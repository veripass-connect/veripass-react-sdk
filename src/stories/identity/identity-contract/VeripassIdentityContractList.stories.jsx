import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassIdentityContractList } from '../../../components/identity/identity-contract/list/VeripassIdentityContractList';
import { AuthProvider } from '../../../hooks/useAuth.hook';

export default {
  title: 'Identity/Contract/VeripassIdentityContractList',
  component: VeripassIdentityContractList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    organization: { control: 'object' },
    redirectUrl: { control: 'text' },
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
    <AuthProvider {...args}>
      <VeripassIdentityContractList {...args} />
    </AuthProvider>
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  ui: {
    profilePhoto: {
      height: '95',
    },
    inputSize: 'small',
  },
  environment: 'local',
  apiKey: '',
  debug: true,
  readOnly: true,
  contractParties: {
    principal_id: 'veripass-123',
    counterparty_id: 'veripass-123',
  },
};
