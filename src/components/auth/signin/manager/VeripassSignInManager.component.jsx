import React, { useState } from 'react';
import { VeripassStandardSignin } from '../standard-signin/VeripassStandardSignin';
import { VeripassAuthLayout } from '@components/auth/layouts/VeripassAuthLayout';
import { KarlaTypography } from '@components/shared/styling/KarlaTypography';
import { TextField, Typography, Button, Divider, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import veripassLogo from '@assets/logos/veripass-logo-dark.svg';

const BrandButton = styled(Button)(({ theme, customTheme }) => ({
  backgroundColor: customTheme?.brandPrimary || '#000000',
  color: customTheme?.brandPrimaryForeground || '#fff',
  textTransform: 'none',
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
  signinType, // 'standard' | undefined
  organization = { name: '', logoSrc: '', slogan: '' },
  ...props
}) => {
  const sideImage = ui.sideImage || { src: '', alt: 'Cover' };
  const providers = ui.providers || [];
  const theme = ui?.theme || {};

  const [view, setView] = useState(signinType === 'standard' ? 'standard' : 'discovery');
  const [identifier, setIdentifier] = useState('');

  const handleContinue = (e) => {
    e.preventDefault();
    if (identifier) {
      setView('standard');
    }
  };

  if (view === 'standard') {
    return (
      <VeripassStandardSignin
        sideImage={sideImage}
        organization={organization}
        providers={providers}
        ui={{
          ...ui,
        }}
        initialEmail={identifier}
        {...props}
      />
    );
  }

  // Discovery View
  return (
    <VeripassAuthLayout sideImage={sideImage} logo={organization?.logoSrc || ui?.logo?.src}>
      <header className="veripass-my-4">
        <KarlaTypography variant="h1" className="veripass-fw-bold veripass-text-dark veripass-mb-2 veripass-display-6">
          {ui?.showTitle !== false ? ui?.title || 'Sign in' : ''}
        </KarlaTypography>
        <Typography variant="body1" className="veripass-text-secondary">
          Enter your email or phone to continue
        </Typography>
      </header>

      <form onSubmit={handleContinue}>
        <section className="veripass-mb-4">
          <TextField
            fullWidth
            label="Email or phone"
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

        <section className="veripass-text-center veripass-mb-4">
          <Link
            href="#"
            underline="hover"
            style={{ color: theme?.linkColor || '#0d6efd', fontWeight: 'bold' }}
            className="veripass-text-decoration-none"
          >
            Create account
          </Link>
        </section>

        {providers && providers.length > 0 && (
          <section>
            <article className="veripass-d-flex veripass-align-items-center veripass-mb-4">
              <Divider className="veripass-flex-grow-1" />
              <Typography variant="caption" className="veripass-mx-3 veripass-text-muted">
                or
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

        <footer className="veripass-mt-5 veripass-text-center">
          <Typography variant="caption" className="veripass-text-secondary veripass-me-1">
            Powered by
          </Typography>
          <img src={veripassLogo} alt="Veripass logo" height="12" />
        </footer>
      </form>
    </VeripassAuthLayout>
  );
};
