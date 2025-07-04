import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';

import { TextField, FormHelperText, CircularProgress, Button } from '@mui/material';
import { NationalIdentificationSelector, PhoneCountrySelector, useDebounce } from '@link-loom/react-sdk';
import { UserProfileService, UserManagementService } from '@services';
import { COVER_IMAGES } from '@constants/cover-images';
import { PROFILE_PICTURES } from '@constants/profile-pictures';

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

async function getEntity({ Service, payload, apiKey, environment = 'production' }) {
  try {
    const entityService = new Service({ apiKey, settings: { environment } });

    const entityResponse = entityService.getByParameters(payload);

    return entityResponse;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getUserByNationalId({ nationalId, apiKey, environment }) {
  try {
    const userResponsePromiseResponse = getEntity({
      payload: {
        queryselector: 'primary-national-id',
        search: nationalId ?? '',
      },
      Service: UserProfileService,
      environment,
      apiKey,
    });

    const [userResponse] = await Promise.all([userResponsePromiseResponse]);

    return { userResponse };
  } catch (error) {
    console.error(error);
  }
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

export const VeripassUserQuickStandardCreate = ({
  ui,
  entitySelected,
  onEvent,
  setIsOpen,
  isPopupContext = false,
  environment = 'production',
  apiKey = '',
}) => {
  // Models
  const [userProfileData, setUserProfileData] = useState(initialState);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [userNationalIdValidationInProgress, setUserNationalIdValidationInProgress] = useState(false);
  const debouncedNationalId = useDebounce(userProfileData?.primary_national_id?.identification, 1000);

  useEffect(() => {
    const fetchUser = async () => {
      if (debouncedNationalId) {
        setUserNationalIdValidationInProgress(true);

        const { userResponse } = await getUserByNationalId({
          nationalId: userProfileData?.primary_national_id?.identification,
          apiKey,
          environment,
        });

        if (!userResponse || !userResponse.success) {
          return;
        }

        if (userResponse?.result?.items?.length === 0) {
          setIsExistingUser(false);
          setUserProfileData({
            ...initialState,
            primary_national_id: {
              ...userProfileData?.primary_national_id,
              identification: userProfileData?.primary_national_id?.identification,
            },
          });
        } else {
          setIsExistingUser(true);
          setUserProfileData(
            userResponse.result?.items[0] ?? {
              ...initialState,
              primary_national_id: {
                ...userProfileData?.primary_national_id,
                identification: userProfileData?.primary_national_id?.identification,
              },
            },
          );
        }
      }

      setUserNationalIdValidationInProgress(false);
    };

    fetchUser();
  }, [debouncedNationalId]);

  const resetForm = () => {
    setUserProfileData(initialState);
  };

  const handleDataChange = (fieldName, data) => {
    setUserProfileData((prevUserData) => ({
      ...prevUserData,
      [fieldName]: data,
    }));
  };

  const handleNameFocus = () => {
    if (!userProfileData.display_name && (userProfileData.first_name || userProfileData.last_name)) {
      setUserProfileData((prevUserData) => ({
        ...prevUserData,
        display_name: `${userProfileData.first_name} ${userProfileData.last_name}`.trim(),
      }));
    }
  };

  const handleSubmit = async (event) => {
    try {
      if (event) {
        event.preventDefault();
      }
      setIsLoading(true);

      // Setup random ui settings
      userProfileData.profile_ui_settings = {
        profile_picture_url: PROFILE_PICTURES[Math.floor(Math.random() * 25) + 1].uri,
        cover_picture_url: COVER_IMAGES[Math.floor(Math.random() * 23) + 1].uri,
      };
      const user = {
        user_profile: userProfileData,
        user_security: { password: userProfileData.password, require_password_reset: true },
      };
      const response = await createEntity({ payload: user, Service: UserManagementService, environment, apiKey });

      // Update parent states
      setIsLoading(false);

      emitEvent({ action: 'veripass-user-quick-standard::created', payload: response, eventHandler: onEvent });

      if (setIsOpen) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);

      setIsLoading(false);
      emitEvent({ action: 'veripass-user-quick-standard::error', error, eventHandler: onEvent });

      if (setIsOpen) {
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    if (ui?.showHeader !== undefined || ui?.showHeader !== null) {
      setShowHeader(ui?.showHeader);
    }
  }, [ui]);

  return (
    <VeripassLayout isPopupContext={isPopupContext}>
      <section className="mb-0">
        {showHeader && (
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
            <article className="row">
              <section className="mb-2">
                <NationalIdentificationSelector
                  label="National identification number"
                  defaultDocumentType="Passport"
                  onChange={(event) => {
                    handleDataChange('primary_national_id', event);
                  }}
                />
                <FormHelperText>Please write the primary legal national id.</FormHelperText>
                {userNationalIdValidationInProgress && (
                  <FormHelperText className="d-flex text-primary">
                    <CircularProgress size={20} className="me-2" /> Validating user existence...
                  </FormHelperText>
                )}
                {isExistingUser && userProfileData?.primary_national_id?.identification && (
                  <FormHelperText className="d-flex text-danger">
                    User already exists. You only can view it and add it to this organization.
                  </FormHelperText>
                )}
              </section>
            </article>

            <article className="row">
              <section className="mb-2 col-12 col-md-6">
                <TextField
                  className="w-100"
                  type="text"
                  id="first-name-input"
                  label="First name"
                  value={userProfileData.first_name}
                  placeholder="Jhon"
                  helperText="This is the legal first name"
                  required
                  disabled={isExistingUser}
                  variant={isExistingUser ? 'filled' : 'outlined'}
                  onChange={(event) => {
                    handleDataChange('first_name', event.target.value);
                  }}
                  autoComplete="off"
                />
              </section>
              <section className="mb-2 col-12 col-md-6">
                <TextField
                  className="w-100"
                  type="text"
                  id="last-name-input"
                  label="Last name"
                  value={userProfileData.last_name}
                  placeholder="Doe"
                  helperText="This is the legal last name"
                  required
                  disabled={isExistingUser}
                  variant={isExistingUser ? 'filled' : 'outlined'}
                  onChange={(event) => {
                    handleDataChange('last_name', event.target.value);
                  }}
                  autoComplete="off"
                />
              </section>
            </article>

            <article className="row">
              <section className="mb-2 col-12 col-md-6">
                <TextField
                  className="w-100"
                  id="fullname-input"
                  label="Display name"
                  value={userProfileData.display_name}
                  placeholder="Jhon Doe"
                  helperText="Enter a name that will be displayed on the user's profile."
                  required
                  disabled={isExistingUser}
                  variant={isExistingUser ? 'filled' : 'outlined'}
                  onFocus={handleNameFocus}
                  onChange={(event) => {
                    handleDataChange('display_name', event.target.value);
                  }}
                  autoComplete="off"
                />
              </section>

              <section className="mb-2 col-12 col-md-6">
                <PhoneCountrySelector
                  label="Phone number"
                  onPhoneChange={(event) => {
                    handleDataChange('primary_phone_number', event);
                  }}
                  disabled={isExistingUser}
                  variant={isExistingUser ? 'filled' : 'outlined'}
                />
                <FormHelperText>Principal phone number and or used with WhatsApp</FormHelperText>
              </section>
            </article>

            <article className="row">
              <section className="mb-2 col-12 col-md-6">
                <TextField
                  className="w-100"
                  type="email"
                  id="email-input"
                  label="Primary email address"
                  value={userProfileData.primary_email_address}
                  placeholder="jhondoe@domain.com"
                  helperText="This is the email most used by user"
                  required
                  disabled={isExistingUser}
                  variant={isExistingUser ? 'filled' : 'outlined'}
                  onChange={(event) => {
                    handleDataChange('primary_email_address', event.target.value);
                  }}
                  autoComplete="veripass-email"
                />
              </section>

              <section className="mb-2 col-12 col-md-6">
                <TextField
                  className="w-100"
                  type="text"
                  id="password-input"
                  label="Password"
                  value={userProfileData.password}
                  placeholder=""
                  helperText="This is temporal password assigned to user"
                  required
                  disabled={isExistingUser}
                  variant={isExistingUser ? 'filled' : 'outlined'}
                  onChange={(event) => {
                    handleDataChange('password', event.target.value);
                  }}
                  autoComplete="veripass-password"
                />
              </section>
            </article>

            <footer className="row">
              <section className="mb-0 h-25 d-flex justify-content-end align-items-end">
                <Button
                  type="button"
                  variant="contained"
                  className="my-2"
                  onClick={handleSubmit}
                  disabled={!userProfileData?.primary_national_id?.identification}
                  sx={{
                    backgroundColor: !userProfileData?.primary_national_id?.identification ? '#a0a0a0' : '#323a46',
                    borderColor: !userProfileData?.primary_national_id?.identification ? '#a0a0a0' : '#323a46',
                    '&:hover': {
                      backgroundColor: !userProfileData?.primary_national_id?.identification ? '#a0a0a0' : '#404651',
                      borderColor: !userProfileData?.primary_national_id?.identification ? '#a0a0a0' : '#404651',
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
