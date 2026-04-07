import React from 'react';
import { Email as EmailIcon } from '@mui/icons-material';
import { VeripassOrganizationMetadataItem } from '../../../../components/organization/corporate-identity/primitives/VeripassOrganizationMetadataItem.component';

export default {
  title: 'Organization/CorporateIdentity/Primitives/VeripassOrganizationMetadataItem',
  component: VeripassOrganizationMetadataItem,
  tags: ['autodocs'],
};

const Template = (args) => <VeripassOrganizationMetadataItem {...args} />;

export const Default = Template.bind({});
Default.args = { label: 'Official Email', value: 'contacto@fiscalia.gov.co' };

export const Copyable = Template.bind({});
Copyable.args = { label: 'Organization ID', value: 'org-fgn-7729bc207343671', copyable: true };

export const WithIcon = Template.bind({});
WithIcon.args = { label: 'Official Email', value: 'contacto@fiscalia.gov.co', icon: <EmailIcon sx={{ fontSize: 16 }} /> };

export const Empty = Template.bind({});
Empty.args = { label: 'Website', value: '', emptyText: 'Not published yet' };
