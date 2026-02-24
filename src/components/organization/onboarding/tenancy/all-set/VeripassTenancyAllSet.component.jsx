import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import styled, { keyframes } from 'styled-components';

import { VeripassActionButton } from '@components/shared/buttons/VeripassActionButton.component';

// Animations
const scaleUp = keyframes`
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const drawCheck = keyframes`
  0% { stroke-dashoffset: 48; }
  100% { stroke-dashoffset: 0; }
`;

const orbitSpin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
`;

const SuccessIconContainer = styled('figure')`
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 24px auto;
`;

const InnerCircle = styled('div')`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #e8f5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${scaleUp} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;

  svg {
    width: 36px;
    height: 36px;
    stroke: #2e7d32;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: ${drawCheck} 0.5s ease-out 0.3s forwards;
  }
`;

const OrbitRing = styled('div')`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  margin-top: ${({ $size }) => -$size / 2}px;
  margin-left: ${({ $size }) => -$size / 2}px;
  border-radius: 50%;
  border: 1.5px dashed #c8e6c9;
  animation:
    ${fadeIn} 0.4s ease-out ${({ $delay }) => $delay}s forwards,
    ${orbitSpin} ${({ $duration }) => $duration}s linear ${({ $delay }) => $delay}s infinite;
  opacity: 0;
  pointer-events: none;
`;

const SummaryCard = styled('article')({
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '16px 20px',
  marginBottom: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
});

const ViewTitle = styled('h2')({
  fontSize: '2rem',
  color: '#0f172a',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const ViewSubtitle = styled('p')({
  fontSize: '1.05rem',
  color: '#64748b',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const SummaryOrgName = styled('span')({
  fontSize: '0.95rem',
  color: '#0f172a',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const ActiveBadge = styled('span')({
  fontSize: '0.7rem',
  color: '#15803d',
  backgroundColor: '#dcfce7',
  borderRadius: '4px',
  padding: '2px 8px',
  letterSpacing: '0.05em',
  fontWeight: '700',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const CountdownContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
});

const CountdownLabel = styled('span')({
  fontSize: '0.85rem',
  color: '#4b5563',
  fontWeight: '500',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const CountdownValue = styled('span')({
  fontSize: '0.85rem',
  color: '#111827',
  fontWeight: '600',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const ProgressBarContainer = styled('div')({
  height: '4px',
  backgroundColor: '#f3f4f6',
  borderRadius: '2px',
  overflow: 'hidden',
});

const ProgressBarFill = styled('div')(({ $progress, $customTheme }) => ({
  height: '100%',
  backgroundColor: $customTheme?.brandPrimary || '#111827',
  width: `${$progress}%`,
  transition: 'width 1s linear',
}));

const ActionParagraph = styled('p')({
  fontSize: '0.875rem',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const ActionLink = styled('a')({
  color: '#6b7280',
  textDecoration: 'none',
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const SupportFooter = styled('footer')({
  backgroundColor: '#f8f9fa',
  borderRadius: '0 0 16px 16px',
  margin: '0 -48px -48px -48px',
  padding: '16px 48px',
  textAlign: 'center',
  borderTop: '1px solid #f3f4f6',
});

const SupportText = styled('p')({
  fontSize: '0.75rem',
  color: '#9ca3af',
  margin: 0,
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const SupportLink = styled('a')({
  color: '#6b7280',
  textDecoration: 'underline',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const BulletSeparator = styled('span')({
  color: '#d1d5db',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const NAMESPACE = 'veripass-tenancy-onboarding';
const ACTIONS = {
  ALL_SET_CONTINUE: `${NAMESPACE}::all-set/continue`,
  ALL_SET_GO_DASHBOARD: `${NAMESPACE}::all-set/go-dashboard`,
};

function VeripassTenancyAllSetComponent({ ui = {}, organization = {}, itemOnAction, updateOnAction, countdownSeconds = 15 }) {
  // Hooks
  const [countdown, setCountdown] = useState(countdownSeconds);
  const copy = ui.copy || {};

  // Component Functions
  useEffect(() => {
    if (countdownSeconds > 0) {
      setCountdown(countdownSeconds);
    }
  }, [countdownSeconds]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && countdownSeconds > 0) {
      handleContinue();
    }
  }, [countdown, countdownSeconds]);

  const handleContinue = () => {
    if (itemOnAction) {
      itemOnAction({
        action: ACTIONS.ALL_SET_CONTINUE,
        namespace: NAMESPACE,
      });
    }
  };

  const handleGoDashboard = (e) => {
    e.preventDefault();
    if (itemOnAction) {
      itemOnAction({ action: ACTIONS.ALL_SET_GO_DASHBOARD, namespace: NAMESPACE });
    }
  };

  const progress = countdownSeconds > 0 ? ((countdownSeconds - countdown) / countdownSeconds) * 100 : 0;

  return (
    <section className="veripass-container-fluid veripass-w-100 veripass-p-0 veripass-text-center">
      <SuccessIconContainer>
        <OrbitRing $size={110} $delay={0.6} $duration={12} />
        <OrbitRing $size={140} $delay={0.9} $duration={18} />
        <InnerCircle>
          <svg viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </InnerCircle>
      </SuccessIconContainer>

      <header className="veripass-mb-4 veripass-pt-4">
        {ui.showTitle !== false && (
          <ViewTitle className="veripass-fw-bold veripass-text-dark veripass-mb-2">
            {copy.allSetTitle || "You're all set"}
          </ViewTitle>
        )}
        <ViewSubtitle className="veripass-text-secondary veripass-m-0">
          {copy.allSetSubtitle || 'We have successfully configured your tenancy.'}
          <br />
          Redirecting you to your organization now.
        </ViewSubtitle>
      </header>

      {organization?.name && (
        <SummaryCard>
          <CorporateFareIcon sx={{ color: '#64748b', fontSize: '1.25rem' }} />
          <SummaryOrgName className="veripass-fw-bold">{organization.name}</SummaryOrgName>
          <BulletSeparator>•</BulletSeparator>
          <ActiveBadge>ACTIVE</ActiveBadge>
        </SummaryCard>
      )}

      {countdownSeconds > 0 && (
        <div className="veripass-mb-4 veripass-text-left">
          <CountdownContainer>
            <CountdownLabel>Continuing to your organization...</CountdownLabel>
            <CountdownValue>{countdown}s</CountdownValue>
          </CountdownContainer>
          <ProgressBarContainer>
            <ProgressBarFill $progress={progress} $customTheme={ui.theme} />
          </ProgressBarContainer>
        </div>
      )}

      <div className="veripass-d-flex veripass-flex-column veripass-align-items-center">
        <VeripassActionButton
          customTheme={ui?.theme}
          variant="contained"
          fullWidth
          size="large"
          className="veripass-py-3 veripass-fw-bold veripass-fs-6 veripass-mb-3"
          onClick={handleContinue}
        >
          {ui.primaryActionLabel || 'Continue'}
        </VeripassActionButton>

        <ActionParagraph className="veripass-m-0 veripass-mb-4">
          <ActionLink href="#" onClick={handleGoDashboard} className="veripass-text-decoration-none">
            Go to Dashboard instead <ArrowForwardIcon sx={{ fontSize: '1rem', ml: 0.5 }} />
          </ActionLink>
        </ActionParagraph>
      </div>

      <SupportFooter>
        <SupportText>
          Having trouble? <SupportLink href="#">Contact Support</SupportLink>
        </SupportText>
      </SupportFooter>
    </section>
  );
}

export const VeripassTenancyAllSet = VeripassTenancyAllSetComponent;
