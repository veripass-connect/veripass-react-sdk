import React from 'react';
import { InfoOutlined as InfoOutlinedIcon } from '@mui/icons-material';

import '@styles/fonts.css';
import '@styles/styles.css';

export const VeripassOrganizationEmptyState = ({ message = 'Not published yet', icon = null, variant = 'inline', ...props }) => {
  if (variant === 'block') {
    return (
      <section className="d-flex flex-column align-items-center justify-content-center text-center py-5 px-3" {...props}>
        {icon || <InfoOutlinedIcon sx={{ fontSize: 40, color: '#cbd5e1', marginBottom: '0.75rem' }} />}
        <p className="text-muted mb-0 mt-2" style={{ fontSize: '0.75rem', maxWidth: 360 }}>{message}</p>
      </section>
    );
  }

  return (
    <span className="text-muted fst-italic" style={{ fontSize: '0.75rem' }} {...props}>
      {message}
    </span>
  );
};
