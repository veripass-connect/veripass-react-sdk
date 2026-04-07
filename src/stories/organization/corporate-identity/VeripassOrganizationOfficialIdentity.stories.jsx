import React from 'react';
import { VeripassOrganizationOfficialIdentity } from '../../../components/organization/corporate-identity/official-identity/VeripassOrganizationOfficialIdentity.component';
import { MOCK_ORGANIZATION_VERIFIED, MOCK_ORGANIZATION_EMPTY } from './mock-data';

export default {
  title: 'Organization/CorporateIdentity/VeripassOrganizationOfficialIdentity',
  component: VeripassOrganizationOfficialIdentity,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ maxWidth: 800 }}><Story /></div>],
};

const Template = (args) => <VeripassOrganizationOfficialIdentity {...args} />;

export const ViewerMode = Template.bind({});
ViewerMode.args = { organization: MOCK_ORGANIZATION_VERIFIED, mode: 'viewer' };

export const AdminRead = Template.bind({});
AdminRead.args = { organization: MOCK_ORGANIZATION_VERIFIED, mode: 'admin' };

export const AdminEditing = Template.bind({});
AdminEditing.args = { organization: MOCK_ORGANIZATION_VERIFIED, mode: 'admin', editingSection: 'official-identity' };

export const EmptyData = Template.bind({});
EmptyData.args = { organization: MOCK_ORGANIZATION_EMPTY, mode: 'viewer' };

export const EditDisabled = Template.bind({});
EditDisabled.args = { organization: MOCK_ORGANIZATION_VERIFIED, mode: 'admin', editingSection: 'branding' };
