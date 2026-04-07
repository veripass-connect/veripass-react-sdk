import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { IconButton, Tooltip, TextField, Button } from '@mui/material';
import { EditOutlined as EditOutlinedIcon, Close as CloseIcon } from '@mui/icons-material';
import { THEME_COLORS } from '@constants/theme';
import { VeripassOrganizationMonogram } from '../primitives/VeripassOrganizationMonogram.component';
import { SectionCard, NAMESPACE, ACTIONS } from '../VeripassOrganizationCorporateIdentity.styles';

import '@styles/fonts.css';
import '@styles/styles.css';

const ColorInput = styled.input.attrs({ type: 'color' })`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  padding: 0;
  outline: none;
  appearance: none;
  -webkit-appearance: none;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 8px;
  }

  &::-moz-color-swatch {
    border: none;
    border-radius: 8px;
  }
`;

const SECTION_KEY = 'branding';

export const VeripassOrganizationBranding = ({
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
  const displayName = profile?.display_name || '';
  const logoUrl = profile?.logo_url || profile?.profile_ui_settings?.profile_picture_url || '';
  const coverUrl = profile?.profile_ui_settings?.cover_picture_url || '';
  const brandColors = profile?.profile_ui_settings?.brand_colors || {};
  const brandPrimary = ui?.theme?.brandPrimary || THEME_COLORS.brandPrimary;
  const isEditing = editingSection === SECTION_KEY;
  const editDisabled = editingSection !== null && editingSection !== SECTION_KEY;

  // UI States
  const [formData, setFormData] = useState({ logo_url: '', cover_picture_url: '', brand_colors: { primary: '', accent: '', surface: '' } });
  const [isSaving, setIsSaving] = useState(false);

  // Configs
  const paletteColors = brandColors?.primary
    ? [
        { label: 'Primary', color: brandColors.primary },
        { label: 'Accent', color: brandColors.accent || THEME_COLORS.success },
        { label: 'Surface', color: brandColors.surface || THEME_COLORS.surfaceSecondary },
      ]
    : [
        { label: 'Deep Purple', color: brandPrimary },
        { label: 'Muted Teal', color: THEME_COLORS.success },
        { label: 'Light Gray', color: THEME_COLORS.surfaceSecondary },
      ];

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

  // Lifecycle
  useEffect(() => {
    if (isEditing) {
      setFormData({
        logo_url: logoUrl || '',
        cover_picture_url: coverUrl || '',
        brand_colors: {
          primary: brandColors?.primary || brandPrimary,
          accent: brandColors?.accent || THEME_COLORS.success,
          surface: brandColors?.surface || THEME_COLORS.surfaceSecondary,
        },
      });
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) setIsSaving(false);
  }, [isEditing]);

  return (
    <>
      <SectionCard $showShell={ui?.showShell} {...props}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-bold mb-0" style={{ color: THEME_COLORS.textPrimary }}>Institutional Branding</h5>
          <div className="d-flex align-items-center gap-2">
            {isEditing && (
              <>
                <span className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill fw-semibold" style={{ fontSize: '0.65rem', backgroundColor: THEME_COLORS.verifiedBg, color: THEME_COLORS.successDark, border: `1px solid ${THEME_COLORS.success}40` }}>
                  <EditOutlinedIcon sx={{ fontSize: 11 }} /> Editing Mode
                </span>
                <Tooltip title="Cancel editing" arrow>
                  <IconButton size="small" onClick={handleEditCancel} sx={{ color: THEME_COLORS.textSecondary }}>
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {mode === 'admin' && !isEditing && (
              <Tooltip title={editDisabled ? 'Save or cancel current edits first' : 'Edit branding'} arrow>
                <span>
                  <IconButton size="small" disabled={editDisabled} onClick={handleEditStart} sx={{ color: THEME_COLORS.textSecondary, opacity: editDisabled ? 0.4 : 1 }}>
                    <EditOutlinedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="row">
            <div className="col-12 col-sm-4 col-md-4 mb-3 mb-sm-0">
              <div className="h-100 p-3 bg-light" style={{ borderRadius: 20 }}>
                <small className="text-uppercase text-muted fw-semibold d-block mb-3" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Official Palette</small>
                <div className="d-flex gap-3 flex-wrap">
                  {paletteColors.map((swatch) => (
                    <div key={swatch.label} className="d-flex flex-column align-items-center gap-1">
                      <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: swatch.color }} />
                      <small className="text-muted text-center" style={{ fontSize: '0.6rem' }}>{swatch.label}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-8 col-md-8">
              <div className="h-100 p-3 bg-light" style={{ borderRadius: 20 }}>
                <div className="row">
                  <div className="col-12 col-sm-7 col-md-7 mb-3 mb-sm-0">
                    <small className="text-uppercase text-muted fw-semibold d-block mb-2" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Primary Logo</small>
                    <div className="d-flex align-items-center justify-content-center p-3 bg-white" style={{ borderRadius: 16, minHeight: 90 }}>
                      {logoUrl ? (
                        <img src={logoUrl} alt={displayName} style={{ maxHeight: 60, maxWidth: '100%', objectFit: 'contain' }} />
                      ) : (
                        <div className="d-flex align-items-center gap-2">
                          <VeripassOrganizationMonogram name={displayName} size={48} backgroundColor={brandPrimary} fontSize="1.2rem" />
                          <strong style={{ fontSize: '0.75rem', color: THEME_COLORS.textPrimary, lineHeight: 1.2 }}>{displayName?.toUpperCase() || 'ORGANIZATION'}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-sm-5 col-md-5">
                    <small className="text-uppercase text-muted fw-semibold d-block mb-2" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Cover Style</small>
                    <div className="bg-white" style={{ height: 90, borderRadius: 16, background: coverUrl ? `url(${coverUrl}) center/cover no-repeat` : undefined, backgroundColor: coverUrl ? undefined : '#ffffff' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="d-flex flex-column gap-3">
            <div className="row g-3">
              <div className="col-12 col-lg-6">
                <TextField fullWidth label="Logo URL" placeholder="https://example.com/logo.png" value={formData.logo_url} onChange={(e) => setFormData((prev) => ({ ...prev, logo_url: e.target.value }))} size={ui?.inputSize} />
              </div>
              <div className="col-12 col-lg-6">
                <TextField fullWidth label="Cover Image URL" placeholder="https://example.com/cover.png" value={formData.cover_picture_url} onChange={(e) => setFormData((prev) => ({ ...prev, cover_picture_url: e.target.value }))} size={ui?.inputSize} />
              </div>
            </div>
            <div className="row g-3">
              <div className="col-12 col-lg-4">
                <div className="d-flex align-items-center gap-2">
                  <ColorInput value={formData.brand_colors.primary} onChange={(e) => setFormData((prev) => ({ ...prev, brand_colors: { ...prev.brand_colors, primary: e.target.value } }))} />
                  <div>
                    <small className="text-muted d-block" style={{ fontSize: '0.65rem' }}>Primary</small>
                    <small className="fw-semibold" style={{ fontSize: '0.75rem' }}>{formData.brand_colors.primary}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="d-flex align-items-center gap-2">
                  <ColorInput value={formData.brand_colors.accent} onChange={(e) => setFormData((prev) => ({ ...prev, brand_colors: { ...prev.brand_colors, accent: e.target.value } }))} />
                  <div>
                    <small className="text-muted d-block" style={{ fontSize: '0.65rem' }}>Accent</small>
                    <small className="fw-semibold" style={{ fontSize: '0.75rem' }}>{formData.brand_colors.accent}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="d-flex align-items-center gap-2">
                  <ColorInput value={formData.brand_colors.surface} onChange={(e) => setFormData((prev) => ({ ...prev, brand_colors: { ...prev.brand_colors, surface: e.target.value } }))} />
                  <div>
                    <small className="text-muted d-block" style={{ fontSize: '0.65rem' }}>Surface</small>
                    <small className="fw-semibold" style={{ fontSize: '0.75rem' }}>{formData.brand_colors.surface}</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 pt-2">
              <Button variant="text" onClick={handleEditCancel} sx={{ textTransform: 'none', color: THEME_COLORS.textSecondary }}>Cancel</Button>
              <Button variant="contained" onClick={handleSave} disabled={isSaving} sx={{ textTransform: 'none', backgroundColor: THEME_COLORS.brandPrimary, fontWeight: 600, '&:hover': { backgroundColor: THEME_COLORS.brandPrimaryDark } }}>
                {isSaving ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </div>
        )}
      </SectionCard>
    </>
  );
};
