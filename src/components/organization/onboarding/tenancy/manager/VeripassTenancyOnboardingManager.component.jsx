import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled from 'styled-components';

import { OrganizationManagementService, TenancyProvisioningService, OrganizationMembershipService } from '@services';

import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';
import { PoweredBy } from '@components/shared/PoweredBy/PoweredBy.component';
import { VeripassTenancyOnboardingHub } from '../hub/VeripassTenancyOnboardingHub.component';
import { VeripassTenancyCreateOrganization } from '../create-organization/VeripassTenancyCreateOrganization.component';
import { VeripassTenancyCreateApplication } from '../create-application/VeripassTenancyCreateApplication.component';
import { VeripassTenancyChooseOrganization } from '../choose-organization/VeripassTenancyChooseOrganization.component';
import { VeripassTenancyAllSet } from '../all-set/VeripassTenancyAllSet.component';

const OnboardingMain = styled('main')({});

const OnboardingCard = styled('section')({
  maxWidth: '640px',
  borderRadius: '1.5rem',
  padding: '48px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
  backgroundColor: '#ffffff',
  overflow: 'hidden',
});

const OnboardingFooter = styled('footer')({
  maxWidth: '640px',
});

const BackNav = styled('nav')({
  maxWidth: '640px',
  width: '100%',
  marginBottom: '12px',
});

const StepIndicator = styled('span')({
  fontSize: '0.75rem',
  letterSpacing: '0.05em',
  color: '#94a3b8',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const VIEWS = {
  HUB: 'hub',
  CREATE_ORGANIZATION: 'create-organization',
  CREATE_APPLICATION: 'create-application',
  CHOOSE_ORGANIZATION: 'choose-organization',
  ALL_SET: 'all-set',
};

const NAMESPACE = 'veripass-tenancy-onboarding';

const ACTIONS = {
  HUB_ACTION_CHANGED: `${NAMESPACE}::hub/action-changed`,
  HUB_CONTINUE: `${NAMESPACE}::hub/continue`,
  ORGANIZATION_BACK: `${NAMESPACE}::organization/back`,
  ORGANIZATION_FORM_UPDATED: `${NAMESPACE}::organization/form-updated`,
  ORGANIZATION_CONTINUE: `${NAMESPACE}::organization/continue`,
  CREATE_APP_BACK: `${NAMESPACE}::create-application/back`,
  CREATE_APP_TOGGLE_UPDATED: `${NAMESPACE}::create-application/app-toggle-updated`,
  CREATE_APP_FORM_UPDATED: `${NAMESPACE}::create-application/app-form-updated`,
  CREATE_APP_SUBMIT: `${NAMESPACE}::create-application/submit`,
  CHOOSE_BACK: `${NAMESPACE}::choose-organization/back`,
  CHOOSE_SEARCH_UPDATED: `${NAMESPACE}::choose-organization/search-updated`,
  CHOOSE_SELECTED_UPDATED: `${NAMESPACE}::choose-organization/selected-updated`,
  CHOOSE_CONTINUE: `${NAMESPACE}::choose-organization/continue`,
  CHOOSE_CREATE_NEW: `${NAMESPACE}::choose-organization/create-new`,
  ALL_SET_CONTINUE: `${NAMESPACE}::all-set/continue`,
  ALL_SET_GO_DASHBOARD: `${NAMESPACE}::all-set/go-dashboard`,
};

const STORAGE_KEY = 'veripass::tenancy-onboarding::state';

const saveState = (state) => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (err) {
    console.warn(`[${STORAGE_KEY}] Failed to save state:`, err);
  }
};

const loadState = () => {
  try {
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    }
  } catch (err) {
    console.warn(`[${STORAGE_KEY}] Failed to load state:`, err);
  }
  return null;
};

const clearState = () => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.warn(`[${STORAGE_KEY}] Failed to clear state:`, err);
  }
};

export const VeripassTenancyOnboardingManager = ({
  ui = {
    title: "Let's get started",
    showTitle: true,
    theme: {
      brandPrimary: '#000000',
      brandPrimaryForeground: '#ffffff',
      linkColor: '#0d6efd',
    },
    copy: {
      hubSubtitle: 'Choose how you would like to set up your workspace.',
      createTitle: 'Create your organization',
      createSubtitle: 'Enter details to configure your environment.',
      createAppTitle: 'Finish setup',
      createAppSubtitle: 'Review your details and configure your initial application settings.',
      chooseTitle: 'Choose your organization',
      chooseSubtitle: 'Select an existing workspace to manage your SDK integration.',
      allSetTitle: "You're all set",
      allSetSubtitle: 'We have successfully configured your tenancy.',
    },
    defaultAction: 'create',
    defaultCreateApp: true,
  },
  organization = { name: '', logoSrc: '', slogan: '' },
  user = {},
  onEvent,
  services,
  countdownSeconds = 15,
  environment = 'production',
  apiKey = '',
  ...props
}) => {
  // --- Restore saved state ---
  const savedState = useMemo(() => loadState(), []);

  const getInitialView = () => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashView = window.location.hash.replace('#view=', '');
      if (Object.values(VIEWS).includes(hashView)) {
        return hashView;
      }
    }
    if (savedState?.view && Object.values(VIEWS).includes(savedState.view)) {
      return savedState.view;
    }
    return VIEWS.HUB;
  };

  // State
  const [view, setView] = useState(getInitialView());
  const [selectedAction, setSelectedAction] = useState(savedState?.selectedAction || ui.defaultAction || 'create-organization');

  const [organizationForm, setOrganizationForm] = useState(
    savedState?.organizationForm || { name: '', slug: '', description: '', isSlugEdited: false },
  );
  const [appForm, setAppForm] = useState(
    savedState?.appForm || { createApp: ui.defaultCreateApp !== false, name: '', slug: '', isSlugEdited: false },
  );

  const [organizations, setOrganizations] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(savedState?.result || {});

  // Initialize service instances only if mock services are not provided
  const activeServices = useMemo(() => {
    if (services) return services;

    const serviceSettings = { settings: { environment }, apiKey };
    console.log('service Settings: ', serviceSettings);
    return {
      organizationService: new OrganizationManagementService(serviceSettings),
      provisioningService: new TenancyProvisioningService(serviceSettings),
      OrganizationMembershipService: new OrganizationMembershipService(serviceSettings),
    };
  }, [services, environment, apiKey]);

  // Sync view to URL hash and persist
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, null, `#view=${view}`);
    }
    setError(null);
    // Persist current view to localStorage
    const current = loadState() || {};
    saveState({ ...current, view });
  }, [view]);

  // Handle Hash change for browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hashView = window.location.hash.replace('#view=', '');
      if (Object.values(VIEWS).includes(hashView) && hashView !== view) {
        setView(hashView);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [view]);

  // Fetch organizations when CHOOSE view is active
  useEffect(() => {
    if (view === VIEWS.CHOOSE_ORGANIZATION && organizations.length === 0 && !loading) {
      loadOrganizations();
    }
  }, [view]);

  const loadOrganizations = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeServices.organizationService) {
        const res = await activeServices.organizationService.getByParameters({});
        if (res && res.success && Array.isArray(res.result)) {
          setOrganizations(res.result);
        } else if (res && Array.isArray(res)) {
          setOrganizations(res); // Handle direct array return
        }
      }
    } catch (err) {
      setError('Failed to load organizations.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppSubmit = async (payload) => {
    try {
      if (!activeServices.provisioningService) {
        throw new Error('Provisioning service not available');
      }

      setLoading(true);
      setError(null);

      // Provisioning expects { organization, application } payload. Map 'name' to 'display_name'
      const provisionPayload = {
        organization: {
          display_name: payload.organization.name,
          slug: payload.organization.slug,
          description: payload.organization.description,
        },
        application: payload.createApp ? payload.application : undefined,
        admin: {
          id: user?.id,
        },
      };

      const provisioningResponse = await activeServices.provisioningService.create(provisionPayload);

      if (!provisioningResponse || !provisioningResponse.success) {
        throw new Error(provisioningResponse?.message || 'Failed to provision tenancy');
      }

      // The result from provision likely contains the created entities
      const allSetResult = {
        organization: provisioningResponse.result?.organization || payload.organization,
        application: provisioningResponse.result?.application || (payload.createApp ? payload.application : null),
      };
      setResult(allSetResult);
      saveState({ view: VIEWS.ALL_SET, result: allSetResult, organizationForm, appForm });
      setView(VIEWS.ALL_SET);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during setup.');
    } finally {
      setLoading(false);
    }
  };

  // --- Core Handlers ---
  const handleItemOnAction = ({ action, namespace, payload, error: actionError }) => {
    if (namespace !== NAMESPACE) return;

    switch (action) {
      case ACTIONS.HUB_CONTINUE:
        setView(payload.selectedAction === 'choose-organization' ? VIEWS.CHOOSE_ORGANIZATION : VIEWS.CREATE_ORGANIZATION);
        break;

      case ACTIONS.ORGANIZATION_BACK:
        setView(VIEWS.HUB);
        break;

      case ACTIONS.ORGANIZATION_CONTINUE:
        if (payload?.organization?.name && payload?.organization?.slug) {
          setView(VIEWS.CREATE_APPLICATION);
        } else {
          setError('Name and slug are required.');
        }
        break;

      case ACTIONS.CREATE_APP_BACK:
        setView(VIEWS.CREATE_ORGANIZATION);
        break;

      case ACTIONS.CREATE_APP_SUBMIT:
        if (payload) {
          handleCreateAppSubmit(payload);
        }
        break;

      case ACTIONS.CHOOSE_BACK:
        setView(VIEWS.HUB);
        break;

      case ACTIONS.CHOOSE_CREATE_NEW:
        setView(VIEWS.CREATE_ORGANIZATION);
        break;

      case ACTIONS.CHOOSE_CONTINUE:
        if (payload?.organizationId) {
          setLoading(true);
          setError(null);

          const doJoin = async () => {
            try {
              if (activeServices.OrganizationMembershipService && user?.id) {
                const res = await activeServices.OrganizationMembershipService.create({
                  organization_id: payload.organizationId,
                  user_id: user.id,
                });
                if (!res || !res.success) {
                  throw new Error(res?.message || 'Failed to join the organization.');
                }
              }
              const selectedOrgObj = organizations.find((o) => o.id === payload.organizationId);
              const allSetResult = {
                organizationId: payload.organizationId,
                organization: selectedOrgObj,
              };
              setResult(allSetResult);
              saveState({ view: VIEWS.ALL_SET, result: allSetResult, organizationForm });
              setView(VIEWS.ALL_SET);
            } catch (err) {
              setError(err.message || 'An unexpected error occurred while joining.');
            } finally {
              setLoading(false);
            }
          };

          doJoin();
        }
        break;

      case ACTIONS.ALL_SET_CONTINUE:
        clearState();
        if (onEvent)
          onEvent({ action: ACTIONS.ALL_SET_CONTINUE, namespace: NAMESPACE, payload: { result: payload?.result || result } });
        break;

      case ACTIONS.ALL_SET_GO_DASHBOARD:
        clearState();
        if (onEvent) onEvent({ action: ACTIONS.ALL_SET_GO_DASHBOARD, namespace: NAMESPACE });
        break;

      default:
        break;
    }
  };

  // --- Persist helper (called after state updates) ---
  const persistFormState = (overrides = {}) => {
    const current = loadState() || {};
    saveState({
      ...current,
      view,
      selectedAction,
      organizationForm,
      appForm,
      ...overrides,
    });
  };

  const handleUpdateOnAction = ({ action, namespace, payload }) => {
    if (namespace !== NAMESPACE) return;

    switch (action) {
      case ACTIONS.HUB_ACTION_CHANGED:
        setSelectedAction(payload.selectedAction);
        persistFormState({ selectedAction: payload.selectedAction });
        break;

      case ACTIONS.ORGANIZATION_FORM_UPDATED:
        setOrganizationForm((prev) => {
          const next = { ...prev, ...payload };
          persistFormState({ organizationForm: next });
          return next;
        });
        break;

      case ACTIONS.CREATE_APP_TOGGLE_UPDATED:
        setAppForm((prev) => {
          const next = { ...prev, createApp: payload.createApp };
          persistFormState({ appForm: next });
          return next;
        });
        break;

      case ACTIONS.CREATE_APP_FORM_UPDATED:
        setAppForm((prev) => {
          const next = { ...prev, ...payload };
          persistFormState({ appForm: next });
          return next;
        });
        break;

      case ACTIONS.CHOOSE_SEARCH_UPDATED:
        setSearch(payload.search);
        break;

      case ACTIONS.CHOOSE_SELECTED_UPDATED:
        setSelectedOrganizationId(payload.organizationId);
        break;

      default:
        break;
    }
  };

  // --- Render logic ---

  const renderView = () => {
    switch (view) {
      case VIEWS.HUB:
        return (
          <VeripassTenancyOnboardingHub
            ui={ui}
            organization={organization}
            selectedAction={selectedAction}
            itemOnAction={handleItemOnAction}
            updateOnAction={handleUpdateOnAction}
            environment={environment}
            apiKey={apiKey}
          />
        );
      case VIEWS.CREATE_ORGANIZATION:
        return (
          <VeripassTenancyCreateOrganization
            ui={ui}
            organization={organization}
            organizationForm={organizationForm}
            itemOnAction={handleItemOnAction}
            updateOnAction={handleUpdateOnAction}
            isLoading={loading}
            error={error}
            environment={environment}
            apiKey={apiKey}
          />
        );
      case VIEWS.CREATE_APPLICATION:
        return (
          <VeripassTenancyCreateApplication
            ui={ui}
            organization={organization}
            organizationForm={organizationForm}
            appForm={appForm}
            itemOnAction={handleItemOnAction}
            updateOnAction={handleUpdateOnAction}
            isLoading={loading}
            error={error}
            environment={environment}
            apiKey={apiKey}
          />
        );
      case VIEWS.CHOOSE_ORGANIZATION:
        return (
          <VeripassTenancyChooseOrganization
            ui={ui}
            organization={organization}
            organizations={organizations}
            searchValue={search}
            selectedOrganizationId={selectedOrganizationId}
            itemOnAction={handleItemOnAction}
            updateOnAction={handleUpdateOnAction}
            loading={loading}
            error={error}
            environment={environment}
            apiKey={apiKey}
          />
        );
      case VIEWS.ALL_SET:
        return (
          <VeripassTenancyAllSet
            ui={ui}
            organization={{ ...organization, name: organizationForm.name || organization.name }}
            itemOnAction={handleItemOnAction}
            updateOnAction={handleUpdateOnAction}
            countdownSeconds={countdownSeconds}
            environment={environment}
            apiKey={apiKey}
          />
        );
      default:
        return null;
    }
  };

  return (
    <VeripassLayout isPopupContext={false} ui={{ ...ui, showLogo: false }}>
      <OnboardingMain className="veripass-d-flex veripass-flex-column veripass-justify-content-center veripass-align-items-center veripass-w-100 veripass-py-4">
        {(view === VIEWS.CHOOSE_ORGANIZATION || view === VIEWS.CREATE_ORGANIZATION || view === VIEWS.FINISH_SETUP) && (
          <BackNav className="veripass-d-flex veripass-justify-content-between veripass-align-items-center">
            <Button
              startIcon={<ArrowBackIcon sx={{ fontSize: '0.9rem' }} />}
              onClick={() => {
                const backActions = {
                  [VIEWS.CHOOSE_ORGANIZATION]: ACTIONS.CHOOSE_BACK,
                  [VIEWS.CREATE_ORGANIZATION]: ACTIONS.ORGANIZATION_BACK,
                  [VIEWS.FINISH_SETUP]: ACTIONS.SETUP_BACK,
                };
                handleItemOnAction({ action: backActions[view], namespace: NAMESPACE });
              }}
              sx={{
                textTransform: 'none',
                color: '#64748b',
                fontWeight: '500',
                fontSize: '0.875rem',
                padding: 0,
                '&:hover': { backgroundColor: 'transparent', color: '#0f172a' },
              }}
            >
              {view === VIEWS.CHOOSE_ORGANIZATION ? 'Back to setup' : 'Back'}
            </Button>
            {(view === VIEWS.CREATE_ORGANIZATION || view === VIEWS.FINISH_SETUP) && (
              <StepIndicator className="veripass-text-uppercase veripass-fw-bold">
                {view === VIEWS.CREATE_ORGANIZATION ? 'STEP 1 OF 2' : 'STEP 2 OF 2'}
              </StepIndicator>
            )}
          </BackNav>
        )}
        <OnboardingCard className="veripass-card veripass-w-100 veripass-mx-auto">{renderView()}</OnboardingCard>

        <OnboardingFooter className="veripass-w-100 veripass-d-flex veripass-justify-content-end veripass-mt-3">
          <PoweredBy align="end" position="bottom" />
        </OnboardingFooter>
      </OnboardingMain>
    </VeripassLayout>
  );
};
