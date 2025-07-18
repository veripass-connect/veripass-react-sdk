import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassUserQuickStandardCreate } from '../../../components/user/quick-actions/create/VeripassUserQuickStandardCreate';

export default {
  title: 'Quick-Actions/VeripassUserQuickStandardCreate',
  component: VeripassUserQuickStandardCreate,
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
    <VeripassUserQuickStandardCreate {...args} />
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
