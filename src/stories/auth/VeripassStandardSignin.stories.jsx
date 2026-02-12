import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassStandardSignin } from '@components/auth/signin/standard-signin/VeripassStandardSignin';
import { AuthProvider } from '@hooks/useAuth.hook';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

export default {
  title: 'Authentication/standard/VeripassStandardSignin',
  component: VeripassStandardSignin,
  parameters: {
    layout: 'fullscreen', // Changed from centered to fullscreen for split layout
    docs: {
      description: {
        component: 'Standard Sign-in component with split-screen layout capability.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    ui: { control: 'object', description: 'UI overrides, including heroImage, logo, title, providers, etc.' },
    organization: { control: 'object', description: 'Organization branding (logo, name, slogan)' },
    // Legacy props hidden or mapped
    heroImage: { table: { disable: true } },
    providers: { table: { disable: true } },
    showForgotPass: { table: { disable: true } },

    redirectUrl: { control: 'text' },
    environment: {
      control: 'select',
      options: ['development', 'staging', 'production'],
    },
    apiKey: { control: 'text' },
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

const Template = (args) => <VeripassStandardSignin {...args} />;

export const Default = Template.bind({});
Default.args = {
  organization: {
    name: 'Sommatic AI',
    slogan: 'Empowering your digital intelligence.',
  },
  ui: {
    logo: {
      src: 'https://id.etrune.com/assets/img/logo-2x.png',
      height: '40',
    },
    title: 'Welcome back to the future',
    showTitle: true,
    showForgotPass: true,
    heroImage: {
      src: 'https://images.unsplash.com/photo-1579547621706-1a9c79d5c9f1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'AI Abstract Art',
      title: 'Unlock your creative potential',
      subtitle: 'Your intelligence hub',
    },
    providers: [
      { id: 'google', icon: <GoogleIcon />, onClick: () => alert('Google') },
      { id: 'github', icon: <GitHubIcon />, onClick: () => alert('Github') },
    ],
  },
  redirectUrl: '/home',
  environment: 'development',
};

export const NoImage = Template.bind({});
NoImage.args = {
  ...Default.args,
  ui: {
    ...Default.args.ui,
    heroImage: null,
  },
};
