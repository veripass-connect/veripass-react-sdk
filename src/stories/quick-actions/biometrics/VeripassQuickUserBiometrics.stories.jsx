import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassQuickUserBiometrics } from '../../../components/user/quick-actions/biometrics/VeripassQuickUserBiometrics';

export default {
  title: 'Quick-Actions/VeripassQuickUserBiometrics',
  component: VeripassQuickUserBiometrics,
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
    <VeripassQuickUserBiometrics {...args} />
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
};

export const CustomTexts = Template.bind({});
CustomTexts.args = {
  entity: {},
  ui: {
    title: 'Veripass Biometrics custom text',
    subtitle: 'This a Biometrics hub to validate user data',
  },
  environment: 'development',
  onEvent: () => {},
  isPopupContext: false,
  apiKey: '',
  debug: true
};
