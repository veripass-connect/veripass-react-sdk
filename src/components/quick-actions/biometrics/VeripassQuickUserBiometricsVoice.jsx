import React, { useState, useEffect } from 'react';
import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';

import { Spinner } from '@link-loom/react-sdk';

export const VeripassQuickUserBiometricsVoice = ({ entity, onUpdatedEntity, setIsOpen, isPopupContext = false }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [entity]);

  return (
    <VeripassLayout $isPopup={isPopupContext}>
      <section className="card-body p-0"></section>
    </VeripassLayout>
  );
};
