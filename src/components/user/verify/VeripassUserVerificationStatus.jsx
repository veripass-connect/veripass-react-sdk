import React, { useState, useEffect } from 'react';
import { VeripassSimpleLayout } from '@components/shared/layouts/VeripassSimpleLayout';

import { Spinner, useNavigate } from '@link-loom/react-sdk';
import { VeripassUserVerifiedBanner } from '@components/user/verify/VeripassUserVerifiedBanner';
import { VeripassUserNotVerifiedBanner } from '@components/user/verify/VeripassUserNotVerifiedBanner';

export const VeripassUserVerificationStatus = ({ entity }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [entity]);

  return (
    <VeripassSimpleLayout>
      <section className="card-body p-0">
        {isLoading ? (
          <Spinner />
        ) : entity?.is_verified ? (
          <VeripassUserVerifiedBanner entity={entity} />
        ) : (
          <VeripassUserNotVerifiedBanner entity={entity} />
        )}
      </section>
    </VeripassSimpleLayout>
  );
};
