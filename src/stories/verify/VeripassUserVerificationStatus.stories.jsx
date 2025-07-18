import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassUserVerificationStatus } from '../../components/verify/VeripassUserVerificationStatus';

export default {
  title: 'Verify/VeripassUserVerificationStatus',
  component: VeripassUserVerificationStatus,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
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
    <VeripassUserVerificationStatus {...args} />
  </MemoryRouter>
);

export const Verified = Template.bind({});
Verified.args = {
  entity: { is_verified: true },
  environment: 'development',
  apiKey: '',
};

export const NotVerified = Template.bind({});
NotVerified.args = {
  entity: { is_verified: false },
  environment: 'development',
  apiKey: '',
  debug: true
};
