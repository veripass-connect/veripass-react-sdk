import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LockIcon from '@mui/icons-material/Lock';
import styled, { keyframes, css } from 'styled-components';
import { VeripassActionButton } from '@components/shared/buttons/VeripassActionButton.component';

const AppCardContainer = styled('article')(({ $customTheme }) => ({
  backgroundColor: '#f9fafb',
  borderRadius: '12px',
  transition: 'border-color 0.2s',
  padding: '20px',
}));

const SecurityBadge = styled('figure')({
  color: '#9ca3af',
  margin: 0,
});

const ViewTitle = styled('h2')({
  fontFamily: 'system-ui, -apple-system, sans-serif',
});

const ViewSubtitle = styled('p')({
  fontSize: '1.05rem',
  fontFamily: 'system-ui, -apple-system, sans-serif',
});

const AppFeatureIcon = styled('figure')({
  width: '48px',
  height: '48px',
  margin: 0,
});

const AppFeatureTitle = styled('h6')({
  fontSize: '1.1rem',
  fontFamily: 'system-ui, -apple-system, sans-serif',
});

const AppFeatureSubtitle = styled('p')({
  fontSize: '0.875rem',
  fontFamily: 'system-ui, -apple-system, sans-serif',
});

const FooterDivider = styled('hr')({
  border: 'none',
  borderTop: '1px solid #f3f4f6',
});

const SecurityLabel = styled('span')({
  fontSize: '0.75rem',
  fontFamily: 'system-ui, -apple-system, sans-serif',
});

const NAMESPACE = 'veripass-tenancy-onboarding';
const ACTIONS = {
  JOIN_HOST_SUCCESS: `${NAMESPACE}::join-host/success`,
  JOIN_HOST_ERROR_UPDATED: `${NAMESPACE}::join-host/error-updated`,
};

const PROVISIONING_STEPS = [
  'Verifying identity...',
  'Resolving host platform...',
  'Preparing access context...',
  'Registering session...',
  'Allocating resources...',
  'Finalizing connection...',
];

const fadeSlideUp = keyframes`
  0% { opacity: 0; transform: translateY(15px); }
  15% { opacity: 1; transform: translateY(0); }
  85% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-15px); }
`;

const fadeSlideUpLast = keyframes`
  0% { opacity: 0; transform: translateY(15px); }
  15% { opacity: 1; transform: translateY(0); }
  100% { opacity: 1; transform: translateY(0); }
`;

const ProgressStepContainer = styled('div')({
  height: '24px',
  marginTop: '16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  position: 'relative',
});

const ProgressText = styled('span')(
  ({ $isLast, $duration }) => css`
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
    position: absolute;
    font-family:
      system-ui,
      -apple-system,
      'Segoe UI',
      Roboto,
      'Helvetica Neue',
      Arial,
      sans-serif;
    animation: ${$isLast ? fadeSlideUpLast : fadeSlideUp} ${$duration}ms ease-in-out forwards;
  `,
);

function VeripassTenancyJoinHostComponent({
  ui = {},
  organization = {},
  itemOnAction,
  updateOnAction,
  services,
  user,
  error,
  environment = 'production',
  apiKey = '',
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState('loading'); // 'loading', 'success'
  const copy = ui.copy || {};

  const stepDuration = 2000;

  const performJoin = async () => {
    setStatus('loading');
    setCurrentStep(0);

    const uiInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < PROVISIONING_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, stepDuration);

    const startTime = Date.now();

    try {
      if (!services?.provisioningService) {
        throw new Error('Provisioning service is unavailable.');
      }
      if (typeof services.provisioningService.joinHost !== 'function') {
        throw new Error('services.provisioningService.joinHost is not a function');
      }

      const payload = {
        admin: {
          id: user?.id,
        },
      };

      const res = await services.provisioningService.joinHost(payload);

      const elapsedTime = Date.now() - startTime;
      const minWaitTime = PROVISIONING_STEPS.length * stepDuration;

      if (elapsedTime < minWaitTime) {
        await new Promise((resolve) => setTimeout(resolve, minWaitTime - elapsedTime));
      }

      if (res && res.success) {
        clearInterval(uiInterval);
        setCurrentStep(PROVISIONING_STEPS.length - 1);
        setStatus('success');

        setTimeout(() => {
          if (itemOnAction) {
            itemOnAction({
              action: ACTIONS.JOIN_HOST_SUCCESS,
              namespace: NAMESPACE,
              payload: { result: res.result },
            });
          }
        }, 800);
      } else {
        throw new Error(res?.message || 'Failed to join host platform.');
      }
    } catch (err) {
      clearInterval(uiInterval);
      setStatus('error');
      if (updateOnAction) {
        updateOnAction({
          action: ACTIONS.JOIN_HOST_ERROR_UPDATED,
          namespace: NAMESPACE,
          payload: { error: err.message || 'An unexpected error occurred.' },
        });
      }
    }
  };

  useEffect(() => {
    performJoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="veripass-container-fluid veripass-w-100 veripass-p-0">
      <header className="veripass-mb-4 veripass-text-center">
        {ui.showTitle !== false && (
          <ViewTitle className="veripass-fs-3 veripass-fw-bold veripass-text-dark veripass-mb-2">
            Joining {organization?.name || 'the platform'}...
          </ViewTitle>
        )}
        <ViewSubtitle className="veripass-m-0 veripass-text-secondary">
          We’re preparing your account for exploration. You can create or join an organization later.
        </ViewSubtitle>
      </header>

      <AppCardContainer
        $customTheme={ui?.theme}
        className="veripass-border veripass-mb-4 veripass-d-flex veripass-flex-column veripass-align-items-center veripass-text-center"
      >
        <AppFeatureIcon className="veripass-border veripass-d-flex veripass-align-items-center veripass-justify-content-center veripass-rounded veripass-bg-white veripass-mb-3">
          <RocketLaunchIcon sx={{ fontSize: '1.5rem', color: '#1e293b' }} />
        </AppFeatureIcon>
        <AppFeatureTitle className="veripass-fw-bold veripass-m-0 veripass-text-dark">Explore mode</AppFeatureTitle>
        <AppFeatureSubtitle className="veripass-m-0 veripass-mt-1 veripass-text-secondary">
          Entering without workspace
        </AppFeatureSubtitle>

        {(status === 'loading' || status === 'success') && (
          <ProgressStepContainer className="veripass-mt-4 veripass-w-100">
            <ProgressText key={currentStep} $isLast={currentStep === PROVISIONING_STEPS.length - 1} $duration={stepDuration}>
              {copy.provisioningSteps?.[currentStep] || PROVISIONING_STEPS[currentStep]}
            </ProgressText>
          </ProgressStepContainer>
        )}
      </AppCardContainer>

      <VeripassActionButton
        customTheme={ui?.theme}
        variant="contained"
        fullWidth
        size="large"
        disabled={true}
        className="veripass-py-3 veripass-fw-bold veripass-fs-6 veripass-position-relative veripass-mb-2"
      >
        {status === 'loading' && <CircularProgress size={20} className="veripass-me-2" sx={{ color: ui?.theme?.brandPrimary }} />}
        {status === 'loading' ? 'Joining platform...' : 'Success'}
      </VeripassActionButton>

      <FooterDivider className="veripass-my-4" />
      <footer className="veripass-d-flex veripass-justify-content-center">
        <SecurityBadge className="veripass-d-inline-flex veripass-align-items-center veripass-gap-2">
          <LockIcon sx={{ fontSize: '0.9rem' }} />
          <SecurityLabel className="veripass-fw-medium">Encrypted end-to-end</SecurityLabel>
        </SecurityBadge>
      </footer>
    </section>
  );
}

export const VeripassTenancyJoinHost = VeripassTenancyJoinHostComponent;
