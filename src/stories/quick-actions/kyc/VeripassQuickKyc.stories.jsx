import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassQuickUserKyc } from '../../../components/user/quick-actions/kyc/VeripassQuickUserKyc';

export default {
  title: 'Quick-Actions/VeripassQuickUserKyc',
  component: VeripassQuickUserKyc,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    ui: { control: 'object' },
    entity: { control: 'object' },
    environment: { control: 'string' },
    apiKey: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

const Template = (args) => (
  <MemoryRouter>
    <VeripassQuickUserKyc {...args} />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  entity: {},
  ui: {},
  environment: 'development',
  apiKey: '',
};

export const CustomTexts = Template.bind({});
CustomTexts.args = {
  entity: {},
  ui: {
    title: 'Welcome!',
    subtitle: 'This a Quick KYC to validate user data',
  },
  environment: 'development',
  apiKey: '',
};
