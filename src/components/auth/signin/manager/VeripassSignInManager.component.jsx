import React, { useState } from 'react';
import { VeripassStandardSignin } from '../standard-signin/VeripassStandardSignin';
import { VeripassAuthLayout } from '@components/auth/layouts/VeripassAuthLayout';
import { KarlaTypography } from '@components/shared/styling/KarlaTypography';
import { TextField, Typography, Button, Divider, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const BrandButton = styled(Button)(({ theme, customTheme }) => ({
  backgroundColor: customTheme?.brandPrimary || '#000000',
  color: customTheme?.brandPrimaryForeground || '#fff',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 'bold',
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

/**
 * Manager component that handles the authentication flow.
 * Can start with a "Discovery" step (Email/Phone) or directly show the Standard Signin.
 *
 * @component
 */
export const VeripassSignInManager = ({
  ui = {
    logo: {
      src: '',
      height: '40',
    },
    title: 'Sign in',
    showTitle: true,
    heroImage: {
      src: '',
      alt: 'Cover',
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
  signinType, // 'standard' | undefined
  organization = { name: '', logoSrc: '', slogan: '' },
  registerUrl = '',
  onRegisterClick,
  ...props
}) => {
  const heroImage = ui.heroImage || { src: '', alt: 'Cover' };
  const providers = ui.providers || [];
  const theme = ui?.theme || {};

  const [view, setView] = useState(signinType === 'standard' ? 'standard' : 'discovery');
  const [identifier, setIdentifier] = useState('');

  const finalRegisterUrl = ui.registerUrl || registerUrl || '#';
  const finalOnRegisterClick = ui.onRegisterClick || onRegisterClick;

  const handleContinue = (e) => {
    e.preventDefault();
    if (identifier) {
      setView('standard');
    }
  };

  if (view === 'standard') {
    return (
      <VeripassStandardSignin
        heroImage={heroImage}
        organization={organization}
        providers={providers}
        ui={{
          ...ui,
        }}
        initialEmail={identifier}
        registerUrl={registerUrl}
        onRegisterClick={onRegisterClick}
        {...props}
      />
    );
  }

  return (
    <VeripassAuthLayout heroImage={heroImage} logo={organization?.logoSrc || ui?.logo?.src}>
      <header className="veripass-my-4">
        <h2 className="veripass-fw-bold veripass-text-dark veripass-mb-2">
          {ui?.showTitle !== false ? ui?.title || 'Sign in' : ''}
        </h2>
        <Typography variant="body1" className="veripass-text-secondary">
          Enter your email or phone to continue
        </Typography>
      </header>

      <form onSubmit={handleContinue}>
        <section className="veripass-mb-4">
          <TextField
            fullWidth
            label="Your email or phone"
            placeholder="Type your email or phone"
            value={identifier}
            required
            onChange={(e) => setIdentifier(e.target.value)}
            variant="outlined"
            size="small"
            autoFocus
          />
        </section>

        <BrandButton
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          className="veripass-mb-3 veripass-py-3 veripass-fw-bold veripass-fs-6"
          customTheme={theme}
        >
          Continue
        </BrandButton>

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

        <div className="veripass-mt-2 veripass-text-center">
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
