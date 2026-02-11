import React, { useState } from 'react';
import { VeripassStandardSignin } from '../standard-signin/VeripassStandardSignin';
import { VeripassAuthLayout } from '@components/auth/layouts/VeripassAuthLayout';
import { KarlaTypography } from '@components/shared/styling/KarlaTypography';
import { TextField, Typography, Button, Divider, Link } from '@mui/material';
import veripassLogo from '@assets/logos/veripass-logo-dark.svg';

export const VeripassSignInManager = ({
  signinType, // 'standard' | undefined
  sideImage,
  organization,
  providers,
  ...props
}) => {
  // If signinType is explicit, bypass discovery
  const [view, setView] = useState(signinType === 'standard' ? 'standard' : 'discovery');
  const [identifier, setIdentifier] = useState('');

  const handleContinue = (e) => {
    e.preventDefault();
    if (identifier) {
      // Here we would ideally check if identifier exists and what type of auth it needs.
      // For now, we assume standard password auth.
      setView('standard');
    }
  };

  if (view === 'standard') {
    return (
      <VeripassStandardSignin
        sideImage={sideImage}
        organization={organization}
        providers={providers}
        initialEmail={identifier} // Pass the discovered email
        {...props}
      />
    );
  }

  // Discovery View
  return (
    <VeripassAuthLayout sideImage={sideImage}>
      <header className="mb-5">
        <div className="d-flex align-items-center mb-3">
          {(organization?.logoSrc || props.ui?.logo?.src) && (
            <img
              src={organization?.logoSrc || props.ui?.logo?.src}
              alt={organization?.name || 'Logo'}
              height={props.ui?.logo?.height || 40}
              className="me-3"
            />
          )}
        </div>

        <div className="mt-4">
          <KarlaTypography variant="h4" style={{ fontWeight: 'bold', color: '#000' }}>
            Sign in
          </KarlaTypography>
          <Typography variant="body2" color="textSecondary" className="mt-2">
            Enter your email or phone to continue
          </Typography>
        </div>
      </header>

      <form onSubmit={handleContinue}>
        <section className="mb-4">
          <Typography variant="caption" display="block" gutterBottom className="fw-bold mb-1">
            Email or phone
          </Typography>
          <TextField
            fullWidth
            placeholder="Type your email or phone"
            value={identifier}
            required
            onChange={(e) => setIdentifier(e.target.value)}
            variant="outlined"
            size="small"
            autoFocus
          />
        </section>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          sx={{
            backgroundColor: '#2d68fc', // Blue as per screenshot 4
            color: '#fff',
            textTransform: 'none',
            py: 1.5,
            '&:hover': {
              backgroundColor: '#1a54e6',
            },
            mb: 3,
          }}
        >
          Continue
        </Button>

        <div className="text-center mb-4">
          <Link href="#" underline="hover" color="primary" fontWeight="bold" style={{ textDecoration: 'none' }}>
            Create account
          </Link>
        </div>

        {providers && providers.length > 0 && (
          <>
            <div className="d-flex align-items-center mb-4">
              <Divider sx={{ flexGrow: 1 }} />
              <Typography variant="caption" className="mx-3 text-muted">
                or
              </Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </div>

            {/* Button for primary provider (e.g. Google) if we want to match Screenshot 4 style 
                             Screenshot 4 has a full width button "Iniciar sesión con Google".
                             Current providers prop is array of icons. 
                             I'll render them as before, or list full buttons? 
                             screenshot 4 shows ONE extensive button. 
                             I'll keep the icon list for consistency with Signin/Signup unless instructed.
                         */}
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
          <Typography variant="caption" style={{ color: '#98a6ad', marginRight: '5px' }}>
            Powered by
          </Typography>
          <img src={veripassLogo} alt="Veripass logo" height="12" />
        </div>
      </form>
    </VeripassAuthLayout>
  );
};
