import React, { useEffect } from 'react';
import { useAuth } from '@hooks/useAuth.hook';

import { Card } from '@components/shared/Card';
import { StandardContainer } from '@components/shared/StandardContainer';
import { KarlaTypography } from '@components/shared/KarlaTypography';
import { Typography } from '@mui/material';

import '@styles/fonts.css';
import '@styles/styles.css';

export const VeripassLogoutSuccess = ({
  organization = {
    logoSrc: '',
  },
  signinUrl = '/auth/login',
  texts = {
    farewellMessage: 'Goodbye!',
    successMessage: 'You have successfully logged out.',
    goBackText: 'Back to',
    signinText: 'Sign in',
  },
}) => {
  const authProvider = useAuth();
  useEffect(() => {
    authProvider.logout();
  }, []);

  return (
    <>
      <StandardContainer>
        <Card>
          <header style={{ textAlign: 'center' }}>
            {organization?.logoSrc && (
              <a href="/">
                <img src={organization?.logoSrc} alt="" height="75" style={{ display: 'block', margin: '0 auto' }} />
              </a>
            )}
          </header>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginTop: '2.25rem' }}>
              <div className="logout-checkmark">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                  <circle
                    className="path circle"
                    fill="none"
                    stroke="#4bd396"
                    strokeWidth="6"
                    strokeMiterlimit="10"
                    cx="65.1"
                    cy="65.1"
                    r="62.1"
                  />
                  <polyline
                    className="path check"
                    fill="none"
                    stroke="#4bd396"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeMiterlimit="10"
                    points="100.2,40.2 51.5,88.8 29.8,67.5 "
                  />
                </svg>
              </div>
            </div>

            <Typography variant="h5" style={{ textAlign: 'center', margin: '10px 0', color: '#343a40', fontWeight: '600' }}>
              <KarlaTypography>{texts?.farewellMessage}</KarlaTypography>
            </Typography>
            <Typography variant="body2" style={{ marginTop: '16px', marginBottom: '24px', color: '#98a6ad' }}>
              {texts?.successMessage}
            </Typography>
          </div>
        </Card>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 auto', width: '100%', textAlign: 'center' }}>
            <Typography variant="body2" style={{ color: '#98a6ad' }}>
              {texts?.goBackText}{' '}
              <a href={signinUrl} style={{ color: '#323a46', marginLeft: '0.175rem' }}>
                <b>{texts?.signinText}</b>
              </a>
            </Typography>
          </div>
        </div>
      </StandardContainer>
    </>
  );
};
