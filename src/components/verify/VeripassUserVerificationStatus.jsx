import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Spinner } from '@link-loom/react-sdk';
import { VeripassUserVerifiedBanner } from '@components/verify/VeripassUserVerifiedBanner';
import { VeripassUserNotVerifiedBanner } from '@components/verify/VeripassUserNotVerifiedBanner';

export const VeripassUserVerificationStatus = ({ entity, onUpdatedEntity, setIsOpen, isPopupContext }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [entity]);

  return (
    <section className="card-body p-0">
      {isLoading ? (
        <Spinner />
      ) : entity?.is_verified ? (
        <VeripassUserVerifiedBanner entity={entity}/>
      ) : (
        <VeripassUserNotVerifiedBanner entity={entity}/>
      )}
    </section>
  );
};
