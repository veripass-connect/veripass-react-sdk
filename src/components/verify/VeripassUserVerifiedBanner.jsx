import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';

export const VeripassUserVerifiedBanner = ({ entity }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [entity]);

  return (
    <section className="border border-1 border-success mx-auto px-1 rounded shadow user-verify">
      <section className="d-flex flex-row flex-grow-1">
        <article className="d-flex mx-2">
          <GppGoodOutlinedIcon className="my-auto d-block mx-2 text-success" sx={{ fontSize: 40 }} />
        </article>
        <article className="d-flex flex-column">
          <header className="d-flex align-items-center justify-content-between my-1">
            <h4>Verified</h4>
            <a href="#" className="my-auto me-2 text-success">
              Explore more
            </a>
          </header>
          <section>
            <p className="font-11 text-start">
              This user's identity is verified with Veripass. This verification ensures a trusted environment for all interactions
              and enhances their credibility within the community.
            </p>
          </section>
        </article>
      </section>
    </section>
  );
};
