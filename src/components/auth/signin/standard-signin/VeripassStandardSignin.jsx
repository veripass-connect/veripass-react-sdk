import React, { useState, useEffect } from 'react';
import { VeripassAuthLayout } from '@components/auth/layouts/VeripassAuthLayout';
import { useUrlErrorHandler } from '@hooks/useUrlErrorHandler';
import { useAuth } from '@hooks/useAuth.hook';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { KarlaTypography } from '@components/shared/styling/KarlaTypography';
import { TextField, InputAdornment, IconButton, CircularProgress, Typography, Button, Link, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import '@styles/fonts.css';
import '@styles/styles.css';

import { SecurityService } from '@services';
import { SECURITY_STATUS_CODE_MESSAGES } from '@constants/security-status-code-messages';

const swal = withReactContent(Swal);

const ActionButton = styled(Button)(({ theme, customTheme }) => ({
  backgroundColor: customTheme?.brandPrimary || '#000000',
  color: customTheme?.brandPrimaryForeground || '#ffffff',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: customTheme?.brandPrimary ? `${customTheme.brandPrimary}CC` : '#333333',
  },
}));

const ProviderButton = styled(Button)({
  minWidth: 'auto',
  width: '60px',
  height: '40px',
  borderColor: '#e0e0e0',
});

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

/**
 * Standard Sign-in component with split-screen layout.
 * Supports email/password authentication, social providers, and extensive customization.
 *
 * @component
 */
export const VeripassStandardSignin = ({
  ui = {
    logo: {
      src: '',
      height: '40',
    },
    title: 'Log in using email address',
    showTitle: true,
    showForgotPass: true,
    heroImage: {
      src: '',
      alt: 'Login Cover',
      title: '',
      subtitle: '',
    },
    providers: [],
    theme: {
      brandPrimary: '#000000',
      brandPrimaryForeground: '#ffffff',
      linkColor: '#0d6efd',
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
  initialEmail = '',
  registerUrl = '',
  onRegisterClick,
  heroImage: directHeroImage,
}) => {
  const heroImage = directHeroImage || ui.heroImage || { src: '', alt: 'Cover' };
  const showForgotPass = ui.showForgotPass !== undefined ? ui.showForgotPass : true;
  const providers = ui.providers || [];
  const theme = ui?.theme || {};

  const finalRegisterUrl = ui.registerUrl || registerUrl || '#';
  const finalOnRegisterClick = ui.onRegisterClick || onRegisterClick;

  const { showErrorFromUrl } = useUrlErrorHandler();
  const authProvider = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

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
    <VeripassAuthLayout heroImage={heroImage} logo={organization?.logoSrc || ui?.logo?.src}>
      <header className="veripass-my-4">
        <h2 className="veripass-fw-bold veripass-text-dark veripass-mb-2">
          {ui?.showTitle !== false ? ui?.title || 'Log in using email address' : ''}
        </h2>
        {organization?.slogan && (
          <Typography variant="body1" className="veripass-text-secondary">
            {organization.slogan}
          </Typography>
        )}
      </header>

      <form onSubmit={handleSubmit} autoComplete="off">
        <section className="veripass-mb-3">
          <TextField
            fullWidth
            label="Your email"
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

        <section className="veripass-mb-4">
          <TextField
            fullWidth
            label="Password"
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

        <ActionButton
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
          size="large"
          className="veripass-mb-2 veripass-py-3"
          customTheme={theme}
        >
          {isLoading && <CircularProgress size={20} className="veripass-me-2 veripass-text-white" />}
          {isLoading ? 'Sign in' : 'Sign in'}
        </ActionButton>

        {showForgotPass && (
          <div className="veripass-d-flex veripass-justify-content-end veripass-mb-4">
            <Link
              href={redirectUrl ? `${redirectUrl}/recover-password` : '/recover-password'}
              underline="hover"
              style={{ color: 'inherit' }}
              fontSize="0.875rem"
            >
              Forgot password?
            </Link>
          </div>
        )}

        {providers && providers.length > 0 && (
          <section>
            <article className="veripass-d-flex veripass-align-items-center veripass-mb-4">
              <Divider className="veripass-flex-grow-1" />
              <Typography variant="caption" className="veripass-mx-3 veripass-text-muted">
                or continue with
              </Typography>
              <Divider className="veripass-flex-grow-1" />
            </article>

            <article className="veripass-d-flex veripass-justify-content-center veripass-gap-3">
              {providers.map((provider) => (
                <ProviderButton key={provider.id} variant="outlined" color="inherit" onClick={provider.onClick}>
                  {provider.icon}
                </ProviderButton>
              ))}
            </article>
          </section>
        )}

        <div className="veripass-mt-5 veripass-text-center">
          <Typography variant="caption" className="veripass-text-secondary">
            Don't have an account?{' '}
            <Link
              href={finalRegisterUrl}
              onClick={(e) => {
                if (finalOnRegisterClick) {
                  e.preventDefault();
                  finalOnRegisterClick(e);
                }
              }}
              underline="hover"
              style={{ color: theme?.linkColor || '#0d6efd', fontWeight: 'bold' }}
              className="veripass-fw-bold"
            >
              Register
            </Link>
          </Typography>
        </div>
      </form>
    </VeripassAuthLayout>
  );
};
