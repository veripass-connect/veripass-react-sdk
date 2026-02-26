import React, { useEffect, useState, useCallback } from 'react';
import { Switch, CircularProgress, TextField } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import styled from 'styled-components';
import { VeripassSlugInput } from '../shared/VeripassSlugInput.component';

import { VeripassActionButton } from '@components/shared/buttons/VeripassActionButton.component';

const AppCardContainer = styled('article')(({ $customTheme }) => ({
  backgroundColor: '#f9fafb',
  borderRadius: '12px',
  transition: 'border-color 0.2s',
  padding: '20px',
}));

const ViewTitle = styled('h2')({
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

const AppFeatureIcon = styled('figure')({
  width: '40px',
  height: '40px',
  backgroundColor: '#ffffff',
  margin: 0,
});

const AppFeatureTitle = styled('h6')({
  color: '#0f172a',
  fontSize: '0.95rem',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const AppFeatureSubtitle = styled('p')({
  fontSize: '0.8rem',
  color: '#64748b',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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

const SlugAutoBadge = styled('span')({
  fontSize: '0.75rem',
  color: '#64748b',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const AppHelperText = styled('p')({
  color: '#6b7280',
  fontSize: '0.875rem',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const FooterDivider = styled('hr')({
  border: 'none',
  borderTop: '1px solid #f3f4f6',
  margin: '24px 0 16px 0',
  width: '100%',
});

const SecurityBadge = styled('figure')({
  color: '#9ca3af',
  margin: 0,
});

const SecurityLabel = styled('span')({
  fontSize: '0.75rem',
  fontWeight: '500',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const GoBackLink = styled('button')({
  color: '#6b7280',
  fontSize: '0.875rem',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  '&:hover': {
    color: '#374151',
  },
});

const NAMESPACE = 'veripass-tenancy-onboarding';
const ACTIONS = {
  CREATE_APP_BACK: `${NAMESPACE}::create-application/back`,
  CREATE_APP_TOGGLE_UPDATED: `${NAMESPACE}::create-application/app-toggle-updated`,
  CREATE_APP_FORM_UPDATED: `${NAMESPACE}::create-application/app-form-updated`,
  CREATE_APP_SUBMIT: `${NAMESPACE}::create-application/submit`,
};

function VeripassTenancyCreateApplicationComponent({
  ui = {},
  organization = {},
  organizationForm = {},
  appForm = { createApp: true, name: '', slug: '', isSlugEdited: false },
  itemOnAction,
  updateOnAction,
  isLoading = false,
  error = null,
  environment = 'production',
  apiKey = '',
}) {
  const [form, setForm] = useState(appForm);
  const copy = ui.copy || {};

  useEffect(() => {
    if (appForm.createApp === undefined) {
      setForm((prev) => ({ ...prev, createApp: ui.defaultCreateApp !== false }));
    } else {
      setForm(appForm);
    }
  }, [appForm, ui.defaultCreateApp]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
  };

  const handleToggle = (e) => {
    const isChecked = e.target.checked;
    setForm({ ...form, createApp: isChecked });
    if (updateOnAction) {
      updateOnAction({
        action: ACTIONS.CREATE_APP_TOGGLE_UPDATED,
        namespace: NAMESPACE,
        payload: { createApp: isChecked },
      });
    }
  };

  const handleUpdate = useCallback(
    (newForm) => {
      setForm(newForm);
      if (updateOnAction) {
        updateOnAction({
          action: ACTIONS.CREATE_APP_FORM_UPDATED,
          namespace: NAMESPACE,
          payload: newForm,
        });
      }
    },
    [updateOnAction],
  );

  const handleNameChange = (e) => {
    const newName = e.target.value;
    const newForm = { ...form, name: newName };
    if (!form.isSlugEdited) {
      newForm.slug = generateSlug(newName);
    }
    handleUpdate(newForm);
  };

  const handleSlugChange = (e) => {
    handleUpdate({ ...form, slug: e.target.value.toLowerCase(), isSlugEdited: true });
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (itemOnAction) {
      itemOnAction({
        action: ACTIONS.CREATE_APP_SUBMIT,
        namespace: NAMESPACE,
        payload: {
          organization: organizationForm,
          application: form,
          createApp: form.createApp,
        },
      });
    }
  };

  const isSlugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug || '');
  let isValid = !isLoading;
  if (form.createApp) {
    isValid = isValid && form.name?.trim()?.length > 0 && isSlugValid;
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isValid) {
      e.preventDefault();
      handleContinue(e);
    }
  };

  return (
    <section className="veripass-container-fluid veripass-w-100 veripass-p-0">
      <header className="veripass-mb-4 veripass-text-center">
        {ui.showTitle !== false && (
          <ViewTitle className="veripass-fw-bold veripass-text-dark veripass-mb-2">
            {copy.createAppTitle || 'Complete your workspace'}
          </ViewTitle>
        )}
        <ViewSubtitle className="veripass-m-0">
          {copy.createAppSubtitle || 'Add your first application to finalize the provisioning.'}
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

      <form onSubmit={handleContinue} onKeyDown={handleKeyDown} autoComplete="off">
        <AppCardContainer $customTheme={ui?.theme} className="veripass-border veripass-mb-4">
          <header className="veripass-d-flex veripass-justify-content-between veripass-align-items-center veripass-border-bottom veripass-pb-3">
            <section className="veripass-d-flex veripass-align-items-center veripass-gap-3">
              <AppFeatureIcon className="veripass-border veripass-d-flex veripass-align-items-center veripass-justify-content-center veripass-rounded veripass-bg-white">
                <RocketLaunchIcon sx={{ fontSize: '1.25rem', color: '#1e293b' }} />
              </AppFeatureIcon>
              <article>
                <AppFeatureTitle className="veripass-fw-bold veripass-m-0">Create my first application</AppFeatureTitle>
                <AppFeatureSubtitle className="veripass-m-0 veripass-mt-1">Generate API keys automatically</AppFeatureSubtitle>
              </article>
            </section>
            <Switch
              checked={form.createApp}
              onChange={handleToggle}
              disabled={isLoading}
              color="primary"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: ui.theme?.brandPrimary || '#000000',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: ui.theme?.brandPrimary || '#000000',
                },
              }}
            />
          </header>

          {form.createApp && (
            <article className="veripass-mt-4">
              <fieldset className="veripass-mb-4 veripass-mt-3 veripass-border-0 veripass-p-0">
                <StyledTextField
                  fullWidth
                  label="Application name"
                  variant="outlined"
                  placeholder="My First App"
                  autoFocus
                  autoComplete="off"
                  value={form.name || ''}
                  onChange={handleNameChange}
                  required={form.createApp}
                  disabled={isLoading}
                />
              </fieldset>

              <fieldset className="veripass-mb-1 veripass-border-0 veripass-p-0">
                <aside className="veripass-d-flex veripass-justify-content-end veripass-align-items-center veripass-mb-2">
                  {!form.isSlugEdited && <SlugAutoBadge>Auto-generated</SlugAutoBadge>}
                </aside>
                <VeripassSlugInput
                  label={copy.slugLabel || 'Slug'}
                  prefix="veripass.com/app/"
                  placeholder="my-first-app"
                  value={form.slug || ''}
                  onChange={handleSlugChange}
                  required={form.createApp}
                  disabled={isLoading}
                  error={form.slug?.length > 0 && !isSlugValid}
                  helperText={
                    form.slug?.length > 0 && !isSlugValid ? 'Only lowercase letters, numbers, and hyphens allowed.' : ''
                  }
                  infoText={copy.slugInfoText || 'This will be your unique URL identifier.'}
                />
              </fieldset>
            </article>
          )}
        </AppCardContainer>

        <VeripassActionButton
          customTheme={ui?.theme}
          variant="contained"
          fullWidth
          size="large"
          type="submit"
          disabled={!isValid || isLoading}
          className="veripass-py-3 veripass-fw-bold veripass-fs-6 veripass-position-relative"
        >
          {isLoading && <CircularProgress size={20} className="veripass-me-2 veripass-text-white" />}
          {ui.primaryActionLabel || 'Create my workspace'}
        </VeripassActionButton>
      </form>

      <FooterDivider />
      <footer className="veripass-d-flex veripass-justify-content-center">
        <SecurityBadge className="veripass-d-inline-flex veripass-align-items-center veripass-gap-2">
          <LockIcon sx={{ fontSize: '0.9rem' }} />
          <SecurityLabel>Encrypted end-to-end</SecurityLabel>
        </SecurityBadge>
      </footer>
    </section>
  );
}

export const VeripassTenancyCreateApplication = VeripassTenancyCreateApplicationComponent;
