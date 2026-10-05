import React, { useState, useEffect, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { Tooltip, CircularProgress, Snackbar, Alert, Divider, TextField, Radio, Popover } from '@mui/material';
import { SwapHoriz as SwapIcon, SettingsOutlined, Add as AddIcon, Check as CheckIcon } from '@mui/icons-material';
import { useAuth, useAdminContext } from '@hooks/useAuth.hook';
import AuthStandardService from '@services/security/auth-standard/auth-standard.service';
import OrganizationApplicationService from '@services/organization/relationships/organization-application/organization-application.service';
import { PoweredBy } from '@components/shared/PoweredBy/PoweredBy.component';
import { VeripassOrganizationCreateDialog } from '@components/organization/OrganizationCreate/VeripassOrganizationCreateDialog.component';
import { ORGANIZATION_EVENTS, dispatchOrganizationEvent } from '@components/organization/shared/organization-context.events';

const FONT_FAMILY = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const Root = styled('section')({
  width: '100%',
  fontFamily: FONT_FAMILY,
  color: '#0f172a',
  '& *, & *::before, & *::after': { boxSizing: 'border-box' },
});

const OrganizationAvatar = styled('figure')(({ ui }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  height: '32px',
  width: '32px',
  margin: 0,
  fontSize: '14px',
  borderRadius: '6px',
  backgroundColor: ui?.theme?.avatarBackground || '#1e293b',
  color: ui?.theme?.avatarForeground || '#ffffff',
  fontWeight: 600,
}));

const ProfileToggleButton = styled('button')(({ condensed }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: condensed ? 'center' : 'flex-start',
  gap: condensed ? 0 : '8px',
  width: '100%',
  padding: '8px',
  borderRadius: '8px',
  backgroundColor: 'transparent',
  border: 'none',
  fontFamily: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
  '&:disabled': { cursor: 'default', opacity: 0.7 },
}));

const TextStack = styled('span')({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  minWidth: 0,
  textAlign: 'left',
});

const OrganizationName = styled('strong')({
  display: 'block',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.3,
  color: '#0f172a',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const OrganizationRole = styled('small')({
  display: 'block',
  fontSize: '13px',
  lineHeight: 1.3,
  color: '#64748b',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const MenuList = styled('div')({
  width: '320px',
  maxWidth: '100%',
  fontFamily: FONT_FAMILY,
  paddingTop: '8px',
});

const Row = styled('div')(({ active, interactive }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 16px',
  cursor: interactive ? 'pointer' : 'default',
  backgroundColor: active ? 'rgba(0,0,0,0.02)' : 'transparent',
  outline: 'none',
  transition: 'background-color 0.15s ease',
  '&:hover, &:focus-visible': { backgroundColor: interactive ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.02)' },
  '& .manage-btn': { opacity: 0, transition: 'opacity 0.2s' },
  '&:hover .manage-btn': { opacity: 1 },
}));

const ManageButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  background: 'transparent',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '4px 8px',
  fontFamily: 'inherit',
  fontSize: '12px',
  fontWeight: 600,
  color: '#475569',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  '&:hover': { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' },
});

const FooterSection = styled('footer')({
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: '#f8fafc',
  padding: '12px 16px',
  borderTop: '1px solid #f1f5f9',
});

const CreateOrganizationItem = styled('button')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  padding: '12px 16px',
  border: 'none',
  background: 'transparent',
  fontFamily: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
});

const DashedCircle = styled('span')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  height: '32px',
  width: '32px',
  borderRadius: '50%',
  border: '1px dashed #cbd5e1',
  color: '#64748b',
});

const DEFAULT_COPY = {
  switchOrganization: 'Switch Organization',
  createOrganization: 'Create organization',
  defaultOrganization: 'Organization',
  defaultRole: 'Member',
  globalAdministratorRole: 'Global administrator',
  globalMode: 'Global',
  globalModeDescription: 'Work across every organization',
  fixedMode: 'Fixed context',
  fixedModeDescription: 'Work inside one organization',
  searchOrganizations: 'Search organizations',
  noOrganizations: 'No organizations found',
  fixedContextLabel: 'Fixed context',
  switchFailed: 'Failed to switch context',
  loadFailed: 'Could not load the organizations',
};

const ADMIN_MODES = { global: 'global', fixed: 'fixed' };

const getProfileName = (link) => link?.context?.organization?.profile?.display_name || link?.context?.profile?.display_name;

const getInitial = (name) => {
  if (!name) return 'U';
  return name.charAt(0).toUpperCase();
};

/**
 * Organization switcher. Works with no props: it reads the session, remembers the connection used at sign-in and
 * opens its own "Create organization" dialog. A host administrator chooses between Global and a fixed context.
 * Host apps can listen to `veripass::organization-switched` and `veripass::organization-created` on `window`.
 */
export const VeripassOrganizationSwitcher = ({
  isCondensed = false,
  ui = {},
  onCreateOrganizationClick,
  onManageClick,
  apiKey = '',
  environment,
}) => {
  const { user, login } = useAuth();
  const { isAdmin, adminContext, setAdminContext, clearAdminContext } = useAdminContext();
  const copy = { ...DEFAULT_COPY, ...ui.copy };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(adminContext ? ADMIN_MODES.fixed : ADMIN_MODES.global);
  const [adminOrganizations, setAdminOrganizations] = useState(null);
  const [search, setSearch] = useState('');

  const authService = useMemo(() => new AuthStandardService({ apiKey, settings: { environment } }), [apiKey, environment]);
  const organizationApplicationService = useMemo(
    () => new OrganizationApplicationService({ apiKey, settings: { environment } }),
    [apiKey, environment],
  );

  const hostOrganization = user?.host_organization;
  const hostDisplayName = hostOrganization?.profile?.display_name || copy.defaultOrganization;

  const getRoleName = (link) => {
    const sessionRole = (user?.payload?.roles || []).find((role) => role.organization_id === link.organization_id);

    return link.context?.role?.name || link.context?.role_name || sessionRole?.context?.role?.name || copy.defaultRole;
  };

  const describeMembership = (link) => {
    const isHost = link.organization_id === hostOrganization?.id;

    return {
      id: link.organization_id,
      displayName: getProfileName(link) || (isHost ? hostDisplayName : copy.defaultOrganization),
      roleName: getRoleName(link),
    };
  };

  const memberships = (user?.memberships?.items || []).map(describeMembership);
  const activeOrganizationId = user?.memberships?.active?.organization_id;

  const getActiveDetails = () => {
    if (isAdmin && adminContext) {
      return { displayName: adminContext.display_name || adminContext.slug, roleName: copy.fixedContextLabel };
    }

    if (isAdmin) {
      return { displayName: hostDisplayName, roleName: copy.globalAdministratorRole };
    }

    const activeMembership = memberships.find((membership) => membership.id === activeOrganizationId);
    if (activeMembership) {
      return activeMembership;
    }

    const activeRole = (user?.payload?.roles || []).find((role) => role.organization_id === activeOrganizationId);
    if (activeRole) {
      return {
        displayName: getProfileName(activeRole) || copy.defaultOrganization,
        roleName: activeRole.context?.role?.name || activeRole.context?.role_name || copy.defaultRole,
      };
    }

    return { displayName: user?.payload?.profile?.display_name || user?.identity || 'My Account', roleName: copy.defaultRole };
  };

  const activeDetails = getActiveDetails();

  const isFixedModeOpen = isAdmin && adminMode === ADMIN_MODES.fixed;

  useEffect(() => {
    if (!isFixedModeOpen || adminOrganizations !== null) {
      return;
    }

    const loadOrganizations = async () => {
      const response = await organizationApplicationService.getByParameters(
        { queryselector: 'app-id', search: user?.payload?.app_id },
        { session: true },
      );

      if (!response?.success) {
        setError(response?.message || copy.loadFailed);
        setAdminOrganizations([]);
        return;
      }

      setAdminOrganizations(
        (response.result?.items || [])
          .filter((link) => link.organization_id !== hostOrganization?.id)
          .map((link) => ({
            organization_id: link.organization_id,
            identity: link.organization?.identity,
            slug: link.organization?.slug,
            display_name: link.organization?.display_name || link.organization?.slug || copy.defaultOrganization,
          })),
      );
    };

    loadOrganizations();
  }, [isFixedModeOpen, adminOrganizations]);

  const visibleAdminOrganizations = (adminOrganizations || []).filter((organization) => {
    const term = search.trim().toLowerCase();
    return !term || `${organization.display_name} ${organization.slug}`.toLowerCase().includes(term);
  });

  const handleSwitchContext = async (targetOrganizationId) => {
    if (targetOrganizationId === activeOrganizationId || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.switchContext({ target_organization_id: targetOrganizationId });

      if (!response?.success || !response.result) {
        setError(response?.message || copy.switchFailed);
        return;
      }

      await login({ user: response.result });

      const target = memberships.find((membership) => membership.id === targetOrganizationId);
      const shouldReload = dispatchOrganizationEvent(ORGANIZATION_EVENTS.switched, {
        organization: { id: targetOrganizationId, display_name: target?.displayName },
        session: response.result,
      });

      if (shouldReload) {
        window.location.reload();
      }
    } catch (exception) {
      setError(copy.switchFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectGlobal = () => {
    setAdminMode(ADMIN_MODES.global);
    clearAdminContext();
    dispatchOrganizationEvent(ORGANIZATION_EVENTS.switched, { organization: null, session: null });
  };

  const handleOpenFixedMode = (event) => {
    event.stopPropagation();
    setAdminMode(ADMIN_MODES.fixed);
  };

  const handleSelectFixedContext = (organization) => {
    setAdminContext(organization);
    dispatchOrganizationEvent(ORGANIZATION_EVENTS.switched, {
      organization: { id: organization.organization_id, display_name: organization.display_name },
      session: null,
    });
  };

  const handleCreateClick = () => {
    if (onCreateOrganizationClick) {
      onCreateOrganizationClick();
      return;
    }

    setIsCreateOpen(true);
  };

  const handleCreated = () => {
    setAdminOrganizations(null);
  };

  const closeMenu = () => setMenuAnchor(null);

  const renderOrganizationItem = ({ id, displayName, roleName, isActive, onSelect, trailing = null }) => {
    const select = () => {
      if (isActive) return;
      closeMenu();
      onSelect();
    };

    return (
      <Row
        key={`organization-${id}`}
        role="button"
        active={isActive}
        interactive={!isActive}
        onClick={select}
        tabIndex={isActive ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            select();
          }
        }}
      >
        <OrganizationAvatar ui={ui}>{getInitial(displayName)}</OrganizationAvatar>

        <TextStack>
          <OrganizationName>{displayName}</OrganizationName>
          {roleName && <OrganizationRole>{roleName}</OrganizationRole>}
        </TextStack>

        {!isActive && !isLoading && <SwapIcon sx={{ fontSize: 16, color: '#94a3b8' }} />}
        {!isActive && isLoading && <CircularProgress size={16} />}
        {isActive && <CheckIcon sx={{ fontSize: 16, color: '#475569' }} />}
        {trailing}
      </Row>
    );
  };

  const renderManageButton = () =>
    onManageClick && (
      <ManageButton
        className="manage-btn"
        onClick={(e) => {
          e.stopPropagation();
          closeMenu();
          onManageClick({ id: activeOrganizationId, displayName: activeDetails.displayName, roleName: activeDetails.roleName });
        }}
      >
        <SettingsOutlined sx={{ fontSize: 14, mr: 0.5 }} /> Manage
      </ManageButton>
    );

  const renderModeRow = ({ checked, title, description, onClick }) => (
    <Row role="button" interactive tabIndex={0} onClick={onClick}>
      <Radio size="small" checked={checked} tabIndex={-1} sx={{ p: 0.5 }} />
      <TextStack>
        <OrganizationName>{title}</OrganizationName>
        <OrganizationRole>{description}</OrganizationRole>
      </TextStack>
    </Row>
  );

  const renderAdminPanel = () => (
    <React.Fragment>
      {renderModeRow({
        checked: !isFixedModeOpen,
        title: copy.globalMode,
        description: copy.globalModeDescription,
        onClick: () => {
          closeMenu();
          handleSelectGlobal();
        },
      })}
      {renderModeRow({
        checked: isFixedModeOpen,
        title: copy.fixedMode,
        description: copy.fixedModeDescription,
        onClick: handleOpenFixedMode,
      })}

      {isFixedModeOpen && (
        <React.Fragment>
          <div style={{ padding: '0 16px 8px' }}>
            <TextField
              fullWidth
              size="small"
              placeholder={copy.searchOrganizations}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              inputProps={{ 'aria-label': copy.searchOrganizations }}
            />
          </div>

          <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
            {adminOrganizations === null && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                <CircularProgress size={20} />
              </div>
            )}
            {adminOrganizations !== null && visibleAdminOrganizations.length === 0 && (
              <OrganizationRole style={{ padding: '16px' }}>{copy.noOrganizations}</OrganizationRole>
            )}
            {visibleAdminOrganizations.map((organization) =>
              renderOrganizationItem({
                id: organization.organization_id,
                displayName: organization.display_name,
                roleName: organization.slug,
                isActive: organization.organization_id === adminContext?.organization_id,
                onSelect: () => handleSelectFixedContext(organization),
              }),
            )}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );

  const renderMembershipsPanel = () => {
    const otherMemberships = memberships.filter((membership) => membership.id !== activeOrganizationId);

    return (
      <React.Fragment>
        {renderOrganizationItem({
          id: activeOrganizationId,
          displayName: activeDetails.displayName,
          roleName: activeDetails.roleName,
          isActive: true,
          trailing: renderManageButton(),
        })}

        {otherMemberships.length > 0 && <Divider sx={{ my: 0, borderColor: '#f1f5f9' }} />}

        {otherMemberships.map((membership) =>
          renderOrganizationItem({ ...membership, isActive: false, onSelect: () => handleSwitchContext(membership.id) }),
        )}
      </React.Fragment>
    );
  };

  return (
    <Root style={ui?.style}>
      <Tooltip title={isCondensed ? activeDetails.displayName : copy.switchOrganization} placement="right">
        <ProfileToggleButton
          type="button"
          condensed={isCondensed ? 1 : 0}
          aria-haspopup="true"
          aria-expanded={Boolean(menuAnchor)}
          aria-label={copy.switchOrganization}
          disabled={isLoading}
          onClick={(event) => setMenuAnchor(event.currentTarget)}
        >
          <OrganizationAvatar ui={ui}>{getInitial(activeDetails.displayName)}</OrganizationAvatar>

          {!isCondensed && (
            <TextStack>
              <OrganizationName>{activeDetails.displayName}</OrganizationName>
              <OrganizationRole>{activeDetails.roleName}</OrganizationRole>
            </TextStack>
          )}
          {!isCondensed && <SwapIcon fontSize="small" sx={{ color: '#94a3b8' }} />}
        </ProfileToggleButton>
      </Tooltip>

      <Popover
        open={Boolean(menuAnchor)}
        disableScrollLock
        anchorEl={menuAnchor}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: { sx: { borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', mb: 1, overflow: 'hidden' } },
        }}
      >
        <MenuList>
          {isAdmin ? renderAdminPanel() : renderMembershipsPanel()}

          <Divider sx={{ my: 0, borderColor: '#f1f5f9' }} />

          <CreateOrganizationItem
            onClick={() => {
              closeMenu();
              handleCreateClick();
            }}
          >
            <DashedCircle>
              <AddIcon sx={{ fontSize: 18 }} />
            </DashedCircle>
            <OrganizationName style={{ color: '#475569', fontWeight: 500 }}>{copy.createOrganization}</OrganizationName>
          </CreateOrganizationItem>

          <FooterSection>
            <PoweredBy align="center" position="bottom" />
          </FooterSection>
        </MenuList>
      </Popover>

      <VeripassOrganizationCreateDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleCreated}
        apiKey={apiKey}
        environment={environment}
        ui={ui.createOrganization}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Root>
  );
};
