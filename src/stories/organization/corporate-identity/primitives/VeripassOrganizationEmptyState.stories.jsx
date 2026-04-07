import React from 'react';
import { ImageNotSupported as ImageNotSupportedIcon } from '@mui/icons-material';
import { VeripassOrganizationEmptyState } from '../../../../components/organization/corporate-identity/primitives/VeripassOrganizationEmptyState.component';

export default {
  title: 'Organization/CorporateIdentity/Primitives/VeripassOrganizationEmptyState',
  component: VeripassOrganizationEmptyState,
  tags: ['autodocs'],
};

const Template = (args) => <VeripassOrganizationEmptyState {...args} />;

export const Inline = Template.bind({});
Inline.args = { message: 'Not published yet', variant: 'inline' };

export const Block = Template.bind({});
Block.args = { message: 'No branding assets configured yet.', variant: 'block' };

export const BlockWithIcon = Template.bind({});
BlockWithIcon.args = {
  message: 'No branding assets configured yet. Set branding to give your organization a more recognizable public identity.',
  variant: 'block',
  icon: <ImageNotSupportedIcon sx={{ fontSize: 48, color: '#cbd5e1' }} />,
};
