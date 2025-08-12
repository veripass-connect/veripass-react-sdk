import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassTeamManagementList } from '../../../../components/team/team-management/list/VeripassTeamManagementList';
import { AuthProvider } from '../../../../hooks/useAuth.hook';

export default {
  title: 'Team/Team-Management/list/VeripassTeamManagementList',
  component: VeripassTeamManagementList,
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
      <VeripassTeamManagementList {...args} />
    </AuthProvider>
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  environment: 'local',
  apiKey: '',
  debug: true,
  readOnly: false,
};
