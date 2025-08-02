import React, { useState, useEffect } from 'react';
import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';
import { VeripassUserVerificationStatus } from '@components/user/verify/VeripassUserVerificationStatus';

import { useUrlErrorHandler } from '@hooks/useUrlErrorHandler';
import { useAuth } from '@hooks/useAuth.hook';

import styled from 'styled-components';
import { Card } from '@components/shared/styling/Card';
import { KarlaTypography } from '@components/shared/styling/KarlaTypography';
import { Box, Avatar, Grid, Typography, Button } from '@mui/material';

import '@styles/fonts.css';
import '@styles/styles.css';

import defaultCover from '@assets/cover/cover-11.jpg';
import defaultAvatar from '@assets/characters/character-unknown.svg';

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

const Content = styled.div`
  padding: 120px 24px 24px;
`;

export const VeripassUserProfileView = ({
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
}) => {
  // Hooks
    const { showErrorFromUrl } = useUrlErrorHandler();
  const authProvider = useAuth();
  const searchParams = new URLSearchParams(window?.location?.search);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [coverUrl, setCoverUrl] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  // Fixed variables
  const phone = veripassIdentity?.profile?.primary_phone_number;
  const formattedPhone =
    phone?.country?.dial_code && phone?.phone_number ? `+${phone.country.dial_code} ${phone.phone_number}` : '';
  const formattedFullname = veripassIdentity?.profile?.first_name
    ? `${veripassIdentity?.profile?.first_name || ''} ${veripassIdentity?.profile?.last_name || ''}`
    : '';
  const fields = [
    { label: 'Username', value: veripassIdentity?.profile?.username || '-' },
    { label: 'Name', value: formattedFullname || '-' },
    { label: 'Primary Email', value: veripassIdentity?.profile?.primary_email_address || '-' },
    { label: 'Primary Phone', value: formattedPhone || '-' },
    { label: 'Primary Document Id', value: veripassIdentity?.profile?.primary_national_id.identification || '-' },
  ].filter(Boolean);

  // Entity states

  const initializeComponent = () => {
    showErrorFromUrl();
  };

  const setProfileUiSettings = () => {
    setCoverUrl(veripassIdentity?.profile?.profile_ui_settings?.cover_picture_url || defaultCover);
    setAvatarUrl(veripassIdentity?.profile?.profile_ui_settings?.profile_picture_url || defaultAvatar);
  };

  useEffect(() => {
    setProfileUiSettings();
  }, [veripassIdentity]);

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
                      <strong>{veripassIdentity?.profile?.display_name}</strong>
                    </ProfileIdentityFullName>
                    {veripassIdentity?.profile?.bio && (
                      <ProfileIdentityBio as="h6" style={{ fontWeight: '300' }}>
                        {veripassIdentity?.profile?.bio}
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

          <Content>
            <Typography variant="h6">{veripassIdentity?.display_name}</Typography>
            <Typography variant="caption" color="textSecondary" gutterBottom>
              {veripassIdentity?.bio}
            </Typography>

            <section>
              <Box component="dl" sx={{ m: 0 }}>
                <Grid container spacing={3} component="div">
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                        textTransform: 'none',
                        mr: 1,
                        mb: 0,
                      }}
                      style={{ marginBottom: 0 }}
                    >
                      <strong>Universal Veripass ID</strong>
                    </Typography>
                    <Typography variant="h5" style={{ marginBottom: 0 }}>
                      <strong>{veripassIdentity?.identity}</strong>
                    </Typography>
                    <Typography style={{ marginBottom: 0, color: '#646b71 !important' }} sx={{ color: '#646b71 !important' }}>
                      https://me.veripass.com.co/{veripassIdentity?.identity}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </section>

            <section style={{ marginTop: '3rem' }}>
              <Box component="dl" sx={{ m: 0 }}>
                <Grid container spacing={3} component="div">
                  {fields.map(({ label, value }) => (
                    <Grid item xs={12} md={6} key={label}>
                      <Box component="dt" sx={{ display: 'flex', alignItems: 'between', mb: 0 }}>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                            textTransform: 'none',
                            mr: 1,
                            mb: 0,
                          }}
                          style={{ marginBottom: 0 }}
                        >
                          {label}
                        </Typography>

                        {/* <SnapData dataKey={label} dataValue={value} /> */}
                      </Box>
                      <Box component="dd" sx={{ m: 0 }}>
                        <Typography variant="body1" style={{ color: '#363636' }}>
                          <strong>{value}</strong>
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </section>

            <section style={{ marginTop: '5rem' }}>
              <VeripassUserVerificationStatus entity={veripassIdentity} sx={{ mt: 2 }} />
            </section>
          </Content>

          {isEditable && (
            <FooterNotice>
              <Typography variant="caption">* Este es tu perfil. Puedes editar tus datos desde la configuración.</Typography>
            </FooterNotice>
          )}
        </Card>
      </VeripassLayout>
    </>
  );
};
