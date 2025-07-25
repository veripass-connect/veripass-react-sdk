import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassOrganizationProfileEdit } from '../../../../components/organization/profile/edit/VeripassOrganizationProfileEdit';
import { AuthProvider } from '../../../../hooks/useAuth.hook';

export default {
  title: 'Organization/Profile/VeripassOrganizationProfileEdit',
  component: VeripassOrganizationProfileEdit,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    organization: { control: 'object' },
    redirectUrl: { control: 'text' },
    environment: { control: 'string' },
    apiKey: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

const Template = (args) => (
  <MemoryRouter>
    <AuthProvider {...args}>
      <VeripassOrganizationProfileEdit {...args} />
    </AuthProvider>
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  veripassIdentity: {
    identity: 'veripass-xyz789',
    organization_profile: {
      display_name: 'Blackwood Stone Holdings, inc.',
      slug: 'blackwood-stone-holdings',
      primary_address: { formatted_address: '169 Madison Ave, New York, NY 10016' },
      primary_email_address: 'contact@blackwoodstoneholdings.com',
      primary_phone_number: {
        country: {
          dial_code: '1',
        },
        phone_number: '2025550147',
      },
      primary_national_id: {
        identification: '987654321',
      },
      status: {
        title: 'Active',
      },
      bio: 'Passionate about secure digital identity and privacy.',
      profile_ui_settings: {
        cover_picture_url: 'https://picsum.photos/800/300',
        profile_picture_url: 'https://picsum.photos/200/200',
      },
    },
  },
  veripassId: 'org-2cea26336c9488a',
  environment: 'development',
  apiKey: '',
  debug: true,
};
