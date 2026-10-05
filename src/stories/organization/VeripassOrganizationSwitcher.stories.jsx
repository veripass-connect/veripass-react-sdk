import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassOrganizationSwitcher } from '@components/organization/OrganizationSwitcher/veripass-organization-switcher.component';
import { AuthProvider, AuthContext } from '@hooks/useAuth.hook';
import { expect, fireEvent, fn, userEvent, waitFor, within } from '@storybook/test';
import { ORGANIZATION_EVENTS } from '@components/organization/shared/organization-context.events';
import {
  MockApiDecorator,
  MockAuthProvider as MockSessionProvider,
  captureOrganizationEvent,
} from './_mocks/mock-veripass-api.jsx';

export default {
  title: 'Organization/switcher/VeripassOrganizationSwitcher',
  component: VeripassOrganizationSwitcher,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Organization Switcher to toggle between linked tenants and personal accounts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isCondensed: { control: 'boolean' },
    ui: { control: 'object' },
    apiKey: { control: 'text' },
    environment: { control: 'select', options: ['development', 'production', 'local'] },
    onManageClick: { action: 'onManageClick' },
    onCreateOrganizationClick: { action: 'onCreateOrganizationClick' },
  },
};

const mockUser = {
  identity: 'usr-1234',
  payload: {
    organization_id: 'org-abc',
    roles: [
      {
        context: {
          role: { name: 'Admin' },
        },
      },
    ],
    profile: {
      display_name: 'Camilo Rodriguez',
    },
  },
  host_organization: {
    id: 'org-host',
    profile: {
      display_name: 'Sommatic AI',
    },
  },
  memberships: {
    active: {
      id: 'membership-1',
      organization_id: 'org-abc',
      is_host_context: false,
    },
    items: [
      {
        organization_id: 'org-abc',
        context: {
          organization: {
            profile: {
              display_name: 'Isadora inc.',
            },
          },
          role: { name: 'Admin' },
        },
      },
      {
        organization_id: 'org-xyz',
        context: {
          organization: {
            profile: {
              display_name: 'Acme Corp',
            },
          },
          role: { name: 'Member' },
        },
      },
    ],
  },
};

const MockAuthProvider = ({ children, mockUserValue }) => {
  const value = {
    user: mockUserValue,
    login: async () => {},
    getToken: () => ({ token: 'mock-token' }),
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const Template = (args) => (
  <MemoryRouter>
    <MockAuthProvider mockUserValue={args.mockUser}>
      <div style={{ padding: '20px', width: args.isCondensed ? '80px' : '300px', backgroundColor: '#f8fafc' }}>
        <VeripassOrganizationSwitcher {...args} />
      </div>
    </MockAuthProvider>
  </MemoryRouter>
);

export const InsideTenant = Template.bind({});
InsideTenant.args = {
  isCondensed: false,
  mockUser: mockUser,
  ui: {
    copy: {
      createOrganization: 'Create new space',
    },
  },
};

export const InsideTenantCondensed = Template.bind({});
InsideTenantCondensed.args = {
  isCondensed: true,
  mockUser: mockUser,
};

export const InsidePersonalAccount = Template.bind({});
InsidePersonalAccount.args = {
  isCondensed: false,
  mockUser: {
    ...mockUser,
    payload: {
      ...mockUser.payload,
      organization_id: 'org-host',
      roles: [],
    },
    memberships: {
      ...mockUser.memberships,
      active: {
        id: 'membership-host',
        organization_id: 'org-host',
        is_host_context: true,
      },
    },
  },
};

const hostOrganization = { id: 'org-host', profile: { display_name: 'Central Host' } };

const buildSession = ({ activeOrganizationId, memberships }) => ({
  identity: 'usr-1',
  payload: { app_id: 'app-host', organization_id: activeOrganizationId, roles: [], profile: { display_name: 'Demo Person' } },
  host_organization: hostOrganization,
  memberships: {
    active: {
      id: 'membership-active',
      organization_id: activeOrganizationId,
      is_host_context: activeOrganizationId === 'org-host',
    },
    items: memberships.map(({ id, name, role }) => ({
      organization_id: id,
      context: { organization: { profile: { display_name: name } }, role: { name: role } },
    })),
  },
});

const switchedSession = buildSession({ activeOrganizationId: 'org-tenant-b', memberships: [] });
const switchCalls = [];
const switcherLogin = fn(async () => {});

const SwitcherFrame = ({ children, ...providerProps }) => (
  <MockSessionProvider {...providerProps}>
    <div style={{ padding: '20px', width: '320px', backgroundColor: '#f8fafc' }}>{children}</div>
  </MockSessionProvider>
);

// The menu is a popover rendered in a portal: open it from the toggle, then query the whole document.
const openMenu = async (canvasElement) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: /switch organization/i }));

  return within(document.body);
};

export const HostAndTenantsCanSwitch = {
  decorators: [MockApiDecorator],
  parameters: {
    mockApi: {
      calls: switchCalls,
      routes: [
        { method: 'post', match: '/security/auth/switch-context', reply: { body: { success: true, result: switchedSession } } },
      ],
    },
  },
  render: () => (
    <SwitcherFrame
      login={switcherLogin}
      user={buildSession({
        activeOrganizationId: 'org-tenant-a',
        memberships: [
          { id: 'org-host', name: 'Central Host', role: 'Member' },
          { id: 'org-tenant-a', name: 'Tenant A', role: 'Organization admin' },
          { id: 'org-tenant-b', name: 'Tenant B', role: 'Member' },
        ],
      })}
    >
      <VeripassOrganizationSwitcher />
    </SwitcherFrame>
  ),
  play: async ({ canvasElement }) => {
    const events = captureOrganizationEvent(ORGANIZATION_EVENTS.switched);
    const canvas = await openMenu(canvasElement);

    await expect(canvas.getByText('Central Host')).toBeInTheDocument();
    await expect(canvas.getByText('Tenant B')).toBeInTheDocument();

    await userEvent.click(canvas.getByText('Tenant B'));

    await waitFor(() => expect(switcherLogin).toHaveBeenCalledWith({ user: switchedSession }));
    await expect(switchCalls[0].body).toEqual({ target_organization_id: 'org-tenant-b' });
    await expect(events.received[0].organization.id).toBe('org-tenant-b');

    events.stop();
  },
};

export const TenantOnlyUser = {
  render: () => (
    <SwitcherFrame
      user={buildSession({
        activeOrganizationId: 'org-tenant-a',
        memberships: [
          { id: 'org-tenant-a', name: 'Tenant A', role: 'Organization admin' },
          { id: 'org-tenant-b', name: 'Tenant B', role: 'Member' },
        ],
      })}
    >
      <VeripassOrganizationSwitcher />
    </SwitcherFrame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = await openMenu(canvasElement);

    await expect(canvas.getAllByText('Tenant A').length).toBeGreaterThan(0);
    await expect(canvas.getByText('Tenant B')).toBeInTheDocument();
    await expect(canvas.queryByText('Central Host')).not.toBeInTheDocument();
    await expect(canvas.queryByText(/Manage/)).not.toBeInTheDocument();
  },
};

export const CreateOrganizationOpensItsOwnDialog = {
  decorators: [MockApiDecorator],
  parameters: { mockApi: { calls: [], routes: [] } },
  render: () => (
    <SwitcherFrame
      user={buildSession({
        activeOrganizationId: 'org-tenant-a',
        memberships: [{ id: 'org-tenant-a', name: 'Tenant A', role: 'Member' }],
      })}
    >
      <VeripassOrganizationSwitcher />
    </SwitcherFrame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = await openMenu(canvasElement);
    await userEvent.click(canvas.getByText('Create organization'));

    await expect(await within(document.body).findByLabelText(/Organization Name/)).toBeInTheDocument();
  },
};

export const CreateOrganizationDelegatedToTheHost = {
  args: { onCreateOrganizationClick: fn() },
  render: (args) => (
    <SwitcherFrame
      user={buildSession({
        activeOrganizationId: 'org-tenant-a',
        memberships: [{ id: 'org-tenant-a', name: 'Tenant A', role: 'Member' }],
      })}
    >
      <VeripassOrganizationSwitcher {...args} />
    </SwitcherFrame>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = await openMenu(canvasElement);
    await userEvent.click(canvas.getByText('Create organization'));

    await expect(args.onCreateOrganizationClick).toHaveBeenCalled();
    await expect(within(document.body).queryByLabelText(/Organization Name/)).not.toBeInTheDocument();
  },
};

const adminCalls = [];
const setAdminContext = fn();
const clearAdminContext = fn();

const adminSession = {
  ...buildSession({
    activeOrganizationId: 'org-host',
    memberships: [{ id: 'org-host', name: 'Central Host', role: 'Administrator' }],
  }),
};

export const HostAdministratorChoosesGlobalOrFixedContext = {
  decorators: [MockApiDecorator],
  parameters: {
    mockApi: {
      calls: adminCalls,
      routes: [
        {
          method: 'get',
          match: '/organization/application/app-id',
          reply: {
            body: {
              success: true,
              result: {
                items: [
                  {
                    organization_id: 'org-alpha',
                    organization: { identity: 'alpha-id', slug: 'alpha', display_name: 'Alpha Foods' },
                  },
                  {
                    organization_id: 'org-zeta',
                    organization: { identity: 'zeta-id', slug: 'zeta', display_name: 'Zeta Logistics' },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
  render: () => (
    <SwitcherFrame user={adminSession} isAdmin setAdminContext={setAdminContext} clearAdminContext={clearAdminContext}>
      <VeripassOrganizationSwitcher />
    </SwitcherFrame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = await openMenu(canvasElement);

    await expect(canvas.getByText('Global')).toBeInTheDocument();
    await expect(canvas.getByText('Fixed context')).toBeInTheDocument();
    await expect(canvas.queryByText('Alpha Foods')).not.toBeInTheDocument();

    await userEvent.click(canvas.getByText('Fixed context'));

    await expect(await canvas.findByText('Alpha Foods')).toBeInTheDocument();
    await expect(adminCalls[0].url).toContain('search=app-host');

    fireEvent.change(canvas.getByPlaceholderText('Search organizations'), { target: { value: 'zet' } });
    await waitFor(() => expect(canvas.queryByText('Alpha Foods')).not.toBeInTheDocument());

    await userEvent.click(canvas.getByText('Zeta Logistics'));
    await expect(setAdminContext).toHaveBeenCalledWith(
      expect.objectContaining({ organization_id: 'org-zeta', slug: 'zeta', display_name: 'Zeta Logistics' }),
    );

    const reopened = await openMenu(canvasElement);
    await userEvent.click(await reopened.findByText('Global'));
    await expect(clearAdminContext).toHaveBeenCalled();
  },
};
