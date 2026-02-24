import React, { useState } from 'react';
import { VeripassTenancyCreateApplication } from '../../../../../components/organization/onboarding/tenancy/create-application/VeripassTenancyCreateApplication.component';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Organization/Onboarding/Tenancy/Create Application/VeripassTenancyCreateApplication',
  component: VeripassTenancyCreateApplication,
  parameters: {
    layout: 'fullscreen',
  },
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
  console.log('[CreateApplication] itemOnAction fired:', e);
  action('itemOnAction')(e);
  alert(`Action: ${e.action}\nPayload: ${JSON.stringify(e.payload, null, 2)}`);
};

const Template = (args) => {
  const [form, setForm] = useState(args.appForm || { createApp: true, name: '', slug: '', isSlugEdited: false });

  const mockUpdateOnAction = (e) => {
    console.log('[CreateApplication] updateOnAction fired:', e);
    action('updateOnAction')(e);
    if (
      e.action === 'veripass-tenancy-onboarding::create-application/app-form-updated' ||
      e.action === 'veripass-tenancy-onboarding::create-application/app-toggle-updated'
    ) {
      setForm((prev) => ({ ...prev, ...e.payload }));
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#f1f5f9',
        minHeight: '100vh',
        padding: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        }}
      >
        <VeripassTenancyCreateApplication
          {...args}
          appForm={form}
          itemOnAction={mockItemOnAction}
          updateOnAction={mockUpdateOnAction}
        />
      </div>
    </div>
  );
};

export const CreateAppOn = Template.bind({});
CreateAppOn.args = {
  isLoading: false,
  error: null,
  ui: {
    title: 'Create application',
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
      createAppSubtitle: 'Review everything and confirm creation.',
    },
  },
};
