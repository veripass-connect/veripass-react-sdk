import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassQuickStandardUserCreate } from '../../../components/quick-actions/create/VeripassQuickStandardUserCreate';

export default {
  title: 'Quick-Actions/VeripassQuickStandardUserCreate',
  component: VeripassQuickStandardUserCreate,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    ui: { control: 'object' },
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
    <VeripassQuickStandardUserCreate {...args} />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  entity: {},
  ui:{},
  debug: true,
  apiKey: '',
};

export const CustomTexts = Template.bind({});
CustomTexts.args = {
  entity: {},
  ui:{
    title: 'Welcome!',
    subtitle: 'This a Quick Standard (with password) user create'
  },
  debug: true,
  apiKey: '',
};