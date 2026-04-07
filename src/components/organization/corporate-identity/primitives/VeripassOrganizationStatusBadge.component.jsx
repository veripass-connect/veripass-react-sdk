import React from 'react';
import { VerifiedUser as VerifiedUserIcon, Schedule as ScheduleIcon } from '@mui/icons-material';
import { THEME_COLORS } from '@constants/theme';

import '@styles/fonts.css';
import '@styles/styles.css';

const STATUS_CONFIG = {
  verified: { label: 'Verified', bg: `${THEME_COLORS.success}20`, color: THEME_COLORS.successDark, icon: VerifiedUserIcon },
  pending: { label: 'Verification Pending', bg: `${THEME_COLORS.warning}20`, color: THEME_COLORS.warningDark, icon: ScheduleIcon },
  not_verified: { label: 'Not Verified', bg: THEME_COLORS.surfaceSecondary, color: THEME_COLORS.textSecondary, icon: null },
  active: { label: 'Active', bg: `${THEME_COLORS.success}20`, color: THEME_COLORS.success, icon: null },
  administrator: { label: 'Administrator', bg: THEME_COLORS.brandPrimary, color: '#ffffff', icon: null },
};

export const VeripassOrganizationStatusBadge = ({ status = 'pending', size = 'small', label = '', ...props }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const displayLabel = label || config.label;
  const IconComponent = config.icon;
  const isSmall = size === 'small';

  return (
    <span
      className="d-inline-flex align-items-center gap-1 rounded-pill fw-semibold text-nowrap"
      style={{
        padding: isSmall ? '2px 10px' : '4px 14px',
        fontSize: isSmall ? '0.7rem' : '0.8rem',
        backgroundColor: config.bg,
        color: config.color,
        letterSpacing: '0.02em',
      }}
      {...props}
    >
      {IconComponent && <IconComponent sx={{ fontSize: isSmall ? 12 : 14 }} />}
      {displayLabel}
    </span>
  );
};
