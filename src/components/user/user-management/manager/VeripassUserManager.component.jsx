import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Avatar,
  Chip,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Badge as BadgeIcon,
  Business as BusinessIcon,
  Check as CheckIcon,
  ContentCopy as ContentCopyIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Devices as DevicesIcon,
  Fingerprint as FingerprintIcon,
  History as HistoryIcon,
  Info as InfoIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon,
  VerifiedUser as VerifiedUserIcon,
} from '@mui/icons-material';
import { RetryMessage, StatusChip } from '@link-loom/react-sdk';

import { CARD_COLORS, GLASS, THEME_COLORS, tint } from '@constants/theme';

import UserIdentityManager from './UserIdentityManager.component';
import UserInformationManager from './UserInformationManager.component';
import UserInformationSensitiveManager from './UserInformationSensitiveManager.component';
import UserLogManager from './UserLogManager.component';
import UserMetadataManager from './UserMetadataManager.component';
import UserOrganizationRoleManager from './UserOrganizationRoleManager.component';
import UserSecurityManager from './UserSecurityManager.component';
import UserSettingsManager from './UserSettingsManager.component';
import UserBiometricsManager from './UserBiometricsManager.component';
import UserContractsManager from './UserContractsManager.component';
import VeripassUserQuickStandardManager from '../quick-actions/manager/VeripassUserQuickStandardManager.component';
import { UserManagementService } from '@services';

const SECTION_GROUPS = [
  {
    label: 'General',
    items: [
      { key: 'overview', label: 'Overview', Icon: DashboardIcon },
      { key: 'profile', label: 'Profile', Icon: PersonIcon },
      { key: 'identity', label: 'Identity', Icon: BadgeIcon },
      { key: 'information', label: 'Information', Icon: InfoIcon },
    ],
  },
  {
    label: 'Access',
    items: [
      { key: 'access-map', label: 'Access map', Icon: VerifiedUserIcon },
      { key: 'security', label: 'Security', Icon: SecurityIcon },
    ],
  },
  {
    label: 'Trust',
    items: [
      { key: 'biometrics', label: 'Biometrics', Icon: FingerprintIcon },
      { key: 'contracts', label: 'Contracts', Icon: DescriptionIcon },
      { key: 'sensitive-information', label: 'Sensitive information', Icon: LockIcon },
    ],
  },
  {
    label: 'System',
    items: [
      { key: 'logs', label: 'Logs', Icon: HistoryIcon },
      { key: 'metadata', label: 'Metadata', Icon: StorageIcon },
      { key: 'settings', label: 'Settings', Icon: SettingsIcon },
    ],
  },
];

const SECTION_KEYS = SECTION_GROUPS.flatMap((group) => group.items.map((item) => item.key));
const SECTION_ITEMS = SECTION_GROUPS.flatMap((group) => group.items);

const OVERVIEW_CARDS = [
  {
    key: 'access-map',
    title: 'Access map',
    description: 'Visual tree that explains what this user can do and why: organization, project, app, role and each permission.',
    Icon: VerifiedUserIcon,
    color: CARD_COLORS.green,
  },
  {
    key: 'organizations',
    title: 'Organizations',
    description: 'Organizations this user belongs to.',
    Icon: BusinessIcon,
    color: CARD_COLORS.blue,
  },
  {
    key: 'devices',
    title: 'Devices',
    description: 'Physical devices linked to this user.',
    Icon: DevicesIcon,
    color: CARD_COLORS.teal,
  },
  {
    key: 'profile',
    title: 'Profile',
    description: 'Name, contact details and how this user appears across the platform.',
    Icon: PersonIcon,
    color: CARD_COLORS.indigo,
  },
  {
    key: 'identity',
    title: 'Identity',
    description: 'Official identity documents and verification data.',
    Icon: BadgeIcon,
    color: CARD_COLORS.cyan,
  },
  {
    key: 'security',
    title: 'Security',
    description: 'Password, sessions and account protection.',
    Icon: SecurityIcon,
    color: CARD_COLORS.red,
  },
  {
    key: 'biometrics',
    title: 'Biometrics',
    description: 'Fingerprints and biometric records enrolled for this user.',
    Icon: FingerprintIcon,
    color: CARD_COLORS.tealDark,
  },
  {
    key: 'contracts',
    title: 'Contracts',
    description: 'Agreements signed by or bound to this user.',
    Icon: DescriptionIcon,
    color: CARD_COLORS.amber,
  },
  {
    key: 'sensitive-information',
    title: 'Sensitive information',
    description: 'Protected personal data with restricted access.',
    Icon: LockIcon,
    color: CARD_COLORS.violet,
  },
  {
    key: 'logs',
    title: 'Logs',
    description: 'Recent activity and audit trail for this account.',
    Icon: HistoryIcon,
    color: CARD_COLORS.indigoAlt,
  },
];

const OverviewTile = ({ card, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-100 h-100 text-start d-flex flex-column p-3"
    style={{
      ...GLASS.tile,
      cursor: 'pointer',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    }}
    onMouseEnter={(event) => {
      event.currentTarget.style.transform = 'translateY(-2px)';
      event.currentTarget.style.boxShadow = '0 10px 24px rgba(15, 23, 42, 0.08)';
    }}
    onMouseLeave={(event) => {
      event.currentTarget.style.transform = 'none';
      event.currentTarget.style.boxShadow = 'none';
    }}
  >
    <span
      className="d-inline-flex align-items-center justify-content-center mb-2"
      style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: tint(card.color, '26') }}
    >
      <card.Icon sx={{ fontSize: 20, color: card.color }} />
    </span>
    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: THEME_COLORS.textStrong }}>
      {card.title}
    </Typography>
    <Typography variant="body2" sx={{ color: THEME_COLORS.textSecondary, fontSize: 13, mt: 0.5 }}>
      {card.description}
    </Typography>
  </button>
);

const VeripassUserManager = ({ userId, apiKey = '', environment = 'production', onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isUserNotFound, setIsUserNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [userStatuses, setUserStatuses] = useState({});
  const [copiedField, setCopiedField] = useState(null);

  const loadingState = { isLoading, setIsLoading };
  const entityState = { entity: user, setEntity: setUser };

  // Built inside the component so the credential context (apiKey/environment) is
  // threaded into every service instance the initial fetch spins up.
  const getEntity = async (payload, entity) => {
    const entityService = new entity({ apiKey, settings: { environment } });
    const entityResponse = await entityService.getByParameters(payload);

    if (!entityResponse || !entityResponse.result) {
      return null;
    }
    return entityResponse.result;
  };

  const getComponentEntities = async (entityId) => {
    try {
      const userResponsePromise = await getEntity(
        {
          queryselector: 'id',
          search: entityId,
        },
        UserManagementService,
      );
      const entityStatusesPromise = await getEntity(
        {
          queryselector: 'status',
          search: '',
        },
        UserManagementService,
      );
      const [userResponse, userStatusesResponse] = await Promise.all([userResponsePromise, entityStatusesPromise]);

      return { userResponse, userStatusesResponse };
    } catch (error) {
      console.error(error);
    }
  };

  const sectionComponents = {
    profile: { Component: VeripassUserQuickStandardManager, entityRef: 'profile' },
    identity: { Component: UserIdentityManager, entityRef: 'contact' },
    information: { Component: UserInformationManager, entityRef: 'information' },
    'access-map': { Component: UserOrganizationRoleManager, entityRef: 'user_organization' },
    security: { Component: UserSecurityManager, entityRef: 'security' },
    biometrics: { Component: UserBiometricsManager, entityRef: 'user_biometrics' },
    contracts: { Component: UserContractsManager, entityRef: 'user_contracts' },
    'sensitive-information': { Component: UserInformationSensitiveManager, entityRef: 'information_sensitive' },
    logs: { Component: UserLogManager, entityRef: 'user_logs' },
    metadata: { Component: UserMetadataManager, entityRef: 'user_metadata' },
    settings: { Component: UserSettingsManager, entityRef: 'settings' },
  };

  const hashSection = (location.hash || '').replace('#', '');
  const activeSection = SECTION_KEYS.includes(hashSection) ? hashSection : 'overview';

  const profile = user?.profile || {};
  const displayName = profile.display_name || [profile.first_name, profile.last_name].filter(Boolean).join(' ');
  const universalId = user?.identity || user?.id || '';
  const primaryEmail = profile.primary_email_address || '';
  const primaryPhone = profile.primary_phone_number?.international_phone_number || '';
  const avatarUrl = profile.profile_ui_settings?.profile_picture_url || '';
  const publicSlug = profile.username || '';
  const publicUrl = publicSlug ? `https://me.veripass.com.co/${publicSlug}` : '';

  const initializeComponent = async (entityId) => {
    const { userResponse, userStatusesResponse } = await getComponentEntities(entityId);

    if (!userResponse || !userResponse?.items?.length) {
      setIsUserNotFound(true);
      setIsLoading(false);
      return;
    }

    setUser(userResponse?.items[0] ?? {});
    setUserStatuses(userStatusesResponse);
    setIsLoading(false);
  };

  const sectionOnClick = (sectionKey) => {
    navigate({ hash: `#${sectionKey}`, search: '' });
  };

  const overviewCardOnClick = (cardKey) => {
    if (cardKey === 'devices') {
      onNavigate?.('devices', userId);
      return;
    }

    if (cardKey === 'organizations') {
      onNavigate?.('organizations', userId);
      return;
    }

    sectionOnClick(cardKey);
  };

  const handleCopy = (field, value) => {
    if (!value) {
      return;
    }

    try {
      navigator.clipboard.writeText(value);
    } catch (error) {
      /* silent */
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleUpdatedEntity = (action, payload) => {
    if (action === 'veripass-user-quick-standard::updated' && payload?.result) {
      setUser(payload.result);
    }
  };

  const renderHero = () => (
    <>
      {/* Cover band + overlapping avatar — same visual skeleton as the organization identity hero */}
      <div className="bg-light" style={{ height: 120 }} />
      <div style={{ marginTop: -44, marginLeft: 24, position: 'relative', zIndex: 2 }}>
        <Avatar
          src={avatarUrl || undefined}
          variant="rounded"
          alt={displayName}
          sx={{
            width: 80,
            height: 80,
            bgcolor: THEME_COLORS.brandPrimary,
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.75rem',
            border: '3px solid #fff',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {(displayName || 'U').charAt(0).toUpperCase()}
        </Avatar>
      </div>

      <div className="d-flex flex-wrap align-items-start justify-content-between px-3 pt-3 gap-2">
        <div className="overflow-hidden" style={{ minWidth: 0, flex: 1 }}>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <h4 className="fw-bold mb-0 text-truncate" style={{ color: THEME_COLORS.textPrimary }}>
              {displayName || 'Unnamed User'}
            </h4>
            {user?.status && <StatusChip status={user.status} />}
          </div>
          <small className="text-muted">Official user profile</small>
        </div>
        {universalId && (
          <div className="flex-shrink-0">
            <small
              className="text-uppercase text-muted fw-semibold d-block mb-1"
              style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}
            >
              User ID
            </small>
            <span
              className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-2"
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: THEME_COLORS.textPrimary,
                backgroundColor: THEME_COLORS.surfaceCard,
                border: `1px solid ${THEME_COLORS.borderMuted}`,
              }}
            >
              {universalId}
              <Tooltip title={copiedField === 'identity' ? 'Copied!' : 'Copy'} arrow>
                <IconButton
                  size="small"
                  onClick={() => handleCopy('identity', universalId)}
                  sx={{ padding: '2px', color: copiedField === 'identity' ? THEME_COLORS.success : THEME_COLORS.textMuted }}
                >
                  {copiedField === 'identity' ? <CheckIcon sx={{ fontSize: 12 }} /> : <ContentCopyIcon sx={{ fontSize: 12 }} />}
                </IconButton>
              </Tooltip>
            </span>
          </div>
        )}
      </div>
      <hr className="mx-3 my-2" style={{ borderColor: THEME_COLORS.borderMuted }} />
      <div className="row px-3 pb-3 g-2">
        <div className="col-12 col-sm-6 col-md-3 overflow-hidden">
          <small
            className="text-uppercase text-muted fw-semibold d-block mb-1"
            style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}
          >
            Access URL
          </small>
          {publicUrl ? (
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="d-block text-truncate fw-medium text-decoration-none"
              style={{ fontSize: '0.85rem', color: THEME_COLORS.textPrimary }}
            >
              {publicUrl}
            </a>
          ) : (
            <span className="text-muted fst-italic" style={{ fontSize: '0.85rem' }}>
              Not published yet
            </span>
          )}
        </div>
        <div className="col-12 col-sm-6 col-md-3 overflow-hidden">
          <small
            className="text-uppercase text-muted fw-semibold d-block mb-1"
            style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}
          >
            Public Slug
          </small>
          {publicSlug ? (
            <span className="d-block text-truncate fw-medium" style={{ fontSize: '0.85rem', color: THEME_COLORS.textPrimary }}>
              {publicSlug}
            </span>
          ) : (
            <span className="text-muted fst-italic" style={{ fontSize: '0.85rem' }}>
              Not published yet
            </span>
          )}
        </div>
        <div className="col-12 col-sm-6 col-md-3 overflow-hidden">
          <small
            className="text-uppercase text-muted fw-semibold d-block mb-1"
            style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}
          >
            Primary Email
          </small>
          {primaryEmail ? (
            <span className="d-block text-truncate fw-medium" style={{ fontSize: '0.85rem', color: THEME_COLORS.textPrimary }}>
              {primaryEmail}
            </span>
          ) : (
            <span className="text-muted fst-italic" style={{ fontSize: '0.85rem' }}>
              Not provided
            </span>
          )}
        </div>
        <div className="col-12 col-sm-6 col-md-3 overflow-hidden">
          <small
            className="text-uppercase text-muted fw-semibold d-block mb-1"
            style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}
          >
            Primary Phone
          </small>
          {primaryPhone ? (
            <span className="d-block text-truncate fw-medium" style={{ fontSize: '0.85rem', color: THEME_COLORS.textPrimary }}>
              {primaryPhone}
            </span>
          ) : (
            <span className="text-muted fst-italic" style={{ fontSize: '0.85rem' }}>
              Not provided
            </span>
          )}
        </div>
      </div>
    </>
  );

  const renderOverview = () => (
    <section>
      <header className="mb-3">
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: THEME_COLORS.textStrong }}>
          What this user can access
        </Typography>
        <Typography variant="body2" sx={{ color: THEME_COLORS.textSecondary }}>
          Permissions, devices and organizations linked to this user. Each card opens its view.
        </Typography>
      </header>

      <section className="row g-3 align-items-stretch">
        {OVERVIEW_CARDS.map((card) => (
          <div key={card.key} className="col-12 col-sm-6 col-xl-4 d-flex">
            <OverviewTile card={card} onClick={() => overviewCardOnClick(card.key)} />
          </div>
        ))}
      </section>
    </section>
  );

  const renderSection = () => {
    if (activeSection === 'overview') {
      return renderOverview();
    }

    const sectionDefinition = sectionComponents[activeSection];
    if (!sectionDefinition) {
      return null;
    }

    const { Component, entityRef } = sectionDefinition;

    return (
      <Component
        relatedEntities={{ statuses: userStatuses }}
        loadingState={loadingState}
        entityState={entityState}
        entityRef={entityRef}
        entityId={userId}
        user={user}
        entitySelected={user}
        apiKey={apiKey}
        environment={environment}
        showFullDetailsLink={false}
        autoSwitchToPreview={true}
        showCloseButton={false}
        onUpdatedEntity={handleUpdatedEntity}
      />
    );
  };

  useEffect(() => {
    if (userId) {
      initializeComponent(userId);
    }
  }, [userId]);

  if (isUserNotFound) {
    return <RetryMessage />;
  }

  return (
    <section className="container-fluid py-3 px-0 px-md-2" style={{ maxWidth: 1440 }}>
      {/* Hero header — same visual skeleton as the organization workspace */}
      <article className="card shadow mb-3 overflow-hidden">
        <section className="card-body p-0">{renderHero()}</section>
      </article>

      {/* Mobile nav: horizontal scrollable pills */}
      <nav className="d-lg-none d-flex gap-2 overflow-auto pb-2 mb-3" style={{ scrollbarWidth: 'none' }}>
        {SECTION_ITEMS.map((item) => (
          <Chip
            key={item.key}
            icon={<item.Icon sx={{ fontSize: 15 }} />}
            label={item.label}
            size="small"
            onClick={() => sectionOnClick(item.key)}
            sx={{
              flexShrink: 0,
              fontWeight: activeSection === item.key ? 600 : 500,
              color: activeSection === item.key ? '#FFFFFF' : THEME_COLORS.textBody,
              backgroundColor: activeSection === item.key ? THEME_COLORS.brandPrimary : 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(2, 6, 23, 0.06)',
              '& .MuiChip-icon': { color: activeSection === item.key ? '#FFFFFF' : THEME_COLORS.textSecondary },
              '&:hover': {
                backgroundColor: activeSection === item.key ? THEME_COLORS.brandPrimaryDark : 'rgba(255,255,255,0.9)',
              },
            }}
          />
        ))}
      </nav>

      <section className="row g-3">
        {/* Desktop nav panel */}
        <aside className="col-lg-4 col-xl-3 col-xxl-2 d-none d-lg-block">
          <nav className="h-100 py-2" style={GLASS.panel}>
            <List dense component="div" disablePadding>
              {SECTION_GROUPS.map((group) => (
                <React.Fragment key={group.label}>
                  <ListSubheader
                    component="div"
                    disableSticky
                    sx={{
                      lineHeight: '30px',
                      textTransform: 'uppercase',
                      fontSize: 10.5,
                      letterSpacing: '0.08em',
                      color: THEME_COLORS.textMuted,
                      background: 'transparent',
                    }}
                  >
                    {group.label}
                  </ListSubheader>
                  {group.items.map((item) => (
                    <ListItemButton
                      key={item.key}
                      selected={activeSection === item.key}
                      onClick={() => sectionOnClick(item.key)}
                      sx={{
                        borderRadius: '10px',
                        mx: 1,
                        mb: 0.25,
                        py: 0.6,
                        '&.Mui-selected': {
                          backgroundColor: tint(THEME_COLORS.brandPrimary, '14'),
                          color: THEME_COLORS.brandPrimary,
                          '& .MuiListItemIcon-root': { color: THEME_COLORS.brandPrimary },
                          '&:hover': { backgroundColor: tint(THEME_COLORS.brandPrimary, '1F') },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <item.Icon sx={{ fontSize: 18 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ fontSize: 13, fontWeight: activeSection === item.key ? 600 : 500 }}
                      />
                    </ListItemButton>
                  ))}
                </React.Fragment>
              ))}
            </List>
          </nav>
        </aside>

        {/* Content panel */}
        <section className="col-12 col-lg-8 col-xl-9 col-xxl-10">
          <article className="p-3" style={GLASS.panel}>
            {renderSection()}
          </article>
        </section>
      </section>
    </section>
  );
};

export default VeripassUserManager;
