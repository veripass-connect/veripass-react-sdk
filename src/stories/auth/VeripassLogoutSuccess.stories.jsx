import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassLogoutSuccess } from '../../components/auth/logout/logout-success/VeripassLogoutSuccess';
import { AuthProvider } from '../../hooks/useAuth.hook';

export default {
  title: 'Authentication/standard/VeripassLogoutSuccess',
  component: VeripassLogoutSuccess,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    organization: { control: 'object' },
    signinUrl: { control: 'text' },
    texts: { control: 'object' },
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
      <VeripassLogoutSuccess {...args} />
    </AuthProvider>
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  organization: {
    logoSrc: 'http://localhost:4571/assets/images/logo-dark-2.svg',
  },
  signinUrl: 'https://portal.veripass.com.co/auth/login',
  texts: {
    farewellMessage: 'Goodbye!',
    successMessage: 'You have successfully logged out.',
    goBackText: 'Back to',
    signinText: 'Sign in',
  },
};

export const CustomTexts = Template.bind({});
CustomTexts.args = {
  organization: {
    logoSrc: 'http://localhost:4571/assets/images/logo-dark-2.svg',
  },
  signinUrl: '/custom-login',
  texts: {
    farewellMessage: 'See you soon!',
    successMessage: 'Logout was successful!',
    goBackText: 'Return to',
    signinText: 'Login again',
  },
};

export const WithoutLogo = Template.bind({});
WithoutLogo.args = {
  organization: {
    logoSrc: '',
  },
  signinUrl: 'https://portal.veripass.com.co/auth/login',
  texts: {
    farewellMessage: 'Goodbye!',
    successMessage: 'You have successfully logged out.',
    goBackText: 'Back to',
    signinText: 'Sign in',
  },
  debug: true
};
