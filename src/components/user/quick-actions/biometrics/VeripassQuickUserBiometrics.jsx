import React, { useState, useEffect } from 'react';
import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';

import { Spinner } from '@link-loom/react-sdk';

import styled from 'styled-components';
import { Stepper, Step, StepLabel, Button, Chip, ThemeProvider, createTheme } from '@mui/material';
import { AccountCircle, PhotoCamera, Fingerprint, RecordVoiceOver, Create, GppGoodOutlined, Check } from '@mui/icons-material';

import { VeripassQuickUserBiometricsSignature } from '@components/user/quick-actions/biometrics/VeripassQuickUserBiometricsSignature';
import { VeripassQuickUserBiometricsIdDocument } from '@components/user/quick-actions/biometrics/VeripassQuickUserBiometricsIdDocument';
import { VeripassQuickUserBiometricsSelfie } from '@components/user/quick-actions/biometrics/VeripassQuickUserBiometricsSelfie';
import { VeripassQuickUserBiometricsFingerprint } from '@components/user/quick-actions/biometrics/VeripassQuickUserBiometricsFingerprint';
import { VeripassQuickUserBiometricsVoice } from '@components/user/quick-actions/biometrics/VeripassQuickUserBiometricsVoice';

const UserQuickBiometricsContainer = styled.section`
  width: 950px;
`;

const OnboardingContainer = styled.section`
  width: 550px;
`;

const StepLine = styled.section`
  min-height: 65px;
  height: 100%;
  border: 0.1px solid rgba(50, 58, 70, 0.22);
  width: 0px;
`;

const onboardingSteps = [
  {
    icon: <AccountCircle className="my-auto d-flex" />,
    label: 'Verify your ID document',
    description: 'Place your ID document (either side of your National ID or your Passport) in the visible area.',
    comingSoon: false,
  },
  {
    icon: <PhotoCamera className="my-auto d-flex" />,
    label: 'Take a selfie',
    description: 'Position your face within the oval to capture your selfie.',
    comingSoon: false,
  },
  {
    icon: <Fingerprint className="my-auto d-flex" />,
    label: 'Capture fingerprints',
    description: 'Capture a clear photo of your fingerprints for processing.',
    comingSoon: true,
  },
  {
    icon: <RecordVoiceOver className="my-auto d-flex" />,
    label: 'Voice liveness check',
    description: 'You will be asked to perform vocal tasks to verify liveness.',
    comingSoon: true,
  },
  {
    icon: <Create className="my-auto d-flex" />,
    label: 'Digital signature',
    description: 'Sign digitally on the screen to complete your documentation process.',
    comingSoon: true,
  },
];
const steps = [
  { title: 'ID Document' },
  { title: 'Selfie' },
  { title: 'Fingerprints' },
  { title: 'Liveness' },
  { title: 'Signature' },
];
const theme = createTheme({
  components: {
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: '#ccc',
          '&.Mui-completed': {
            color: 'green',
          },
          '&.Mui-active': {
            color: '#1976d2',
          },
        },
      },
    },
  },
});

async function emitEvent({ action, payload, error, eventHandler }) {
  if (eventHandler) {
    eventHandler({ action, namespace: 'veripass', payload, error });
  }
}

export const VeripassQuickUserBiometrics = ({ entity, onEvent, setIsOpen, isPopupContext = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('onboarding');
  const [currentStepIndex, setActiveStep] = React.useState(0);

  const startOnClick = async () => {
    setView('steps');
  };

  const closeOnClick = async () => {
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    if (onEvent) {
      emitEvent({ action: 'quick-user-biometrics::finished', eventHandler: onEvent });
    }
  };

  const handleNext = () => {
    let nextStep = currentStepIndex + 1;
    while (nextStep < onboardingSteps.length && onboardingSteps[nextStep].comingSoon) {
      nextStep++;
    }

    if (nextStep < onboardingSteps.length) {
      setActiveStep(nextStep);
    } else {
      setActiveStep(steps.length);
    }
  };

  const isStepOptional = (stepIndex) => {
    return onboardingSteps[stepIndex].comingSoon;
  };

  const isLastStep = () => {
    return currentStepIndex === steps.length - 1 || onboardingSteps.slice(currentStepIndex + 1).every((step) => step.comingSoon);
  };

  useEffect(() => {
    setIsLoading(false);
    console.log(entity);
  }, [entity]);

  return (
    <VeripassLayout isPopupContext={isPopupContext}>
      {isLoading ? (
        <Spinner />
      ) : (
        <UserQuickBiometricsContainer className="user-quick-biometrics border-1 mx-auto rounded px-3">
          <article
            className={
              isPopupContext ? 'text-left card-body p-0' : 'text-left card-body p-0 border-bottom border-end border-start'
            }
          >
            <header className="position-relative my-4 text-center">
              <h2>Veripass verification</h2>
            </header>

            {view === 'onboarding' && (
              <OnboardingContainer className="d-flex mx-auto">
                <section className="m-2 d-flex flex-column">
                  {onboardingSteps.map((step, index) => (
                    <article key={index} className="d-flex flex-row pb-1">
                      <section className="d-flex flex-column mx-2">
                        {step.icon}

                        {index < onboardingSteps.length - 1 && <StepLine className="mx-auto mt-1" />}
                      </section>
                      <section>
                        <h5 className="my-0">
                          <span className="me-1">{step.label}</span>
                          {step.comingSoon && <Chip label="Coming soon!" color="error" size="small" variant="outlined" />}
                        </h5>
                        <p className="my-0">{step.description}</p>
                      </section>
                    </article>
                  ))}
                </section>
              </OnboardingContainer>
            )}

            {view === 'steps' && (
              <section className="m-2">
                <ThemeProvider theme={theme}>
                  <Stepper activeStep={currentStepIndex}>
                    {steps.map((step) => {
                      return (
                        <Step key={step.title}>
                          <StepLabel>{step.title}</StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                </ThemeProvider>

                {currentStepIndex === steps.length ? (
                  <section className="d-flex flex-column text-center mb-5 mt-4">
                    <section className="border border-1 border-success mx-auto px-1 rounded shadow user-verify my-3 w-50">
                      <section className="d-flex flex-row flex-grow-1">
                        <article className="d-flex mx-2">
                          <GppGoodOutlined className="my-auto d-block mx-2 text-success" sx={{ fontSize: 40 }} />
                        </article>
                        <article className="d-flex flex-column py-2">
                          <header className="d-flex align-items-center justify-content-between my-1">
                            <h4>You're now verified!</h4>
                          </header>
                          <section>
                            <p className="font-11 text-start">
                              Welcome to trusted access with Veripass. This verification ensures a trusted environment for all
                              interactions and enhances their credibility within the community.
                            </p>
                          </section>
                        </article>
                      </section>
                    </section>
                    <footer>
                      <Button onClick={handleFinish} variant="contained" color="success">
                        Exit
                      </Button>
                    </footer>
                  </section>
                ) : (
                  <section>
                    <section>
                      {currentStepIndex === 0 && <VeripassQuickUserBiometricsIdDocument />}
                      {currentStepIndex === 1 && <VeripassQuickUserBiometricsSelfie currentStepIndex={currentStepIndex} />}
                      {currentStepIndex === 2 && <VeripassQuickUserBiometricsFingerprint />}
                      {currentStepIndex === 3 && <VeripassQuickUserBiometricsVoice />}
                      {currentStepIndex === 4 && <VeripassQuickUserBiometricsSignature />}
                    </section>
                    <footer className="d-flex justify-content-between">
                      <Button color="inherit" disabled={currentStepIndex === 0} onClick={handleBack}>
                        Back
                      </Button>
                      <Button onClick={handleNext} disabled={isStepOptional(currentStepIndex)}>
                        {isLastStep() ? 'Finish' : 'Next'}
                      </Button>
                    </footer>
                  </section>
                )}
              </section>
            )}

            {view == 'onboarding' && (
              <section className="d-flex justify-content-center mt-4 pb-3">
                {isPopupContext && (
                  <button title="Submit" type="submit" className="btn btn btn-white btn-action mx-2" onClick={closeOnClick}>
                    <i className="bi bi-check"></i> Close
                  </button>
                )}

                <button title="Start" type="button" className="btn btn-dark waves-effect waves-light mx-2" onClick={startOnClick}>
                  Start
                </button>
              </section>
            )}
          </article>
        </UserQuickBiometricsContainer>
      )}
    </VeripassLayout>
  );
};
