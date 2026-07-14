import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@link-loom/react-sdk';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';

import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const UserBiometricsPreview = ({ entity, setIsOpen, isPopupContext }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const confirmOnClick = async () => {
    setIsOpen(false);
    navigate(`/client/users/management/${entity?.id}`);
  };

  const closeOnClick = async () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setIsLoading(false);
    console.log(entity);
  }, [entity]);

  useEffect(() => {
    console.log('UserBiometricsPreview component mounted');

    return () => {
      console.log('UserBiometricsPreview component unmounted');
    };
  }, []);

  return (
    <section className="card-body p-0">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>ID Document</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Identification details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Review your ID document information to ensure it accurately reflects your current identification
                status.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Selfie</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Live and personal photo</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Check your uploaded selfie, which is used for visual identity verification purposes. Ensure it's
                clear and up-to-date.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Fingerprints</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Biometric data</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                View your fingerprint records. This biometric data is crucial for secure access and authentication.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Voice liveness</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Voice verification</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Review your voice liveness data, which helps to confirm your identity during secure transactions or
                access.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel5bh-content"
              id="panel5bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Digital signature</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Authentication signature</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                View your digital signature, used for signing documents and verifying your identity in digital
                environments.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </>
      )}
      {isPopupContext && (
        <section className="d-flex justify-content-center mt-4 pb-3">
          <button
            title="Submit"
            type="submit"
            className="btn btn btn-white btn-action mx-2"
            onClick={closeOnClick}
          >
            <i className="bi bi-check"></i> Close
          </button>
          <button
            title="Edit user"
            type="submit"
            className="btn btn-soft-success btn-action mx-2"
            onClick={confirmOnClick}
          >
            <i className="bi bi-check"></i> Edit user
          </button>
        </section>
      )}
    </section>
  );
};

export default UserBiometricsPreview;
