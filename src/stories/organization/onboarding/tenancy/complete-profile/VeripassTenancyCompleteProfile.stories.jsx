import React from 'react';
import { VeripassTenancyCompleteProfile } from '../../../../../components/organization/onboarding/tenancy/complete-profile/VeripassTenancyCompleteProfile.component';

export default {
  title: 'Organization/Onboarding/Tenancy/Steps/VeripassTenancyCompleteProfile',
  component: VeripassTenancyCompleteProfile,
  argTypes: {
    ui: { description: 'UI configuration object', control: 'object' },
    isLoading: { control: 'boolean' },
    error: { control: 'text' },
    itemOnAction: { action: 'itemOnAction' },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

const Template = (args) => (
  <div style={{ width: '500px', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '1rem' }}>
    <VeripassTenancyCompleteProfile {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  ui: {
    theme: {
      brandPrimary: '#000000',
    },
  },
};

export const Loading = Template.bind({});
Loading.args = {
  ...Default.args,
  isLoading: true,
};

export const WithError = Template.bind({});
WithError.args = {
  ...Default.args,
  error: 'Please fill in all required fields.',
};
