import React from 'react';
import { VeripassStandardSignin } from '../../components/auth/signin/standard-signin/VeripassStandardSignin';
import { VeripassSignInManager } from '../../components/auth/signin/manager/VeripassSignInManager.component';
import { VeripassStandardSignup } from '../../components/auth/signup/standard-signup/VeripassStandardSignup.component';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import AppleIcon from '@mui/icons-material/Apple';

export default {
  title: 'Auth/Components',
  component: VeripassSignInManager,
  parameters: {
    layout: 'fullscreen',
  },
};

const providers = [
  { id: 'google', icon: <GoogleIcon />, onClick: () => alert('Google click') },
  { id: 'github', icon: <GitHubIcon />, onClick: () => alert('GitHub click') },
  { id: 'apple', icon: <AppleIcon />, onClick: () => alert('Apple click') },
];

const sideImage = {
  src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', // Abstract orange/dark
  alt: 'Cover',
  overlayText1: 'Welcome back',
  overlayText2: 'Manage your identity securely.',
};

const orangeImage = {
  src: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2629&auto=format&fit=crop', // Gradient orange
  alt: 'Orange Cover',
  overlayText1: 'Get access to your personal hub',
  overlayText2: 'For clarity and productivity.',
};

export const StandardSignin = () => (
  <VeripassStandardSignin
    sideImage={sideImage}
    providers={providers}
    organization={{ name: 'Sommatic', slogan: 'The backbone powering essential services.' }}
  />
);

export const SignInManagerDirect = () => (
  <VeripassSignInManager
    signinType="standard"
    sideImage={sideImage}
    providers={providers}
    organization={{ name: 'Sommatic', slogan: 'Direct Standard Signin Mode' }}
  />
);

export const SignInManagerDiscovery = () => (
  <VeripassSignInManager
    // No signinType -> Discovery
    sideImage={orangeImage}
    providers={providers}
    organization={{ name: 'BrightNest', slogan: 'Discovery Mode (Email/Phone)' }}
  />
);

export const StandardSignup = () => (
  <VeripassStandardSignup
    sideImage={orangeImage}
    providers={providers}
    organization={{ name: 'BrightNest', slogan: 'Create your account today.' }}
  />
);
