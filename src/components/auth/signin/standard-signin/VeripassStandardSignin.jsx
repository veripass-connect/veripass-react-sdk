import React, { useState, useEffect } from 'react';
import { VeripassAuthLayout } from '@components/auth/layouts/VeripassAuthLayout';
import { useUrlErrorHandler } from '@hooks/useUrlErrorHandler';
import { useAuth } from '@hooks/useAuth.hook';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { KarlaTypography } from '@components/shared/styling/KarlaTypography';
import { TextField, InputAdornment, IconButton, CircularProgress, Typography, Button, Link, Divider } from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import '@styles/fonts.css';
import '@styles/styles.css';

import veripassLogo from '@assets/logos/veripass-logo-dark.svg';

import { SecurityService } from '@services';
import { SECURITY_STATUS_CODE_MESSAGES } from '@constants/security-status-code-messages';

const swal = withReactContent(Swal);

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

export const VeripassStandardSignin = ({
  ui = {
    logo: {
      height: '40',
    },
    title: 'Log in using email address',
    showTitle: true,
  },
  organization = {
    name: '',
    logoSrc: '',
    slogan: '',
  },
  sideImage = {
    src: '',
    alt: 'Login Cover',
    overlayText1: '',
    overlayText2: '',
  },
  providers = [],
  showForgotPass = true,
  redirectUrl = '',
  environment = 'production',
  apiKey = '',
  isPopupContext = false,
  initialEmail = '', // Allow pre-filling email from Manager
}) => {
  // Hooks
  const { showErrorFromUrl } = useUrlErrorHandler();
  const authProvider = useAuth();

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // Entity states
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');

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
    showErrorFromUrl();
  };

  useEffect(() => {
    initializeComponent();
  }, []);

  return (
    <VeripassAuthLayout sideImage={sideImage}>
      {/* Organization Branding */}
      <header className="mb-5">
        <div className="d-flex align-items-center mb-3">
          {(organization?.logoSrc || ui?.logo?.src) && (
            <img
              src={organization?.logoSrc || ui?.logo?.src}
              alt={organization?.name || 'Logo'}
              height={ui?.logo?.height || 40}
              className="me-3"
            />
          )}
        </div>

        {(organization?.name || organization?.slogan) && (
          <div>
            {organization?.name && (
              <Typography variant="h5" fontWeight="bold">
                {organization.name}
              </Typography>
            )}
          </div>
        )}

        <div className="mt-4">
          <KarlaTypography variant="h4" style={{ fontWeight: 'bold', color: '#000' }}>
            {ui?.showTitle !== false ? ui?.title || 'Log in using email address' : ''}
          </KarlaTypography>
          {organization?.slogan && (
            <Typography variant="body2" color="textSecondary" className="mt-2">
              {organization.slogan}
            </Typography>
          )}
        </div>
      </header>

      <form onSubmit={handleSubmit} autoComplete="off">
        <section className="mb-3">
          <Typography variant="caption" display="block" gutterBottom className="fw-bold mb-1">
            Your email
          </Typography>
          <TextField
            fullWidth
            type="email"
            id="email-input"
            placeholder="name@example.com"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            variant="outlined"
            size="small"
            InputProps={{
              style: { backgroundColor: '#fff' },
            }}
          />
        </section>

        <section className="mb-4">
          <Typography variant="caption" display="block" gutterBottom className="fw-bold mb-1">
            Password
          </Typography>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((show) => !show)}
                    onMouseDown={(event) => event.preventDefault()}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </section>

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
          size="large"
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            textTransform: 'none',
            py: 1.5,
            '&:hover': {
              backgroundColor: '#333',
            },
            mb: 2,
          }}
        >
          {isLoading && <CircularProgress size={20} style={{ marginRight: '8px', color: '#fff' }} />}
          {isLoading ? 'Loading...' : 'Log in'}
        </Button>

        {showForgotPass && (
          <div className="d-flex justify-content-end mb-4">
            <Link
              href={redirectUrl ? `${redirectUrl}/recover-password` : '/recover-password'}
              underline="hover"
              color="inherit"
              fontSize="0.875rem"
            >
              Forgot password?
            </Link>
          </div>
        )}

        {providers && providers.length > 0 && (
          <>
            <div className="d-flex align-items-center mb-4">
              <Divider sx={{ flexGrow: 1 }} />
              <Typography variant="caption" className="mx-3 text-muted">
                or continue with
              </Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </div>

            <div className="d-flex justify-content-center gap-3">
              {providers.map((provider) => (
                <Button
                  key={provider.id}
                  variant="outlined"
                  color="inherit"
                  onClick={provider.onClick}
                  sx={{
                    minWidth: 'auto',
                    width: '60px',
                    height: '40px',
                    borderColor: '#e0e0e0',
                  }}
                >
                  {provider.icon}
                </Button>
              ))}
            </div>
          </>
        )}

        <div className="mt-5 text-center">
          <Typography variant="caption" color="textSecondary">
            Don't have an account?{' '}
            <Link href="#" underline="hover" color="warning.main" fontWeight="bold">
              Register
            </Link>
          </Typography>
        </div>

        <div className="mt-4 pt-4 d-flex justify-content-center align-items-center">
          <Typography variant="caption" style={{ color: '#98a6ad', marginRight: '5px' }}>
            Powered by
          </Typography>
          <img src={veripassLogo} alt="Veripass logo" height="12" />
        </div>
      </form>
    </VeripassAuthLayout>
  );
};
