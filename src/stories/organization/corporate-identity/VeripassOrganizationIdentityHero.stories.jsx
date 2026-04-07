import React from 'react';
import { VeripassOrganizationIdentityHero } from '../../../components/organization/corporate-identity/hero/VeripassOrganizationIdentityHero.component';
import { MOCK_ORGANIZATION_VERIFIED, MOCK_ORGANIZATION_UNVERIFIED, MOCK_ORGANIZATION_EMPTY } from './mock-data';

export default {
  title: 'Organization/CorporateIdentity/VeripassOrganizationIdentityHero',
  component: VeripassOrganizationIdentityHero,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ maxWidth: 900 }}><Story /></div>],
};

const Template = (args) => <VeripassOrganizationIdentityHero {...args} />;

export const VerifiedViewer = Template.bind({});
VerifiedViewer.args = { organization: MOCK_ORGANIZATION_VERIFIED, mode: 'viewer' };

export const UnverifiedViewer = Template.bind({});
UnverifiedViewer.args = { organization: MOCK_ORGANIZATION_UNVERIFIED, mode: 'viewer' };

export const AdminMode = Template.bind({});
AdminMode.args = { organization: MOCK_ORGANIZATION_VERIFIED, mode: 'admin' };

export const EmptyOrganization = Template.bind({});
EmptyOrganization.args = { organization: MOCK_ORGANIZATION_EMPTY, mode: 'viewer' };

export const WithShell = Template.bind({});
WithShell.args = { organization: MOCK_ORGANIZATION_VERIFIED, mode: 'viewer', ui: { showShell: true } };
