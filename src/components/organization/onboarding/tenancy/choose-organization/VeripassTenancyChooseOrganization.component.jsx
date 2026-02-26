import React, { useEffect, useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
import styled from 'styled-components';

// 1. Styled Components

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
  '& .MuiInputBase-input': {
    fontSize: '0.875rem',
    padding: '12px 14px',
  },
});

const OrganizationListContainer = styled('ul')({
  maxHeight: '360px',
  overflowY: 'auto',
  backgroundColor: '#fafbfc',
  borderRadius: '8px',
  borderTop: '1px solid #f0f1f3',
  padding: 0,
  margin: '0 -48px',
  listStyle: 'none',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#ddd',
    borderRadius: '4px',
  },
});

const OrganizationRow = styled('li')({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 48px',
  cursor: 'pointer',
  borderBottom: '1px solid #f3f4f6',
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor: '#f3f4f6',
  },
  '&:last-child': {
    borderBottom: 'none',
  },
});

const OrganizationAvatarWrapper = styled('figure')(({ $avatarColor }) => ({
  width: '34px',
  height: '34px',
  color: '#ffffff',
  fontSize: '0.7rem',
  backgroundColor: $avatarColor || 'transparent',
  fontWeight: '600',
  margin: '0 12px 0 0',
  flexShrink: 0,
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  letterSpacing: '0.03em',
}));

const OrganizationName = styled('h6')({
  fontSize: '0.875rem',
  color: '#0f172a',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const OrganizationSlug = styled('p')({
  fontSize: '0.75rem',
  color: '#64748b',
  marginTop: '2px',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const OrganizationBadge = styled('span')(({ $isOwner }) => ({
  backgroundColor: $isOwner ? '#eff6ff' : '#f9fafb',
  color: $isOwner ? '#3b82f6' : '#6b7280',
  fontSize: '0.7rem',
  fontWeight: '500',
  border: `1px solid ${$isOwner ? '#bfdbfe' : '#e5e7eb'}`,
  marginRight: '12px',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}));

const OrganizationListFooter = styled('footer')({
  borderTop: '1px solid #f0f1f3',
  backgroundColor: '#fafbfc',
  margin: '0 -48px -48px -48px',
  padding: '14px 48px',
  borderRadius: '0 0 16px 16px',
});

const FooterHelpText = styled('span')({
  fontSize: '0.8rem',
  color: '#6b7280',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const FooterCreateLink = styled('a')(({ $customTheme }) => ({
  color: $customTheme?.linkColor || '#0d6efd',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '0.8rem',
  display: 'flex',
  alignItems: 'center',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}));

const ViewTitle = styled('h5')({
  fontSize: '0.8rem',
  color: '#1a1a2e',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const ViewSubtitle = styled('p')({
  fontSize: '0.85rem',
  color: '#6b7280',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const StatusMessage = styled('p')({
  fontSize: '0.875rem',
});

// 2. Constants

const NAMESPACE = 'veripass-tenancy-onboarding';
const ACTIONS = {
  CHOOSE_BACK: `${NAMESPACE}::choose-organization/back`,
  CHOOSE_SEARCH_UPDATED: `${NAMESPACE}::choose-organization/search-updated`,
  CHOOSE_SELECTED_UPDATED: `${NAMESPACE}::choose-organization/selected-updated`,
  CHOOSE_CONTINUE: `${NAMESPACE}::choose-organization/continue`,
  CHOOSE_CREATE_NEW: `${NAMESPACE}::choose-organization/create-new`,
};

// 3. Component

function VeripassTenancyChooseOrganizationComponent({
  ui = {},
  organization = {},
  organizations = [],
  searchValue = '',
  selectedOrganizationId = null,
  itemOnAction,
  updateOnAction,
  loading = false,
  error = null,
  environment = 'production',
  apiKey = '',
}) {
  // Hooks
  const [search, setSearch] = useState(searchValue);
  const copy = ui.copy || {};

  // Component Functions
  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (updateOnAction) {
      updateOnAction({
        action: ACTIONS.CHOOSE_SEARCH_UPDATED,
        namespace: NAMESPACE,
        payload: { search: val },
      });
    }
  };

  const handleSelect = (id) => {
    if (updateOnAction) {
      updateOnAction({
        action: ACTIONS.CHOOSE_SELECTED_UPDATED,
        namespace: NAMESPACE,
        payload: { organizationId: id },
      });
    }
    if (itemOnAction) {
      itemOnAction({
        action: ACTIONS.CHOOSE_CONTINUE,
        namespace: NAMESPACE,
        payload: { organizationId: id },
      });
    }
  };

  const handleCreateNew = (e) => {
    e.preventDefault();
    if (itemOnAction) {
      itemOnAction({ action: ACTIONS.CHOOSE_CREATE_NEW, namespace: NAMESPACE });
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getColorForString = (str) => {
    const colors = ['#1e293b', '#6366f1', '#10b981', '#f97316', '#ef4444', '#8b5cf6'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const filteredOrganizations = search
    ? organizations.filter(
        (org) => org.name?.toLowerCase().includes(search.toLowerCase()) || org.slug?.toLowerCase().includes(search.toLowerCase()),
      )
    : organizations;

  // Render
  return (
    <section className="veripass-container-fluid veripass-w-100 veripass-p-0">
      <header className="veripass-mb-4 veripass-text-left">
        {ui.showTitle !== false && (
          <ViewTitle className="veripass-fw-bold veripass-text-dark veripass-mb-2">
            {copy.chooseTitle || 'Choose your organization'}
          </ViewTitle>
        )}
        <ViewSubtitle className="veripass-text-secondary veripass-m-0">
          {copy.chooseSubtitle || 'Select an existing workspace to manage your SDK integration.'}
        </ViewSubtitle>
      </header>

      {error && typeof error === 'string' && (
        <aside className="veripass-alert veripass-alert-danger veripass-mb-3 veripass-p-2 veripass-border-radius-1" role="alert">
          {error}
        </aside>
      )}

      <article className="veripass-mb-0">
        <nav className="veripass-mb-4">
          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="Filter organizations..."
            value={search}
            onChange={handleSearchChange}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9ca3af', fontSize: '1.25rem' }} />
                </InputAdornment>
              ),
            }}
          />
        </nav>

        <OrganizationListContainer>
          {loading ? (
            <li className="veripass-p-4 veripass-text-center">
              <StatusMessage className="veripass-text-secondary veripass-m-0">Loading organizations...</StatusMessage>
            </li>
          ) : filteredOrganizations.length === 0 ? (
            <li className="veripass-p-4 veripass-text-center">
              <StatusMessage className="veripass-text-secondary veripass-m-0">
                {search ? 'No organizations found matching your search.' : "You don't belong to any organizations yet."}
              </StatusMessage>
            </li>
          ) : (
            filteredOrganizations.map((organization) => (
              <OrganizationRow key={organization.id} onClick={() => handleSelect(organization.id)}>
                <OrganizationAvatarWrapper
                  className="veripass-d-flex veripass-align-items-center veripass-justify-content-center veripass-rounded-circle"
                  $avatarColor={getColorForString(organization.name)}
                >
                  {getInitials(organization.name)}
                </OrganizationAvatarWrapper>

                <section className="veripass-flex-grow-1 veripass-overflow-hidden">
                  <OrganizationName className="veripass-m-0 veripass-fw-semibold veripass-text-truncate">
                    {organization.name}
                  </OrganizationName>
                  <OrganizationSlug className="veripass-m-0 veripass-text-truncate">{organization.slug}</OrganizationSlug>
                </section>

                <aside className="veripass-d-flex veripass-align-items-center">
                  <OrganizationBadge
                    $isOwner={organization.role === 'Owner'}
                    className="veripass-rounded-pill veripass-px-2 veripass-py-1"
                  >
                    {organization.role || 'Member'}
                  </OrganizationBadge>
                  <ArrowForwardIosIcon sx={{ fontSize: '0.75rem', color: '#d1d5db' }} />
                </aside>
              </OrganizationRow>
            ))
          )}
        </OrganizationListContainer>

        <OrganizationListFooter className="veripass-d-flex veripass-justify-content-between veripass-align-items-center">
          <FooterHelpText>Can't find your organization?</FooterHelpText>
          <FooterCreateLink href="#" onClick={handleCreateNew} $customTheme={ui.theme}>
            {copy.createNewLabel || 'Create new workspace'} <ArrowForwardIcon sx={{ fontSize: '0.9rem', ml: 0.5 }} />
          </FooterCreateLink>
        </OrganizationListFooter>
      </article>
    </section>
  );
}

export const VeripassTenancyChooseOrganization = VeripassTenancyChooseOrganizationComponent;
