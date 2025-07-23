import React, { useState, useEffect } from 'react';
import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';

import { useAuth } from '@hooks/useAuth.hook';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Card } from '@components/shared/styling/Card';
import { KarlaTypography } from '@components/shared/styling/KarlaTypography';
import { TextField, InputAdornment, IconButton, CircularProgress, Typography, Button, Link } from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';

import '@styles/fonts.css';
import '@styles/styles.css';

import veripassLogo from '@assets/logos/veripass-logo-dark.svg';

import { SecurityService } from '@services';

const swal = withReactContent(Swal);

const statusCodeMessages = {
  461: 'The data provided does not match any registered application',
  462: 'Unauthorized user. After 3 failed attempts, your account will be locked for 24 hours.',
  463: 'The user is not registered in this application, needs to register',
  464: 'Unauthorized. After 3 failed attempts, your account will be locked for 24 hours.',
  465: 'API key is missing or invalid',
  401: 'Error authenticating',
};

async function signInStandard({ payload, authProvider, redirectUrl, apiKey, environment }) {
  const entityService = new SecurityService({ apiKey, settings: { environment } });
  const entityResponse = await entityService.signInStandard(payload);

  if (!entityResponse || !entityResponse.result) {
    await swal.fire({
      title: 'Sign-in error',
      text: statusCodeMessages[entityResponse.status] || 'An error occurred',
      icon: 'error',
    });

    return;
  }

  authProvider.login({ user: entityResponse.result || {}, redirectUrl });
}

export const VeripassStandardSignin = ({
  ui = {
    logo: {
      height: '75',
    },
  },
  organization = {
    name: '',
    logoSrc: '',
    slogan: '',
  },
  redirectUrl = '',
  environment = 'production',
  apiKey = '',
  isPopupContext = false,
}) => {
  // Hooks
  const authProvider = useAuth();
  const searchParams = new URLSearchParams(window?.location?.search);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // Entity states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setIsLoading(true);

      if (!email) {
        await swal.fire({
          title: 'Error entering',
          text: 'Please enter an email.',
          icon: 'error',
        });

        return;
      }

      if (!password) {
        await swal.fire({
          title: 'Error entering',
          text: 'Please enter a password.',
          icon: 'error',
        });

        return;
      }

      await signInStandard({ payload: { email, password }, authProvider, redirectUrl, apiKey, environment });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeComponent = () => {
    setErrors();
  };

  useEffect(() => {
    initializeComponent();
  }, []);

  return (
    <>
      <VeripassLayout isPopupContext={isPopupContext} ui={{ showLogo: false, vertical: 'bottom', alignment: 'end' }}>
        <header style={{ textAlign: 'center' }}>
          <a href="/">
            <img
              src={organization?.logoSrc}
              alt={organization?.name}
              height={ui?.logo?.height}
              style={{ display: 'block', margin: '0 auto' }}
            />
          </a>
          <Typography variant="body2" style={{ marginTop: '16px', marginBottom: '24px', color: '#98a6ad', fontWeight: 300 }}>
            {organization?.slogan}
          </Typography>
        </header>

        <Card style={{ padding: '2.25rem 2.25rem 1.23rem 2.25rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <KarlaTypography style={{ color: '#343a40' }}>Log in using email address</KarlaTypography>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off">
            <section style={{ marginBottom: '16px', margin: '10px 0' }}>
              <TextField
                fullWidth
                type="email"
                id="email-input"
                label="Email address"
                value={email}
                placeholder="Type your email"
                required
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="etrune-email"
                InputLabelProps={{ shrink: true }}
              />
            </section>

            <section style={{ marginBottom: '16px' }}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((show) => !show)}
                        onMouseDown={(event) => {
                          event.preventDefault();
                        }}
                        edge="end"
                      >
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ shrink: true }}
              />
            </section>

            <section style={{ marginBottom: '16px', width: '100%' }}>
              <Link
                href="recover-password"
                underline="hover"
                style={{
                  marginLeft: '8px',
                  color: 'gray',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  textDecoration: 'none',
                }}
              >
                <LockIcon style={{ marginRight: '5px', color: '#98a6ad', fontSize: '18px' }} />
                <Typography variant="body2" style={{ color: '#98a6ad', fontWeight: '400' }}>
                  Forgot password?
                </Typography>
              </Link>
            </section>

            <footer style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '2px solid #232931',
                  backgroundColor: '#323a46',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#3d4c61',
                  },
                  width: '100%',
                }}
              >
                {isLoading && <CircularProgress size={20} style={{ marginRight: '8px', color: '#fff' }} />}
                {isLoading ? 'Loading...' : 'Log in'}
              </Button>
            </footer>

            <section style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Typography
                style={{ fontSize: '0.775rem', marginRight: '7px', color: '#98a6ad', fontWeight: '400', marginBottom: '0' }}
              >
                Powered by
              </Typography>
              <img src={veripassLogo} alt="Veripass logo" height="15" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
            </section>
          </form>
        </Card>
      </VeripassLayout>
    </>
  );
};
