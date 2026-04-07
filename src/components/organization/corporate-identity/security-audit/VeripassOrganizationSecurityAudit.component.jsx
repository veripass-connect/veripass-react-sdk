import React from 'react';
import styled from 'styled-components';
import { Token as GppGoodIcon } from '@mui/icons-material';
import { THEME_COLORS } from '@constants/theme';
import { SectionCard } from '../VeripassOrganizationCorporateIdentity.styles';

import '@styles/fonts.css';
import '@styles/styles.css';

const AuditCard = styled.div.attrs({ className: 'h-100 d-flex flex-column' })`
  background: linear-gradient(145deg, #1b2f3a 0%, #1b2f3a 50%, #1b2f3a 100%);
  color: #ffffff;
  padding: 1.5rem;
  border-radius: inherit;
`;

const ShieldTile = styled.div.attrs({ className: 'd-flex align-items-center justify-content-center flex-shrink-0' })`
  width: 42px;
  height: 42px;
  border-radius: 8px;
  background-color: rgba(48, 187, 183, 0.15);
`;

const AuditFooter = styled.div.attrs({ className: 'text-center' })`
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 0.5rem 0.75rem;
  margin-top: auto;
`;

export const VeripassOrganizationSecurityAudit = ({
  ui = { showShell: false },
  organization = {},
  ...props
}) => {
  // Models
  const modified = organization?.modified;
  const lastAuditDate = modified?.timestamp
    ? new Date(parseInt(modified.timestamp)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  return (
    <>
      <SectionCard $showShell={ui?.showShell} className="h-100" {...props}>
        <AuditCard>
          <h5 className="fw-bold mb-3" style={{ color: '#ffffff' }}>Security Audit</h5>

          <header className="d-flex align-items-center gap-2 mb-3">
            <ShieldTile>
              <GppGoodIcon sx={{ fontSize: 20, color: THEME_COLORS.success }} />
            </ShieldTile>
            
            <div className="overflow-hidden">
              <span className="fw-semibold" style={{ fontSize: '0.85rem', color: '#ffffff' }}>Standard Security Active</span>
              <small className="fw-bold d-block" style={{ fontSize: '0.7rem' }}>&nbsp;</small>
            </div>
          </header>

          <p className="mb-3" style={{ fontSize: '0.8rem', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.7)' }}>
            Identity changes are monitored and logged for organizational transparency. Multi-factor authentication is required for all identity-affecting roles.
          </p>

          {lastAuditDate && (
            <AuditFooter>
              <small className="fw-semibold" style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)' }}>Last audit completed: {lastAuditDate}</small>
            </AuditFooter>
          )}
        </AuditCard>
      </SectionCard>
    </>
  );
};
