import React, { useEffect, useState, useCallback } from 'react';
import { TextField, CircularProgress } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import styled from 'styled-components';
import { VeripassSlugInput } from '../shared/VeripassSlugInput.component';

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
  const isValid = form.name?.trim()?.length > 0 && isSlugValid && !isLoading;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isValid) {
      e.preventDefault();
      handleContinue(e);
    }
  };

  return (
    <section className="veripass-container-fluid veripass-w-100 veripass-p-0">
      <header className="veripass-mb-4 veripass-text-left">
        {ui.showTitle !== false && (
          <ViewTitle className="veripass-fw-bold veripass-text-dark veripass-mb-2">
            {copy.createTitle || 'Create your organization'}
          </ViewTitle>
        )}
        <ViewSubtitle className="veripass-m-0">
          {copy.createSubtitle || 'Enter details to configure your environment.'}
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
        <fieldset className="veripass-mb-4 veripass-mt-3 veripass-border-0 veripass-p-0">
          <StyledTextField
            fullWidth
            label="Organization Name"
            variant="outlined"
            placeholder="e.g. Blackwood Stone Holdings, inc."
            autoFocus
            autoComplete="off"
            value={form.name || ''}
            onChange={handleNameChange}
            required
            disabled={isLoading}
          />
        </fieldset>

        <fieldset className="veripass-mb-1 veripass-border-0 veripass-p-0">
          <aside className="veripass-d-flex veripass-justify-content-end veripass-align-items-center veripass-mb-2">
            {!form.isSlugEdited && <SlugAutoBadge>Auto-generated</SlugAutoBadge>}
          </aside>
          <VeripassSlugInput
            label={copy.slugLabel || 'Slug'}
            prefix="veripass.com/"
            placeholder="blackwood-stone-holdings"
            value={form.slug || ''}
            onChange={handleSlugChange}
            required
            disabled={isLoading}
            error={form.slug?.length > 0 && !isSlugValid}
            helperText={form.slug?.length > 0 && !isSlugValid ? 'Only lowercase letters, numbers, and hyphens allowed.' : ''}
            infoText={copy.slugInfoText || 'This will be your unique URL identifier.'}
          />
        </fieldset>

        <VeripassActionButton
          customTheme={ui?.theme}
          variant="contained"
          fullWidth
          size="large"
          type="submit"
          disabled={!isValid || isLoading}
          className="veripass-py-3 veripass-fw-bold veripass-fs-6 veripass-position-relative veripass-mt-4"
        >
          {isLoading && <CircularProgress size={20} className="veripass-me-2" sx={{ color: ui?.theme?.brandPrimary }} />}
          Continue
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

export const VeripassTenancyCreateOrganization = VeripassTenancyCreateOrganizationComponent;
