import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip, Typography } from '@mui/material';
import { Close as CloseIcon, CheckCircle as AcceptedIcon, Schedule as PendingIcon, Description as ContractIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import { THEME_COLORS } from '@constants/theme';

import '@styles/fonts.css';
import '@styles/styles.css';

const NAMESPACE = 'veripass-contract-viewer';

const ACTIONS = {
  VIEWER_OPEN: `${NAMESPACE}::viewer-open`,
  VIEWER_CLOSE: `${NAMESPACE}::viewer-close`,
};

export { NAMESPACE as CONTRACT_VIEWER_NAMESPACE, ACTIONS as CONTRACT_VIEWER_ACTIONS };

export const VeripassContractViewer = ({
  ui = { showShell: false },
  contract = null,
  open = false,
  isAccepted = false,
  itemOnAction = () => {},
  environment = 'production',
  apiKey = '',
  ...props
}) => {
  if (!contract) {
    return null;
  }

  // Models
  const hasContent = contract.content && contract.content.trim().length > 0;
  const hasUrl = contract.url && contract.url.trim().length > 0;
  const statusConfig = isAccepted
    ? { label: 'Accepted', color: THEME_COLORS.success, icon: AcceptedIcon }
    : { label: 'Pending', color: THEME_COLORS.warning, icon: PendingIcon };
  const StatusIcon = statusConfig.icon;

  // Functions
  const handleClose = () => {
    itemOnAction({ action: ACTIONS.VIEWER_CLOSE, namespace: NAMESPACE, payload: { contract } });
  };

  // Configs
  const pdfDocuments = hasUrl ? [{ uri: contract.url }] : [];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{ sx: { borderRadius: '20px', minHeight: '60vh' } }}
      {...props}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <div className="d-flex align-items-center gap-2 overflow-hidden">
          <ContractIcon sx={{ fontSize: 22, color: THEME_COLORS.textSecondary }} />
          <div className="overflow-hidden">
            <Typography variant="h6" className="fw-bold text-truncate" sx={{ color: THEME_COLORS.textPrimary, fontSize: '1rem' }}>
              {contract.name || 'Contract'}
            </Typography>
            <Typography variant="caption" sx={{ color: THEME_COLORS.textSecondary }}>
              Version {contract.version || '1.0'}
            </Typography>
          </div>
        </div>
        <IconButton onClick={handleClose} size="small" sx={{ color: THEME_COLORS.textSecondary }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {hasContent && (
          <div className="contract-markdown-content" style={{ fontSize: '0.85rem', lineHeight: 1.7, color: THEME_COLORS.textPrimary }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{contract.content}</ReactMarkdown>
          </div>
        )}

        {!hasContent && hasUrl && (
          <DocViewer
            documents={pdfDocuments}
            pluginRenderers={DocViewerRenderers}
            style={{ minHeight: 500 }}
            config={{
              header: { disableHeader: true },
            }}
          />
        )}

        {!hasContent && !hasUrl && (
          <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
            <ContractIcon sx={{ fontSize: 48, color: THEME_COLORS.surfaceSecondary, mb: 1 }} />
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>No content available for this contract.</p>
          </div>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Chip
          icon={<StatusIcon sx={{ fontSize: 14 }} />}
          label={statusConfig.label}
          size="small"
          sx={{
            backgroundColor: `${statusConfig.color}20`,
            color: statusConfig.color,
            fontWeight: 600,
            fontSize: '0.7rem',
          }}
        />
        <Typography variant="caption" sx={{ color: THEME_COLORS.textMuted }}>
          {contract.metadata?.header || ''}
        </Typography>
      </DialogActions>
    </Dialog>
  );
};
