import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';

import { KeyValueRow } from '@components/shared/entity-detail-shell/EntityDetailShell.component';

const initialState = {
  primary_national_id: {
    type: '',
    identification: '',
    issuing_country: {
      iso_code: '',
      country_name: '',
    },
  },
  primary_email_address: '',
  display_name: '',
  primary_phone_number: {
    country: {
      iso_code: '',
      dial_code: '',
      name: '',
    },
    international_phone_number: '',
    phone_number: '',
  },
  first_name: '',
  last_name: '',
};

export const VeripassUserQuickStandardPreview = ({
  ui = { showHeader: false },
  entity,
  setIsOpen,
  isPopupContext = false,
  showCloseButton = true,
}) => {
  // Models
  const [userProfileData, setUserProfileData] = useState(initialState);
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    if (entity) {
      const data = entity.profile || entity;

      setUserProfileData((prev) => ({
        ...prev,
        ...data,
        primary_national_id: data.primary_national_id || prev.primary_national_id,
        primary_phone_number: data.primary_phone_number || prev.primary_phone_number,
      }));
    }
  }, [entity]);

  useEffect(() => {
    if (ui?.showHeader !== undefined || ui?.showHeader !== null) {
      setShowHeader(ui?.showHeader);
    }
  }, [ui]);

  const nationalId = userProfileData?.primary_national_id?.identification
    ? `${userProfileData.primary_national_id.identification} (${userProfileData.primary_national_id.type || 'Passport'})`
    : '';
  const phoneNumber =
    userProfileData?.primary_phone_number?.international_phone_number ||
    userProfileData?.primary_phone_number?.phone_number ||
    '';

  const fields = [
    { label: 'Display name', value: userProfileData.display_name },
    { label: 'First name', value: userProfileData.first_name },
    { label: 'Last name', value: userProfileData.last_name },
    { label: 'Primary email address', value: userProfileData.primary_email_address },
    { label: 'Phone number', value: phoneNumber },
    { label: 'National identification number', value: nationalId, mono: true },
  ];

  return (
    <section>
      {showHeader && (
        <header className="mb-3">
          <h4 className="header-title">{ui?.title || 'User Preview'}</h4>
          <p className="sub-header">{ui?.subtitle || 'Information about the user.'}</p>
        </header>
      )}

      <div className="row g-3">
        {fields.map((field) => (
          <div key={field.label} className="col-12 col-md-6">
            <KeyValueRow label={field.label} value={field.value} mono={field.mono} />
          </div>
        ))}
      </div>

      {isPopupContext && showCloseButton && (
        <section className="d-flex justify-content-end mt-4 pb-1">
          <Button
            type="button"
            variant="contained"
            onClick={() => setIsOpen && setIsOpen(false)}
            sx={{
              backgroundColor: '#323a46',
              borderColor: '#323a46',
              '&:hover': { backgroundColor: '#404651', borderColor: '#404651' },
            }}
          >
            Close
          </Button>
        </section>
      )}
    </section>
  );
};
