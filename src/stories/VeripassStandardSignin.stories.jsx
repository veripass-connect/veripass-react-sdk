import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VeripassStandardSignin } from '../../src/components/auth/standard-signin/VeripassStandardSignin';

export default {
  title: 'Components/VeripassStandardSignin',
  component: VeripassStandardSignin,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    organizationLogoSrc: { control: 'text' },
    organizationSlogan: { control: 'text' },
    redirectUrl: { control: 'text' },
    debug: { control: 'boolean' },
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
    <VeripassStandardSignin {...args} />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  organizationLogoSrc: 'https://id.etrune.com/assets/img/logo-2x.png',
  organizationSlogan: 'Unlock your digital world',
  redirectUrl: '/home',
  debug: true,
};

export const Loading = Template.bind({});
Loading.args = {
  organizationLogoSrc: 'https://id.etrune.com/assets/img/logo-2x.png',
  organizationSlogan: 'Loading...',
  redirectUrl: '/loading',
  debug: true,
};
