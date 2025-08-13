import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassMyPrincipalTeamList } from '../../../../components/team/team-management/preview/VeripassMyPrincipalTeamList';
import { AuthProvider } from '../../../../hooks/useAuth.hook';

export default {
  title: 'Team/Team-Management/preview/VeripassMyPrincipalTeamList',
  component: VeripassMyPrincipalTeamList,
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
      <VeripassMyPrincipalTeamList {...args} />
    </AuthProvider>
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  environment: 'local',
  apiKey: '',
  debug: true,
};
