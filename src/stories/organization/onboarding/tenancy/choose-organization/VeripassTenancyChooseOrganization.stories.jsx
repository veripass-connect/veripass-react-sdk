import React, { useState } from 'react';
import { VeripassTenancyChooseOrganization } from '../../../../../components/organization/onboarding/tenancy/choose-organization/VeripassTenancyChooseOrganization.component';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Organization/Onboarding/Tenancy/Choose Organization/VeripassTenancyChooseOrganization',
  component: VeripassTenancyChooseOrganization,
  argTypes: {
    ui: { description: 'UI configuration object', control: 'object' },
    organization: { description: 'Host organization branding context', control: 'object' },
    organizations: { description: 'List of organization objects', control: 'object' },
    searchValue: { description: 'Search term', control: 'text' },
    selectedOrganizationId: { description: 'Currently selected organization ID', control: 'text' },
    loading: { description: 'Loading state', control: 'boolean' },
    error: { description: 'Error message', control: 'text' },
    itemOnAction: { action: 'itemOnAction' },
    updateOnAction: { action: 'updateOnAction' },
  },
};

const mockItemOnAction = (e) => {
  action('itemOnAction')(e);
  console.log('[ChooseOrg] itemOnAction fired:', e);
};

const DUMMY_ORGS = [
  { id: 'org_1', name: 'Acme Corp', slug: 'acme-corp', role: 'Owner' },
  { id: 'org_2', name: 'Sommatic Labs', slug: 'sommatic-labs', role: 'Admin' },
  { id: 'org_3', name: 'Global Tech', slug: 'global-tech', role: 'Member' },
  { id: 'org_4', name: 'StartUp Factory', slug: 'startup-factory', role: 'Member' },
  { id: 'org_5', name: 'Innovate AI', slug: 'innovate-ai', role: 'Owner' },
];

const Template = (args) => {
  const [search, setSearch] = useState(args.searchValue || '');
  const [selectedId, setSelectedId] = useState(args.selectedOrganizationId || null);

  const mockUpdateOnAction = (e) => {
    action('updateOnAction')(e);
    if (e.action.includes('search-updated')) {
      setSearch(e.payload.search);
    }
    if (e.action.includes('selected-updated')) {
      setSelectedId(e.payload.organizationId);
    }
  };

  const filteredOrgs = args.organizations.filter(
    (org) => org.name.toLowerCase().includes(search.toLowerCase()) || org.slug.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px', backgroundColor: '#fff' }}>
      <VeripassTenancyChooseOrganization
        {...args}
        organizations={filteredOrgs}
        searchValue={search}
        selectedOrganizationId={selectedId}
        itemOnAction={mockItemOnAction}
        updateOnAction={mockUpdateOnAction}
      />
    </div>
  );
};

export const PopulatedList = Template.bind({});
PopulatedList.args = {
  loading: false,
  error: null,
  organizations: DUMMY_ORGS,
  ui: {
    title: 'Choose your organization',
    showTitle: true,
    theme: {
      brandPrimary: '#000000',
      brandPrimaryForeground: '#ffffff',
      linkColor: '#0d6efd',
    },
    copy: {},
  },
};

export const CustomThemeWithSelection = Template.bind({});
CustomThemeWithSelection.args = {
  ...PopulatedList.args,
  selectedOrganizationId: 'org_2',
  ui: {
    title: 'Select Tenant',
    showTitle: true,
    theme: {
      brandPrimary: '#6f42c1',
      brandPrimaryForeground: '#ffffff',
      linkColor: '#6f42c1',
    },
    copy: {
      chooseSubtitle: 'Which environment do you want to access?',
    },
  },
};

export const EmptyState = Template.bind({});
EmptyState.args = {
  ...PopulatedList.args,
  organizations: [],
};

export const LoadingState = Template.bind({});
LoadingState.args = {
  ...PopulatedList.args,
  loading: true,
};
