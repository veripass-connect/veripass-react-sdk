import React from 'react';
import { VeripassTenancyOnboardingManager } from '../../../../../components/organization/onboarding/tenancy/manager/VeripassTenancyOnboardingManager.component';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Organization/Onboarding/Tenancy/Manager/VeripassTenancyOnboardingManager',
  component: VeripassTenancyOnboardingManager,
  argTypes: {
    ui: { description: 'UI configuration object', control: 'object' },
    organization: { description: 'Host organization branding context', control: 'object' },
    onEvent: { action: 'onEvent' },
    countdownSeconds: { control: 'number' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Manager component handling the tenancy onboarding flow.',
      },
    },
  },
  tags: ['autodocs'],
};

// Mock Services for Storybook
const MOCK_ORGS = [
  { id: 'org_1', name: 'Veripass Tech', slug: 'veripass-sdk', role: 'Owner' },
  { id: 'org_2', name: 'Acme Corp', slug: 'acme-corp-global', role: 'Admin' },
  { id: 'org_3', name: 'Global Systems', slug: 'global-sys-inc', role: 'Member' },
  { id: 'org_4', name: 'Nebula Ops', slug: 'nebula-ops-sandbox', role: 'Viewer' },
];

const mockServicesSuccess = {
  organizationService: {
    getByParameters: async () => {
      return new Promise((resolve) => setTimeout(() => resolve({ success: true, result: MOCK_ORGS }), 800));
    },
  },
  provisioningService: {
    provisionWorkspace: async (payload) => {
      console.log('[Mock] provisioning workspace:', payload);
      return new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              success: true,
              result: {
                organization: { id: 'new_org_123', ...payload.organization },
                application: payload.application ? { id: 'new_app_456', ...payload.application } : null,
              },
            }),
          1000,
        ),
      );
    },
    joinHost: async (payload) => {
      console.log('[Mock] joining host:', payload);
      return new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              success: true,
              result: {
                host: { organizationId: 'host_org_123' },
                organizationMembership: { id: 'mem_1' },
              },
            }),
          1500,
        ),
      );
    },
  },
  userProfileService: {
    update: async (payload) => {
      console.log('[Mock] updating profile:', payload);
      return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 800));
    },
  },
  OrganizationMembershipService: {
    create: async () => ({ success: true }),
  },
};

const mockServicesTimeout = {
  ...mockServicesSuccess,
  provisioningService: {
    provisionWorkspace: async () => {
      return new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              success: false,
              isTimeout: true,
              message: 'The request took too long to complete (timeout).',
            }),
          1000,
        ),
      );
    },
    joinHost: async () => {
      return new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              success: false,
              isTimeout: true,
              message: 'The request took too long to complete (timeout).',
            }),
          1000,
        ),
      );
    },
  },
};

const Template = (args) => <VeripassTenancyOnboardingManager {...args} />;

export const DefaultMockedFlow = Template.bind({});
DefaultMockedFlow.args = {
  services: mockServicesSuccess,
  user: {
    id: 'user_1',
    payload: {
      profile: { first_name: 'John', last_name: 'Doe', display_name: 'John Doe' },
    },
  },
  ui: {
    theme: { brandPrimary: '#000000' },
    defaultAction: 'create-organization',
  },
};

export const CompleteProfileInterception = Template.bind({});
CompleteProfileInterception.args = {
  services: mockServicesSuccess,
  user: {
    id: 'user_2',
    payload: {
      profile: { first_name: '', last_name: '', display_name: '' },
    },
  },
  ui: {
    theme: { brandPrimary: '#000000' },
  },
};

export const TimeoutErrorScenario = Template.bind({});
TimeoutErrorScenario.args = {
  services: mockServicesTimeout,
  user: {
    id: 'user_1',
    payload: {
      profile: { first_name: 'John', last_name: 'Doe', display_name: 'John Doe' },
    },
  },
  ui: {
    theme: { brandPrimary: '#000000' },
    defaultAction: 'join-host',
  },
};

export const CustomBrandingJoinHost = Template.bind({});
CustomBrandingJoinHost.args = {
  services: mockServicesSuccess,
  organization: {
    name: 'Blackwood Stone Holdings',
    logoSrc: 'https://via.placeholder.com/150',
    slogan: 'Building the future of finance.',
  },
  user: {
    id: 'user_1',
    payload: {
      profile: { first_name: 'John', last_name: 'Doe', display_name: 'John Doe' },
    },
  },
  ui: {
    theme: {
      brandPrimary: '#1e293b',
      brandPrimaryForeground: '#ffffff',
      linkColor: '#3b82f6',
    },
    defaultAction: 'join-host',
  },
};
