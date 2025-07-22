import { useState, useEffect } from 'react';
import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';
import { VeripassUserVerificationStatus } from '@components/user/verify/VeripassUserVerificationStatus';

import { useAuth } from '@hooks/useAuth.hook';

import styled from 'styled-components';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Card } from '@components/shared/styling/Card';
import { KarlaTypography } from '@components/shared/styling/KarlaTypography';
import { Box, Avatar, Grid, Typography } from '@mui/material';

import '@styles/fonts.css';
import '@styles/styles.css';

import defaultCover from '@assets/cover/cover-11.jpg';
import defaultAvatar from '@assets/characters/character-unknown.svg';


const swal = withReactContent(Swal);

const statusCodeMessages = {
  461: 'The data provided does not match any registered application',
  462: 'Unauthorized user. After 3 failed attempts, your account will be locked for 24 hours.',
  463: 'The user is not registered in this application, needs to register',
  464: 'Unauthorized. After 3 failed attempts, your account will be locked for 24 hours.',
  465: 'API key is missing or invalid',
  401: 'Error authenticating',
};

const Header = styled.header`
  position: relative;
  border-radius: 8px;
  height: 225px;
  background: url(${(p) => p.coverurl}) center/cover no-repeat;
`;

const AvatarWrapper = styled.div`
  position: absolute;
  bottom: -100px;
  left: 24px;
  border: 4px solid white;
  border-radius: 50%;
`;

const HeaderInfo = styled.div`
  position: absolute;
  bottom: -90px;
  left: 220px;
`;

const Name = styled(KarlaTypography)`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0;
`;

const Bio = styled(Typography)`
  color: #646b71 !important;
  font-size: 0.9rem;
  margin-top: 4px;
`;

const Content = styled.div`
  padding: 120px 24px 24px;
`;

const Field = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
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
  veripassProfile = {},
  veripassId = {},
}) => {
  // Hooks
  const authProvider = useAuth();
  const searchParams = new URLSearchParams(window?.location?.search);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [veripassIdentityInternal, setVeripassItentityInternal] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const fields = [
    { label: 'Username', value: veripassIdentityInternal?.profile?.username || '-' },
    {
      label: 'Name',
      value: `${veripassIdentityInternal?.profile?.first_name || ''} ${veripassIdentityInternal?.profile?.last_name || ''}`,
    },
    { label: 'Primary Email', value: veripassIdentityInternal?.profile?.primary_email_address || '-' },
    {
      label: 'Primary Phone',
      value: `+${veripassIdentityInternal?.profile?.primary_phone_number.country.dial_code} ${veripassIdentityInternal?.profile?.primary_phone_number.phone_number}`,
    },
    { label: 'Primary Document Id', value: veripassIdentityInternal?.profile?.primary_national_id.identification || '' },
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

  const initializeComponent = () => {
    setErrors();
  };

  const setProfileUiSettings = () => {
    setCoverUrl(veripassProfile?.profile?.profile_ui_settings?.cover_picture_url || defaultCover);
    setAvatarUrl(veripassProfile?.profile?.profile_ui_settings?.profile_picture_url || defaultAvatar);
  };

  useEffect(() => {
    setVeripassItentityInternal(veripassProfile);
    setProfileUiSettings();
  }, [veripassProfile]);

  useEffect(() => {
    initializeComponent();
  }, []);

  return (
    <>
      <VeripassLayout isPopupContext={isPopupContext} ui={{ showLogo: true, vertical: 'bottom', alignment: 'end' }}>
        <Card style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <Header coverurl={coverUrl}>
            <AvatarWrapper>
              <Avatar
                src={avatarUrl}
                sx={{ width: 168, height: 168 }}
                style={{ border: '10px solid rgb(255 255 255 / 50%)' }}
                alt="User avatar"
              />
            </AvatarWrapper>
            <HeaderInfo>
              <Name as="h1" style={{ marginBottom: 0 }}>
                {veripassIdentityInternal?.profile?.display_name}
              </Name>
              {veripassIdentityInternal?.profile?.bio && (
                <Bio as="h6" style={{ fontWeight: '300' }}>
                  {veripassIdentityInternal?.profile?.bio}
                </Bio>
              )}
            </HeaderInfo>
          </Header>

          <Content>
            <Typography variant="h6">{veripassIdentityInternal?.display_name}</Typography>
            <Typography variant="caption" color="textSecondary" gutterBottom>
              {veripassIdentityInternal?.bio}
            </Typography>

            <section>
              <Box component="dl" sx={{ m: 0 }}>
                <Grid container spacing={3} component="div">
                  <Grid item xs={12} md={6}>
                    <Typography variant="h5">
                      <strong>Universal Veripass ID</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      <Typography variant="h5" style={{ marginBottom: 0 }}>
                        <strong>{veripassIdentityInternal?.identity}</strong>
                      </Typography>
                      <Typography style={{ marginBottom: 0, color: "#646b71 !important" }} sx={{color: "#646b71 !important"}}>
                        https://me.veripass.com.co/{veripassIdentityInternal?.identity}
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
                          variant="body1"
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
                        <Typography variant="h5" style={{ color: '#363636' }}>
                          <strong>{value}</strong>
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </section>

            <section style={{ marginTop: '5rem' }}>
              <VeripassUserVerificationStatus entity={veripassIdentityInternal} sx={{ mt: 2 }} />
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
