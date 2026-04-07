import React from 'react';
import { Badge as BadgeIcon } from '@mui/icons-material';
import { VeripassOrganizationSectionHeader } from '../../../../components/organization/corporate-identity/primitives/VeripassOrganizationSectionHeader.component';

export default {
  title: 'Organization/CorporateIdentity/Primitives/VeripassOrganizationSectionHeader',
  component: VeripassOrganizationSectionHeader,
  tags: ['autodocs'],
};

const Template = (args) => <VeripassOrganizationSectionHeader {...args} />;

export const ReadOnly = Template.bind({});
ReadOnly.args = { title: 'Official Identity', icon: <BadgeIcon sx={{ fontSize: 22 }} /> };

export const Editable = Template.bind({});
Editable.args = { title: 'Official Identity', icon: <BadgeIcon sx={{ fontSize: 22 }} />, isEditable: true };

export const Editing = Template.bind({});
Editing.args = { title: 'Official Identity', icon: <BadgeIcon sx={{ fontSize: 22 }} />, isEditable: true, isEditing: true };

export const EditDisabled = Template.bind({});
EditDisabled.args = { title: 'Official Identity', icon: <BadgeIcon sx={{ fontSize: 22 }} />, isEditable: true, editDisabled: true };
