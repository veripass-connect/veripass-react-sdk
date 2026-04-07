import React, { useState } from 'react';
import { Chip } from '@mui/material';
import {
  Description as ContractIcon,
  CheckCircle as AcceptedIcon,
  Schedule as PendingIcon,
  OpenInNew as OpenIcon,
} from '@mui/icons-material';
import { THEME_COLORS } from '@constants/theme';
import { VeripassContractViewer } from './VeripassContractViewer.component';

import '@styles/fonts.css';
import '@styles/styles.css';

const NAMESPACE = 'veripass-contracts-list';

const STATUS_MAP = {
  signed: { label: 'Accepted', color: THEME_COLORS.success, icon: AcceptedIcon },
  pending: { label: 'Pending', color: THEME_COLORS.warning, icon: PendingIcon },
};

export const VeripassOrganizationContractsList = ({
  ui = { showShell: false },
  contracts = [],
  acceptedContractIds = [],
  itemOnAction = () => {},
  environment = 'production',
  apiKey = '',
  ...props
}) => {
  // UI States
  const [selectedContract, setSelectedContract] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  // Functions
  const handleContractClick = (contract) => {
    setSelectedContract(contract);
    setViewerOpen(true);
    itemOnAction({ action: `${NAMESPACE}::contract-click`, namespace: NAMESPACE, payload: { contract } });
  };

  const handleViewerAction = ({ action, namespace, payload }) => {
    if (action === 'veripass-contract-viewer::viewer-close') {
      setViewerOpen(false);
      setSelectedContract(null);
    }
    itemOnAction({ action, namespace, payload });
  };

  if (!contracts || contracts.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center text-center py-5" {...props}>
        <ContractIcon sx={{ fontSize: 48, color: THEME_COLORS.surfaceSecondary, mb: 1 }} />
        <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>No contracts found for this application.</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-2" {...props}>
      {contracts.map((contract) => {
        const isAccepted = acceptedContractIds.includes(contract.id);
        const statusConfig = isAccepted ? STATUS_MAP.signed : STATUS_MAP.pending;
        const StatusIcon = statusConfig.icon;

        return (
          <div
            key={contract.id}
            className="d-flex align-items-center justify-content-between p-3 rounded-3 border"
            style={{ backgroundColor: isAccepted ? '#f8fffe' : THEME_COLORS.surfaceLight, cursor: 'pointer', borderColor: THEME_COLORS.border }}
            onClick={() => handleContractClick(contract)}
            role="button"
            tabIndex={0}
          >
            <div className="d-flex align-items-center gap-3 overflow-hidden">
              <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${statusConfig.color}20` }}>
                <ContractIcon sx={{ fontSize: 20, color: statusConfig.color }} />
              </div>
              <div className="overflow-hidden">
                <strong className="d-block text-truncate" style={{ fontSize: '0.85rem', color: THEME_COLORS.textPrimary }}>
                  {contract.name || 'Untitled Contract'}
                </strong>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                  Version {contract.version || '1.0'}
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <Chip
                icon={<StatusIcon sx={{ fontSize: 14 }} />}
                label={statusConfig.label}
                size="small"
                sx={{
                  backgroundColor: `${statusConfig.color}20`,
                  color: statusConfig.color,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 24,
                }}
              />
              {(contract.url || contract.content) && (
                <OpenIcon sx={{ fontSize: 16, color: THEME_COLORS.textMuted }} />
              )}
            </div>
          </div>
        );
      })}

      <VeripassContractViewer
        contract={selectedContract}
        open={viewerOpen}
        isAccepted={selectedContract ? acceptedContractIds.includes(selectedContract.id) : false}
        itemOnAction={handleViewerAction}
        environment={environment}
        apiKey={apiKey}
      />
    </div>
  );
};
