import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassQuickKyc } from '../../components/quick-actions/kyc/VeripassQuickKyc';

export default {
  title: 'Quick-Actions/VeripassQuickKyc',
  component: VeripassQuickKyc,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    entity: { control: 'object' },
    debug: { control: 'boolean' },
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
    <VeripassQuickKyc {...args} />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  entity: {},
  redirectUrl: '/home',
  debug: true,
  apiKey: '',
};
