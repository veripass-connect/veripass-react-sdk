import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, Button, FormHelperText } from '@mui/material';
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Badge as BadgeIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { NationalIdentificationSelector, PhoneCountrySelector } from '@link-loom/react-sdk';
import { THEME_COLORS } from '@constants/theme';
import { VeripassOrganizationSectionHeader } from '../primitives/VeripassOrganizationSectionHeader.component';
import { VeripassOrganizationMetadataItem } from '../primitives/VeripassOrganizationMetadataItem.component';
import { SectionCard, NAMESPACE, ACTIONS } from '../VeripassOrganizationCorporateIdentity.styles';

import '@styles/fonts.css';
import '@styles/styles.css';

const SECTION_KEY = 'official-identity';

const initialFormState = {
  display_name: '',
  primary_national_id: { type: '', identification: '', issuing_country: { iso_code: '', country_name: '' } },
  primary_email_address: '',
  primary_phone_number: { country: { iso_code: '', dial_code: '', name: '' }, international_phone_number: '', phone_number: '' },
  primary_address: { formatted_address: '', raw_address: '' },
  website_url: '',
  description: '',
};

export const VeripassOrganizationOfficialIdentity = ({
  ui = {
    showShell: false,
    showLogo: false,
    inputSize: 'small',
    theme: { brandPrimary: THEME_COLORS.brandPrimary, brandPrimaryForeground: '#ffffff' },
  },
  organization = {},
  mode = 'viewer',
  editingSection = null,
  itemOnAction = () => {},
  updateOnAction = () => {},
  environment = 'production',
  apiKey = '',
  ...props
}) => {
  // Models
  const profile = organization?.organization_profile || organization?.profile || {};
  const information = organization?.organization_information || organization?.information || {};
  const isEditing = editingSection === SECTION_KEY;
  const isEditable = mode === 'admin';
  const editDisabled = editingSection !== null && editingSection !== SECTION_KEY;

  // UI States
  const [formData, setFormData] = useState(initialFormState);
  const [isSaving, setIsSaving] = useState(false);

  // Configs
  const phone = profile?.primary_phone_number;
  const formattedPhone =
    phone?.country?.dial_code && phone?.phone_number
      ? `+${phone.country.dial_code} ${phone.phone_number}`
      : phone?.international_phone_number || '';

  const nationalId = profile?.primary_national_id;
  const docType = nationalId?.type || nationalId?.document_type || '';
  const formattedNationalId = nationalId?.identification
    ? `${docType ? docType + ' ' : ''}${nationalId.identification}`
    : '';
  const issuingCountry = nationalId?.issuing_country?.country_name || nationalId?.country?.name || '';

  // Functions
  const handleEditStart = () => {
    itemOnAction({ action: ACTIONS.SECTION_EDIT_START, namespace: NAMESPACE, payload: { sectionKey: SECTION_KEY } });
  };

  const handleEditCancel = () => {
    itemOnAction({ action: ACTIONS.SECTION_EDIT_CANCEL, namespace: NAMESPACE, payload: { sectionKey: SECTION_KEY } });
  };

  const handleSave = () => {
    setIsSaving(true);
    itemOnAction({ action: ACTIONS.SECTION_SAVE, namespace: NAMESPACE, payload: { sectionKey: SECTION_KEY, data: formData } });
  };

  const handleFieldChange = (path, value) => {
    setFormData((prev) => {
      const next = { ...prev };
      path.split('.').reduce((obj, key, idx, arr) => {
        if (idx === arr.length - 1) obj[key] = value;
        else obj[key] = { ...obj[key] };
        return obj[key];
      }, next);
      return next;
    });
    updateOnAction({ action: ACTIONS.IDENTITY_FORM_UPDATED, namespace: NAMESPACE, payload: { path, value } });
  };

  const handleCopyMetadata = (field, value) => {
    itemOnAction({ action: ACTIONS.METADATA_COPY, namespace: NAMESPACE, payload: { field, value } });
  };

  // Lifecycle
  useEffect(() => {
    if (isEditing && profile) {
      setFormData({
        display_name: profile.display_name || '',
        primary_national_id: profile.primary_national_id || initialFormState.primary_national_id,
        primary_email_address: profile.primary_email_address || '',
        primary_phone_number: profile.primary_phone_number || initialFormState.primary_phone_number,
        primary_address: profile.primary_address || initialFormState.primary_address,
        website_url: information?.website_url || '',
        description: information?.description || '',
      });
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) setIsSaving(false);
  }, [isEditing]);


  // Render
  return (
    <>
      <SectionCard $showShell={ui?.showShell} {...props}>
        <VeripassOrganizationSectionHeader
          title="Official Identity"
          icon={<BadgeIcon sx={{ fontSize: 20 }} />}
          isEditable={isEditable}
          isEditing={isEditing}
          editDisabled={editDisabled}
          onEditClick={handleEditStart}
          onCancelClick={handleEditCancel}
        />

        {!isEditing && (
          <div className="row">
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 overflow-hidden">
              <VeripassOrganizationMetadataItem label="Tax ID (NIT)" value={formattedNationalId} copyable onCopy={(v) => handleCopyMetadata('national_id', v)} />
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 overflow-hidden">
              <VeripassOrganizationMetadataItem label="Jurisdiction" value={issuingCountry} />
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 overflow-hidden">
              <VeripassOrganizationMetadataItem label="Contact Email" value={profile.primary_email_address} copyable onCopy={(v) => handleCopyMetadata('email', v)} />
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 overflow-hidden">
              <VeripassOrganizationMetadataItem label="Phone Number" value={formattedPhone} />
            </div>
            <div className="col-12 overflow-hidden">
              <VeripassOrganizationMetadataItem label="Registered Address" value={profile.primary_address?.formatted_address} />
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 overflow-hidden">
              <VeripassOrganizationMetadataItem label="Website" value={information?.website_url} />
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 overflow-hidden">
              <VeripassOrganizationMetadataItem label="Description" value={information?.description} />
            </div>
          </div>
        )}

        {isEditing && (
          <div className="d-flex flex-column gap-3">
            <TextField fullWidth label="Display Name" placeholder="Organization name" value={formData.display_name} onChange={(e) => handleFieldChange('display_name', e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><BusinessIcon color="action" /></InputAdornment> } }} size={ui?.inputSize} />
            <TextField fullWidth label="Official Email" type="email" placeholder="contact@organization.com" value={formData.primary_email_address} onChange={(e) => handleFieldChange('primary_email_address', e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment> } }} size={ui?.inputSize} />
            <div>
              <NationalIdentificationSelector
                label="National identification number"
                value={formData.primary_national_id}
                defaultDocumentType={formData.primary_national_id?.type || formData.primary_national_id?.document_type || 'NIT'}
                onChange={(event) => handleFieldChange('primary_national_id', event)}
                ui={{ ...ui, documentType: true }}
              />
              <FormHelperText>Primary legal national identification document.</FormHelperText>
            </div>
            <PhoneCountrySelector
              label="Phone number"
              value={formData.primary_phone_number}
              onPhoneChange={(event) => handleFieldChange('primary_phone_number', event)}
              ui={ui}
            />
            <TextField fullWidth label="Headquarters Address" placeholder="Diagonal 22B No. 52-01" value={formData.primary_address?.formatted_address || ''} onChange={(e) => handleFieldChange('primary_address.formatted_address', e.target.value)} multiline rows={2} slotProps={{ input: { startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: '12px' }}><LocationOnIcon color="action" /></InputAdornment> } }} size={ui?.inputSize} />
            <TextField fullWidth label="Website URL" placeholder="https://www.organization.com" value={formData.website_url} onChange={(e) => handleFieldChange('website_url', e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><LanguageIcon color="action" /></InputAdornment> } }} size={ui?.inputSize} />
            <TextField fullWidth label="Organization Description" placeholder="Brief description of the organization" value={formData.description} onChange={(e) => handleFieldChange('description', e.target.value)} multiline rows={3} size={ui?.inputSize} />
            <div className="d-flex justify-content-end gap-2 pt-2">
              <Button variant="text" onClick={handleEditCancel} sx={{ textTransform: 'none', color: THEME_COLORS.textSecondary }}>Cancel</Button>
              <Button variant="contained" onClick={handleSave} disabled={isSaving} sx={{ textTransform: 'none', backgroundColor: ui?.theme?.brandPrimary || THEME_COLORS.brandPrimary, fontWeight: 600, '&:hover': { backgroundColor: THEME_COLORS.brandPrimaryDark } }}>
                {isSaving ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </div>
        )}
      </SectionCard>
    </>
  );
};
