import React from 'react';
import { VeripassOrganizationMonogram } from '../../../../components/organization/corporate-identity/primitives/VeripassOrganizationMonogram.component';

export default {
  title: 'Organization/CorporateIdentity/Primitives/VeripassOrganizationMonogram',
  component: VeripassOrganizationMonogram,
  tags: ['autodocs'],
};

const Template = (args) => <VeripassOrganizationMonogram {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'Fiscalia General de la Nacion',
  size: 98,
  backgroundColor: '#1e1b3a',
  color: '#ffffff',
};

export const Small = Template.bind({});
Small.args = {
  name: 'Blackwood Stone Holdings',
  size: 48,
  backgroundColor: '#0d9488',
  color: '#ffffff',
  fontSize: '0.9rem',
};

export const NoName = Template.bind({});
NoName.args = {
  name: '',
  size: 98,
};
