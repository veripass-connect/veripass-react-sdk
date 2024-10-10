import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassQuickUserPreview } from '../../../components/quick-actions/preview/VeripassQuickUserPreview';

export default {
  title: 'Quick-Actions/VeripassQuickUserPreview',
  component: VeripassQuickUserPreview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    ui: { control: 'object' },
    entity: { control: 'object' },
    onUpdatedEntity: { control: 'function' },
    setIsOpen: { control: 'function' },
    isPopupContext: { control: 'boolean' },
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
    <VeripassQuickUserPreview {...args} />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  entity: {},
  ui: {},
  onUpdatedEntity: () => {},
  isPopupContext: false,
  debug: true,
  apiKey: '',
};
