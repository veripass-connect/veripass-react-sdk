import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassStandardSignin } from '../../components/auth/signin/standard-signin/VeripassStandardSignin';
import { AuthProvider } from '../../hooks/useAuth.hook';

export default {
  title: 'Components/VeripassStandardSignin',
  component: VeripassStandardSignin,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    organization: { control: 'object' },
    redirectUrl: { control: 'text' },
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
    <AuthProvider>
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
  debug: true,
  apiKey: '',
};