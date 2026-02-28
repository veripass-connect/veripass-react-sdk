import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassOrganizationSwitcher } from '@components/organization/OrganizationSwitcher/veripass-organization-switcher.component';
import { AuthProvider, AuthContext } from '@hooks/useAuth.hook';

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
  linked_organizations: [
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
      organization_id: 'org-host', // Active org is the host
      roles: [], // Usually no roles defined strictly for personal account
    },
  },
};
