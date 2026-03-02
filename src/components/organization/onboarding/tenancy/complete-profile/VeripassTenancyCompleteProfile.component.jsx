import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField, CircularProgress } from '@mui/material';
import { VeripassActionButton } from '@components/shared/buttons/VeripassActionButton.component';

const ViewTitle = styled('h4')({
  fontSize: '2rem',
  color: '#0f172a',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const ViewSubtitle = styled('p')({
  fontSize: '1.05rem',
  color: '#64748b',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const FormError = styled('aside')({
  fontSize: '0.875rem',
});

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

const ProfileFormContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%',
});

const FieldRow = styled('div')({
  display: 'flex',
  gap: '1rem',
  width: '100%',
  '@media (max-width: 600px)': {
    flexDirection: 'column',
  },
});

export const VeripassTenancyCompleteProfile = ({ ui = {}, itemOnAction, isLoading = false, error = null }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Auto-concatenate display name when first or last name changes and display name hasn't been manually overridden
  const handleNameFocus = () => {
    if (!displayName && (firstName || lastName)) {
      setDisplayName(`${firstName} ${lastName}`.trim());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemOnAction) {
      itemOnAction({
        action: 'veripass-tenancy-onboarding::complete-profile/submit',
        namespace: 'veripass-tenancy-onboarding',
        payload: {
          profile: {
            first_name: firstName,
            last_name: lastName,
            display_name: displayName || `${firstName} ${lastName}`.trim(),
          },
        },
      });
    }
  };

  return (
    <div className="veripass-w-100">
      <header className="veripass-mb-4">
        <ViewTitle className="veripass-fw-bold veripass-text-dark veripass-mb-2">
          {ui.copy?.completeProfileTitle || 'Complete your profile'}
        </ViewTitle>
        <ViewSubtitle className="veripass-m-0">
          {ui.copy?.completeProfileSubtitle || 'Tell us a bit about yourself to personalize your experience.'}
        </ViewSubtitle>
      </header>

      {error && typeof error === 'string' && (
        <FormError
          className="veripass-alert veripass-alert-danger veripass-mb-3 veripass-p-2 veripass-border-radius-1"
          role="alert"
        >
          {error}
        </FormError>
      )}

      <form onSubmit={handleSubmit}>
        <ProfileFormContainer>
          <FieldRow>
            <StyledTextField
              fullWidth
              label="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Jane"
              required
              disabled={isLoading}
              variant="outlined"
              autoComplete="given-name"
            />
            <StyledTextField
              fullWidth
              label="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Doe"
              required
              disabled={isLoading}
              variant="outlined"
              autoComplete="family-name"
            />
          </FieldRow>

          <StyledTextField
            fullWidth
            label="Display name"
            value={displayName}
            onFocus={handleNameFocus}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Jane Doe"
            helperText="This is how you will appear to others."
            required
            disabled={isLoading}
            variant="outlined"
            autoComplete="nickname"
          />

          <div className="veripass-d-flex veripass-justify-content-end veripass-mt-2">
            <VeripassActionButton
              type="submit"
              variant="contained"
              disabled={isLoading || !firstName || !lastName || !displayName}
              customTheme={ui.theme}
              className="veripass-px-4 veripass-py-2"
            >
              {isLoading && (
                <CircularProgress
                  size={20}
                  className="veripass-me-2"
                  sx={{ color: ui?.theme?.brandPrimaryForeground || '#fff' }}
                />
              )}
              {isLoading ? 'Saving...' : 'Continue'}
            </VeripassActionButton>
          </div>
        </ProfileFormContainer>
      </form>
    </div>
  );
};
