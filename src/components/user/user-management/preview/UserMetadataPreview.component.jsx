import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@link-loom/react-sdk';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';

import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const UserMetadataPreview = ({ entity, setIsOpen, isPopupContext }) => {
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
    console.log('UserMetadataPreview component mounted');

    return () => {
      console.log('UserMetadataPreview component unmounted');
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
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Public Metadata</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Shared information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Review metadata that is publicly available and can be shared with others. Ensure it accurately
                represents the necessary details.
              </Typography>
              <pre
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '10px',
                  borderRadius: '4px',
                  marginTop: '10px',
                  overflowX: 'auto',
                }}
              >
                {JSON.stringify(entity?.public_metadata || {}, null, 2)}
              </pre>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Private Metadata</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Confidential information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                View metadata that is privately stored and accessible only to you or authorized personnel. Keep
                this information secure and accurate.
              </Typography>
              <pre
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '10px',
                  borderRadius: '4px',
                  marginTop: '10px',
                  overflowX: 'auto',
                }}
              >
                {JSON.stringify(entity?.private_metadata || {}, null, 2)}
              </pre>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Unsafe Metadata</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Sensitive data</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Examine metadata that may pose security risks if improperly handled. Ensure it is managed with the
                highest level of caution.
              </Typography>
              <pre
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '10px',
                  borderRadius: '4px',
                  marginTop: '10px',
                  overflowX: 'auto',
                }}
              >
                {JSON.stringify(entity?.unsafe_metadata || {}, null, 2)}
              </pre>
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

export default UserMetadataPreview;
