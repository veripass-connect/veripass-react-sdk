import React, { useState } from 'react';
import styled from 'styled-components';
import { IconButton, Tooltip } from '@mui/material';
import { ContentCopy as ContentCopyIcon, Check as CheckIcon } from '@mui/icons-material';
import { THEME_COLORS } from '@constants/theme';
import { VeripassOrganizationMonogram } from '../primitives/VeripassOrganizationMonogram.component';
import { SectionCard } from '../VeripassOrganizationCorporateIdentity.styles';

import '@styles/fonts.css';
import '@styles/styles.css';

const PreviewContainer = styled.div.attrs({ className: 'h-100 d-flex flex-column' })`
  padding: 1.5rem;
  background-color: #f8fafc;
  border-radius: inherit;
`;

const PreviewFooter = styled.div.attrs({ className: 'text-center d-flex align-items-center justify-content-center gap-1' })`
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  padding: 0.5rem 0.75rem;
  margin-top: auto;
`;

export const VeripassOrganizationPublicProfilePreview = ({
  ui = { showShell: false, showLogo: false },
  organization = {},
  ...props
}) => {
  // Models
  const profile = organization?.organization_profile || organization?.profile || {};
  const displayName = profile?.display_name || '';
  const slug = profile?.slug || '';
  const isVerified = profile?.is_verified === true;
  const logoUrl = profile?.logo_url || profile?.profile_ui_settings?.profile_picture_url || '';

  // UI States
  const [copied, setCopied] = useState(false);

  // Configs
  const publicUrl = slug ? `me.veripass.com.co/${slug}` : '';
  const fullUrl = slug ? `https://me.veripass.com.co/${slug}` : '';

  // Functions
  const handleCopy = () => {
    if (!fullUrl) return;
    try { navigator.clipboard.writeText(fullUrl); } catch (e) { /* silent */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SectionCard $showShell={ui?.showShell} className="h-100" {...props}>
        <PreviewContainer>
          <h5 className="fw-bold mb-3" style={{ color: THEME_COLORS.textPrimary }}>Public Preview</h5>

          <header className="d-flex align-items-center gap-2 mb-3">
            {logoUrl ? (
              <img src={logoUrl} alt={displayName} className="flex-shrink-0" style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 8 }} />
            ) : (
              <VeripassOrganizationMonogram name={displayName} size={42} fontSize="1rem" />
            )}
            <div className="overflow-hidden">
              <strong className="d-block text-truncate" style={{ fontSize: '0.85rem', color: THEME_COLORS.textPrimary }}>
                {displayName || 'Organization'}
              </strong>
              {isVerified && <small className="fw-bold" style={{ fontSize: '0.7rem', color: THEME_COLORS.success }}>VERIFIED</small>}
              {!isVerified && <small className="fw-bold" style={{ fontSize: '0.7rem', color: THEME_COLORS.warning }}>PENDING</small>}
            </div>
          </header>

          <p className="mb-3" style={{ fontSize: '0.8rem', color: THEME_COLORS.textSecondary, lineHeight: 1.6 }}>
            {isVerified
              ? 'This profile is publicly visible and trusted across the Veripass ecosystem.'
              : 'This profile has limited visibility until verification is completed.'}
          </p>

          {publicUrl && (
            <PreviewFooter>
              <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="text-truncate text-decoration-none fw-semibold" style={{ fontSize: '0.75rem', color: THEME_COLORS.textMuted }}>
                {publicUrl}
              </a>
              <Tooltip title={copied ? 'Copied!' : 'Copy'} arrow>
                <IconButton size="small" onClick={handleCopy} sx={{ padding: '2px', color: copied ? THEME_COLORS.success : THEME_COLORS.textMuted }}>
                  {copied ? <CheckIcon sx={{ fontSize: 12 }} /> : <ContentCopyIcon sx={{ fontSize: 12 }} />}
                </IconButton>
              </Tooltip>
            </PreviewFooter>
          )}
        </PreviewContainer>
      </SectionCard>
    </>
  );
};
