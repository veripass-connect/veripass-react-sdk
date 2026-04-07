import React from 'react';
import { Business as BusinessIcon } from '@mui/icons-material';

import '@styles/fonts.css';
import '@styles/styles.css';

function getInitials(name) {
  if (!name || typeof name !== 'string') {
    return '';
  }

  return name.trim().charAt(0).toUpperCase();
}

export const VeripassOrganizationMonogram = ({
  name = '',
  size = 80,
  backgroundColor = '#2d2654',
  color = '#ffffff',
  fontSize = '2.5rem',
  ...props
}) => {
  const initials = getInitials(name);

  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    borderRadius: 10,
    backgroundColor,
    color,
    fontFamily: "'Karla', 'Roboto', sans-serif",
    fontWeight: 700,
    fontSize,
    letterSpacing: '0.05em',
    userSelect: 'none',
    flexShrink: 0,
  };

  const { style: externalStyle, ...restProps } = props;

  return (
    <div style={{ ...style, ...externalStyle }} {...restProps}>
      {initials || <BusinessIcon sx={{ fontSize: size * 0.45, color }} />}
    </div>
  );
};
