import React, { useState } from 'react';
import { VeripassTenancyFinishSetup } from '../../../../../components/organization/onboarding/tenancy/finish-setup/VeripassTenancyFinishSetup.component';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Organization/Onboarding/Tenancy/Finish Setup/VeripassTenancyFinishSetup',
  component: VeripassTenancyFinishSetup,
  argTypes: {
    ui: { description: 'UI configuration object', control: 'object' },
    organization: { description: 'Host organization branding context', control: 'object' },
    appForm: { description: 'App Form data object', control: 'object' },
    isLoading: { description: 'Loading state', control: 'boolean' },
    error: { description: 'Error message', control: 'text' },
    itemOnAction: { action: 'itemOnAction' },
    updateOnAction: { action: 'updateOnAction' },
  },
};

const mockItemOnAction = (e) => {
  action('itemOnAction')(e);
  console.log('[FinishSetup] itemOnAction fired:', e);
};

const Template = (args) => {
  const [form, setForm] = useState(args.appForm || { createApp: true, name: '', slug: '', isSlugEdited: false });

  const mockUpdateOnAction = (e) => {
    action('updateOnAction')(e);
    if (e.action.includes('toggle-updated')) {
      setForm((prev) => ({ ...prev, createApp: e.payload.createApp }));
    }
    if (e.action.includes('form-updated')) {
      setForm(e.payload);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px', backgroundColor: '#fff' }}>
      <VeripassTenancyFinishSetup {...args} appForm={form} itemOnAction={mockItemOnAction} updateOnAction={mockUpdateOnAction} />
    </div>
  );
};

export const CreateAppOn = Template.bind({});
CreateAppOn.args = {
  isLoading: false,
  error: null,
  ui: {
    title: 'Finish setup',
    showTitle: true,
    theme: {
      brandPrimary: '#000000',
      brandPrimaryForeground: '#ffffff',
    },
    copy: {},
  },
};

export const CreateAppOff = Template.bind({});
CreateAppOff.args = {
  ...CreateAppOn.args,
  appForm: {
    createApp: false,
    name: '',
    slug: '',
    isSlugEdited: false,
  },
};

export const ErrorState = Template.bind({});
ErrorState.args = {
  ...CreateAppOn.args,
  error: 'Failed to create application. Please check your network and try again.',
  appForm: {
    createApp: true,
    name: 'Sommatic Web',
    slug: 'sommatic-web',
    isSlugEdited: false,
  },
};

export const CustomTheme = Template.bind({});
CustomTheme.args = {
  ...CreateAppOn.args,
  ui: {
    title: 'Final Step',
    showTitle: true,
    theme: {
      brandPrimary: '#0d6efd',
      brandPrimaryForeground: '#ffffff',
    },
    copy: {
      finishSubtitle: 'Review everything and confirm creation.',
    },
  },
};
