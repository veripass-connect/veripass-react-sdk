import React, { useState, useEffect } from 'react';
import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';

import { useUrlErrorHandler } from '@hooks/useUrlErrorHandler';
import { useAuth } from '@hooks/useAuth.hook';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Card } from '@components/shared/styling/Card';
import { StandardContainer } from '@components/shared/styling/StandardContainer';
import { KarlaTypography } from '@components/shared/styling/KarlaTypography';
import { TextField, InputAdornment, IconButton, CircularProgress, Typography, Button, Link } from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';

import '@styles/fonts.css';
import '@styles/styles.css';

import { SecurityService } from '@services';

const swal = withReactContent(Swal);

import { SECURITY_STATUS_CODE_MESSAGES } from '@constants/security-status-code-messages';

async function signInStandard({ payload, authProvider, redirectUrl, apiKey, environment }) {
  const entityService = new SecurityService({ apiKey, settings: { environment } });
  const entityResponse = await entityService.signInStandard(payload);

  if (!entityResponse || !entityResponse.result) {
    await swal.fire({
      title: 'Sign-in error',
      text: SECURITY_STATUS_CODE_MESSAGES[entityResponse.status] || 'An error occurred',
      icon: 'error',
    });

    return;
  }

  authProvider.login({ user: entityResponse.result || {}, redirectUrl });
}

export const VeripassStandardRecoverPassword = ({
  organization = {
    logoSrc: '',
    slogan: '',
  },
  redirectUrl = '',
  environment = 'production',
  apiKey = '',
  isPopupContext = false,
}) => {
  // Hooks
    const { showErrorFromUrl } = useUrlErrorHandler();
  const authProvider = useAuth();
  const searchParams = new URLSearchParams(window?.location?.search);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // Entity states
  const [email, setEmail] = useState('');

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

      await signInStandard({ payload: { email }, authProvider, redirectUrl, apiKey, environment });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeComponent = () => {
    showErrorFromUrl();
  };

  useEffect(() => {
    initializeComponent();
  }, []);

  return (
    <>
      <VeripassLayout isPopupContext={isPopupContext}>
        <header style={{ textAlign: 'center' }}>
          <a href="/">
            <img src={organization?.logoSrc} alt="" height="75" style={{ display: 'block', margin: '0 auto' }} />
          </a>
          <Typography variant="body2" style={{ marginTop: '16px', marginBottom: '24px', color: '#98a6ad', fontWeight: 300 }}>
            {organization?.slogan}
          </Typography>
        </header>

        <Card>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <KarlaTypography style={{ color: '#343a40' }}>Recover password</KarlaTypography>
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
                {isLoading ? 'Recovering...' : 'Recover'}
              </Button>
            </footer>
          </form>
        </Card>
      </VeripassLayout>
    </>
  );
};
