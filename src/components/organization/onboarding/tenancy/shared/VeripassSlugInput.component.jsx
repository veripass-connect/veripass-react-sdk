import React from 'react';
import styled from 'styled-components';
import { TextField, InputAdornment } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
  '& .MuiInputBase-input': {
    fontSize: '0.95rem',
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.95rem',
  },
});

const SlugError = styled('div')({
  fontSize: '0.75rem',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const SlugInfo = styled('div')({
  color: '#64748b',
  fontSize: '0.8rem',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

function VeripassSlugInputComponent({
  value = '',
  onChange,
  onBlur,
  error = false,
  helperText = '',
  infoText = 'This will be your unique URL identifier.',
  disabled = false,
  prefix = 'veripass.com/',
  label = 'Organization Slug',
  placeholder = 'blackwood-stone-holdings',
  required = false,
  className = '',
}) {
  return (
    <div className={`veripass-w-100 veripass-mb-3 ${className}`}>
      <StyledTextField
        fullWidth
        label={label}
        variant="outlined"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        helperText={error && helperText ? helperText : ''}
        required={required}
        disabled={disabled}
        InputProps={{
          startAdornment: prefix ? <InputAdornment position="start">{prefix}</InputAdornment> : null,
        }}
      />
      {!error && infoText && (
        <SlugInfo className="veripass-d-flex veripass-align-items-center veripass-mt-2">
          <InfoOutlinedIcon sx={{ fontSize: '1.1rem', mr: 0.5 }} />
          <span>{infoText}</span>
        </SlugInfo>
      )}
    </div>
  );
}

export const VeripassSlugInput = VeripassSlugInputComponent;
