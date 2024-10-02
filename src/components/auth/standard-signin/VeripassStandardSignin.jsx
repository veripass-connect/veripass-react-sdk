import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '@hooks/useAuth.hook';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { TextField, InputAdornment, IconButton, CircularProgress } from '@mui/material';

import { SecurityService } from '@services';

const swal = withReactContent(Swal);

const statusCodeMessages = {
  461: 'The data provided does not match any registered application',
  462: 'Unauthorized user. After 3 failed attempts, your account will be locked for 24 hours.',
  463: 'The user is not registered in this application, needs to register',
  464: 'Unauthorized. After 3 failed attempts, your account will be locked for 24 hours.',
  401: 'Error authenticating',
};

async function signInStandard({ payload, authProvider, redirectUrl, apiKey, debug }) {
  const entityService = new SecurityService({ apiKey, settings: { debug } });
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

export const VeripassStandardSignin = ({ logoSrc = '', subtitle = '', redirectUrl = '', debug = false }) => {
  // Hooks
  const authProvider = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // Entity states
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState('');

  const showError = ({ title, message }) => {
    Swal.fire({
      title: title || 'Failed to sign-in',
      text: message || '',
      icon: 'error',
    }).then(() => {
      searchParams.delete('error');
      navigate(`${location.pathname}?${searchParams.toString()}`, {
        replace: true,
      });
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

      await signInStandard({ payload: { email, password }, authProvider, redirectUrl });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeComponent();
  }, []);

  return (
    <>
      <section style={{ maxWidth: '600px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center' }}>
          <a href="/">
            <img src={logoSrc} alt="" height="75" style={{ display: 'block', margin: '0 auto' }} />
          </a>
          <Typography variant="body2" color="textSecondary" style={{ marginTop: '16px', marginBottom: '24px' }}>
            {subtitle}
          </Typography>
        </header>

        <section style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Typography variant="h6">Log in using email address</Typography>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off">
            <section style={{ marginBottom: '16px' }}>
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
                        {showPassword ? <i className="fe-eye-off" /> : <i className="fe-eye" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ shrink: true }}
              />
            </section>

            <section style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <Link to="recover-password" style={{ marginLeft: '8px', color: 'gray' }}>
                <i className="fa fa-lock" style={{ marginRight: '4px' }}></i>Forgot password?
              </Link>
            </section>

            <footer style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                disabled={isLoading}
                {...props}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '2px solid #232931',
                  backgroundColor: isLoading ? '#323a46' : 'transparent',
                  color: isLoading ? '#fff' : '#000',
                  '&:hover': {
                    backgroundColor: isLoading ? '#2b323b' : 'transparent',
                  },
                }}
              >
                {isLoading && <CircularProgress size={20} style={{ marginRight: '8px', color: '#fff' }} />}
                {isLoading ? 'Loading...' : 'Log in'}
              </Button>
            </footer>
          </form>
        </section>
      </section>
    </>
  );
};
