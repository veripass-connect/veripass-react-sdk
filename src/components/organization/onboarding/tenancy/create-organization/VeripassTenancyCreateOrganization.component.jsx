import React, { useEffect, useState, useCallback } from 'react';
import { TextField, CircularProgress, Button } from '@mui/material';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LockIcon from '@mui/icons-material/Lock';
import styled from 'styled-components';
import { VeripassSlugInput } from '../shared/VeripassSlugInput.component';

import { VeripassActionButton } from '@components/shared/buttons/VeripassActionButton.component';

import '@styles/fonts.css';
import '@styles/styles.css';

const ViewTitle = styled('h4')(({ $compact }) => ({
  margin: '0 0 8px',
  fontSize: $compact ? '1.5rem' : '2rem',
  lineHeight: 1.2,
  color: '#0f172a',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}));

const ViewSubtitle = styled('p')(({ $compact }) => ({
  margin: 0,
  fontSize: $compact ? '0.95rem' : '1.05rem',
  color: '#64748b',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}));

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

const SlugAutoBadge = styled('span')({
  fontSize: '0.75rem',
  color: '#64748b',
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

const Field = styled('fieldset')({
  border: 0,
  padding: 0,
  margin: 0,
  minWidth: 0,
});

const SlugBadgeRow = styled('aside')({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginBottom: '8px',
});

const FooterNote = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  margin: '16px 0 0',
  fontSize: '0.8rem',
  color: '#64748b',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const ActionsRow = styled('div')(({ $compact }) => ({
  display: 'flex',
  justifyContent: $compact ? 'flex-end' : 'stretch',
  alignItems: 'center',
  gap: '8px',
  marginTop: $compact ? '20px' : '24px',
}));

const COMPACT_BUTTON_STYLE = {
  height: 36,
  minHeight: 36,
  padding: '0 16px',
  fontSize: '0.875rem',
  lineHeight: 1,
  textTransform: 'none',
  boxShadow: 'none',
};

const NAMESPACE = 'veripass-tenancy-onboarding';
const ACTIONS = {
  ORGANIZATION_BACK: `${NAMESPACE}::organization/back`,
  ORGANIZATION_FORM_UPDATED: `${NAMESPACE}::organization/form-updated`,
  ORGANIZATION_CONTINUE: `${NAMESPACE}::organization/continue`,
};

function VeripassTenancyCreateOrganizationComponent({
  ui = {},
  organization = {},
  organizationForm = { name: '', slug: '', description: '', isSlugEdited: false },
  itemOnAction,
  updateOnAction,
  isLoading = false,
  error = null,
  slugError = '',
  isSlugChecking = false,
  onCancel,
  environment = 'production',
  apiKey = '',
}) {
  // Hooks
  const [form, setForm] = useState(organizationForm);

  // Models
  const copy = ui.copy || {};

  // Component Functions
  useEffect(() => {
    setForm(organizationForm);
  }, [organizationForm]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
  };

  const handleUpdate = useCallback(
    (newForm) => {
      setForm(newForm);
      if (updateOnAction) {
        updateOnAction({
          action: ACTIONS.ORGANIZATION_FORM_UPDATED,
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
        action: ACTIONS.ORGANIZATION_CONTINUE,
        namespace: NAMESPACE,
        payload: { organization: form },
      });
    }
  };

  // Validations
  const isSlugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug || '');
  const isSlugInvalid = form.slug?.length > 0 && !isSlugValid;
  const slugHelperText = isSlugInvalid ? 'Only lowercase letters, numbers, and hyphens allowed.' : slugError;
  const isValid = form.name?.trim()?.length > 0 && isSlugValid && !slugError && !isSlugChecking && !isLoading;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isValid) {
      e.preventDefault();
      handleContinue(e);
    }
  };

  return (
    <section className="veripass-container-fluid veripass-w-100 veripass-p-0">
      {ui.showHeader !== false && (
        <header style={{ marginBottom: ui.compact ? 20 : 24, textAlign: 'left' }}>
          {ui.showTitle !== false && (
            <ViewTitle $compact={ui.compact} className="veripass-fw-bold">
              {copy.createTitle || 'Create your organization'}
            </ViewTitle>
          )}
          <ViewSubtitle $compact={ui.compact}>
            {copy.createSubtitle || 'Enter details to configure your environment.'}
          </ViewSubtitle>
        </header>
      )}

      {error && typeof error === 'string' && (
        <FormError
          className="veripass-alert veripass-alert-danger veripass-mb-3 veripass-p-2 veripass-border-radius-1"
          role="alert"
        >
          {error}
        </FormError>
      )}

      <form onSubmit={handleContinue} onKeyDown={handleKeyDown} autoComplete="off">
        <Field style={{ margin: ui.compact ? '0 0 16px' : '16px 0 24px' }}>
          <StyledTextField
            fullWidth
            size={ui.compact ? 'small' : 'medium'}
            label="Organization Name"
            variant="outlined"
            placeholder={copy.namePlaceholder || 'e.g. Blackwood Stone Holdings, inc.'}
            autoFocus
            autoComplete="off"
            value={form.name || ''}
            onChange={handleNameChange}
            required
            disabled={isLoading}
          />
        </Field>

        <Field style={{ marginBottom: '4px' }}>
          {!ui.compact && <SlugBadgeRow>{!form.isSlugEdited && <SlugAutoBadge>Auto-generated</SlugAutoBadge>}</SlugBadgeRow>}
          <VeripassSlugInput
            size={ui.compact ? 'small' : 'medium'}
            label={copy.slugLabel || 'Slug'}
            prefix={copy.slugPrefix ?? 'veripass.com/'}
            placeholder={copy.slugPlaceholder || 'blackwood-stone-holdings'}
            value={form.slug || ''}
            onChange={handleSlugChange}
            required
            disabled={isLoading}
            error={isSlugInvalid || Boolean(slugError)}
            helperText={slugHelperText}
            infoText={
              isSlugChecking
                ? 'Checking availability...'
                : ui.compact && !form.isSlugEdited
                  ? copy.slugAutoText || 'Suggested from the name. You can edit it.'
                  : copy.slugInfoText || 'This will be your unique URL identifier.'
            }
          />
        </Field>

        {copy.footerNote && (
          <FooterNote>
            <AdminPanelSettingsOutlinedIcon sx={{ fontSize: '1rem' }} />
            <span>{copy.footerNote}</span>
          </FooterNote>
        )}

        <ActionsRow $compact={ui.compact}>
          {ui.compact && onCancel && (
            <Button
              type="button"
              color="inherit"
              onClick={onCancel}
              disabled={isLoading}
              sx={{ textTransform: 'none', color: '#475569', height: 36, fontSize: '0.875rem' }}
            >
              {copy.cancelLabel || 'Cancel'}
            </Button>
          )}
          <VeripassActionButton
            customTheme={ui?.theme}
            variant="contained"
            fullWidth={!ui.compact}
            size={ui.compact ? 'medium' : 'large'}
            type="submit"
            disabled={!isValid || isLoading}
            className={
              ui.compact ? 'veripass-fw-bold' : 'veripass-py-3 veripass-fw-bold veripass-fs-6 veripass-position-relative'
            }
            style={ui.compact ? COMPACT_BUTTON_STYLE : undefined}
          >
            {isLoading && <CircularProgress size={18} className="veripass-me-2" sx={{ color: ui?.theme?.brandPrimary }} />}
            {copy.submitLabel || 'Continue'}
          </VeripassActionButton>
        </ActionsRow>
      </form>

      {ui.showSecurityFooter !== false && (
        <React.Fragment>
          <FooterDivider />
          <footer className="veripass-d-flex veripass-justify-content-center">
            <SecurityBadge className="veripass-d-inline-flex veripass-align-items-center veripass-gap-2">
              <LockIcon sx={{ fontSize: '0.9rem' }} />
              <SecurityLabel>Encrypted end-to-end</SecurityLabel>
            </SecurityBadge>
          </footer>
        </React.Fragment>
      )}
    </section>
  );
}

export const VeripassTenancyCreateOrganization = VeripassTenancyCreateOrganizationComponent;
