import React, { useState } from 'react';
import { VeripassSimpleLayout } from '@components/shared/layouts/VeripassSimpleLayout';

import { PopUp } from '@link-loom/react-sdk';

import { Chip } from '@mui/material';

import { VeripassQuickUserBiometrics } from '@components/quick-actions/biometrics/VeripassQuickUserBiometrics';

async function emitEvent({ action, payload, error, eventHandler }) {
  if (eventHandler) {
    eventHandler({ action, namespace: 'veripass', payload, error });
  }
}

export const VeripassUserVerifyButton = ({ entity, style, isVerified, verifiedLabel, notVerifiedLabel, className }) => {
  const [isOpenUserQuickBiometricsModal, setIsOpenUserQuickBiometricsModal] = useState(false);

  const onVerifyClick = () => {
    setIsOpenUserQuickBiometricsModal(true);
  };

  const onEvent = ({ action, payload, error, eventHandler }) => {
    emitEvent({ action, payload, error, eventHandler });

    if (action === 'quick-user-biometrics::finished') {
      setIsOpenUserQuickBiometricsModal(false);
    }
  };

  return (
    <VeripassSimpleLayout>
      {style === 'chip' ? (
        <Chip
          label={isVerified ? verifiedLabel ?? 'Verified' : notVerifiedLabel ?? 'Verify'}
          color={isVerified ? 'success' : 'warning'}
          variant="outlined"
          className={className}
          onClick={onVerifyClick}
        />
      ) : isVerified ? (
        <span href="#" className={className}>
          {notVerifiedLabel ?? 'Verified'}
        </span>
      ) : (
        <button className={className} onClick={onVerifyClick}>
          {notVerifiedLabel ?? 'Verify now'}
        </button>
      )}

      <PopUp
        data-testid="user-quick-biometrics-modal"
        id="user-quick-biometrics-modal"
        isOpen={isOpenUserQuickBiometricsModal}
        setIsOpen={setIsOpenUserQuickBiometricsModal}
        className="col-lg-4 col-md-8 col-12"
        styles={{
          closeButtonColor: 'text-black-50',
        }}
      >
        <VeripassQuickUserBiometrics
          onEvent={onEvent}
          entity={entity}
          setIsOpen={setIsOpenUserQuickBiometricsModal}
          isPopupContext
        />
      </PopUp>
    </VeripassSimpleLayout>
  );
};
