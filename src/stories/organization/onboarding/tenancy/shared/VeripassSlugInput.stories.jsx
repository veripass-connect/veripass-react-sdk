import React, { useState } from 'react';
import { VeripassSlugInput } from '../../../../../components/organization/onboarding/tenancy/shared/VeripassSlugInput.component';

export default {
  title: 'Organization/Onboarding/Tenancy/Shared/VeripassSlugInput',
  component: VeripassSlugInput,
  argTypes: {
    value: { description: 'Value of the input field', control: 'text' },
    label: { description: 'Label for the input', control: 'text' },
    placeholder: { description: 'Placeholder for the input', control: 'text' },
    prefix: { description: 'Prefix text displayed before the input value', control: 'text' },
    disabled: { description: 'Whether the input is disabled', control: 'boolean' },
    error: { description: 'Whether to show error state', control: 'boolean' },
    helperText: { description: 'Helper text displayed below the input', control: 'text' },
    required: { description: 'Whether this field is required', control: 'boolean' },
  },
};

const Template = (args) => {
  const [val, setVal] = useState(args.value || '');
  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <VeripassSlugInput {...args} value={val} onChange={(e) => setVal(e.target.value)} />
    </div>
  );
};

export const DefaultTheme = Template.bind({});
DefaultTheme.args = {
  label: 'Organization URL',
  placeholder: 'my-organization',
  prefix: 'veripass.com/',
  disabled: false,
  error: false,
  helperText: 'Only lowercase letters, numbers and hyphens are allowed.',
  required: true,
};

export const ErrorState = Template.bind({});
ErrorState.args = {
  ...DefaultTheme.args,
  error: true,
  helperText: 'Invalid slug format. Use only lowercase letters and hyphens.',
  value: 'Invalid Slug!',
};
