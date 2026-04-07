import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { EditOutlined as EditOutlinedIcon, Close as CloseIcon } from '@mui/icons-material';
import { THEME_COLORS } from '@constants/theme';

import '@styles/fonts.css';
import '@styles/styles.css';

export const VeripassOrganizationSectionHeader = ({
  title = '',
  subtitle = '',
  icon = null,
  isEditable = false,
  isEditing = false,
  editDisabled = false,
  onEditClick = () => {},
  onCancelClick = () => {},
  ...props
}) => {
  return (
    <header className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom" {...props}>
      <div className="d-flex align-items-center gap-2">
        {icon && <span className="d-flex" style={{ color: THEME_COLORS.textSecondary }}>{icon}</span>}
        <h5 className="fw-bold mb-0" style={{ color: THEME_COLORS.textPrimary }}>{title}</h5>
        {subtitle && <small className="text-muted">{subtitle}</small>}
      </div>

      <div className="d-flex align-items-center gap-2">
        {isEditing && (
          <>
            <span
              className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill fw-semibold"
              style={{ fontSize: '0.65rem', backgroundColor: THEME_COLORS.verifiedBg, color: THEME_COLORS.successDark, border: `1px solid ${THEME_COLORS.success}40` }}
            >
              <EditOutlinedIcon sx={{ fontSize: 11 }} />
              Editing Mode
            </span>
            <Tooltip title="Cancel editing" arrow>
              <IconButton size="small" onClick={onCancelClick} sx={{ color: THEME_COLORS.textSecondary }}>
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </>
        )}

        {isEditable && !isEditing && (
          <Tooltip title={editDisabled ? 'Save or cancel current edits first' : 'Edit'} arrow>
            <span>
              <IconButton
                size="small"
                onClick={onEditClick}
                disabled={editDisabled}
                sx={{ color: THEME_COLORS.textSecondary, opacity: editDisabled ? 0.4 : 1 }}
              >
                <EditOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </div>
    </header>
  );
};
