import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassQuickUserPreview } from '../../../../components/user/quick-actions/preview/VeripassQuickUserPreview';

export default {
  title: 'User/Quick-Actions/VeripassQuickUserPreview',
  component: VeripassQuickUserPreview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    ui: { control: 'object' },
    entity: { control: 'object' },
    onEvent: { control: 'function' },
    setIsOpen: { control: 'function' },
    isPopupContext: { control: 'boolean' },
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
    <VeripassQuickUserPreview {...args} />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  entity: {},
  ui: {},
  onEvent: () => {},
  isPopupContext: false,
  environment: 'development',
  apiKey: '',
  debug: true
};
