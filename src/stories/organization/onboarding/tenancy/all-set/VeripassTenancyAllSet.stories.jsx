import React from 'react';
import { VeripassTenancyAllSet } from '../../../../../components/organization/onboarding/tenancy/all-set/VeripassTenancyAllSet.component';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Organization/Onboarding/Tenancy/All Set/VeripassTenancyAllSet',
  component: VeripassTenancyAllSet,
  argTypes: {
    ui: { description: 'UI configuration object', control: 'object' },
    organization: { description: 'Host organization branding context', control: 'object' },
    result: { description: 'Resulting object created/selected', control: 'object' },
    countdownSeconds: { description: 'Optional countdown timer', control: 'number' },
    itemOnAction: { action: 'itemOnAction' },
    updateOnAction: { action: 'updateOnAction' },
  },
};

const mockItemOnAction = (e) => {
  action('itemOnAction')(e);
  console.log('[AllSet] itemOnAction fired:', e);
};

const Template = (args) => (
  <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px', backgroundColor: '#fff' }}>
    <VeripassTenancyAllSet {...args} itemOnAction={mockItemOnAction} />
  </div>
);

export const SuccessNoCountdown = Template.bind({});
SuccessNoCountdown.args = {
  result: {
    organization: { name: 'Acme Corp', slug: 'acme-corp' },
    application: { name: 'Main Prod App', slug: 'main-prod-app' },
  },
  countdownSeconds: 15,
  ui: {
    title: "You're all set",
    showTitle: true,
    theme: {
      brandPrimary: '#000000',
      brandPrimaryForeground: '#ffffff',
    },
    copy: {},
  },
  organization: {
    name: 'Sommatic',
    logoSrc: '',
    slogan: '',
  },
};

export const SuccessWithCountdown = Template.bind({});
SuccessWithCountdown.args = {
  ...SuccessNoCountdown.args,
  countdownSeconds: 15,
};

export const SelectedExistingOrg = Template.bind({});
SelectedExistingOrg.args = {
  ...SuccessNoCountdown.args,
  result: {
    organizationId: '1234abcd',
    organization: { name: 'Existing Global Tech' },
  },
};

export const CustomTheme = Template.bind({});
CustomTheme.args = {
  ...SuccessNoCountdown.args,
  ui: {
    title: 'Success!',
    showTitle: true,
    theme: {
      brandPrimary: '#198754',
      brandPrimaryForeground: '#ffffff',
    },
    copy: {
      allSetSubtitle: 'Your workspace has been fully provisioned.',
    },
  },
};
