import React, { useState, useEffect } from 'react';
import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';
import { VeripassUserVerificationStatus } from '@components/user/verify/VeripassUserVerificationStatus';

import { fetchEntityCollection } from '@services/utils/entityServiceAdapter';
import { useAuth } from '@hooks/useAuth.hook';

import styled from 'styled-components';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Card } from '@components/shared/styling/Card';
import { KarlaTypography } from '@components/shared/styling/KarlaTypography';
import { Box, Avatar, Grid, Typography, Button, InputAdornment, TextField, FormHelperText } from '@mui/material';
import { NationalIdentificationSelector, PhoneCountrySelector, useDebounce } from '@link-loom/react-sdk';

import '@styles/fonts.css';
import '@styles/styles.css';

import defaultCover from '@assets/cover/cover-11.jpg';
import defaultAvatar from '@assets/characters/character-unknown.svg';

const swal = withReactContent(Swal);

import { OrganizationManagementService } from '@services';

const statusCodeMessages = {
  461: 'The data provided does not match any registered application',
  462: 'Unauthorized user. After 3 failed attempts, your account will be locked for 24 hours.',
  463: 'The user is not registered in this application, needs to register',
  464: 'Unauthorized. After 3 failed attempts, your account will be locked for 24 hours.',
  465: 'API key is missing or invalid',
  401: 'Error authenticating',
};

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
    isManual_entry: false,
    formatted_address: '',
    raw_address: '',
  },
  is_verified: false,
  profile_ui_settings: '',
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
      height: '75',
    },
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
  const authProvider = useAuth();
  const searchParams = new URLSearchParams(window?.location?.search);

  // Models
  const [entity, setEntity] = useState(initialState);

  // UI States
  const [internalVeripassIdentity, setInternalVeripassIdentity] = useState(null);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [coverUrl, setCoverUrl] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [userNationalIdValidationInProgress, setUserNationalIdValidationInProgress] = useState(false);
  const debouncedNationalId = useDebounce(entity?.primary_national_id?.identification, 1000);
  const hasExternal = veripassIdentity && Object.keys(veripassIdentity).length > 0;
  const identity = hasExternal ? veripassIdentity : internalVeripassIdentity;

  // Entity states
  const showError = ({ title, message }) => {
    Swal.fire({
      title: title || 'Failed to sign-in',
      text: message || '',
      icon: 'error',
    }).then(() => {
      searchParams.delete('error');
      window.location.replace(`${window?.location?.pathname}?${searchParams.toString()}`);
    });
  };

  const setErrors = () => {
    const error = searchParams.get('error');

    switch (error) {
      case 'insufficient_permissions':
        showError({ title: 'Insufficient permissions', message: 'You do not have sufficient permissions to enter.' });
        break;
      case 'access_denied':
        showError({ title: 'Access denied', message: 'Your account does not have access to this application.' });
        break;
      default:
        break;
    }
  };

  const handleDataChange = (path, value) =>
    setEntity((prev) => {
      const next = { ...prev };
      path.split('.').reduce((obj, key, idx, arr) => {
        if (idx === arr.length - 1) obj[key] = value;
        else obj[key] = obj[key] = { ...obj[key] };
        return obj[key];
      }, next);
      return next;
    });

  const initializeComponent = async () => {
    setErrors();
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
              <article className="col-10 d-flex">
                <article className="avatar-wrapper">
                  <Avatar src={avatarUrl} sx={{ width: 168, height: 168, bgcolor: '#fff' }} alt="User avatar" />
                </article>
                <article className="profile-info d-flex align-items-end flex-fill overflow-hidden">
                  <div className="d-flex flex-column  w-100">
                    <ProfileIdentityFullName as="h2" style={{ marginBottom: 0 }} className="text-truncate w-100">
                      <strong>{identity?.organization_profile?.display_name}</strong>
                    </ProfileIdentityFullName>
                    {identity?.organization_profile?.bio && (
                      <ProfileIdentityBio as="h6" style={{ fontWeight: '300' }}>
                        {identity?.organization_profile?.bio}
                      </ProfileIdentityBio>
                    )}
                  </div>
                </article>
              </article>

              <article className="profile-actions col-2 justify-content-end">
                <Button
                  variant="outlined"
                  onClick={(event) => {
                    event.preventDefault();
                    itemOnAction('edit', null);
                  }}
                >
                  Edit
                </Button>
              </article>
            </section>
          </header>

          <main className="profile-content">
            <section className="bg-neutral d-flex flex-column justify-content-between pt-3 px-4 flex-wrap gap-4">
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <i className="fe-user text-muted"></i>
                        </InputAdornment>
                      ),
                    }}
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
                      startAdornment: (
                        <InputAdornment position="start">
                          <i className="fe-user text-muted"></i>
                        </InputAdornment>
                      ),
                    }}
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
                        startAdornment: <InputAdornment position="start">https://me.veripass.com.co/</InputAdornment>,
                      },
                    }}
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
                      startAdornment: (
                        <InputAdornment position="start">
                          <i className="fe-user text-muted"></i>
                        </InputAdornment>
                      ),
                    }}
                  />
                </section>
              </article>
            </section>
          </main>
        </Card>
      </VeripassLayout>
    </>
  );
};
