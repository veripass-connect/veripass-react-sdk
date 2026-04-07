import React from 'react';
import { Language as LanguageIcon } from '@mui/icons-material';
import { THEME_COLORS } from '@constants/theme';
import { VeripassOrganizationSectionHeader } from '../primitives/VeripassOrganizationSectionHeader.component';
import { VeripassOrganizationMetadataItem } from '../primitives/VeripassOrganizationMetadataItem.component';
import { SectionCard } from '../VeripassOrganizationCorporateIdentity.styles';

import '@styles/fonts.css';
import '@styles/styles.css';

export const VeripassOrganizationPublicPresence = ({
  ui = { showShell: false, showLogo: false },
  organization = {},
  mode = 'viewer',
  itemOnAction = () => {},
  ...props
}) => {
  // Models
  const profile = organization?.organization_profile || organization?.profile || {};
  const status = organization?.status;
  const isVerified = profile?.is_verified === true;
  const logoUrl = profile?.logo_url || profile?.profile_ui_settings?.profile_picture_url || '';
  const coverUrl = profile?.profile_ui_settings?.cover_picture_url || '';
  const brandColors = profile?.profile_ui_settings?.brand_colors || null;

  return (
    <>
      <SectionCard $showShell={ui?.showShell} {...props}>
        <VeripassOrganizationSectionHeader title="Public Presence" icon={<LanguageIcon sx={{ fontSize: 18 }} />} />

        <div className="row">
          <div className="col-12 col-sm-6 overflow-hidden">
            <VeripassOrganizationMetadataItem label="Visibility" value={isVerified ? 'Visible across Veripass' : 'Limited visibility'} />
          </div>
          <div className="col-12 col-sm-6 overflow-hidden">
            <article className="d-flex flex-column mb-2 overflow-hidden">
              <small className="text-uppercase text-muted fw-semibold mb-0" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                Verification
              </small>
              <p className="fw-semibold mb-0" style={{ fontSize: '0.8rem', color: isVerified ? THEME_COLORS.success : THEME_COLORS.textPrimary }}>
                {isVerified ? 'Verified' : 'Pending'}
              </p>
            </article>
          </div>
          <div className="col-12 col-sm-6 overflow-hidden">
            <VeripassOrganizationMetadataItem label="Branding" value={logoUrl || coverUrl || brandColors ? 'Configured' : 'Not configured yet'} />
          </div>
          <div className="col-12 col-sm-6 overflow-hidden">
            <VeripassOrganizationMetadataItem label="Assets" value={logoUrl ? 'Uploaded' : 'Using default institutional style'} />
          </div>
          <div className="col-12 overflow-hidden">
            <article className="d-flex flex-column mb-2 overflow-hidden">
              <small className="text-uppercase text-muted fw-semibold mb-0" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                Operational Status
              </small>
              <p className="fw-semibold d-flex align-items-center gap-1 mb-0" style={{ fontSize: '0.8rem', color: THEME_COLORS.textPrimary }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: THEME_COLORS.success, display: 'inline-block', flexShrink: 0 }} />
                {status?.title === 'Active' ? 'Active & Trustworthy' : status?.title || 'Active'}
              </p>
            </article>
          </div>
        </div>
      </SectionCard>
    </>
  );
};
