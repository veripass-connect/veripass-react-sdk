import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassSignInManager } from '@components/auth/signin/manager/VeripassSignInManager.component';
import { AuthProvider } from '@hooks/useAuth.hook';
import GoogleIcon from '@mui/icons-material/Google';

export default {
  title: 'Authentication/manager/VeripassSignInManager',
  component: VeripassSignInManager,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Manager component handling authentication flow (Discovery -> Signin).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    signinType: {
      control: 'select',
      options: [undefined, 'standard'],
      description: 'Force specific signin mode or leave undefined for discovery',
    },
    ui: { control: 'object' },
    organization: { control: 'object' },
    // Disable flattened
    sideImage: { table: { disable: true } },
    providers: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <AuthProvider debug={true}>
          <Story />
        </AuthProvider>
      </MemoryRouter>
    ),
  ],
};

const Template = (args) => <VeripassSignInManager {...args} />;

const commonArgs = {
  organization: {
    name: 'Sommatic AI',
    slogan: 'Access your intelligence hub',
  },
  ui: {
    logo: {
      src: 'https://id.etrune.com/assets/img/logo-2x.png',
      height: '40',
    },
    title: 'Sign in to Sommatic',
    showTitle: true,
    sideImage: {
      src: 'https://images.unsplash.com/photo-1579547621706-1a9c79d5c9f1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Cybersecurity',
      overlayText1: 'Securely access your agents.',
      overlayText2: 'Intelligence awaits',
    },
    providers: [{ id: 'google', icon: <GoogleIcon />, onClick: () => alert('Google') }],
  },
};

export const DiscoveryMode = Template.bind({});
DiscoveryMode.args = {
  ...commonArgs,
  signinType: undefined, // Discovery
  organization: { ...commonArgs.organization, slogan: 'Enter email to discover' },
};

export const DirectStandard = Template.bind({});
DirectStandard.args = {
  ...commonArgs,
  signinType: 'standard', // Direct
  organization: { ...commonArgs.organization, slogan: 'Direct Standard Login' },
};
