import React, { useState } from 'react';
import { Box, Chip, IconButton, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import { Check as CheckIcon, Edit as EditIcon, Link as LinkIcon } from '@mui/icons-material';

import { THEME_COLORS } from '@constants/theme';

/**
 * Two-line label/value block used inside the meta band and Settings tabs.
 * Ported from Sommatic's PromptTemplatePreview.
 */
export const KeyValueRow = ({ label, value, mono = false }) => (
  <div className="mb-2 d-flex flex-column">
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        fontFamily: mono ? 'monospace' : 'inherit',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        overflowWrap: 'anywhere',
        color: THEME_COLORS.textPrimary,
      }}
    >
      {value || '—'}
    </Typography>
  </div>
);

/**
 * Monospace scrollable text block for bodies/content. Ported from Sommatic.
 */
export const TextBlock = ({ label, value }) => (
  <Box mb={2}>
    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
      {label}
    </Typography>
    <Box
      sx={{
        backgroundColor: '#F9FAFB',
        border: `1px solid ${THEME_COLORS.borderMuted}`,
        borderRadius: 1,
        padding: '10px 12px',
        fontFamily: 'monospace',
        fontSize: 13,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        maxHeight: 280,
        overflow: 'auto',
      }}
    >
      {value || '—'}
    </Box>
  </Box>
);

/**
 * Shared skeleton for entity detail modals (Sommatic detail pattern):
 * top bar (breadcrumb + copy link + edit pencil) → accent header (title, mono slug,
 * tag chips) → grey meta band (up to 2 rows × 3 columns) → MUI Tabs → scrollable
 * tab content. Simple tabs first, Settings last — the per-entity preview only
 * declares data; this shell owns the layout.
 *
 * Props:
 * - breadcrumbSection: string (e.g. 'Roles')
 * - title, slug: strings
 * - tags: array of strings or { label, sx } objects
 * - copyLinkPath: absolute path copied to clipboard (host prepended)
 * - onEdit: optional — renders the pencil that enters edit mode
 * - meta: array of { label, value, mono, render } (max 6 → 2 rows × 3 columns)
 * - tabs: array of { id, label, icon, content }
 */
const EntityDetailShell = ({
  breadcrumbSection,
  title,
  slug,
  tags = [],
  copyLinkPath,
  onEdit,
  meta = [],
  tabs = [],
  topBarExtra = null,
  renderHeader = null,
  footer = null,
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    if (!copyLinkPath) {
      return;
    }

    navigator.clipboard.writeText(`${window.location.host}${copyLinkPath}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <section className="d-flex flex-column w-100">
      {/* Top bar: breadcrumb + actions */}
      <Box
        sx={{
          flexShrink: 0,
          padding: '12px 60px 10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          borderBottom: `1px solid ${THEME_COLORS.borderMuted}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: '#9CA3AF',
            fontSize: '0.8rem',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <span>{breadcrumbSection} /</span>
          <span style={{ color: THEME_COLORS.textPrimary, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title || 'Untitled'}
          </span>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0 }}>
          {copyLinkPath && (
            <Tooltip title={linkCopied ? 'Link copied!' : 'Copy link'} arrow>
              <IconButton
                size="small"
                onClick={handleCopyLink}
                aria-label="Copy link"
                sx={{ color: linkCopied ? '#0F766E' : '#9CA3AF' }}
              >
                {linkCopied ? <CheckIcon sx={{ fontSize: 16 }} /> : <LinkIcon sx={{ fontSize: 16 }} />}
              </IconButton>
            </Tooltip>
          )}
          {onEdit && (
            <Tooltip title="Edit" arrow>
              <IconButton size="small" onClick={onEdit} aria-label="Edit" sx={{ color: '#9CA3AF' }}>
                <EditIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
          {topBarExtra}
        </Box>
      </Box>

      {/* Accent header: title + slug + tags (or editable header in edit mode) */}
      <header className="px-4 pt-3 pb-2" style={{ borderLeft: `5px solid ${THEME_COLORS.brandPrimary}` }}>
        <div style={{ minWidth: 0 }}>
          {renderHeader || (
            <>
              <Typography variant="h5" className="fw-bold text-dark mb-0">
                {title || breadcrumbSection}
              </Typography>
              <Typography variant="caption" className="text-muted" sx={{ fontFamily: 'monospace' }}>
                {slug || '—'}
              </Typography>
            </>
          )}

          {tags.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mt-2">
              {tags.map((tag, index) => {
                const isObject = tag && typeof tag === 'object';
                return (
                  <Chip
                    key={`${isObject ? tag.label : tag}-${index}`}
                    label={isObject ? tag.label : tag}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: 11,
                      bgcolor: '#EEF2FF',
                      color: '#4338CA',
                      ...(isObject ? tag.sx : {}),
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Grey meta band: common data, max 2 rows × 3 columns */}
      {meta.length > 0 && (
        <section className="pt-3 px-4" style={{ backgroundColor: THEME_COLORS.surfaceMuted }}>
          <div className="row">
            {meta.slice(0, 6).map((item) => (
              <article key={item.label} className="col-12 col-md-4 mb-2">
                {item.render ? (
                  <div className="mb-2 d-flex flex-column">
                    <Typography variant="caption" color="text.secondary">
                      {item.label}
                    </Typography>
                    {item.render}
                  </div>
                ) : (
                  <KeyValueRow label={item.label} value={item.value} mono={item.mono} />
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Tabs — the tab bar is only shown when there is more than one tab.
          A single tab renders its content directly (no redundant tab strip). */}
      {tabs.length > 0 && (
        <>
          {tabs.length > 1 && (
          <aside className="px-4 mt-2">
            <Tabs
              value={activeTab}
              onChange={(_, next) => setActiveTab(next)}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{ sx: { backgroundColor: THEME_COLORS.brandPrimary } }}
              sx={{
                minHeight: 38,
                '& .MuiTab-root': {
                  minHeight: 38,
                  textTransform: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  color: THEME_COLORS.textSecondary,
                  py: 0.5,
                  px: 1.75,
                  '&.Mui-selected': {
                    color: THEME_COLORS.brandPrimary,
                    fontWeight: 600,
                  },
                },
              }}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  label={tab.label}
                  value={tab.id}
                  icon={tab.icon}
                  iconPosition="start"
                  disableRipple
                />
              ))}
            </Tabs>
          </aside>
          )}

          <div className="overflow-y-auto" style={{ height: '440px', overflowX: 'hidden' }}>
            <div className="px-4 pt-3">{activeTabContent}</div>
          </div>
        </>
      )}

      {/* Footer (edit mode: Cancel / Save) — same slot in every entity so the
          organization never shifts between preview and edit. */}
      {footer && (
        <footer
          className="d-flex justify-content-between align-items-center px-4 py-3"
          style={{ borderTop: `1px solid ${THEME_COLORS.borderMuted}` }}
        >
          {footer}
        </footer>
      )}
    </section>
  );
};

export default EntityDetailShell;
