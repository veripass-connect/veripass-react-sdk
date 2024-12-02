import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Typography } from '@mui/material';

import '@styles/bootstrap-namespaced.css';
import '@styles/styles.css';
import '@styles/fonts.css';

import veripassLogo from '@assets/logos/veripass-logo-dark.svg';

const Container = styled.article`
  margin: 0 auto;
  min-width: 400px;
  width: ${(props) => (props.$isPopup ? '800px' : '100%')};
  ${(props) => (props.$isPopup ? '' : 'flex-grow: 1;')};

  @media (max-width: 1199px) {
    width: ${(props) => (props.$isPopup ? '700px' : '100%')};
    max-width: ${(props) => (props.$isPopup ? 'unset' : '41.6667%')}; /* 5/12 */
  }

  @media (max-width: 991px) {
    width: ${(props) => (props.$isPopup ? '600px' : '100%')};
    max-width: ${(props) => (props.$isPopup ? 'unset' : '50%')}; /* 6/12 */
  }

  @media (max-width: 767px) {
    width: ${(props) => (props.$isPopup ? '500px' : '100%')};
    max-width: ${(props) => (props.$isPopup ? 'unset' : '66.6667%')}; /* 8/12 */
  }

  @media (max-width: 575px) {
    width: 100%;
  }
`;

export const VeripassLayout = ({ children, isPopupContext = false, showLogo = true, logoPosition = 'top', ...props }) => {
  return (
    <Container
      $isPopup={isPopupContext}
      className={`veripass ${!isPopupContext ? 'col-12' : ''}`}
      style={{ boxSizing: 'border-box' }}
    >
      {showLogo && logoPosition === 'top' && (
        <section className="d-flex justify-content-end mb-3">
          <Typography className="mb-0 me-2 text-muted" style={{ fontSize: '0.775rem', fontWeight: 400 }}>
            Powered by
          </Typography>
          <img src={veripassLogo} alt="Veripass logo" height="15" />
        </section>
      )}

      <main {...props}>{children}</main>

      {showLogo && logoPosition === 'bottom' && (
        <section className="d-flex justify-content-end mb-3">
          <Typography className="mb-0 me-2 text-muted" style={{ fontSize: '0.775rem', fontWeight: 400 }}>
            Powered by
          </Typography>
          <img src={veripassLogo} alt="Veripass logo" height="15" />
        </section>
      )}
    </Container>
  );
};
