import React from 'react';
import { VeripassOrganizationVerificationStatus } from '../../../components/organization/corporate-identity/verification-status/VeripassOrganizationVerificationStatus.component';
import { MOCK_ORGANIZATION_VERIFIED, MOCK_ORGANIZATION_UNVERIFIED } from './mock-data';

export default {
  title: 'Organization/CorporateIdentity/VeripassOrganizationVerificationStatus',
  component: VeripassOrganizationVerificationStatus,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ maxWidth: 400 }}><Story /></div>],
};

const Template = (args) => <VeripassOrganizationVerificationStatus {...args} />;

export const Verified = Template.bind({});
Verified.args = { organization: MOCK_ORGANIZATION_VERIFIED, mode: 'viewer' };

export const VerifiedAdmin = Template.bind({});
VerifiedAdmin.args = { organization: MOCK_ORGANIZATION_VERIFIED, mode: 'admin' };

export const Pending = Template.bind({});
Pending.args = { organization: MOCK_ORGANIZATION_UNVERIFIED, mode: 'viewer' };

export const PendingAdmin = Template.bind({});
PendingAdmin.args = { organization: MOCK_ORGANIZATION_UNVERIFIED, mode: 'admin' };
