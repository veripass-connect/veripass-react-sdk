import React, { useState } from 'react';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { Gavel as GavelIcon, CheckCircle as AcceptedIcon } from '@mui/icons-material';
import { THEME_COLORS } from '@constants/theme';
import { VeripassContractViewer } from './VeripassContractViewer.component';

import '@styles/fonts.css';
import '@styles/styles.css';

const NAMESPACE = 'veripass-contract-acceptance';

const ACTIONS = {
  ACCEPT_ALL: `${NAMESPACE}::accept-all`,
  CONTRACT_READ: `${NAMESPACE}::contract-read`,
};

export const VeripassContractAcceptance = ({
  ui = { showShell: false },
  pendingContracts = [],
  itemOnAction = () => {},
  isAccepting = false,
  environment = 'production',
  apiKey = '',
  ...props
}) => {
  // UI States
  const [checkedContracts, setCheckedContracts] = useState({});
  const [viewerContract, setViewerContract] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  // Configs
  const allChecked = pendingContracts.length > 0 && pendingContracts.every((contract) => checkedContracts[contract.id]);

  // Functions
  const handleToggle = (contractId) => {
    setCheckedContracts((prev) => ({ ...prev, [contractId]: !prev[contractId] }));
  };

  const handleAcceptAll = () => {
    const allIds = pendingContracts.map((contract) => contract.id);
    itemOnAction({ action: ACTIONS.ACCEPT_ALL, namespace: NAMESPACE, payload: { contractIds: allIds } });
  };

  const handleReadContract = (contract) => {
    setViewerContract(contract);
    setViewerOpen(true);
    itemOnAction({ action: ACTIONS.CONTRACT_READ, namespace: NAMESPACE, payload: { contract } });
  };

  const handleViewerAction = ({ action, namespace, payload }) => {
    if (action === 'veripass-contract-viewer::viewer-close') {
      setViewerOpen(false);
      setViewerContract(null);
    }
    itemOnAction({ action, namespace, payload });
  };

  if (!pendingContracts || pendingContracts.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center text-center py-4" {...props}>
        <AcceptedIcon sx={{ fontSize: 48, color: THEME_COLORS.success, mb: 1 }} />
        <h6 className="fw-bold mb-1" style={{ color: THEME_COLORS.textPrimary }}>All contracts accepted</h6>
        <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>You have accepted all required contracts and agreements.</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column" {...props}>
      <div className="d-flex align-items-center gap-2 mb-3">
        <GavelIcon sx={{ fontSize: 20, color: THEME_COLORS.warning }} />
        <div>
          <h6 className="fw-bold mb-0" style={{ color: THEME_COLORS.textPrimary }}>
            {pendingContracts.length} contract{pendingContracts.length > 1 ? 's' : ''} pending acceptance
          </h6>
          <small className="text-muted" style={{ fontSize: '0.75rem' }}>Review and accept the following agreements to continue.</small>
        </div>
      </div>

      <div className="d-flex flex-column gap-2 mb-3">
        {pendingContracts.map((contract) => (
          <div key={contract.id} className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ backgroundColor: THEME_COLORS.surfaceLight }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!checkedContracts[contract.id]}
                  onChange={() => handleToggle(contract.id)}
                  size="small"
                  sx={{ color: THEME_COLORS.textMuted, '&.Mui-checked': { color: THEME_COLORS.success } }}
                />
              }
              label={
                <span style={{ fontSize: '0.8rem', color: THEME_COLORS.textPrimary }}>
                  {contract.name || 'Untitled Contract'}
                  <small className="text-muted ms-2" style={{ fontSize: '0.7rem' }}>v{contract.version || '1.0'}</small>
                </span>
              }
            />
            {(contract.url || contract.content) && (
              <Button
                size="small"
                onClick={(e) => { e.stopPropagation(); handleReadContract(contract); }}
                sx={{ textTransform: 'none', color: THEME_COLORS.textSecondary, fontSize: '0.7rem', minWidth: 'auto' }}
              >
                Read
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="contained"
        fullWidth
        disabled={!allChecked || isAccepting}
        onClick={handleAcceptAll}
        startIcon={isAccepting ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> : <GavelIcon />}
        sx={{
          backgroundColor: THEME_COLORS.brandPrimary,
          color: '#fff',
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': { backgroundColor: THEME_COLORS.brandPrimaryDark },
          '&.Mui-disabled': { backgroundColor: THEME_COLORS.surfaceSecondary },
        }}
      >
        {isAccepting ? 'Accepting...' : 'Accept all contracts'}
      </Button>

      <VeripassContractViewer
        contract={viewerContract}
        open={viewerOpen}
        isAccepted={false}
        itemOnAction={handleViewerAction}
        environment={environment}
        apiKey={apiKey}
      />
    </div>
  );
};
