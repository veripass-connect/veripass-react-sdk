import React, { useState, useEffect } from 'react';
import { VeripassSelectableCard } from '../../../../../components/organization/onboarding/tenancy/shared/VeripassSelectableCard.component';
import BusinessIcon from '@mui/icons-material/Business';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default {
  title: 'Organization/Onboarding/Tenancy/Shared/VeripassSelectableCard',
  component: VeripassSelectableCard,
  argTypes: {
    title: { description: 'Title of the card', control: 'text' },
    description: { description: 'Description text below the title', control: 'text' },
    selected: { description: 'Whether this card is selected', control: 'boolean' },
    ui: { description: 'UI configuration object containing theme', control: 'object' },
  },
};

const Template = (args) => {
  const [selected, setSelected] = useState(args.selected);

  useEffect(() => {
    setSelected(args.selected);
  }, [args.selected]);

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <VeripassSelectableCard
        {...args}
        selected={selected}
        onClick={() => setSelected(!selected)}
        icon={args.iconName === 'business' ? <BusinessIcon /> : <AddCircleOutlineIcon />}
      />
    </div>
  );
};

export const DefaultTheme = Template.bind({});
DefaultTheme.args = {
  title: 'Create new organization',
  description: 'Set up a brand new environment for your team.',
  selected: true,
  iconName: 'add',
  ui: {
    theme: {
      brandPrimary: '#000000',
    },
  },
};

export const CustomTheme = Template.bind({});
CustomTheme.args = {
  title: 'Choose existing organization',
  description: 'Join an organization you already belong to.',
  selected: true,
  iconName: 'business',
  ui: {
    theme: {
      brandPrimary: '#0d6efd',
    },
  },
};
