import React, { useState, useEffect } from 'react';
import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';

import { useUrlErrorHandler } from '@hooks/useUrlErrorHandler';
import { useAuth } from '@hooks/useAuth.hook';

import styled from 'styled-components';
import { Card } from '@components/shared/styling/Card';
import { KarlaTypography } from '@components/shared/styling/KarlaTypography';
import { Avatar, Typography, Button, InputAdornment, TextField, FormHelperText } from '@mui/material';
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { NationalIdentificationSelector, PhoneCountrySelector, useDebounce } from '@link-loom/react-sdk';

import '@styles/fonts.css';
import '@styles/styles.css';

import defaultCover from '@assets/cover/cover-11.jpg';
import defaultAvatar from '@assets/characters/character-unknown.svg';

import { OrganizationManagementService } from '@services';

async function emitEvent({ action, payload, error, eventHandler }) {
  if (eventHandler) {
    eventHandler({ action, namespace: 'veripass', payload, error });
  }
}

const initialState = {
  slug: '',
  display_name: '',
  primary_national_id: {
    type: '',
    identification: '',
    issuing_country: {
      iso_code: '',
      country_name: '',
    },
  },
  primary_email_address: '',
  primary_phone_number: {
    country: {
      iso_code: '',
      dial_code: '',
      name: '',
    },
    international_phone_number: '',
    phone_number: '',
  },
  primary_address: {
    address_line_1: '',
    address_line_2: '',
    state: '',
    state_name: '',
    country: '',
    country_code: '',
    county: '',
    city: '',
    city_subdivision: '',
    extended_postal_code: '',
    postal_code: '',
    latitude: 0,
    longitude: 0,
    score: 0,
    is_manual_entry: false,
    formatted_address: '',
    raw_address: '',
  },
  is_verified: false,
  profile_ui_settings: {},
};

const ProfileIdentityFullName = styled(KarlaTypography)`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0;
`;

const ProfileIdentityBio = styled(Typography)`
  color: #646b71 !important;
  font-size: 0.9rem;
  margin-top: 4px;
`;

export const VeripassOrganizationProfileEdit = ({
  ui = {
    profilePhoto: {
      height: '85',
    },
    inputSize: 'small',
  },
  redirectUrl = '',
  environment = 'production',
  apiKey = '',
  isPopupContext = false,
  veripassIdentity = {},
  veripassId = '',
  itemOnAction = () => {},
}) => {
  // Hooks
    const { showErrorFromUrl } = useUrlErrorHandler();
  const authProvider = useAuth();
  const searchParams = new URLSearchParams(window?.location?.search);

  // Models
  const [entity, setEntity] = useState(initialState);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [internalVeripassIdentity, setInternalVeripassIdentity] = useState(null);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [coverUrl, setCoverUrl] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [userNationalIdValidationInProgress, setUserNationalIdValidationInProgress] = useState(false);
  const debouncedNationalId = useDebounce(entity?.primary_national_id?.identification, 1000);
  const hasExternal = veripassIdentity && Object.keys(veripassIdentity).length > 0;
  const identity = hasExternal ? veripassIdentity : internalVeripassIdentity;

  // Entity states

  const handleDataChange = (path, value) => {
    setEntity((prev) => {
      const next = { ...prev };
      path.split('.').reduce((obj, key, idx, arr) => {
        if (idx === arr.length - 1) obj[key] = value;
        else obj[key] = obj[key] = { ...obj[key] };
        return obj[key];
      }, next);
      return next;
    });
  };

  const handleSubmit = async (event) => {
    try {
      if (event) {
        event.preventDefault();
      }
      setIsLoading(true);

      const response = await updateEntityRecord({
        payload: entity,
        service: OrganizationManagementService,
        settings: { environment },
        apiKey,
      });

      // Update parent states
      setIsLoading(false);

      emitEvent({ action: 'veripass-organization-profile::updated', payload: response, eventHandler: onEvent });

      if (setIsOpen) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);

      setIsLoading(false);
      emitEvent({ action: 'veripass-organization-profile::error', error, eventHandler: onEvent });

      if (setIsOpen) {
        setIsOpen(false);
      }
    }
  };

  const initializeComponent = async () => {
    showErrorFromUrl();
  };

  useEffect(() => {
    if (
      veripassIdentity &&
      Object.keys(veripassIdentity).length > 0 &&
      veripassIdentity?.identity !== internalVeripassIdentity?.identity
    ) {
      setInternalVeripassIdentity(veripassIdentity);
    }
  }, [veripassIdentity]);

  useEffect(() => {
    if (identity && Object.keys(identity).length > 0) {
      setCoverUrl(identity.organization_profile?.profile_ui_settings?.cover_picture_url || defaultCover);
      setAvatarUrl(identity.organization_profile?.profile_ui_settings?.profile_picture_url || defaultAvatar);
    }
  }, [identity]);

  useEffect(() => {
    initializeComponent();
  }, []);

  return (
    <>
      <VeripassLayout isPopupContext={isPopupContext} ui={{ showLogo: true, vertical: 'bottom', alignment: 'end' }}>
        <Card style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <header
            className="profile-header position-relative rounded-3"
            style={{ background: `url(${coverUrl}) center/cover no-repeat` }}
          >
            <section className="profile-info-container row justify-content-between">
              <section className="col-10 d-flex">
                <article className="avatar-wrapper mx-4">
                  <Avatar src={avatarUrl} sx={{ width: 98, height: 98, bgcolor: '#fff' }} alt="User avatar" />
                </article>
                <article className="profile-info d-flex align-items-end flex-fill overflow-hidden">
                  <div className="d-flex flex-column  w-100">
                    <ProfileIdentityFullName as="h5" style={{ marginBottom: 0 }} className="text-truncate w-100">
                      <strong>{identity?.organization_profile?.display_name}</strong>
                    </ProfileIdentityFullName>
                    {identity?.organization_profile?.bio && (
                      <ProfileIdentityBio as="body2" style={{ fontWeight: '300' }}>
                        {identity?.organization_profile?.bio}
                      </ProfileIdentityBio>
                    )}
                  </div>
                </article>
              </section>
            </section>
          </header>

          <main className="profile-content">
            <section className="d-flex flex-column justify-content-between pt-3 px-4 flex-wrap gap-4">
              <article className="row">
                <section className="col-12 col-md-6">
                  <TextField
                    fullWidth
                    id="display_name"
                    label="Display Name"
                    placeholder="Your organization name"
                    helperText="Please write a public name you want to show"
                    value={entity.display_name}
                    onChange={(e, newValue) => handleDataChange('display_name', newValue)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    size={ui?.inputSize}
                  />
                </section>
                <section className="col-12 col-md-6">
                  <TextField
                    className="w-100"
                    type="email"
                    id="email-input"
                    label="Primary email address"
                    placeholder="jhondoe@domain.com"
                    helperText="This is the email most used by organization"
                    value={entity.primary_email_address}
                    required
                    disabled={isExistingUser}
                    variant={isExistingUser ? 'filled' : 'outlined'}
                    onChange={(event) => {
                      handleDataChange('primary_email_address', event.target.value);
                    }}
                    autoComplete="veripass-email"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    size={ui?.inputSize}
                  />
                </section>
              </article>

              <article className="row">
                <section className="col-12">
                  <TextField
                    fullWidth
                    id="organization_slug"
                    label="Slug"
                    placeholder="write-without-spaces"
                    helperText="Unique and global organization name"
                    value={entity.teacher_name}
                    onChange={(_, newValue) => handleDataChange('display_name', newValue)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LanguageIcon color="action" sx={{ mr: 1 }} />
                            https://corporate.veripass.com.co/
                          </InputAdornment>
                        ),
                      },
                    }}
                    size={ui?.inputSize}
                  />
                </section>
              </article>

              <article className="row">
                <section className="col-12">
                  <NationalIdentificationSelector
                    label="National identification number"
                    defaultDocumentType="Passport"
                    onChange={(event) => {
                      handleDataChange('primary_national_id', event);
                    }}
                    ui={{ ...ui, ...{ documentType: true } }}
                  />
                  <FormHelperText className="mb-0">Please write the primary organization legal national id.</FormHelperText>
                  {userNationalIdValidationInProgress && (
                    <FormHelperText className="d-flex text-primary">
                      <CircularProgress size={20} className="me-2" /> Validating user existence...
                    </FormHelperText>
                  )}
                  {isExistingUser && entity?.primary_national_id?.identification && (
                    <FormHelperText className="d-flex text-danger">
                      Organization already exists. You only can view it and add it to this organization.
                    </FormHelperText>
                  )}
                </section>
              </article>

              <article className="row">
                <article className="col-12">
                  <PhoneCountrySelector
                    label="Phone number"
                    onPhoneChange={(event) => {
                      handleDataChange('primary_phone_number', event);
                    }}
                    disabled={isExistingUser}
                    variant={isExistingUser ? 'filled' : 'outlined'}
                    ui={ui}
                  />
                  <FormHelperText>Principal phone number and or used with WhatsApp</FormHelperText>
                </article>
              </article>

              <article className="row">
                <section className="col-12">
                  <TextField
                    fullWidth
                    id="primary_address"
                    label="Address"
                    placeholder="Your organization headquarters"
                    helperText="Please write a public address you want to show"
                    value={entity?.primary_address?.raw_address}
                    onChange={(_, newValue) => handleDataChange('primary_address.raw_address', newValue)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnIcon color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    size={ui?.inputSize}
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
                    disabled={!entity?.primary_national_id?.identification}
                    sx={{
                      backgroundColor: !entity?.primary_national_id?.identification ? '#a0a0a0' : '#323a46',
                      borderColor: !entity?.primary_national_id?.identification ? '#a0a0a0' : '#323a46',
                      '&:hover': {
                        backgroundColor: !entity?.primary_national_id?.identification ? '#a0a0a0' : '#404651',
                        borderColor: !entity?.primary_national_id?.identification ? '#a0a0a0' : '#404651',
                      },
                    }}
                  >
                    {isLoading ? 'Saving...' : 'Next'}
                  </Button>
                </section>
              </footer>
            </section>
          </main>
        </Card>
      </VeripassLayout>
    </>
  );
};
