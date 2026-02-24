import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CardContainer = styled('article')(({ $selected, $customTheme }) => ({
  border: `1px solid ${$selected ? $customTheme?.brandPrimary || '#000000' : '#e2e8f0'}`,
  borderRadius: '8px',
  padding: '16px 20px',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  '&:hover': {
    borderColor: $customTheme?.brandPrimary || '#000000',
  },
}));

const CardIconWrapper = styled('figure')({
  color: '#1e293b',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#f8fafc',
  flexShrink: 0,
});

const CardTitle = styled('h6')({
  color: '#0f172a',
  fontSize: '0.95rem',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const CardDescription = styled('p')({
  fontSize: '0.8rem',
  color: '#64748b',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

function VeripassSelectableCardComponent({
  title,
  description,
  icon,
  selected = false,
  onClick,
  ui = { theme: {} },
  className = '',
}) {
  // Hooks
  // ...

  // Models
  // ...

  // UI states
  // ...

  // Configs
  // ...

  // Component Functions
  useEffect(() => {}, []);

  return (
    <CardContainer
      $selected={selected}
      $customTheme={ui.theme}
      onClick={onClick}
      className={`veripass-mb-3 veripass-w-100 veripass-d-flex veripass-align-items-center veripass-gap-3 ${className}`}
    >
      {icon && (
        <CardIconWrapper className="veripass-d-flex veripass-align-items-center veripass-justify-content-center veripass-m-0">
          {icon}
        </CardIconWrapper>
      )}
      <section className="veripass-flex-grow-1 veripass-d-flex veripass-flex-column veripass-justify-content-center">
        <CardTitle className="veripass-m-0 veripass-fw-bold">{title}</CardTitle>
        {description && <CardDescription className="veripass-m-0 veripass-mt-1">{description}</CardDescription>}
      </section>
      {selected && (
        <CheckCircleIcon
          sx={{
            color: ui.theme?.brandPrimary || '#000000',
            ml: 1,
            fontSize: '1.75rem',
          }}
        />
      )}
    </CardContainer>
  );
}

export const VeripassSelectableCard = VeripassSelectableCardComponent;
