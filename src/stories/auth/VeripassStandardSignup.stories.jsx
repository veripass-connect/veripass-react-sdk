import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassStandardSignup } from '@components/auth/signup/standard-signup/VeripassStandardSignup.component';
import { AuthProvider } from '@hooks/useAuth.hook';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import AppleIcon from '@mui/icons-material/Apple';

export default {
  title: 'Authentication/standard/VeripassStandardSignup',
  component: VeripassStandardSignup,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Standard Sign-up component with split-screen layout.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    ui: { control: 'object' },
    organization: { control: 'object' },
    // Disable flattened props
    sideImage: { table: { disable: true } },
    providers: { table: { disable: true } },

    redirectUrl: { control: 'text' },
    environment: {
      control: 'select',
      options: ['development', 'staging', 'production'],
    },
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

const Template = (args) => <VeripassStandardSignup {...args} />;

export const Default = Template.bind({});
Default.args = {
  organization: {
    name: 'Sommatic AI',
    slogan: 'Building the next generation of intelligence.',
  },
  ui: {
    logo: {
      src: 'https://id.etrune.com/assets/img/logo-2x.png',
      height: '40',
    },
    title: 'Join the AI revolution',
    showTitle: true,
    sideImage: {
      src: 'https://images.unsplash.com/photo-1579547621706-1a9c79d5c9f1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Futuristic Landscape',
      overlayText1: 'Start building tomorrow, today.',
      overlayText2: 'Create your account',
    },
    providers: [
      { id: 'google', icon: <GoogleIcon />, onClick: () => alert('Google') },
      { id: 'apple', icon: <AppleIcon />, onClick: () => alert('Apple') },
    ],
  },
  redirectUrl: '/dashboard',
  environment: 'development',
};
