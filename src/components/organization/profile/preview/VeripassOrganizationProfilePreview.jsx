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
import { Box, Avatar, Grid, Typography, MenuList, ListItemIcon, IconButton, Menu, MenuItem, Paper } from '@mui/material';
import { MoreVert as MoreVertIcon, Edit as EditIcon } from '@mui/icons-material';

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

export const VeripassOrganizationProfilePreview = ({
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

  // UI States
  const [internalVeripassIdentity, setInternalVeripassIdentity] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const hasExternal = veripassIdentity && Object.keys(veripassIdentity).length > 0;
  const identity = hasExternal ? veripassIdentity : internalVeripassIdentity;
  const open = Boolean(anchorEl);

  // Fixed Variables
  const phone = identity?.organization_profile?.primary_phone_number;
  const formattedPhone =
    phone?.country?.dial_code && phone?.phone_number ? `+${phone.country.dial_code} ${phone.phone_number}` : '';
  const fields = [
    { label: 'Primary Document Id', value: identity?.organization_profile?.primary_national_id?.identification },
    { label: 'Primary Email', value: identity?.organization_profile?.primary_email_address },
    { label: 'Primary Phone', value: formattedPhone },
    { label: 'Primary Address', value: identity?.organization_profile?.primary_address?.formatted_address },
  ].filter(Boolean);

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
                <article className="avatar-wrapper mx-4">
                  <Avatar src={avatarUrl} sx={{ width: 138, height: 138, bgcolor: '#fff' }} alt="User avatar" />
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
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? 'long-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  MenuListProps={{
                    'aria-labelledby': 'long-button',
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    paper: {
                      style: {
                        maxHeight: 48 * 4.5,
                        width: '20ch',
                      },
                    },
                  }}
                >
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        itemOnAction('edit');
                      }}
                    >
                      <ListItemIcon>
                        <EditIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography variant="inherit">Edit</Typography>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </article>
            </section>
          </header>

          <main className="profile-content">
            <Typography variant="h6">{identity?.display_name}</Typography>
            <Typography variant="caption" color="textSecondary" gutterBottom>
              {identity?.bio}
            </Typography>

            <section>
              <Box component="dl" sx={{ m: 0 }}>
                <Grid container spacing={3} component="div">
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Universal Veripass ID</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      <Typography variant="body1" style={{ marginBottom: 0 }}>
                        <strong>{identity?.identity}</strong>
                      </Typography>
                      <Typography style={{ marginBottom: 0, color: '#646b71 !important' }} sx={{ color: '#646b71 !important' }}>
                        https://me.veripass.com.co/{identity?.organization_profile?.slug}
                      </Typography>
                    </div>
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
              <VeripassUserVerificationStatus entity={identity} sx={{ mt: 2 }} />
            </section>
          </main>

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
