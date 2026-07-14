// Veripass SDK theme constants — holding-wide named colors so every surface
// (hub cards, detail shells, tabs, chips) consumes named tokens instead of baking
// hex values. Existing SDK color values are preserved; the extra tokens below are
// what the migrated user-management surfaces (VeripassUserManager + tabs) consume.

export const THEME_COLORS = {
  brandPrimary: '#3A2E4F', // SDK brand (kept; override to Veripass blue #193796 if desired)
  brandPrimaryDark: '#2D243E',
  success: '#30BBB7',
  successDark: '#299E9C',
  error: '#FB7185',
  errorDark: '#9F1239',
  errorDarker: '#7F0F2E', // Delete buttons hover
  warning: '#F59E0B',
  warningDark: '#92400E',
  purple: '#8B5CF6',
  textPrimary: '#1e293b',
  textSecondary: '#6B7280',
  textMuted: '#94a3b8',
  textBody: '#374151', // Gray 700 (long-form paragraphs)
  textBodyMuted: '#4B5563', // Gray 600 (secondary paragraphs)
  textStrong: '#111827', // Gray 900 (active toggle / card titles)
  white: '#FFFFFF',
  surfacePrimary: '#ffffff',
  surfaceSecondary: '#E5E7EB',
  surfaceLight: '#f8fafc',
  surfaceCard: '#F9FAFB', // Gray 50 (inset cards, soft row borders)
  surfaceMuted: '#F5F7F9', // Detail shell meta band background
  surfaceTrack: '#F3F4F6', // Gray 100 (progress tracks, subtle borders)
  surfaceToggle: '#E2E4E8',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  borderMuted: '#E5E7EB', // Gray 200 borders
  borderDashed: '#D1D5DB', // Gray 300 dashed borders
  verified: '#30BBB7',
  verifiedBg: '#f0fdfa',
  pendingBg: '#fffbeb',
  statusSigned: '#43A047', // Canonical "signed" contract status color
};

// Soft badge palettes for document/invoice statuses.
export const STATUS_BADGE_COLORS = {
  paid: { background: '#ECFDF5', color: '#059669' },
  pending: { background: '#FFFBEB', color: '#D97706' },
  failed: { background: '#FEF2F2', color: '#DC2626' },
};

// Payment network brand colors (card brand chips).
export const CARD_BRAND_COLORS = {
  visa: '#1A1F71',
  mastercard: '#EB001B',
};

// Holding-wide QuickLinkCard / overview-tile palette. Same values across every
// Blackwood product so the same concept keeps the same color.
export const CARD_COLORS = {
  indigo: '#4F46E5',
  cyan: '#06B6D4',
  violet: '#8B5CF6',
  teal: '#0EA5A4',
  amber: '#F59E0B',
  red: '#EF4444',
  green: '#10B981',
  blue: '#3B82F6',
  pink: '#EC4899',
  indigoAlt: '#6366F1',
  tealDark: '#0D9488',
};

// Sibling product brand colors (used when a card points into another product's home).
export const PRODUCT_COLORS = {
  veripass: '#193796',
  vca: '#180F85',
  hivora: '#111D1B',
};

// Soft tint helper — entity color at low alpha as background, the SAME color as
// foreground (icon boxes, badges, hover states).
export const tint = (color, alphaHex = '26') => `${color}${alphaHex}`;

// Glassmorphism tokens: translucent panels over the app's gradient backdrop.
export const GLASS = {
  radius: 16,
  tileRadius: 12,
  panel: {
    background: 'rgba(255, 255, 255, 0.72)',
    backdropFilter: 'blur(18px) saturate(160%)',
    WebkitBackdropFilter: 'blur(18px) saturate(160%)',
    border: '1px solid rgba(255, 255, 255, 0.65)',
    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.06)',
    borderRadius: 16,
  },
  tile: {
    background: 'rgba(255, 255, 255, 0.55)',
    border: '1px solid rgba(2, 6, 23, 0.06)',
    borderRadius: 12,
  },
};
