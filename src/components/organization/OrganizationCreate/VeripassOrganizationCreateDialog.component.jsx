import React from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import { VeripassOrganizationCreate } from './VeripassOrganizationCreate.component';

const FONT_FAMILY = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const DIALOG_COPY = {
  createTitle: 'Create organization',
  createSubtitle: 'Set up a new workspace under your account.',
  submitLabel: 'Create organization',
  cancelLabel: 'Cancel',
  namePlaceholder: 'e.g. Acme Inc.',
  slugPlaceholder: 'acme-inc',
  slugPrefix: '',
  slugInfoText: 'Unique identifier of the organization.',
  footerNote: 'You will be the administrator of the new organization.',
};

const Header = styled('header')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '18px 56px 16px 24px',
  borderBottom: '1px solid #e2e8f0',
  fontFamily: FONT_FAMILY,
});

const IconTile = styled('span')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '40px',
  height: '40px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc',
  color: '#334155',
});

const Title = styled('h2')({
  margin: 0,
  fontSize: '1.0625rem',
  fontWeight: 600,
  lineHeight: 1.3,
  color: '#0f172a',
});

const Subtitle = styled('p')({
  margin: '2px 0 0',
  fontSize: '0.8125rem',
  lineHeight: 1.4,
  color: '#64748b',
});

/**
 * Modal wrapper of `VeripassOrganizationCreate`. Closes itself once the organization is created.
 */
export const VeripassOrganizationCreateDialog = ({ open = false, onClose, onCreated, ui = {}, ...props }) => {
  const copy = { ...DIALOG_COPY, ...ui.copy };

  const handleCreated = (result) => {
    if (onCreated) {
      onCreated(result);
    }

    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-label={copy.createTitle}
      slotProps={{ paper: { sx: { borderRadius: '12px', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)', overflow: 'hidden' } } }}
    >
      <IconButton
        aria-label="Close"
        onClick={onClose}
        size="small"
        sx={{ position: 'absolute', top: 14, right: 14, color: '#64748b' }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <Header>
        <IconTile>
          <ApartmentOutlinedIcon fontSize="small" />
        </IconTile>
        <div>
          <Title>{copy.createTitle}</Title>
          <Subtitle>{copy.createSubtitle}</Subtitle>
        </div>
      </Header>

      <DialogContent sx={{ p: '20px 24px 24px', fontFamily: FONT_FAMILY }}>
        <VeripassOrganizationCreate
          {...props}
          ui={{ showSecurityFooter: false, showHeader: false, compact: true, ...ui, copy }}
          onCreated={handleCreated}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
