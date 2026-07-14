import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import VeripassUserManager from '../../../../components/user/user-management/manager/VeripassUserManager.component';

export default {
  title: 'User/Manager/VeripassUserManager',
  component: VeripassUserManager,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    userId: { control: 'text' },
    apiKey: { control: 'text' },
    environment: { control: 'string' },
    onNavigate: { control: 'function' },
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
    <VeripassUserManager {...args} />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  userId: 'user-618f7f167eca2f4',
  apiKey: '',
  environment: 'development',
  onNavigate: () => {},
  debug: true,
};
