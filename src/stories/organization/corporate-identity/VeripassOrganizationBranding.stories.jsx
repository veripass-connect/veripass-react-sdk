import React from 'react';
import { VeripassOrganizationBranding } from '../../../components/organization/corporate-identity/branding/VeripassOrganizationBranding.component';
import { MOCK_ORGANIZATION_VERIFIED, MOCK_ORGANIZATION_EMPTY } from './mock-data';

export default {
  title: 'Organization/CorporateIdentity/VeripassOrganizationBranding',
  component: VeripassOrganizationBranding,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ maxWidth: 800 }}><Story /></div>],
};

const Template = (args) => <VeripassOrganizationBranding {...args} />;

export const WithBranding = Template.bind({});
WithBranding.args = { organization: MOCK_ORGANIZATION_VERIFIED, mode: 'viewer' };

export const AdminMode = Template.bind({});
AdminMode.args = { organization: MOCK_ORGANIZATION_VERIFIED, mode: 'admin' };

export const NoBranding = Template.bind({});
NoBranding.args = { organization: MOCK_ORGANIZATION_EMPTY, mode: 'viewer' };
