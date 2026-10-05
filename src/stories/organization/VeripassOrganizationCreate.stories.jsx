import React, { useState } from 'react';
import { expect, fireEvent, fn, userEvent, waitFor, within } from '@storybook/test';
import { VeripassTenancyCreateOrganization } from '@components/organization/onboarding/tenancy/create-organization/VeripassTenancyCreateOrganization.component';
import { VeripassOrganizationCreate } from '@components/organization/OrganizationCreate/VeripassOrganizationCreate.component';
import { VeripassOrganizationCreateDialog } from '@components/organization/OrganizationCreate/VeripassOrganizationCreateDialog.component';
import { ORGANIZATION_EVENTS } from '@components/organization/shared/organization-context.events';
import { MockApiDecorator, MockAuthProvider, captureOrganizationEvent } from './_mocks/mock-veripass-api.jsx';

export default {
  title: 'Organization/create/VeripassOrganizationCreate',
  parameters: { layout: 'centered' },
  decorators: [MockApiDecorator],
};

const createdOrganization = {
  id: 'org-new',
  identity: 'acme-corp-identity',
  profile: { display_name: 'Acme Corp', slug: 'acme-corp' },
};
const newSession = { identity: 'usr-1', token: 'new-token', memberships: { active: { organization_id: 'org-new' }, items: [] } };

const successRoutes = [
  { method: 'get', match: '/organization/management/slug', reply: { body: { success: true, result: { items: [] } } } },
  { method: 'post', match: '/organization/management', reply: { body: { success: true, result: createdOrganization } } },
  { method: 'post', match: '/security/auth/switch-context', reply: { body: { success: true, result: newSession } } },
];

const getNameInput = (canvas) => canvas.getByLabelText(/Organization Name/);
const getSlugInput = (canvas) => canvas.getByLabelText(/^Slug/);

const ControlledForm = (props) => {
  const [form, setForm] = useState({ name: '', slug: '', description: '', isSlugEdited: false });

  return (
    <div style={{ width: 420 }}>
      <VeripassTenancyCreateOrganization
        organizationForm={form}
        updateOnAction={({ payload }) => setForm(payload)}
        itemOnAction={props.itemOnAction}
        {...props}
      />
    </div>
  );
};

export const FormSuggestsSlugWhileTyping = {
  render: (args) => <ControlledForm {...args} />,
  args: { itemOnAction: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(getNameInput(canvas), 'Acme Corp & Sons!', { delay: 15 });

    await waitFor(() => expect(getSlugInput(canvas)).toHaveValue('acme-corp-sons'));
    await expect(canvas.getByText('Auto-generated')).toBeInTheDocument();
  },
};

export const FormKeepsTheSlugEditedByHand = {
  render: (args) => <ControlledForm {...args} />,
  args: { itemOnAction: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(getNameInput(canvas), 'Acme', { delay: 15 });
    await waitFor(() => expect(getSlugInput(canvas)).toHaveValue('acme'));

    fireEvent.change(getSlugInput(canvas), { target: { value: 'my-own-slug' } });
    await waitFor(() => expect(canvas.queryByText('Auto-generated')).not.toBeInTheDocument());

    fireEvent.change(getNameInput(canvas), { target: { value: 'Acme Corp' } });

    await waitFor(() => expect(getNameInput(canvas)).toHaveValue('Acme Corp'));
    await expect(getSlugInput(canvas)).toHaveValue('my-own-slug');
  },
};

export const FormSubmitDisabledWhenEmpty = {
  render: (args) => <ControlledForm {...args} />,
  args: { itemOnAction: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: /continue/i })).toBeDisabled();
  },
};

export const FormSubmitsNameAndSlug = {
  render: (args) => <ControlledForm {...args} />,
  args: { itemOnAction: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(getNameInput(canvas), 'Acme Corp', { delay: 15 });
    await waitFor(() => expect(canvas.getByRole('button', { name: /continue/i })).toBeEnabled());
    await userEvent.click(canvas.getByRole('button', { name: /continue/i }));

    await expect(args.itemOnAction).toHaveBeenCalledWith(
      expect.objectContaining({ payload: { organization: expect.objectContaining({ name: 'Acme Corp', slug: 'acme-corp' }) } }),
    );
  },
};

export const FormSlugTaken = {
  render: (args) => <ControlledForm {...args} />,
  args: { itemOnAction: fn(), slugError: 'This slug is already taken.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(getNameInput(canvas), 'Acme Corp', { delay: 15 });

    await expect(canvas.getByText('This slug is already taken.')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: /continue/i })).toBeDisabled();
  },
};

export const FormLoading = {
  render: (args) => <ControlledForm {...args} />,
  args: { itemOnAction: fn(), isLoading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(getNameInput(canvas)).toBeDisabled();
    await expect(canvas.getByRole('button', { name: /continue/i })).toBeDisabled();
  },
};

export const FormWithError = {
  render: (args) => <ControlledForm {...args} />,
  args: { itemOnAction: fn(), error: 'The organization could not be created.' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent('The organization could not be created.');
  },
};

const createdCalls = [];

export const ManagerCreatesAndSwitches = {
  parameters: { mockApi: { routes: successRoutes, calls: createdCalls } },
  args: { onCreated: fn(), onError: fn() },
  render: (args) => (
    <MockAuthProvider user={{ identity: 'usr-1' }}>
      <div style={{ width: 420 }}>
        <VeripassOrganizationCreate {...args} />
      </div>
    </MockAuthProvider>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const events = captureOrganizationEvent(ORGANIZATION_EVENTS.created);

    await userEvent.type(getNameInput(canvas), 'Acme Corp', { delay: 15 });
    await waitFor(() => expect(canvas.getByRole('button', { name: /continue/i })).toBeEnabled());
    await userEvent.click(canvas.getByRole('button', { name: /continue/i }));

    await waitFor(() => expect(args.onCreated).toHaveBeenCalled());
    await expect(args.onCreated.mock.calls[0][0].organization.id).toBe('org-new');
    await expect(events.received).toHaveLength(1);
    await expect(
      createdCalls.find((call) => call.method === 'post' && call.url.endsWith('/organization/management')).body,
    ).toEqual({
      profile: { display_name: 'Acme Corp', slug: 'acme-corp' },
    });
    await expect(createdCalls.find((call) => call.url.includes('switch-context')).body).toEqual({
      target_organization_id: 'org-new',
    });

    events.stop();
  },
};

const takenCalls = [];

export const ManagerReportsTakenSlug = {
  parameters: {
    mockApi: {
      calls: takenCalls,
      routes: [
        {
          method: 'get',
          match: '/organization/management/slug',
          reply: { body: { success: true, result: { items: [{ id: 'org-existing' }] } } },
        },
      ],
    },
  },
  render: (args) => (
    <MockAuthProvider user={{ identity: 'usr-1' }}>
      <div style={{ width: 420 }}>
        <VeripassOrganizationCreate {...args} />
      </div>
    </MockAuthProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(getNameInput(canvas), 'Acme Corp', { delay: 15 });

    await waitFor(() => expect(canvas.getByText('This slug is already taken.')).toBeInTheDocument());
    await expect(canvas.getByRole('button', { name: /continue/i })).toBeDisabled();
  },
};

const failedCalls = [];

export const ManagerShowsServerError = {
  parameters: {
    mockApi: {
      calls: failedCalls,
      routes: [
        { method: 'get', match: '/organization/management/slug', reply: { body: { success: true, result: { items: [] } } } },
        {
          method: 'post',
          match: '/organization/management',
          reply: { status: 403, body: { success: false, message: 'Organization creation is not enabled for this application.' } },
        },
      ],
    },
  },
  args: { onError: fn(), onCreated: fn() },
  render: (args) => (
    <MockAuthProvider user={{ identity: 'usr-1' }}>
      <div style={{ width: 420 }}>
        <VeripassOrganizationCreate {...args} />
      </div>
    </MockAuthProvider>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(getNameInput(canvas), 'Acme Corp', { delay: 15 });
    await waitFor(() => expect(canvas.getByRole('button', { name: /continue/i })).toBeEnabled());
    await userEvent.click(canvas.getByRole('button', { name: /continue/i }));

    await waitFor(() => expect(canvas.getByRole('alert')).toHaveTextContent('Organization creation is not enabled'));
    await expect(args.onError).toHaveBeenCalled();
    await expect(args.onCreated).not.toHaveBeenCalled();
  },
};

const adminCalls = [];
const setAdminContext = fn();

export const ManagerForAdminFixesTheContext = {
  parameters: { mockApi: { routes: successRoutes, calls: adminCalls } },
  args: { onCreated: fn() },
  render: (args) => (
    <MockAuthProvider user={{ identity: 'usr-1' }} isAdmin setAdminContext={setAdminContext}>
      <div style={{ width: 420 }}>
        <VeripassOrganizationCreate {...args} />
      </div>
    </MockAuthProvider>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const events = captureOrganizationEvent(ORGANIZATION_EVENTS.created);

    await userEvent.type(getNameInput(canvas), 'Acme Corp', { delay: 15 });
    await waitFor(() => expect(canvas.getByRole('button', { name: /continue/i })).toBeEnabled());
    await userEvent.click(canvas.getByRole('button', { name: /continue/i }));

    await waitFor(() => expect(args.onCreated).toHaveBeenCalled());
    await expect(setAdminContext).toHaveBeenCalledWith(
      expect.objectContaining({ organization_id: 'org-new', slug: 'acme-corp', display_name: 'Acme Corp' }),
    );
    await expect(adminCalls.some((call) => call.url.includes('switch-context'))).toBe(false);
    await expect(events.received).toHaveLength(1);

    events.stop();
  },
};

const dialogCalls = [];

export const DialogClosesAfterCreating = {
  parameters: { mockApi: { routes: successRoutes, calls: dialogCalls } },
  args: { onClose: fn(), onCreated: fn() },
  render: (args) => (
    <MockAuthProvider user={{ identity: 'usr-1' }}>
      <VeripassOrganizationCreateDialog open {...args} />
    </MockAuthProvider>
  ),
  play: async ({ args }) => {
    const dialog = within(document.body);
    const events = captureOrganizationEvent(ORGANIZATION_EVENTS.created);

    await userEvent.type(await dialog.findByLabelText(/Organization Name/), 'Acme Corp');
    await waitFor(() => expect(dialog.getByRole('button', { name: /^create organization$/i })).toBeEnabled());
    await userEvent.click(dialog.getByRole('button', { name: /^create organization$/i }));

    await waitFor(() => expect(args.onClose).toHaveBeenCalled());
    await expect(args.onCreated).toHaveBeenCalled();

    events.stop();
  },
};
