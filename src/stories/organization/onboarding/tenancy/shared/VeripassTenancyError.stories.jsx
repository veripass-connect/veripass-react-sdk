import React from 'react';
import { VeripassTenancyError } from '../../../../../components/organization/onboarding/tenancy/shared/VeripassTenancyError.component';

export default {
  title: 'Organization/Onboarding/Tenancy/Shared/VeripassTenancyError',
  component: VeripassTenancyError,
  argTypes: {
    ui: { description: 'UI configuration object', control: 'object' },
    errorTitle: { control: 'text' },
    errorBody: { control: 'text' },
    onRetry: { action: 'onRetry' },
    onBack: { action: 'onBack' },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

const Template = (args) => (
  <div style={{ width: '500px', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '1rem' }}>
    <VeripassTenancyError {...args} />
  </div>
);

export const DefaultTimeout = Template.bind({});
DefaultTimeout.args = {
  ui: {
    theme: {
      brandPrimary: '#000000',
    },
  },
  errorTitle: 'Setup Timeout',
  errorBody: 'The process took longer than expected. Please check your console in a few minutes or start again.',
};

export const CustomError = Template.bind({});
CustomError.args = {
  ...DefaultTimeout.args,
  errorTitle: 'Configuration Error',
  errorBody: 'The organization slug "veripass" is already taken. Please choose another one.',
};
