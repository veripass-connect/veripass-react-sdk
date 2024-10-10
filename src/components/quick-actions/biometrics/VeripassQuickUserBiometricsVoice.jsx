import React, { useState, useEffect } from 'react';

import { Spinner } from '@link-loom/react-sdk';

export const VeripassQuickUserBiometricsVoice = ({ entity, onUpdatedEntity, setIsOpen, isPopupContext }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [entity]);

  return <section className="card-body p-0"></section>;
};
