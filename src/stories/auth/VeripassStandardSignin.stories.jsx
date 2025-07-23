import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassStandardSignin } from '../../components/auth/signin/standard-signin/VeripassStandardSignin';
import { AuthProvider } from '../../hooks/useAuth.hook';

export default {
  title: 'Authentication/standard/VeripassStandardSignin',
  component: VeripassStandardSignin,
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
      <VeripassStandardSignin {...args} />
    </AuthProvider>
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  organization: {
    logoSrc: 'https://id.etrune.com/assets/img/logo-2x.png',
    slogan: 'Unlock your digital world',
  },
  redirectUrl: '/home',
  environment: 'development',
  apiKey: '',
  debug: true
};
