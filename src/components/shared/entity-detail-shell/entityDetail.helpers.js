import { STATUS_BADGE_COLORS } from '@constants/theme';

const NEGATIVE_STATUS_NAMES = ['deleted', 'inactive', 'banned', 'blocked', 'revoked', 'expired', 'cancelled'];
const POSITIVE_STATUS_NAMES = ['active', 'signed', 'verified'];

export const formatEntityTimestamp = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(+value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleString();
};

export const buildStatusTag = (status) => {
  const label = status?.title || status?.name;
  if (!label) {
    return null;
  }

  const statusName = String(status?.name || '').toLowerCase();

  if (POSITIVE_STATUS_NAMES.includes(statusName)) {
    return { label, sx: { bgcolor: STATUS_BADGE_COLORS.paid.background, color: STATUS_BADGE_COLORS.paid.color } };
  }

  if (NEGATIVE_STATUS_NAMES.includes(statusName)) {
    return {
      label,
      sx: { bgcolor: STATUS_BADGE_COLORS.failed.background, color: STATUS_BADGE_COLORS.failed.color },
    };
  }

  return { label };
};
