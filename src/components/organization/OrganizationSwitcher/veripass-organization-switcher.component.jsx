import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Tooltip, CircularProgress, Snackbar, Alert, Divider } from '@mui/material';
import { SwapHoriz as SwapIcon, SettingsOutlined, Add as AddIcon, Check as CheckIcon } from '@mui/icons-material';
import { useAuth } from '@hooks/useAuth.hook';
import AuthStandardService from '@services/security/auth-standard/auth-standard.service';
import { PoweredBy } from '@components/shared/PoweredBy/PoweredBy.component';

const OrganizationAvatar = styled('figure')(({ ui }) => ({
  height: '32px',
  maxWidth: '32px',
  margin: 0,
  fontSize: '14px',
  minWidth: '32px',
  borderRadius: '6px',
  backgroundColor: ui?.theme?.avatarBackground || '#1e293b',
  color: ui?.theme?.avatarForeground || '#ffffff',
  fontWeight: '600',
}));

const OrganizationsContainer = styled('menu')({
  zIndex: 1060,
  padding: '8px 0 0 0',
  margin: 0,
  listStyle: 'none',
  maxWidth: '320px',
  paddingInlineStart: '0',
  minWidth: '320px',
});

const ProfileToggleButton = styled('button')({
  transition: 'all 0.2s',
  padding: '8px',
  borderRadius: '8px',
  backgroundColor: 'transparent',
  border: 'none',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
});

const OrganizationName = styled('strong')({
  fontSize: '14px',
  fontWeight: 600,
  color: '#0f172a',
});

const OrganizationRole = styled('small')({
  fontSize: '13px',
  color: '#64748b',
});

const OrganizationsDropdown = styled('nav')({
  zIndex: 1060,
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  backgroundColor: '#ffffff',
});

const DropdownItem = styled('article')(({ active }) => ({
  padding: '12px 16px',
  cursor: !active ? 'pointer' : 'default',
  transition: 'background-color 0.15s ease',
  backgroundColor: active ? 'rgba(0,0,0,0.02)' : 'transparent',
  border: 'none',
  outline: 'none',
  '&:hover': {
    backgroundColor: !active ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.02)',
  },
  '& .manage-btn': {
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  '&:hover .manage-btn': {
    opacity: 1,
  },
}));

const ManageButton = styled('button')({
  background: 'transparent',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '4px 8px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#475569',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  '&:hover': {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },
});

const FooterSection = styled('footer')({
  backgroundColor: '#f8fafc',
  padding: '12px 16px',
  borderTop: '1px solid #f1f5f9',
});

const CreateOrganizationItem = styled('button')({
  padding: '12px 16px',
  cursor: 'pointer',
  textAlign: 'left',
  border: 'none',
  background: 'transparent',
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
});

const DashedCircle = styled('figure')({
  height: '32px',
  maxWidth: '32px',
  margin: 0,
  borderRadius: '50%',
  border: '1px dashed #cbd5e1',
  color: '#64748b',
});

export const VeripassOrganizationSwitcher = ({
  isCondensed = false,
  ui = {
    theme: {
      avatarBackground: '#1e293b',
      avatarForeground: '#ffffff',
    },
    copy: {
      switchOrganization: 'Switch Organization',
      createOrganization: 'Create organization',
      defaultOrganization: 'Organization',
    },
  },
  onCreateOrganizationClick = () => {},
  onManageClick = () => {},
  apiKey = '',
  environment = 'production',
}) => {
  const { user, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [contextData, setContextData] = useState({
    switchableOrganizations: [],
    currentOrganizationId: null,
    currentDisplayName: ui.copy?.defaultOrganization || 'Organization',
    currentRole: 'Member',
  });

  const getSwitchableOrganizations = (linkedOrganizations = [], hostOrganization = null) => {
    return linkedOrganizations.filter((organization) => organization.organization_id !== hostOrganization?.id);
  };

  const getDisplayDetails = (targetOrganizationId, switchableOrganizations, roles = []) => {
    const targetLink = switchableOrganizations.find((organization) => organization.organization_id === targetOrganizationId);
    const targetRole = roles.find((role) => role.organization_id === targetOrganizationId);

    if (targetLink) {
      return {
        displayName:
          targetLink.context?.organization?.profile?.display_name ||
          targetLink.context?.profile?.display_name ||
          targetLink.name ||
          ui.copy?.defaultOrganization ||
          'Organization',
        roleName: targetLink.context?.role?.name || targetLink.context?.role_name || 'Member',
      };
    }

    if (targetRole) {
      return {
        displayName: targetRole.context?.organization?.profile?.display_name || ui.copy?.defaultOrganization || 'Organization',
        roleName: targetRole.context?.role?.name || targetRole.context?.role_name || 'Member',
      };
    }

    if (switchableOrganizations.length > 0) {
      const fallbackOrganization = switchableOrganizations[0];
      return {
        displayName:
          fallbackOrganization.context?.organization?.profile?.display_name ||
          fallbackOrganization.context?.profile?.display_name ||
          ui.copy?.defaultOrganization ||
          'Organization',
        roleName: fallbackOrganization.context?.role?.name || fallbackOrganization.context?.role_name || 'Member',
      };
    }

    return {
      displayName: user?.payload?.profile?.display_name || user?.identity || 'My Account',
      roleName: 'Owner',
    };
  };

  useEffect(() => {
    if (!user) return;

    const rolesContext = user.payload?.roles || [];
    const allMemberships = user.memberships?.items || [];

    const switchableOrganizations = getSwitchableOrganizations(allMemberships, user.host_organization);
    const activeOrganizationId = user.memberships?.active?.organization_id;
    const displayDetails = getDisplayDetails(activeOrganizationId, switchableOrganizations, rolesContext);

    setContextData({
      switchableOrganizations,
      currentOrganizationId: activeOrganizationId,
      currentDisplayName: displayDetails.displayName,
      currentRole: displayDetails.roleName,
    });
  }, [user, ui.copy?.defaultOrganization]); // Added ui.copy?.defaultOrganization to dependency array

  const handleSwitchContext = async (targetOrganizationId) => {
    if (targetOrganizationId === contextData.currentOrganizationId || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const authService = new AuthStandardService({
        apiKey,
        settings: { environment },
      });

      const response = await authService.switchContext({
        target_organization_id: targetOrganizationId,
        host_organization_id: user.host_organization?.id,
      });

      if (response && response.success) {
        await login({ user: response.result });
        window.location.reload();
      } else {
        setError(response?.message || 'Failed to switch context');
      }
    } catch (err) {
      setError('An error occurred while switching context');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => setError(null);

  const getInitial = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const renderOrganizationItem = (id, displayName, roleName, isActive) => (
    <DropdownItem
      className="d-flex align-items-center"
      key={`organization-${id}`}
      active={isActive}
      onClick={() => !isActive && handleSwitchContext(id)}
      tabIndex={isActive ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!isActive) handleSwitchContext(id);
        }
      }}
    >
      <OrganizationAvatar className="me-2 d-flex justify-content-center align-items-center w-100" ui={ui}>
        {getInitial(displayName)}
      </OrganizationAvatar>

      <header className="d-flex flex-column flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
        <OrganizationName className="text-truncate w-100 d-inline-block">{displayName}</OrganizationName>
        <OrganizationRole className="text-truncate w-100 d-inline-block">{roleName}</OrganizationRole>
      </header>

      {!isActive && !isLoading && <SwapIcon className="ms-2" sx={{ fontSize: 16, color: '#94a3b8' }} />}

      {!isActive && isLoading && <CircularProgress size={16} className="ms-2" />}

      {isActive && <CheckIcon className="d-lg-none ms-2" sx={{ fontSize: 16, color: '#475569' }} />}
      {isActive && (
        <ManageButton
          className="manage-btn ms-2 d-flex align-items-center"
          onClick={(e) => {
            e.stopPropagation();
            if (onManageClick) onManageClick({ id, displayName, roleName });
          }}
        >
          <SettingsOutlined sx={{ fontSize: 14, mr: 0.5 }} /> Manage
        </ManageButton>
      )}
    </DropdownItem>
  );

  const hasOtherSwitchableOrganizations = contextData.switchableOrganizations.some(
    (organization) => organization.organization_id !== contextData.currentOrganizationId,
  );

  return (
    <section className="dropup notification-list w-100" style={ui?.style}>
      <Tooltip
        title={isCondensed ? contextData.currentDisplayName : ui.copy?.switchOrganization || 'Switch Organization'}
        placement="right"
      >
        <ProfileToggleButton
          type="button"
          className={`w-100 d-flex align-items-center ${
            isCondensed ? 'justify-content-center' : 'justify-content-start'
          } dropdown-toggle text-truncate`}
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          disabled={isLoading}
        >
          <OrganizationAvatar
            className={`${isCondensed ? '' : 'me-2'} d-flex justify-content-center align-items-center w-100`}
            ui={ui}
          >
            {getInitial(contextData.currentDisplayName)}
          </OrganizationAvatar>

          {!isCondensed && (
            <header className="d-flex flex-column overflow-hidden text-start flex-grow-1 text-truncate" style={{ minWidth: 0 }}>
              <OrganizationName className="text-truncate w-100 d-inline-block">{contextData.currentDisplayName}</OrganizationName>
              <OrganizationRole className="text-truncate w-100 d-inline-block">{contextData.currentRole}</OrganizationRole>
            </header>
          )}
          {!isCondensed && <SwapIcon className="mx-1 text-muted" fontSize="small" />}
        </ProfileToggleButton>
      </Tooltip>

      <OrganizationsDropdown className="dropdown-menu profile-dropdown p-0 border-0 mb-2 overflow-hidden">
        <OrganizationsContainer className="d-flex flex-column position-relative w-100">
          <li className="p-0 m-0">
            {renderOrganizationItem(
              contextData.currentOrganizationId,
              contextData.currentDisplayName,
              contextData.currentRole,
              true,
            )}
          </li>

          <Divider sx={{ my: 0, borderColor: '#f1f5f9' }} component="li" />

          {hasOtherSwitchableOrganizations && (
            <React.Fragment>
              {contextData.switchableOrganizations.map((link) => {
                const linkOrganizationId = link.organization_id;
                if (linkOrganizationId === contextData.currentOrganizationId) return null;

                const displayName =
                  link.context?.organization?.profile?.display_name ||
                  link.context?.profile?.display_name ||
                  ui.copy?.defaultOrganization ||
                  'Organization';

                const roleName = link.context?.role?.name || link.context?.role_name || 'Member';

                return (
                  <li className="p-0 m-0" key={`link-${linkOrganizationId}`}>
                    {renderOrganizationItem(linkOrganizationId, displayName, roleName, false)}
                  </li>
                );
              })}
            </React.Fragment>
          )}

          {hasOtherSwitchableOrganizations && <Divider sx={{ my: 0, borderColor: '#f1f5f9' }} component="li" />}

          <li className="p-0 m-0">
            <CreateOrganizationItem
              className="w-100 d-flex align-items-center"
              onClick={() => {
                if (onCreateOrganizationClick) onCreateOrganizationClick();
              }}
            >
              <DashedCircle className="me-3 d-flex justify-content-center align-items-center w-100">
                <AddIcon sx={{ fontSize: 18 }} />
              </DashedCircle>
              <OrganizationName style={{ color: '#475569', fontWeight: 500 }}>
                {ui.copy?.createOrganization || 'Create organization'}
              </OrganizationName>
            </CreateOrganizationItem>
          </li>

          <FooterSection className="d-flex justify-content-center">
            <PoweredBy align="center" position="bottom" />
          </FooterSection>
        </OrganizationsContainer>
      </OrganizationsDropdown>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </section>
  );
};
