import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Chip, CircularProgress, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { Description as DescriptionIcon } from '@mui/icons-material';

import IdentityContractService from '../../../../services/identity/identity-contract/identity-contract.service';
import {
  CONTRACT_STATUSES,
  canSign,
  groupContractsByOrganization,
} from '../../../../services/identity/identity-contract/contract-signing';
import { THEME_COLORS } from '@constants/theme';

const DEFAULT_SIGN_PATH = '/contracts/sign';
const LOAD_STATES = Object.freeze({ loading: 'loading', ready: 'ready', failed: 'failed' });

const UserContractsManager = ({ entityId: userId = '', apiKey = '', environment = 'production', signPath = DEFAULT_SIGN_PATH }) => {
  const navigate = useNavigate();
  const [loadState, setLoadState] = useState(LOAD_STATES.loading);
  const [contracts, setContracts] = useState([]);

  const loadContracts = async () => {
    setLoadState(LOAD_STATES.loading);
    const response = await new IdentityContractService({ apiKey, settings: { environment } }).getMine();
    if (!response?.success) {
      setLoadState(LOAD_STATES.failed);
      return;
    }

    setContracts(response.result?.items || []);
    setLoadState(LOAD_STATES.ready);
  };

  const openSigning = (contractId) => {
    navigate(`${signPath}/${contractId}?return_path=${encodeURIComponent(`${window.location.pathname}${window.location.hash}`)}`);
  };

  useEffect(() => {
    loadContracts();
  }, []);

  if (loadState === LOAD_STATES.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (loadState === LOAD_STATES.failed) {
    return (
      <Stack spacing={2} alignItems="flex-start" sx={{ py: 2 }}>
        <Alert severity="error" sx={{ width: '100%' }}>We could not load your contracts.</Alert>
        <Button onClick={loadContracts}>Try again</Button>
      </Stack>
    );
  }

  if (contracts.length === 0) {
    return (
      <Stack alignItems="center" spacing={1} sx={{ py: 6, color: THEME_COLORS.textSecondary }}>
        <DescriptionIcon fontSize="large" />
        <Typography variant="subtitle1">No contracts yet</Typography>
        <Typography variant="body2">When an organization asks you to sign something, it shows up here.</Typography>
      </Stack>
    );
  }

  const awaitingCount = contracts.filter((contract) => canSign(contract, userId)).length;

  return (
    <Stack spacing={2} sx={{ py: 1 }}>
      {awaitingCount > 0 && (
        <Alert severity="warning">
          {awaitingCount === 1 ? '1 contract is waiting for your signature.' : `${awaitingCount} contracts are waiting for your signature.`}
        </Alert>
      )}

      {groupContractsByOrganization(contracts).map((group) => (
        <Box key={group.key}>
          <Typography variant="overline" color="text.secondary">
            {group.name || 'Other'}
          </Typography>
          <List disablePadding>
            {group.contracts.map((contract) => (
              <ListItem
                key={contract.id}
                divider
                disableGutters
                secondaryAction={
                  canSign(contract, userId) && (
                    <Button size="small" variant="contained" onClick={() => openSigning(contract.id)}>
                      Review and sign
                    </Button>
                  )
                }
              >
                <ListItemText
                  primary={contract.name || contract.title || 'Contract'}
                  secondary={contract.effective_from ? `Effective ${new Date(contract.effective_from).toLocaleDateString()}` : null}
                  sx={{ pr: 18 }}
                />
                <Chip
                  size="small"
                  label={contract.status?.title || contract.status?.name}
                  sx={{
                    bgcolor: contract.status?.name === CONTRACT_STATUSES.signed ? THEME_COLORS.success : contract.status?.color,
                    color: '#fff',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Stack>
  );
};

export default UserContractsManager;
