import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassQuickUserBiometrics } from '../../../components/quick-actions/biometrics/VeripassQuickUserBiometrics';

export default {
  title: 'Biometrics/VeripassQuickUserBiometrics',
  component: VeripassQuickUserBiometrics,
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
    <VeripassQuickUserBiometrics {...args} />
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

export const CustomTexts = Template.bind({});
CustomTexts.args = {
  entity: {},
  ui: {
    title: 'Veripass Biometrics custom text',
    subtitle: 'This a Biometrics hub to validate user data',
  },
  debug: true,
  onUpdatedEntity: () => {},
  isPopupContext: false,
  apiKey: '',
};
