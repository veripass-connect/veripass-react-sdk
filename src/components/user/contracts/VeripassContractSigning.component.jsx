import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Chip, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { Close as CloseIcon, Verified as VerifiedIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import IdentityContractService from '../../../services/identity/identity-contract/identity-contract.service';
import {
  canSign,
  findMySigner,
  isValidOtp,
  resolveReturnPath,
} from '../../../services/identity/identity-contract/contract-signing';
import { useAuth } from '../../../hooks/useAuth.hook.jsx';
import { THEME_COLORS } from '@constants/theme';

const LOAD_STATES = Object.freeze({ loading: 'loading', ready: 'ready', missing: 'missing', failed: 'failed' });

/**
 * Signing page body: review the document, confirm with the TOTP code, sign or decline,
 * then go back to `returnPath` (only local paths or allowed origins are followed).
 */
export const VeripassContractSigning = ({
  contractId = '',
  returnPath = '',
  allowedReturnOrigins = [],
  apiKey = '',
  environment = 'production',
  settings = {},
  onFinished = (destination) => {
    window.location.assign(destination);
  },
  onBack = () => {},
}) => {
  const { user } = useAuth();
  const identity = user?.identity || user?.id || '';
  const [loadState, setLoadState] = useState(LOAD_STATES.loading);
  const [contract, setContract] = useState(null);
  const [otp, setOtp] = useState('');
  const [isWorking, setIsWorking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const buildService = () => new IdentityContractService({ apiKey, settings: { environment, ...settings } });

  const loadContract = async () => {
    setLoadState(LOAD_STATES.loading);
    const response = await buildService().getMine();
    if (!response?.success) {
      setLoadState(LOAD_STATES.failed);
      return;
    }

    const found = (response.result?.items || []).find((item) => item.id === contractId);
    setContract(found || null);
    setLoadState(found ? LOAD_STATES.ready : LOAD_STATES.missing);
  };

  const leave = () => {
    const destination = resolveReturnPath(returnPath, {
      currentOrigin: window.location.origin,
      allowedOrigins: allowedReturnOrigins,
    });
    if (!destination) {
      onBack();
      return;
    }
    onFinished(destination);
  };

  const submit = async (action) => {
    setIsWorking(true);
    setErrorMessage('');
    const service = buildService();
    const response = action === 'sign' ? await service.sign({ id: contractId, otp: otp.trim() }) : await service.decline({ id: contractId });
    setIsWorking(false);

    if (!response?.success) {
      setErrorMessage(response?.message || 'We could not complete this. Check the code and try again.');
      return;
    }

    leave();
  };

  useEffect(() => {
    loadContract();
  }, [contractId]);

  if (loadState === LOAD_STATES.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (loadState !== LOAD_STATES.ready) {
    return (
      <Stack spacing={2} alignItems="flex-start" sx={{ py: 4 }}>
        <Alert severity={loadState === LOAD_STATES.failed ? 'error' : 'info'} sx={{ width: '100%' }}>
          {loadState === LOAD_STATES.failed
            ? 'We could not load your contracts.'
            : 'This contract is not available for your account.'}
        </Alert>
        {loadState === LOAD_STATES.failed && <Button onClick={loadContract}>Try again</Button>}
        <Button onClick={leave}>Go back</Button>
      </Stack>
    );
  }

  const mySigner = findMySigner(contract, identity);
  const isSignable = canSign(contract, identity);
  const hasContent = Boolean(contract.content && contract.content.trim());
  const document = contract.document || {};

  return (
    <Stack spacing={2.5} sx={{ maxWidth: 760, mx: 'auto', py: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography variant="h6" sx={{ color: THEME_COLORS.textPrimary, flex: 1, minWidth: 200 }}>
          {contract.name || contract.title || 'Contract'}
        </Typography>
        <Chip size="small" label={contract.status?.title || contract.status?.name} sx={{ bgcolor: contract.status?.color, color: '#fff' }} />
      </Stack>

      <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, p: 2, maxHeight: '45vh', overflow: 'auto' }}>
        {hasContent ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{contract.content}</ReactMarkdown>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {document.storage_ref ? 'The document is stored with this contract.' : 'This contract has no readable text.'}
          </Typography>
        )}
      </Box>

      {document.hash_sha256 && (
        <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
          SHA-256: {document.hash_sha256}
        </Typography>
      )}

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      {!isSignable && (
        <Alert severity="info">
          {mySigner?.status === 'signed' ? 'You already signed this contract.' : 'This contract is not waiting for your signature.'}
        </Alert>
      )}

      {isSignable && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
          <TextField
            size="small"
            label="Authenticator code"
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
            inputProps={{ inputMode: 'numeric', autoComplete: 'one-time-code', maxLength: 6 }}
            sx={{ width: { xs: '100%', sm: 200 } }}
          />
          <Button variant="contained" startIcon={<VerifiedIcon />} disabled={!isValidOtp(otp) || isWorking} onClick={() => submit('sign')}>
            Sign
          </Button>
          <Button color="error" startIcon={<CloseIcon />} disabled={isWorking} onClick={() => submit('decline')}>
            Decline
          </Button>
        </Stack>
      )}

      {!isSignable && <Button onClick={leave} sx={{ alignSelf: 'flex-start' }}>Go back</Button>}
    </Stack>
  );
};

export default VeripassContractSigning;
