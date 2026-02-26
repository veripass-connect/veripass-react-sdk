import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, Typography } from '@mui/material';

import '@styles/bootstrap-namespaced.css';
import '@styles/styles.css';
import '@styles/fonts.css';

import { PoweredBy } from '@components/shared/PoweredBy/PoweredBy.component';

const Container = styled.article`
  margin: 0 auto;
  min-width: ${(props) => props.$layout?.minWidth?.xs || '450px'};
  width: ${(props) => (props.$ispopup ? props.$layout?.width?.xl || '800px' : '100%')};
  ${(props) => (props.$ispopup ? '' : 'flex-grow: 1;')};

  @media (min-width: 1200px) {
    width: ${(props) => (props.$ispopup ? props.$layout?.width?.xl || '800px' : '100%')};
    min-width: ${(props) => props.$layout?.minWidth?.xl || props.$layout?.minWidth?.xs || '450px'};
  }

  @media (max-width: 1199px) {
    width: ${(props) => (props.$ispopup ? props.$layout?.width?.lg || '700px' : '100%')};
    min-width: ${(props) => props.$layout?.minWidth?.lg || props.$layout?.minWidth?.xs || '450px'};
  }

  @media (max-width: 991px) {
    width: ${(props) => (props.$ispopup ? props.$layout?.width?.md || '600px' : '100%')};
    min-width: ${(props) => props.$layout?.minWidth?.md || props.$layout?.minWidth?.xs || '450px'};
  }

  @media (max-width: 767px) {
    width: ${(props) => (props.$ispopup ? props.$layout?.width?.sm || '500px' : '100%')};
    min-width: ${(props) => props.$layout?.minWidth?.sm || props.$layout?.minWidth?.xs || '450px'};
  }

  @media (max-width: 575px) {
    width: 100%;
    min-width: ${(props) => props.$layout?.minWidth?.xs || '100%'};
  }
`;

export const VeripassLayout = ({
  children,
  isPopupContext = false,
  ui = { showLogo: true, vertical: 'bottom', alignment: 'end' },
  ...props
}) => {
  return (
    <Container $ispopup={isPopupContext} $layout={ui?.layout} className="veripass" style={{ boxSizing: 'border-box' }}>
      {ui?.showLogo === true && ui?.vertical === 'top' && <PoweredBy align={ui?.alignment} position={ui?.vertical} />}

      <main {...props}>{children}</main>

      {ui?.showLogo === true && ui?.vertical === 'bottom' && <PoweredBy align={ui?.alignment} position={ui?.vertical} />}
    </Container>
  );
};
