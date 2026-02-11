import React, { useState } from 'react';
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

// Assuming generic signup function similar to signin
async function signUpStandard({ payload, authProvider, redirectUrl, apiKey, environment }) {
  const entityService = new SecurityService({ apiKey, settings: { environment } });

  // Checking if method exists, based on earlier grep it does: signUpWithStandard
  const entityResponse = await entityService.signUpWithStandard(payload);

  if (!entityResponse || !entityResponse.result) {
    await swal.fire({
      title: 'Sign-up error',
      text: SECURITY_STATUS_CODE_MESSAGES[entityResponse.status] || 'An error occurred',
      icon: 'error',
    });
    return;
  }

  // Auto-login after signup? Or redirect to verify?
  // "Standard signup... very similar to standardsignin"
  // Usually returns user or token. I'll assume auto-login for now or just message.
  authProvider.login({ user: entityResponse.result || {}, redirectUrl });
}

export const VeripassStandardSignup = ({
  ui = {
    logo: { height: '40' },
    title: 'Create an account',
    showTitle: true,
  },
  organization = { name: '', logoSrc: '', slogan: '' },
  sideImage,
  providers = [],
  redirectUrl = '',
  environment = 'production',
  apiKey = '',
}) => {
  // Hooks
  const { showErrorFromUrl } = useUrlErrorHandler();
  const authProvider = useAuth();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Data
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
    <VeripassAuthLayout sideImage={sideImage}>
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
            {ui?.showTitle !== false ? ui?.title || 'Create an account' : ''}
          </KarlaTypography>
          {organization?.slogan && (
            <Typography variant="body2" color="textSecondary" className="mt-2">
              {organization.slogan}
            </Typography>
          )}
        </div>
      </header>

      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="row g-2 mb-3">
          <div className="col-6">
            <Typography variant="caption" className="fw-bold mb-1 d-block">
              First name
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="col-6">
            <Typography variant="caption" className="fw-bold mb-1 d-block">
              Last name
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <section className="mb-3">
          <Typography variant="caption" display="block" gutterBottom className="fw-bold mb-1">
            Your email
          </Typography>
          <TextField
            fullWidth
            type="email"
            placeholder="name@example.com"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            size="small"
          />
        </section>

        <section className="mb-4">
          <Typography variant="caption" display="block" gutterBottom className="fw-bold mb-1">
            Create password
          </Typography>
          <TextField
            fullWidth
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
          {isLoading ? 'Loading...' : 'Create account'}
        </Button>

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
                  sx={{ minWidth: 'auto', width: '60px', height: '40px', borderColor: '#e0e0e0' }}
                >
                  {provider.icon}
                </Button>
              ))}
            </div>
          </>
        )}

        <div className="mt-5 text-center">
          <Typography variant="caption" color="textSecondary">
            Already have an account?{' '}
            <Link href="#" underline="hover" color="warning.main" fontWeight="bold">
              Log in
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
