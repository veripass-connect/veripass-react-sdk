import React from 'react';
import { VeripassTenancyOnboardingHub } from '../../../../../components/organization/onboarding/tenancy/hub/VeripassTenancyOnboardingHub.component';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Organization/Onboarding/Tenancy/Hub/VeripassTenancyOnboardingHub',
  component: VeripassTenancyOnboardingHub,
  argTypes: {
    ui: { description: 'UI configuration object', control: 'object' },
    organization: { description: 'Host organization branding context', control: 'object' },
    selectedAction: {
      description: 'Initial selected action',
      control: 'radio',
      options: ['create', 'choose'],
    },
    itemOnAction: { action: 'itemOnAction' },
    updateOnAction: { action: 'updateOnAction' },
  },
};

const mockItemOnAction = (e) => {
  action('itemOnAction')(e);
  console.log('[Hub] itemOnAction fired:', e);
};

const mockUpdateOnAction = (e) => {
  action('updateOnAction')(e);
  console.log('[Hub] updateOnAction fired:', e);
};

const Template = (args) => (
  <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px', backgroundColor: '#fff' }}>
    <VeripassTenancyOnboardingHub {...args} itemOnAction={mockItemOnAction} updateOnAction={mockUpdateOnAction} />
  </div>
);

export const DefaultTheme = Template.bind({});
DefaultTheme.args = {
  selectedAction: 'create-organization',
  ui: {
    title: "Let's get started",
    showTitle: true,
    theme: {
      brandPrimary: '#000000',
      brandPrimaryForeground: '#ffffff',
    },
    copy: {
      hubSubtitle: 'Choose how you would like to set up your organization.',
    },
  },
  organization: {
    name: 'Sommatic',
    logoSrc: '',
    slogan: '',
  },
};

export const ChooseSelected = Template.bind({});
ChooseSelected.args = {
  ...DefaultTheme.args,
  selectedAction: 'choose-organization',
};

export const CustomTheme = Template.bind({});
CustomTheme.args = {
  selectedAction: 'create-organization',
  ui: {
    title: 'Welcome to Acme Corp',
    showTitle: true,
    theme: {
      brandPrimary: '#0d6efd',
      brandPrimaryForeground: '#ffffff',
    },
    copy: {
      hubSubtitle: 'Please select how you want to configure your tenant.',
    },
  },
};
