import React from 'react';
import { VeripassOrganizationPublicPresence } from '../../../components/organization/corporate-identity/public-presence/VeripassOrganizationPublicPresence.component';
import { MOCK_ORGANIZATION_VERIFIED, MOCK_ORGANIZATION_UNVERIFIED, MOCK_ORGANIZATION_EMPTY } from './mock-data';

export default {
  title: 'Organization/CorporateIdentity/VeripassOrganizationPublicPresence',
  component: VeripassOrganizationPublicPresence,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ maxWidth: 600 }}><Story /></div>],
};

const Template = (args) => <VeripassOrganizationPublicPresence {...args} />;

export const Verified = Template.bind({});
Verified.args = { organization: MOCK_ORGANIZATION_VERIFIED };

export const Unverified = Template.bind({});
Unverified.args = { organization: MOCK_ORGANIZATION_UNVERIFIED };

export const Empty = Template.bind({});
Empty.args = { organization: MOCK_ORGANIZATION_EMPTY };
