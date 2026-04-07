import React from 'react';
import styled from 'styled-components';
import { VerifiedUser as VerifiedUserIcon, ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';
import { THEME_COLORS } from '@constants/theme';
import { SectionCard, NAMESPACE, ACTIONS } from '../VeripassOrganizationCorporateIdentity.styles';

import '@styles/fonts.css';
import '@styles/styles.css';

const StatusContainer = styled.div.attrs({ className: 'h-100 d-flex flex-column' })`
  padding: 1.5rem;
  background-color: ${(props) => props.$bg};
  border-radius: inherit;
`;

const IconTile = styled.div.attrs({ className: 'd-flex align-items-center justify-content-center flex-shrink-0' })`
  width: 42px;
  height: 42px;
  border-radius: 8px;
  background-color: ${(props) => props.$bg};
`;

export const VeripassOrganizationVerificationStatus = ({
  ui = { showShell: false, showLogo: false },
  organization = {},
  mode = 'viewer',
  itemOnAction = () => {},
  ...props
}) => {
  // Models
  const profile = organization?.organization_profile || organization?.profile || {};
  const isVerified = profile?.is_verified === true;

  if (isVerified) {
    return (
      <>
        <SectionCard $showShell={ui?.showShell} className="h-100" {...props}>
          <StatusContainer $bg={THEME_COLORS.verifiedBg}>
            <h5 className="fw-bold mb-3" style={{ color: THEME_COLORS.successDark }}>Verified organization</h5>

            <header className="d-flex align-items-center gap-2 mb-3">
              <IconTile $bg={THEME_COLORS.successDark}>
                <VerifiedUserIcon sx={{ fontSize: 20, color: '#ffffff' }} />
              </IconTile>
              <div className="overflow-hidden">
                <span className="fw-semibold" style={{ fontSize: '0.85rem', color: THEME_COLORS.successDark }}>Institutional Trust Verified</span>
                <small className="fw-bold d-block" style={{ fontSize: '0.7rem' }}>&nbsp;</small>
              </div>
            </header>

            <p className="mb-3" style={{ fontSize: '0.8rem', color: THEME_COLORS.successDark, lineHeight: 1.6, opacity: 0.85 }}>
              This organization has completed its Veripass verification and is recognized as an official trusted entity in the Veripass ecosystem.
            </p>

            <div className="text-center mt-auto" style={{ backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 10, padding: '0.5rem 0.75rem' }}>
              <small className="fw-semibold" style={{ fontSize: '0.75rem', color: THEME_COLORS.successDark }}>Verification complete</small>
            </div>
          </StatusContainer>
        </SectionCard>
      </>
    );
  }

  return (
    <>
      <SectionCard $showShell={ui?.showShell} className="h-100" {...props}>
        <StatusContainer $bg={THEME_COLORS.pendingBg}>
          <h5 className="fw-bold mb-3" style={{ color: THEME_COLORS.warningDark }}>Verification pending</h5>

          <div className="d-flex align-items-center gap-2 mb-0">
            <IconTile $bg={`${THEME_COLORS.warning}30`}>
              <ErrorOutlineIcon sx={{ fontSize: 20, color: THEME_COLORS.warning }} />
            </IconTile>
            <span className="fw-semibold" style={{ fontSize: '0.85rem', color: THEME_COLORS.warningDark }}>Awaiting Verification</span>
          </div>
          <small className="fw-bold mb-3 d-block" style={{ fontSize: '0.7rem' }}>&nbsp;</small>

          <p className="mb-0" style={{ fontSize: '0.8rem', color: THEME_COLORS.warningDark, lineHeight: 1.6, opacity: 0.85 }}>
            This organization has not completed verification yet. Please contact your system administrator to initiate the verification workflow.
          </p>
        </StatusContainer>
      </SectionCard>
    </>
  );
};
