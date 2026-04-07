import React from 'react';
import { VeripassOrganizationStatusBadge } from '../../../../components/organization/corporate-identity/primitives/VeripassOrganizationStatusBadge.component';

export default {
  title: 'Organization/CorporateIdentity/Primitives/VeripassOrganizationStatusBadge',
  component: VeripassOrganizationStatusBadge,
  tags: ['autodocs'],
};

const Template = (args) => <VeripassOrganizationStatusBadge {...args} />;

export const Verified = Template.bind({});
Verified.args = { status: 'verified' };

export const Pending = Template.bind({});
Pending.args = { status: 'pending' };

export const NotVerified = Template.bind({});
NotVerified.args = { status: 'not_verified' };

export const Active = Template.bind({});
Active.args = { status: 'active' };

export const Administrator = Template.bind({});
Administrator.args = { status: 'administrator' };

export const AllBadges = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <VeripassOrganizationStatusBadge status="verified" />
    <VeripassOrganizationStatusBadge status="pending" />
    <VeripassOrganizationStatusBadge status="not_verified" />
    <VeripassOrganizationStatusBadge status="active" />
    <VeripassOrganizationStatusBadge status="administrator" />
  </div>
);
