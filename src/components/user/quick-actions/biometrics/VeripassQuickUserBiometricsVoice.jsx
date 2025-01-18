import React, { useState, useEffect } from 'react';
import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';

async function emitEvent({ action, payload, error, eventHandler }) {
  if (eventHandler) {
    eventHandler({ action, namespace: 'veripass', payload, error });
  }
}

export const VeripassQuickUserBiometricsVoice = ({ entity, onEvent, setIsOpen, isPopupContext = false }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [entity]);

  return (
    <VeripassLayout isPopupContext={isPopupContext}>
      <section className="card-body p-0"></section>
    </VeripassLayout>
  );
};
