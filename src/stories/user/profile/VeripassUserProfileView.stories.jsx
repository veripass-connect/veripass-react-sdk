import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassUserProfileView } from '../../../components/user/profile/VeripassUserProfileView';
import { AuthProvider } from '../../../hooks/useAuth.hook';

export default {
  title: 'User/Profile/VeripassUserProfileView',
  component: VeripassUserProfileView,
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
      <VeripassUserProfileView {...args} />
    </AuthProvider>
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  veripassProfile: {
    identity: 'veripass-xyz789',
    profile: {
      display_name: 'Sophia Turner',
      first_name: 'Sophia',
      last_name: 'Turner',
      primary_email_address: 'sophia.turner@veripass.com',
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
        profile_picture_url: 'https://loremflickr.com/200/200/',
      },
    },
  },
  environment: 'development',
  apiKey: '',
  debug: true,
};
