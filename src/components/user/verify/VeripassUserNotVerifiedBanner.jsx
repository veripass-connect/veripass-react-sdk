import React, { useState, useEffect } from 'react';
import { VeripassSimpleLayout } from '@components/shared/layouts/VeripassSimpleLayout';

import { VeripassUserVerifyButton } from '@components/user/verify/VeripassUserVerifyButton';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';

export const VeripassUserNotVerifiedBanner = ({ entity }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [entity]);

  return (
    <VeripassSimpleLayout>
      <section className="border border-1 border-danger mx-auto px-1 rounded shadow user-verify">
        <section className="d-flex flex-row flex-grow-1">
          <article className="d-flex mx-2">
            <GppGoodOutlinedIcon className="my-auto d-block text-danger" sx={{ fontSize: 40 }} />
          </article>
          <article className="d-flex flex-column">
            <header className="d-flex align-items-center justify-content-between my-1">
              <h4>Get verified</h4>
              <VeripassUserVerifyButton
                className="btn my-auto me-2 text-danger"
                isVerified={entity?.is_verified}
                onVerifyClick={() => {}}
              />
            </header>
            <section>
              <p className="font-11 text-start">
                Verifying this user's identity with Veripass will build trust and open up more opportunities. It secures their
                interactions and enhances their profile.
              </p>
            </section>
          </article>
        </section>
      </section>
    </VeripassSimpleLayout>
  );
};
