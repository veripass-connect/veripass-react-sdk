import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled from 'styled-components';

import {
  OrganizationManagementService,
  TenancyProvisioningService,
  OrganizationMembershipService,
  UserProfileService,
} from '@services';

import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';
import { PoweredBy } from '@components/shared/PoweredBy/PoweredBy.component';
import { VeripassTenancyOnboardingHub } from '../hub/VeripassTenancyOnboardingHub.component';
import { VeripassTenancyCreateOrganization } from '../create-organization/VeripassTenancyCreateOrganization.component';
import { VeripassTenancyCreateApplication } from '../create-application/VeripassTenancyCreateApplication.component';
import { VeripassTenancyChooseOrganization } from '../choose-organization/VeripassTenancyChooseOrganization.component';
import { VeripassTenancyJoinHost } from '../join-host/VeripassTenancyJoinHost.component';
import { VeripassTenancyAllSet } from '../all-set/VeripassTenancyAllSet.component';
import { VeripassTenancyError } from '../shared/VeripassTenancyError.component';
import { VeripassTenancyCompleteProfile } from '../complete-profile/VeripassTenancyCompleteProfile.component';

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
  JOIN_HOST: 'join-host',
  CREATE_ORGANIZATION: 'create-organization',
  CREATE_APPLICATION: 'create-application',
  CHOOSE_ORGANIZATION: 'choose-organization',
  ALL_SET: 'all-set',
  COMPLETE_PROFILE: 'complete-profile',
  ERROR: 'error',
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
  JOIN_HOST_BACK: `${NAMESPACE}::join-host/back`,
  JOIN_HOST_ERROR_UPDATED: `${NAMESPACE}::join-host/error-updated`,
  COMPLETE_PROFILE_SUBMIT: `${NAMESPACE}::complete-profile/submit`,
  COMPLETE_PROFILE_BACK: `${NAMESPACE}::complete-profile/back`,
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
      window.localStorage.removeItem('veripass::auth::user-data');
    }
  } catch (err) {
    console.warn(`Failed to clear state:`, err);
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
    defaultAction: 'join-host',
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

  const checkNeedsProfile = (userData) => {
    const p = userData?.payload?.profile;
    return !!userData && (!p?.first_name || !p?.last_name || !p?.display_name);
  };

  const needsProfile = checkNeedsProfile(user);

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
  const [intendedViewAfterProfile, setIntendedViewAfterProfile] = useState(savedState?.intendedViewAfterProfile || null);
  const [selectedAction, setSelectedAction] = useState(savedState?.selectedAction || ui.defaultAction || 'join-host');

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
    const provisioningSettings = { settings: { environment, timeout: 120000 }, apiKey };

    return {
      organizationService: new OrganizationManagementService(serviceSettings),
      provisioningService: new TenancyProvisioningService(provisioningSettings),
      OrganizationMembershipService: new OrganizationMembershipService(serviceSettings),
      userProfileService: new UserProfileService(serviceSettings),
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
    saveState({ ...current, view, intendedViewAfterProfile });
  }, [view, intendedViewAfterProfile]);

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

  const handleError = (err, defaultMessage = 'An unexpected error occurred.') => {
    if (err?.isTimeout || (err?.message && err.message.toLowerCase().includes('timeout'))) {
      setError('The process took longer than expected. Please check your console in a few minutes or start again.');
      clearState();
      setView(VIEWS.ERROR);
    } else {
      setError(err?.message || defaultMessage);
    }
  };

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
      handleError(err, 'Failed to load organizations.');
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

      const provisioningResponse = await activeServices.provisioningService.provisionWorkspace(provisionPayload);

      if (!provisioningResponse || !provisioningResponse.success) {
        throw provisioningResponse || new Error('Failed to provision tenancy');
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
      handleError(err, 'An unexpected error occurred during setup.');
    } finally {
      setLoading(false);
    }
  };

  // --- Core Handlers ---
  const handleItemOnAction = ({ action, namespace, payload, error: actionError }) => {
    if (namespace !== NAMESPACE) return;

    switch (action) {
      case ACTIONS.HUB_CONTINUE:
        const nextView = {
          'join-host': VIEWS.JOIN_HOST,
          'choose-organization': VIEWS.CHOOSE_ORGANIZATION,
          'create-organization': VIEWS.CREATE_ORGANIZATION,
        }[payload.selectedAction];

        if (nextView) {
          if (checkNeedsProfile(user)) {
            setIntendedViewAfterProfile(nextView);
            setView(VIEWS.COMPLETE_PROFILE);
          } else {
            setView(nextView);
          }
        }
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
              handleError(err, 'An unexpected error occurred while joining.');
            } finally {
              setLoading(false);
            }
          };

          doJoin();
        }
        break;

      case 'veripass-tenancy-onboarding::join-host/success':
        if (payload?.result) {
          const allSetResult = {
            organization: { id: payload.result.host?.organizationId },
            applicationRoleAssignment: payload.result.applicationRoleAssignment,
            organizationMembership: payload.result.organizationMembership,
          };
          setResult(allSetResult);
          saveState({ view: VIEWS.ALL_SET, result: allSetResult, organizationForm });
          setView(VIEWS.ALL_SET);
        }
        break;
      case ACTIONS.JOIN_HOST_BACK:
        setView(VIEWS.HUB);
        break;

      case ACTIONS.COMPLETE_PROFILE_SUBMIT:
        if (payload?.profile) {
          setLoading(true);
          setError(null);
          const updateProfile = async () => {
            try {
              if (activeServices.userProfileService && user?.id) {
                const res = await activeServices.userProfileService.update({
                  id: user.id,
                  first_name: payload.profile.first_name,
                  last_name: payload.profile.last_name,
                  display_name: payload.profile.display_name,
                });

                if (!res || !res.success) {
                  throw new Error(res?.message || 'Failed to update user profile.');
                }

                // If they have a destination saved, go there, otherwise go to HUB
                if (intendedViewAfterProfile) {
                  setView(intendedViewAfterProfile);
                  setIntendedViewAfterProfile(null);
                } else {
                  setView(VIEWS.HUB);
                }
              }
            } catch (err) {
              handleError(err, 'An unexpected error occurred while updating profile.');
            } finally {
              setLoading(false);
            }
          };
          updateProfile();
        }
        break;

      case ACTIONS.COMPLETE_PROFILE_BACK:
        setView(VIEWS.HUB);
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

      case ACTIONS.JOIN_HOST_ERROR_UPDATED:
        handleError(payload, 'An unexpected error occurred while joining host.');
        break;

      default:
        break;
    }
  };

  // --- Render logic ---

  const renderView = () => {
    switch (view) {
      case VIEWS.COMPLETE_PROFILE:
        return <VeripassTenancyCompleteProfile ui={ui} itemOnAction={handleItemOnAction} isLoading={loading} error={error} />;
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
      case VIEWS.JOIN_HOST:
        if (error) {
          return (
            <VeripassTenancyError
              ui={ui}
              errorBody={error}
              onRetry={() => {
                handleUpdateOnAction({
                  action: ACTIONS.JOIN_HOST_ERROR_UPDATED,
                  namespace: NAMESPACE,
                  payload: { error: null },
                });
              }}
            />
          );
        }
        return (
          <VeripassTenancyJoinHost
            ui={ui}
            user={user}
            organization={organization}
            services={activeServices}
            itemOnAction={handleItemOnAction}
            updateOnAction={handleUpdateOnAction}
            error={error}
            environment={environment}
            apiKey={apiKey}
          />
        );
      case VIEWS.ERROR:
        return (
          <VeripassTenancyError
            ui={ui}
            errorTitle="Setup Timeout"
            errorBody={error || 'An unexpected error occurred.'}
            onBack={() => {
              setError(null);
              setView(VIEWS.HUB);
            }}
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
    }
  };

  const getStepIndicator = () => {
    let currentStep = 0;
    let totalSteps = 0;

    // Determine base total steps based on chosen flow
    if (selectedAction === 'create-organization') {
      totalSteps = 2; // Create Org -> Create App
    } else if (selectedAction === 'choose-organization' || selectedAction === 'join-host') {
      totalSteps = 1; // Choose/Join
    }

    // If profile is missing, it adds an extra initial step to all flows
    if (needsProfile && totalSteps > 0) {
      totalSteps += 1;
    }

    // Determine current step index based on the view
    if (view === VIEWS.COMPLETE_PROFILE) {
      currentStep = 1;
    } else if (view === VIEWS.JOIN_HOST || view === VIEWS.CHOOSE_ORGANIZATION || view === VIEWS.CREATE_ORGANIZATION) {
      currentStep = needsProfile ? 2 : 1;
    } else if (view === VIEWS.CREATE_APPLICATION) {
      currentStep = needsProfile ? 3 : 2;
    }

    if (currentStep > 0 && totalSteps > 0 && currentStep <= totalSteps) {
      return `STEP ${currentStep} OF ${totalSteps}`;
    }
    return null;
  };

  return (
    <VeripassLayout isPopupContext={false} ui={{ ...ui, showLogo: false }}>
      <OnboardingMain className="veripass-d-flex veripass-flex-column veripass-justify-content-center veripass-align-items-center veripass-w-100 veripass-py-4">
        {(view === VIEWS.CHOOSE_ORGANIZATION ||
          view === VIEWS.CREATE_ORGANIZATION ||
          view === VIEWS.CREATE_APPLICATION ||
          view === VIEWS.COMPLETE_PROFILE ||
          (view === VIEWS.JOIN_HOST && Boolean(error))) && (
          <BackNav className="veripass-d-flex veripass-justify-content-between veripass-align-items-center">
            <Button
              startIcon={<ArrowBackIcon sx={{ fontSize: '0.9rem' }} />}
              onClick={() => {
                const backActions = {
                  [VIEWS.CHOOSE_ORGANIZATION]: ACTIONS.CHOOSE_BACK,
                  [VIEWS.CREATE_ORGANIZATION]: ACTIONS.ORGANIZATION_BACK,
                  [VIEWS.CREATE_APPLICATION]: ACTIONS.CREATE_APP_BACK,
                  [VIEWS.JOIN_HOST]: ACTIONS.JOIN_HOST_BACK,
                  [VIEWS.COMPLETE_PROFILE]: ACTIONS.COMPLETE_PROFILE_BACK,
                };
                const mappedAction = backActions[view];
                if (mappedAction) {
                  handleItemOnAction({ action: mappedAction, namespace: NAMESPACE });
                }
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
              {view === VIEWS.CHOOSE_ORGANIZATION || view === VIEWS.JOIN_HOST ? 'Back to setup' : 'Back'}
            </Button>
            {getStepIndicator() && (
              <StepIndicator className="veripass-text-uppercase veripass-fw-bold">{getStepIndicator()}</StepIndicator>
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
