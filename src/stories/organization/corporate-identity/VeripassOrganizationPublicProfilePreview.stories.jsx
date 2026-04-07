import React from 'react';
import { VeripassOrganizationPublicProfilePreview } from '../../../components/organization/corporate-identity/public-profile-preview/VeripassOrganizationPublicProfilePreview.component';
import { MOCK_ORGANIZATION_VERIFIED, MOCK_ORGANIZATION_UNVERIFIED, MOCK_ORGANIZATION_EMPTY } from './mock-data';

export default {
  title: 'Organization/CorporateIdentity/VeripassOrganizationPublicProfilePreview',
  component: VeripassOrganizationPublicProfilePreview,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ maxWidth: 300 }}><Story /></div>],
};

const Template = (args) => <VeripassOrganizationPublicProfilePreview {...args} />;

export const Verified = Template.bind({});
Verified.args = { organization: MOCK_ORGANIZATION_VERIFIED };

export const Unverified = Template.bind({});
Unverified.args = { organization: MOCK_ORGANIZATION_UNVERIFIED };

export const Empty = Template.bind({});
Empty.args = { organization: MOCK_ORGANIZATION_EMPTY };
