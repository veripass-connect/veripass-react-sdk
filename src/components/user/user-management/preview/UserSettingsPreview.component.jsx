import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@link-loom/react-sdk';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';

import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const UserSettingsPreview = ({ entity, setIsOpen, isPopupContext }) => {
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

  const languageMap = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
  };

  const closeOnClick = async () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setIsLoading(false);
    console.log(entity);
  }, [entity]);

  useEffect(() => {
    console.log('UserSettingsPreview component mounted');

    return () => {
      console.log('UserSettingsPreview component unmounted');
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
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Notification preferences</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Alerts and updates</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Review and manage your notification settings to control how and when you receive alerts and updates
                about your account.
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
                {JSON.stringify(entity?.notification_preferences || {}, null, 2)}
              </pre>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Marketing Preferences</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Promotional content</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Manage your preferences for receiving marketing communications. Choose the type and frequency of
                promotional content that suits you.
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
                {JSON.stringify(entity?.marketing_preferences || {}, null, 2)}
              </pre>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Personal Data Preferences</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Data usage control</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Review and adjust your personal data preferences to control how your information is used and shared
                within the platform.
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
                {JSON.stringify(entity?.personal_data_preferences || {}, null, 2)}
              </pre>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Language Preference</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Language selection</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Set your preferred language for the interface and communications to ensure a comfortable user
                experience in your chosen language.
              </Typography>
              <Typography variant="body2" sx={{ marginTop: '10px', fontWeight: 'bold' }}>
                Current Language:{' '}
                {languageMap[entity?.language_preference] || entity?.language_preference || 'Not set'}
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

export default UserSettingsPreview;
