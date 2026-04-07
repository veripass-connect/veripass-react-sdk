import styled from 'styled-components';

export const SectionCard = styled.section`
  ${(props) =>
    props.$showShell
      ? `
    border: 1px solid #f2f2f2;
    border-radius: 8px;
    padding: 2.25rem;
    box-shadow: 0 0.75rem 6rem rgba(56, 65, 74, 0.03);
    background: #ffffff;
  `
      : ''}
`;

export const SectionDivider = styled.hr`
  border: 0;
  border-top: 1px solid #f1f5f9;
  margin: 1.5rem 0;
`;

export const InstitutionalText = styled.span`
  font-family: 'Karla', 'Roboto', sans-serif;
  font-weight: 600;
`;

export const LabelText = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #64748b;
`;

export const ValueText = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: #1e293b;
`;

export const NAMESPACE = 'veripass-corporate-identity';

export const ACTIONS = {
  HERO_EDIT_COVER: `${NAMESPACE}::hero-edit-cover`,
  HERO_EDIT_AVATAR: `${NAMESPACE}::hero-edit-avatar`,

  SECTION_EDIT_START: `${NAMESPACE}::section-edit-start`,
  SECTION_EDIT_CANCEL: `${NAMESPACE}::section-edit-cancel`,
  SECTION_SAVE: `${NAMESPACE}::section-save`,
  SECTION_SAVED: `${NAMESPACE}::section-saved`,
  SECTION_SAVE_ERROR: `${NAMESPACE}::section-save-error`,

  IDENTITY_FORM_UPDATED: `${NAMESPACE}::official-identity-form-updated`,
  BRANDING_FORM_UPDATED: `${NAMESPACE}::branding-form-updated`,

  VERIFICATION_REQUEST: `${NAMESPACE}::verification-request`,
  VERIFICATION_AUDIT_LOG: `${NAMESPACE}::verification-audit-log`,

  METADATA_COPY: `${NAMESPACE}::metadata-copy`,
};
