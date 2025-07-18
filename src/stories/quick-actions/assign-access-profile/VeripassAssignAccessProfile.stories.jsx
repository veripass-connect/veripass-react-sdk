import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassAssignAccessProfile } from '../../../components/user/quick-actions/assign-access-profile/VeripassAssignAccessProfile';

export default {
  title: 'Quick-Actions/VeripassAssignAccessProfile',
  component: VeripassAssignAccessProfile,
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
    <VeripassAssignAccessProfile {...args} />
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
    subtitle: 'This a Quick Standard (with password) user create',
  },
  environment: 'development',
  apiKey: '',
  debug: true
};
