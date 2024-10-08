import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Spinner } from '@link-loom/react-sdk';
import { UserVerifiedBanner } from '@components/verify/UserVerifiedBanner';
import { UserNotVerifiedBanner } from '@components/verify/UserNotVerifiedBanner';

const UserVerificationStatus = ({ entity, onUpdatedEntity, setIsOpen, isPopupContext }) => {
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
        <UserVerifiedBanner entity={entity}/>
      ) : (
        <UserNotVerifiedBanner entity={entity}/>
      )}
    </section>
  );
};

export default UserVerificationStatus;
