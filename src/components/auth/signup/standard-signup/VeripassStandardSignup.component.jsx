import React, { useState } from 'react';
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

import veripassLogo from '@assets/logos/veripass-logo-dark.svg';
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

// Assuming generic signup function similar to signin
async function signUpStandard({ payload, authProvider, redirectUrl, apiKey, environment }) {
  const entityService = new SecurityService({ apiKey, settings: { environment } });

  const entityResponse = await entityService.signUpWithStandard(payload);

  if (!entityResponse || !entityResponse.result) {
    await swal.fire({
      title: 'Sign-up error',
      text: SECURITY_STATUS_CODE_MESSAGES[entityResponse.status] || 'An error occurred',
      icon: 'error',
    });
    return;
  }

  authProvider.login({ user: entityResponse.result || {}, redirectUrl });
}

/**
 * Standard Sign-up component with split-screen layout.
 * Collects First Name, Last Name, Email, and Password.
 *
 * @component
 */
export const VeripassStandardSignup = ({
  ui = {
    logo: {
      src: '',
      height: '40',
    },
    title: 'Create an account',
    showTitle: true,
    sideImage: {
      src: '',
      alt: 'Cover',
      overlayText1: '',
      overlayText2: '',
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
}) => {
  const sideImage = ui.sideImage || { src: '', alt: 'Cover' };
  const providers = ui.providers || [];
  const theme = ui?.theme || {};

  const { showErrorFromUrl } = useUrlErrorHandler();
  const authProvider = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await signUpStandard({
        payload: { email, password, firstName, lastName },
        authProvider,
        redirectUrl,
        apiKey,
        environment,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VeripassAuthLayout sideImage={sideImage} logo={organization?.logoSrc || ui?.logo?.src}>
      <header className="veripass-mb-4">
        <div className="veripass-mt-4">
          <KarlaTypography variant="h1" className="veripass-fw-bold veripass-text-dark veripass-mb-2 veripass-display-6">
            {ui?.showTitle !== false ? ui?.title || 'Create an account' : ''}
          </KarlaTypography>
          {organization?.slogan && (
            <Typography variant="body1" className="veripass-text-secondary">
              {organization.slogan}
            </Typography>
          )}
        </div>
      </header>

      <form onSubmit={handleSubmit} autoComplete="off">
        <section className="veripass-mb-3">
          <TextField
            fullWidth
            label="First Name"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            size="small"
            className="veripass-mb-3"
          />
          <TextField
            fullWidth
            label="Last Name"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            size="small"
          />
        </section>

        <section className="veripass-mb-3">
          <TextField
            fullWidth
            label="Your email"
            type="email"
            placeholder="name@example.com"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            size="small"
          />
        </section>

        <section className="veripass-mb-4">
          <TextField
            fullWidth
            label="Create password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
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
          {isLoading ? 'Create account' : 'Create account'}
        </ActionButton>

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
            Already have an account?{' '}
            <Link
              href="#"
              underline="hover"
              style={{ color: theme?.linkColor || '#0d6efd', fontWeight: 'bold' }}
              className="veripass-fw-bold"
            >
              Log in
            </Link>
          </Typography>
        </div>

        <footer className="veripass-mt-4 veripass-pt-4 veripass-d-flex veripass-justify-content-center veripass-align-items-center">
          <Typography variant="caption" className="veripass-text-secondary veripass-me-1">
            Powered by
          </Typography>
          <img src={veripassLogo} alt="Veripass logo" height="12" />
        </footer>
      </form>
    </VeripassAuthLayout>
  );
};
