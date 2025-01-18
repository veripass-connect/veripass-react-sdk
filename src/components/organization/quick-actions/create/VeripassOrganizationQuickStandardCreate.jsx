import React, { useEffect, useState } from 'react';

import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';

import { TextField, FormHelperText, Button } from '@mui/material';
import { NationalIdentificationSelector, PhoneCountrySelector } from '@link-loom/react-sdk';
import { OrganizationManagementService } from '@services';

async function emitEvent({ action, payload, error, eventHandler }) {
  if (eventHandler) {
    eventHandler({ action, namespace: 'veripass', payload, error });
  }
}

async function createEntity({ Service, payload, apiKey, environment = 'production' }) {
  const entityService = new Service({ apiKey, settings: { environment } });
  const entityResponse = await entityService.create(payload);

  if (!entityResponse || !entityResponse.result) {
    console.error(entityResponse);
    return null;
  }

  return entityResponse;
}

const initialState = {
  primary_national_id: {
    type: '',
    identification: '',
    issuing_country: {
      iso_code: '',
      country_name: '',
    },
  },
  primary_email_address: '',
  display_name: '',
  primary_phone_number: {
    country: {
      iso_code: '',
      dial_code: '',
      name: '',
    },
    international_phone_number: '',
    phone_number: '',
  },
  first_name: '',
  last_name: '',
  profile_ui_settings: {},
  password: '',
};

export const VeripassOrganizationQuickStandardCreate = ({
  ui = { showHeader: false },
  entity,
  onEvent,
  setIsOpen,
  isPopupContext = false,
  environment = 'production',
  apiKey = '',
}) => {
  // Models
  const [organizationProfileData, setOrganizationProfileData] = useState(initialState);

  // UI States
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setOrganizationProfileData(initialState);
  };

  const handleDataChange = (fieldPath, value) => {
    setOrganizationProfileData((previousData) => {
      const keys = fieldPath.split('.');
      keys.reduce((currentLevel, currentKey, index) => {
        currentLevel[currentKey] = index === keys.length - 1 ? value : currentLevel[currentKey] || {};
        return currentLevel[currentKey];
      }, previousData);
      return { ...previousData };
    });
  };

  const handleSubmit = async (event) => {
    try {
      if (event) {
        event.preventDefault();
      }
      setIsLoading(true);

      const organization = {
        organization_profile: organizationProfileData,
      };
      const response = await createEntity({ payload: organization, Service: OrganizationManagementService, environment, apiKey });

      // Update parent states
      setIsLoading(false);

      emitEvent({ action: 'veripass-quick-standard-organization::created', payload: response, eventHandler: onEvent });

      if (setIsOpen) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);

      setIsLoading(false);
      emitEvent({ action: 'veripass-quick-standard-organization::error', error, eventHandler: onEvent });

      if (setIsOpen) {
        setIsOpen(false);
      }
    }
  };

  return (
    <VeripassLayout isPopupContext={isPopupContext}>
      <section className="mb-0">
        {ui?.showHeader === true && (
          <header className="row">
            <article className="col-12">
              <h4 className="header-title">{ui?.title || 'Create User'}</h4>
              <p className="sub-header">
                {ui?.subtitle || "To get started, fill out some basic information about who you're adding as a user."}
              </p>
            </article>
          </header>
        )}

        <section>
          <form onSubmit={(event) => event.preventDefault()}>
            {/* Display name, Slug */}
            <article className="row">
              <section className="mb-3 col-12 col-md-6">
                <TextField
                  className="w-100"
                  type="text"
                  id="name-input"
                  label="Display name"
                  value={organizationData.display_name}
                  placeholder=""
                  helperText="This is the app name"
                  required
                  onChange={(event) => {
                    handleDataChange('display_name', event.target.value);
                  }}
                  autoComplete="off"
                />
              </section>
              <section className="mb-3 col-12 col-md-6">
                <TextField
                  className="w-100"
                  type="text"
                  id="slug-input"
                  label="Slug"
                  value={organizationData.slug}
                  placeholder=""
                  helperText="This is a unique app slug"
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">@</InputAdornment>,
                  }}
                  InputLabelProps={{ shrink: true }}
                  onChange={(event) => {
                    handleDataChange('slug', event.target.value);
                  }}
                  autoComplete="off"
                />
              </section>
            </article>

            {/* National identification */}
            <article className="row">
              <section className="mb-3 col-12 col-md-12">
                <NationalIdentificationSelector
                  label="National identification number"
                  defaultDocumentType="Passport"
                  onChange={(event) => {
                    handleDataChange('primary_national_id', event);
                  }}
                />
                <FormHelperText>Please write the primary legal national id.</FormHelperText>
              </section>
            </article>

            {/* Email, Phone */}
            <article className="row">
              <section className="mb-3 col-12 col-md-6">
                <TextField
                  className="w-100"
                  type="email"
                  id="email-input"
                  label="Primary email address"
                  value={organizationData.primary_email_address}
                  placeholder="jhondoe@domain.com"
                  helperText="This is the email most used by user"
                  required
                  onChange={(event) => {
                    handleDataChange('primary_email_address', event.target.value);
                  }}
                  autoComplete="veripass-email"
                />
              </section>
              <section className="mb-3 col-12 col-md-6">
                <PhoneCountrySelector
                  label="Phone number"
                  onPhoneChange={(event) => {
                    handleDataChange('primary_phone_number', event);
                  }}
                  disabled={false}
                  variant="outlined"
                />
                <FormHelperText>Principal phone number and or used with WhatsApp</FormHelperText>
              </section>
            </article>

            <footer className="row">
              <section className="mb-0 h-25 d-flex justify-content-end align-items-end">
                <Button
                  type="button"
                  variant="contained"
                  className="my-2"
                  onClick={handleSubmit}
                  disabled={!organizationProfileData?.primary_national_id?.identification}
                  sx={{
                    backgroundColor: '#323a46',
                    borderColor: '#323a46',
                    '&:hover': {
                      backgroundColor: '#404651',
                      borderColor: '#404651',
                    },
                  }}
                >
                  {isLoading ? 'Saving...' : 'Next'}
                </Button>
              </section>
            </footer>
          </form>
        </section>
      </section>
    </VeripassLayout>
  );
};
