import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Avatar, Tooltip, IconButton, TextField, InputAdornment, Button } from '@mui/material';
import { ContentCopy as ContentCopyIcon, Check as CheckIcon, EditOutlined as EditOutlinedIcon, Business as BusinessIcon, Language as LanguageIcon } from '@mui/icons-material';
import { VeripassOrganizationMonogram } from '../primitives/VeripassOrganizationMonogram.component';
import { VeripassOrganizationStatusBadge } from '../primitives/VeripassOrganizationStatusBadge.component';
import { SectionCard, NAMESPACE, ACTIONS } from '../VeripassOrganizationCorporateIdentity.styles';
import { THEME_COLORS } from '@constants/theme';

import '@styles/fonts.css';
import '@styles/styles.css';

const SECTION_KEY = 'hero';

const CoverBand = styled.div.attrs({ className: 'bg-light' })`
  height: 120px;
  ${(props) => props.$coverUrl ? `background: url(${props.$coverUrl}) center/cover no-repeat !important;` : ''}

  @media (max-width: 575px) {
    height: 80px;
  }
`;

const AvatarPosition = styled.div`
  margin-top: -44px;
  margin-left: 24px;
  position: relative;
  z-index: 2;

  @media (max-width: 575px) {
    margin-top: -32px;
    margin-left: 16px;
  }
`;

export const VeripassOrganizationIdentityHero = ({
  ui = {
    showShell: false,
    showLogo: false,
    profilePhoto: { height: '80' },
    inputSize: 'small',
    theme: { brandPrimary: THEME_COLORS.brandPrimary, brandPrimaryForeground: '#ffffff' },
  },
  organization = {},
  mode = 'viewer',
  editingSection = null,
  itemOnAction = () => {},
  updateOnAction = () => {},
  ...props
}) => {
  // Models
  const profile = organization?.organization_profile || organization?.profile || {};
  const isVerified = profile?.is_verified === true;
  const displayName = profile?.display_name || '';
  const logoUrl = profile?.logo_url || profile?.profile_ui_settings?.profile_picture_url || '';
  const coverUrl = profile?.profile_ui_settings?.cover_picture_url || '';
  const slug = profile?.slug || '';
  const universalId = organization?.identity || '';
  const avatarSize = parseInt(ui?.profilePhoto?.height || '80', 10);
  const brandPrimary = ui?.theme?.brandPrimary || THEME_COLORS.brandPrimary;
  const isEditing = editingSection === SECTION_KEY;
  const editDisabled = editingSection !== null && editingSection !== SECTION_KEY;

  // UI States
  const [copiedField, setCopiedField] = useState(null);
  const [formData, setFormData] = useState({ display_name: '', slug: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Configs
  const publicUrl = slug ? `https://me.veripass.com.co/${slug}` : '';

  // Functions
  const handleCopy = (field, value) => {
    if (!value) return;
    try { navigator.clipboard.writeText(value); } catch (e) { /* silent */ }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    itemOnAction({ action: ACTIONS.METADATA_COPY, namespace: NAMESPACE, payload: { field, value } });
  };

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
      setFormData({ display_name: displayName, slug });
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) setIsSaving(false);
  }, [isEditing]);

  return (
    <SectionCard $showShell={ui?.showShell} {...props}>
      <CoverBand $coverUrl={coverUrl} />

      <AvatarPosition>
        {logoUrl ? (
          <Avatar src={logoUrl} variant="rounded" alt={displayName} sx={{ width: avatarSize, height: avatarSize, bgcolor: '#fff', border: '3px solid #fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
        ) : (
          <VeripassOrganizationMonogram name={displayName} size={avatarSize} backgroundColor={brandPrimary} style={{ border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
        )}
      </AvatarPosition>

      {!isEditing && (
        <>
          <div className="d-flex flex-wrap align-items-start justify-content-between px-3 pt-3 gap-2">
            <div className="overflow-hidden" style={{ minWidth: 0, flex: 1 }}>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h4 className="fw-bold mb-0 text-truncate" style={{ color: THEME_COLORS.textPrimary }}>
                  {displayName || 'Unnamed Organization'}
                </h4>
                {isVerified ? <VeripassOrganizationStatusBadge status="verified" /> : <VeripassOrganizationStatusBadge status="pending" />}
                {mode === 'admin' && (
                  <Tooltip title={editDisabled ? 'Save or cancel current edits first' : 'Edit profile'} arrow>
                    <span>
                      <IconButton size="small" onClick={handleEditStart} disabled={editDisabled} sx={{ color: THEME_COLORS.textSecondary, opacity: editDisabled ? 0.4 : 1 }}>
                        <EditOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </div>
              <small className="text-muted">Official organization profile</small>
            </div>
            {universalId && (
              <div className="flex-shrink-0">
                <small className="text-uppercase text-muted fw-semibold d-block mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}>Organization ID</small>
                <span className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-2" style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: THEME_COLORS.textPrimary, backgroundColor: THEME_COLORS.surfaceLight, border: `1px solid ${THEME_COLORS.border}` }}>
                  {universalId}
                  <Tooltip title={copiedField === 'identity' ? 'Copied!' : 'Copy'} arrow>
                    <IconButton size="small" onClick={() => handleCopy('identity', universalId)} sx={{ padding: '2px', color: copiedField === 'identity' ? THEME_COLORS.success : THEME_COLORS.textMuted }}>
                      {copiedField === 'identity' ? <CheckIcon sx={{ fontSize: 12 }} /> : <ContentCopyIcon sx={{ fontSize: 12 }} />}
                    </IconButton>
                  </Tooltip>
                </span>
              </div>
            )}
          </div>
          <hr className="mx-3 my-2" style={{ borderColor: THEME_COLORS.borderLight }} />
          <div className="row px-3 pb-3 g-2">
            <div className="col-12 col-sm-7 col-md-7 overflow-hidden">
              <small className="text-uppercase text-muted fw-semibold d-block mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}>Access URL</small>
              {publicUrl ? (
                <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="d-block text-truncate fw-medium text-decoration-none" style={{ fontSize: '0.85rem', color: THEME_COLORS.textPrimary }}>{publicUrl}</a>
              ) : (
                <span className="text-muted fst-italic" style={{ fontSize: '0.85rem' }}>Not published yet</span>
              )}
            </div>
            <div className="col-12 col-sm-5 col-md-5 overflow-hidden">
              <small className="text-uppercase text-muted fw-semibold d-block mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}>Public Slug</small>
              {slug ? (
                <span className="d-block text-truncate fw-medium" style={{ fontSize: '0.85rem', color: THEME_COLORS.textPrimary }}>{slug}</span>
              ) : (
                <span className="text-muted fst-italic" style={{ fontSize: '0.85rem' }}>Not published yet</span>
              )}
            </div>
          </div>
        </>
      )}

      {isEditing && (
        <div className="px-3 pt-3 pb-3">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold mb-0" style={{ color: THEME_COLORS.textPrimary }}>Edit Profile</h5>
            <span className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill fw-semibold" style={{ fontSize: '0.65rem', backgroundColor: THEME_COLORS.verifiedBg, color: THEME_COLORS.successDark, border: `1px solid ${THEME_COLORS.success}40` }}>
              <EditOutlinedIcon sx={{ fontSize: 11 }} /> Editing Mode
            </span>
          </div>
          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-6">
              <TextField fullWidth label="Display Name" placeholder="Organization name" value={formData.display_name} onChange={(e) => setFormData((prev) => ({ ...prev, display_name: e.target.value }))} slotProps={{ input: { startAdornment: <InputAdornment position="start"><BusinessIcon color="action" /></InputAdornment> } }} size={ui?.inputSize} />
            </div>
            <div className="col-12 col-sm-6">
              <TextField fullWidth label="Public Slug" placeholder="organization-slug" value={formData.slug} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} slotProps={{ input: { startAdornment: <InputAdornment position="start"><LanguageIcon color="action" /></InputAdornment> } }} size={ui?.inputSize} />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="text" onClick={handleEditCancel} sx={{ textTransform: 'none', color: THEME_COLORS.textSecondary }}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} disabled={isSaving} sx={{ textTransform: 'none', backgroundColor: THEME_COLORS.brandPrimary, fontWeight: 600, '&:hover': { backgroundColor: THEME_COLORS.brandPrimaryDark } }}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </div>
      )}
    </SectionCard>
  );
};
