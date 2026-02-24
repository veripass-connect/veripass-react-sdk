import React, { useState } from 'react';
import { VeripassTenancyCreateOrganization } from '../../../../../components/organization/onboarding/tenancy/create-organization/VeripassTenancyCreateOrganization.component';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Organization/Onboarding/Tenancy/Create Organization/VeripassTenancyCreateOrganization',
  component: VeripassTenancyCreateOrganization,
  argTypes: {
    ui: { description: 'UI configuration object', control: 'object' },
    organization: { description: 'Host organization branding context', control: 'object' },
    organizationForm: { description: 'Form data object', control: 'object' },
    isLoading: { description: 'Loading state', control: 'boolean' },
    error: { description: 'Error message', control: 'text' },
    itemOnAction: { action: 'itemOnAction' },
    updateOnAction: { action: 'updateOnAction' },
  },
};

const mockItemOnAction = (e) => {
  action('itemOnAction')(e);
  console.log('[CreateOrg] itemOnAction fired:', e);
};

const Template = (args) => {
  const [form, setForm] = useState(args.organizationForm || { name: '', slug: '', description: '', isSlugEdited: false });

  const mockUpdateOnAction = (e) => {
    action('updateOnAction')(e);
    if (e.action.includes('form-updated')) {
      setForm(e.payload);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px', backgroundColor: '#fff' }}>
      <VeripassTenancyCreateOrganization
        {...args}
        organizationForm={form}
        itemOnAction={mockItemOnAction}
        updateOnAction={mockUpdateOnAction}
      />
    </div>
  );
};

export const EmptyForm = Template.bind({});
EmptyForm.args = {
  isLoading: false,
  error: null,
  ui: {
    title: 'Create your organization',
    showTitle: true,
    theme: {
      brandPrimary: '#000000',
      brandPrimaryForeground: '#ffffff',
    },
    copy: {},
  },
};

export const ValidFilledForm = Template.bind({});
ValidFilledForm.args = {
  ...EmptyForm.args,
  organizationForm: {
    name: 'Sommatic Labs',
    slug: 'sommatic-labs',
    description: 'Generative AI tools',
    isSlugEdited: false,
  },
};

export const ErrorState = Template.bind({});
ErrorState.args = {
  ...EmptyForm.args,
  error: 'An organization with this slug already exists. Please choose a different one.',
  organizationForm: {
    name: 'Sommatic',
    slug: 'sommatic',
    description: '',
    isSlugEdited: true,
  },
};

export const CustomTheme = Template.bind({});
CustomTheme.args = {
  ...EmptyForm.args,
  ui: {
    title: 'Setup Acme Org',
    showTitle: true,
    theme: {
      brandPrimary: '#0d6efd',
      brandPrimaryForeground: '#ffffff',
    },
    copy: {
      createSubtitle: 'We need some details to configure your dashboard workspace.',
    },
  },
};
