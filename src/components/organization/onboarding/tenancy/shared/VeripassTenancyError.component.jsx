import React from 'react';
import styled from 'styled-components';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { VeripassActionButton } from '@components/shared/buttons/VeripassActionButton.component';

const IconCircle = styled('figure')({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: '#fef2f2',
  color: '#dc2626',
  margin: 0,
  '& svg': {
    fontSize: '2rem',
  },
});

const Title = styled('h2')({
  fontFamily: 'system-ui, -apple-system, sans-serif',
});

const Subtitle = styled('p')({
  fontFamily: 'system-ui, -apple-system, sans-serif',
});

const HighlightBox = styled('article')({
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '1rem',
});

const HighlightIcon = styled('figure')({
  color: '#991b1b',
  margin: 0,
  '& svg': {
    fontSize: '1.5rem',
  },
});

const HighlightTitle = styled('h6')({
  fontSize: '0.95rem',
  color: '#991b1b',
  fontFamily: 'system-ui, -apple-system, sans-serif',
});

const HighlightBody = styled('p')({
  fontSize: '0.875rem',
  color: '#991b1b',
  fontFamily: 'system-ui, -apple-system, sans-serif',
});

const BackButton = styled('button')({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1rem',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  '&:hover': {
    color: '#0f172a',
  },
});

export const VeripassTenancyError = ({
  title = 'Something went wrong',
  subtitle = "We couldn't complete the setup at this time.",
  errorTitle = 'Network connection interrupted',
  errorBody = 'Please check your internet connection and try again.',
  onRetry,
  onBack,
  ui = {},
}) => {
  return (
    <section className="veripass-d-flex veripass-flex-column veripass-align-items-center veripass-text-center veripass-p-3 veripass-w-100">
      <IconCircle className="veripass-d-flex veripass-justify-content-center veripass-align-items-center veripass-mb-4">
        <ErrorOutlineIcon />
      </IconCircle>

      <Title className="veripass-fs-4 veripass-fw-bold veripass-text-dark veripass-mb-2">{title}</Title>
      <Subtitle className="veripass-text-secondary veripass-mb-4">{subtitle}</Subtitle>

      <HighlightBox className="veripass-d-flex veripass-flex-column veripass-align-items-center veripass-justify-content-center veripass-p-4 veripass-w-100 veripass-mb-4 veripass-text-center">
        <HighlightIcon className="veripass-d-flex veripass-align-items-center veripass-justify-content-center">
          <WifiOffIcon />
        </HighlightIcon>
        <section className="veripass-d-flex veripass-flex-column veripass-align-items-center veripass-text-center veripass-mt-2">
          <HighlightTitle className="veripass-m-0 veripass-fw-bold">{errorTitle}</HighlightTitle>
          <HighlightBody className="veripass-mt-1 veripass-mb-0 veripass-mx-0">{errorBody}</HighlightBody>
        </section>
      </HighlightBox>

      <VeripassActionButton
        customTheme={ui?.theme}
        variant="contained"
        fullWidth
        size="large"
        className="veripass-py-3 veripass-fw-bold veripass-fs-6 veripass-mb-3"
        onClick={onRetry}
      >
        Retry
      </VeripassActionButton>

      {onBack && (
        <BackButton className="veripass-text-secondary veripass-fw-medium veripass-mt-4" onClick={onBack}>
          Back to setup
        </BackButton>
      )}
    </section>
  );
};
