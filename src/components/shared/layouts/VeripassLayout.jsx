import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Typography } from '@mui/material';

import '@styles/bootstrap-namespaced.css';
import '@styles/styles.css';
import '@styles/fonts.css';

import veripassLogo from '@assets/logos/veripass-logo-dark.svg';

const Container = styled.article`
  margin: 0 auto;
  min-width: 450px;
  width: ${(props) => (props.$ispopup ? '800px' : '100%')};
  ${(props) => (props.$ispopup ? '' : 'flex-grow: 1;')};

  @media (max-width: 1199px) {
    width: ${(props) => (props.$ispopup ? '700px' : '100%')};
  }

  @media (max-width: 991px) {
    width: ${(props) => (props.$ispopup ? '600px' : '100%')};
  }

  @media (max-width: 767px) {
    width: ${(props) => (props.$ispopup ? '500px' : '100%')};
  }

  @media (max-width: 575px) {
    width: 100%;
  }
`;

export const VeripassLayout = ({
  children,
  isPopupContext = false,
  ui = { showLogo: true, vertical: 'bottom', alignment: 'end' },
  ...props
}) => {
  return (
    <Container
      $ispopup={isPopupContext}
      className={`veripass container-fluid ${!isPopupContext ? 'col-12' : ''}`}
      style={{ boxSizing: 'border-box' }}
    >
      {ui?.showLogo && ui?.vertical === 'top' && (
        <section
          className={`d-flex ${ui?.vertical === 'top' ? 'mb-1' : 'mt-3'} ${ui?.alignment === 'start' ? 'justify-content-start' : ''} ${
            ui?.alignment === 'center' ? 'justify-content-center' : ''
          } ${ui?.alignment === 'end' ? 'justify-content-end' : ''}`}
        >
          <Typography className="mb-0 me-2 text-muted" style={{ fontSize: '0.775rem', fontWeight: 400 }}>
            Powered by
          </Typography>
          <img src={veripassLogo} alt="Veripass logo" height="15" />
        </section>
      )}

      <main {...props}>{children}</main>

      {ui?.showLogo && ui?.vertical === 'bottom' && (
        <section
          className={`d-flex ${ui?.vertical === 'bottom' ? 'mb-1' : 'mt-3'} ${ui?.alignment === 'start' ? 'justify-content-start' : ''} ${
            ui?.alignment === 'center' ? 'justify-content-center' : ''
          } ${ui?.alignment === 'end' ? 'justify-content-end' : ''}`}
        >
          <Typography className="mb-0 me-2 text-muted" style={{ fontSize: '0.775rem', fontWeight: 400 }}>
            Powered by
          </Typography>
          <img src={veripassLogo} alt="Veripass logo" height="15" />
        </section>
      )}
    </Container>
  );
};
