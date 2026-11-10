export const CONTRACT_STATUSES = Object.freeze({
  pendingSignature: 'pending_signature',
  signed: 'signed',
});

export const SIGNER_STATUSES = Object.freeze({
  pending: 'pending',
  signed: 'signed',
  declined: 'declined',
});

const OTP_PATTERN = /^\d{6}$/;

export const findMySigner = (contract, identity) => {
  if (!contract || !identity) {
    return null;
  }

  return (contract.signers || []).find((signer) => signer.identity === identity) || null;
};

export const canSign = (contract, identity) => {
  const signer = findMySigner(contract, identity);
  if (!signer) {
    return false;
  }

  return contract.status?.name === CONTRACT_STATUSES.pendingSignature && signer.status === SIGNER_STATUSES.pending;
};

export const isValidOtp = (value) => OTP_PATTERN.test(String(value || '').trim());

/**
 * A return_path is only followed when it stays inside a trusted origin: a local path,
 * or an absolute URL whose origin is the current one or one the host explicitly allows.
 */
export const resolveReturnPath = (returnPath, { currentOrigin = '', allowedOrigins = [] } = {}) => {
  if (!returnPath || typeof returnPath !== 'string') {
    return null;
  }

  const trimmed = returnPath.trim();
  if (trimmed.startsWith('/') && trimmed[1] !== '/' && trimmed[1] !== '\\') {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const trustedOrigins = [currentOrigin, ...allowedOrigins].filter(Boolean);
    if (!['https:', 'http:'].includes(parsed.protocol) || !trustedOrigins.includes(parsed.origin)) {
      return null;
    }
    return parsed.href;
  } catch (error) {
    return null;
  }
};

export const groupContractsByOrganization = (contracts = []) => {
  const groups = new Map();

  contracts.forEach((contract) => {
    const key = contract.organization_id || contract.organization_name || '';
    const group = groups.get(key) || { key, name: contract.organization_name || '', contracts: [] };
    group.contracts.push(contract);
    groups.set(key, group);
  });

  return [...groups.values()];
};
