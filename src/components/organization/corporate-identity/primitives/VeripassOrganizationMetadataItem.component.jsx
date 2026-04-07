import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { ContentCopy as ContentCopyIcon, Check as CheckIcon } from '@mui/icons-material';
import { THEME_COLORS } from '@constants/theme';
import { VeripassOrganizationEmptyState } from './VeripassOrganizationEmptyState.component';

import '@styles/fonts.css';
import '@styles/styles.css';

export const VeripassOrganizationMetadataItem = ({
  label = '',
  value = '',
  icon = null,
  emptyText = 'Not published yet',
  copyable = false,
  onCopy = () => {},
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy(value);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('[VeripassOrganizationMetadataItem] Copy failed', error);
    }
  };

  const hasValue = value !== null && value !== undefined && value !== '';

  return (
    <article className="d-flex flex-column mb-2 overflow-hidden" {...props}>
      {label && (
        <small className="text-uppercase text-muted fw-semibold mb-0" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
          {label}
        </small>
      )}
      <div className="d-flex align-items-center gap-1 overflow-hidden">
        {icon && <span className="d-flex text-muted flex-shrink-0">{icon}</span>}
        {hasValue ? (
          <p className="fw-semibold text-truncate mb-0" style={{ fontSize: '0.8rem', color: THEME_COLORS.textPrimary }}>
            {value}
          </p>
        ) : (
          <VeripassOrganizationEmptyState message={emptyText} variant="inline" />
        )}
        {copyable && hasValue && (
          <Tooltip title={copied ? 'Copied' : 'Copy'} arrow placement="top">
            <IconButton size="small" onClick={handleCopy} className="flex-shrink-0" sx={{ padding: '2px', color: THEME_COLORS.textMuted }}>
              {copied ? <CheckIcon sx={{ fontSize: 14, color: THEME_COLORS.success }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
            </IconButton>
          </Tooltip>
        )}
      </div>
    </article>
  );
};
