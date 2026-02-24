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
      console.log('[Mock] fetching organizations...');
      return new Promise((resolve) => setTimeout(() => resolve({ success: true, result: MOCK_ORGS }), 800));
    },
  },
  provisioningService: {
    create: async (payload) => {
      console.log('[Mock] provisioning tenancy:', payload);
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
  },
};

const mockServicesError = {
  organizationService: {
    getByParameters: async () => {
      console.log('[Mock] fetching organizations...');
      return new Promise((resolve) => setTimeout(() => resolve({ success: true, result: MOCK_ORGS }), 800));
    },
  },
  provisioningService: {
    create: async () => {
      return new Promise((resolve) =>
        setTimeout(() => resolve({ success: false, message: 'Server Error: Duplicate slug found.' }), 1000),
      );
    },
  },
};

const Template = (args) => <VeripassTenancyOnboardingManager {...args} />;

export const DefaultMockedFlow = Template.bind({});
DefaultMockedFlow.args = {
  services: mockServicesSuccess,
  countdownSeconds: 15,
  ui: {
    title: "Let's get started",
    showTitle: true,
    theme: {
      brandPrimary: '#000000',
      brandPrimaryForeground: '#ffffff',
      linkColor: '#0d6efd',
    },
    defaultAction: 'create',
    defaultCreateApp: true,
  },
};

export const CustomThemeMockedFlow = Template.bind({});
CustomThemeMockedFlow.args = {
  services: mockServicesSuccess,
  countdownSeconds: 15,
  ui: {
    title: 'Tenant Setup',
    showTitle: true,
    theme: {
      brandPrimary: '#6f42c1',
      brandPrimaryForeground: '#ffffff',
      linkColor: '#6f42c1',
    },
    defaultAction: 'choose',
    defaultCreateApp: false,
  },
};

export const MockedFlowWithError = Template.bind({});
MockedFlowWithError.args = {
  services: mockServicesError,
  countdownSeconds: 15,
  ui: {
    theme: {
      brandPrimary: '#d32f2f',
      brandPrimaryForeground: '#ffffff',
      linkColor: '#d32f2f',
    },
  },
};
