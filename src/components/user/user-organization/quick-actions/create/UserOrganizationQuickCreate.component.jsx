import React, { useEffect, useState } from 'react';
import { useAuth } from '@hooks/useAuth.hook';
import { NationalIdentificationSelector, useDebounce } from '@link-loom/react-sdk';
import { Autocomplete, Button, CircularProgress, FormHelperText, TextField, Typography } from '@mui/material';
import {
  InfoOutlined as InfoOutlinedIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

import EntityDetailShell, {
  KeyValueRow,
} from '@components/shared/entity-detail-shell/EntityDetailShell.component';
import { THEME_COLORS } from '@constants/theme';
import {
  UserProfileService,
  OrganizationMembershipService as UserOrganizationService,
  ApplicationEntitlementService as UserAppService,
  RoleService as SecurityRoleService,
  ApplicationRoleAssignmentService as UserAppRoleService,
  AppManagementService,
  ProjectManagementService,
  OrganizationManagementService,
  ClaimService as SecurityClaimService,
  CapabilityService as SecurityCapabilityService,
  ClaimGrantService as UserAppClaimService,
  CapabilityGrantService as UserAppCapabilityService,
} from '@services';

async function createEntity(payload, entity) {
  const entityService = new entity();
  const entityResponse = await entityService.create(payload);

  if (!entityResponse || !entityResponse.result) {
    return null;
  }

  return entityResponse;
}

async function getEntity({ payload, service }) {
  try {
    const entityService = new service();

    const entityResponse = entityService.getByParameters(payload);

    return entityResponse;
  } catch (error) {
    return null;
  }
}

async function getUserByNationalId(nationalId) {
  try {
    const entitiesResponse = await getEntity({
      payload: {
        queryselector: 'primary-national-id',
        search: nationalId ?? '',
      },
      service: UserProfileService,
    });

    return entitiesResponse;
  } catch (error) {
    return null;
  }
}

async function getOrganizationsByUserId(userId) {
  try {
    const entitiesResponse = await getEntity({
      payload: {
        queryselector: 'all',
        exclude_status: 'deleted',
        search: userId ?? '',
      },
      service: OrganizationManagementService,
    });

    return entitiesResponse;
  } catch (error) {
    return null;
  }
}

async function getRolesByAppId(appId) {
  try {
    const entitiesResponse = await getEntity({
      payload: {
        queryselector: 'app-id',
        exclude_status: 'deleted',
        search: appId ?? '',
      },
      service: SecurityRoleService,
    });

    return entitiesResponse;
  } catch (error) {
    return null;
  }
}

async function getAppsByProjectId(projectId) {
  try {
    const entitiesResponse = await getEntity({
      payload: {
        queryselector: 'project-id',
        exclude_status: 'deleted',
        search: projectId ?? '',
      },
      service: AppManagementService,
    });

    return entitiesResponse;
  } catch (error) {
    return null;
  }
}

async function getProjectsByOrganizationId(organizationId) {
  try {
    const entitiesResponse = await getEntity({
      payload: {
        queryselector: 'organization-id',
        exclude_status: 'deleted',
        search: organizationId ?? '',
      },
      service: ProjectManagementService,
    });

    return entitiesResponse;
  } catch (error) {
    return null;
  }
}

const initialUserOrganizationState = {
  user_id: '',
  organization_id: '',
  context: {
    organization_slug: '',
    organization_display_name: '',
    user_display_name: '',
    user_primary_national_id: {},
  },
};

const initialUserRoleState = {
  user_id: '',
  role_id: '',
  organization_id: '',
  app_id: '',
  context: {
    user_display_name: '',
    user_primary_national_id: {},
    role_slug: '',
    role_name: '',
    organization_slug: '',
    organization_display_name: '',
    app_slug: '',
    app_name: '',
  },
};

const initialUserAppState = {
  user_id: '',
  organization_id: '',
  project_id: '',
  app_id: '',
  is_onboarding_completed: false,
  context: {
    organization_slug: '',
    organization_display_name: '',
    user_display_name: '',
    user_primary_national_id: '',
    project_name: '',
    app_slug: '',
    app_name: '',
  },
};

function UserOrganizationQuickCreateComponent({ user, onUpdatedEntity = () => {}, setIsOpen = () => {}, isPopupContext }) {
  const { user: authUser } = useAuth();

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [userNationalIdValidationInProgress, setUserNationalIdValidationInProgress] = useState(false);

  // Models
  const [userOrganizationData, setUserOrganizationData] = useState(initialUserOrganizationState);
  const [userRoleData, setUserRoleData] = useState(initialUserRoleState);
  const [userAppData, setUserAppData] = useState(initialUserAppState);

  // Lists
  const [userOrganizationList, setUserOrganizationList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [organizationAppList, setOrganizationAppList] = useState([]);
  const [rolesByAppList, setRolesByAppList] = useState([]);

  // Model UI validators
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedApp, setSelectedApp] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);

  const debouncedNationalId = useDebounce(
    userOrganizationData?.context?.user_primary_national_id?.identification,
    1000,
  );

  const handleUserOrganizationDataChange = (fieldName, data) => {
    setUserOrganizationData((prevUserData) => ({
      ...prevUserData,
      [fieldName]: data,
    }));
  };

  const handleUserAppDataChange = (fieldName, data) => {
    setUserAppData((prevUserData) => ({
      ...prevUserData,
      [fieldName]: data,
    }));
  };

  const handleUserRoleDataChange = (fieldName, data) => {
    setUserRoleData((prevUserData) => ({
      ...prevUserData,
      [fieldName]: data,
    }));
  };

  const handleDataChange = (fieldPath, value) => {
    setUserOrganizationData((previousData) => {
      const keys = fieldPath.split('.');
      keys.reduce((currentLevel, currentKey, index) => {
        currentLevel[currentKey] = index === keys.length - 1 ? value : currentLevel[currentKey] || {};
        return currentLevel[currentKey];
      }, previousData);
      return { ...previousData };
    });
  };

  const getUser = async () => {
    if (debouncedNationalId) {
      setUserNationalIdValidationInProgress(true);

      const userResponse = await getUserByNationalId(
        userOrganizationData?.context?.user_primary_national_id?.identification,
      );

      if (userResponse?.result?.items?.length === 0) {
        setIsExistingUser(false);
        setUserOrganizationData({
          ...initialUserOrganizationState,
          user_id: userOrganizationData.user_id,
        });
      } else {
        const foundUser = userResponse?.result?.items?.[0];
        setIsExistingUser(true);

        setUserOrganizationData((prevState) => ({
          ...prevState,
          user_id: foundUser?.id ?? '',
          context: {
            ...prevState.context,
            user_display_name: foundUser?.display_name || '',
            user_primary_national_id: foundUser?.primary_national_id || {},
          },
        }));

        handleUserAppDataChange('user_id', foundUser?.id ?? '');
        handleUserRoleDataChange('user_id', foundUser?.id ?? '');
      }
    }

    setUserNationalIdValidationInProgress(false);
  };

  const getMyOrganizations = async () => {
    const userOrganizationResponse = await getOrganizationsByUserId(authUser?.identity);

    setUserOrganizationList(userOrganizationResponse?.result?.items || []);
  };

  const getRolesByApp = async (appId) => {
    const rolesResponse = await getRolesByAppId(appId);

    setRolesByAppList(rolesResponse?.result?.items || []);
  };

  const getProjectsByOrganization = async (organizationId) => {
    const projectsResponse = await getProjectsByOrganizationId(organizationId);

    setProjectsList(projectsResponse?.result?.items || []);
  };

  const getAppsByProject = async (projectId) => {
    const appsResponse = await getAppsByProjectId(projectId);

    setOrganizationAppList(appsResponse?.result?.items || []);
  };

  const handleSubmit = async () => {
    try {
      let userOrganizationResponse = {};
      setIsLoading(true);

      // Create user organization
      userOrganizationResponse = await createEntity(userOrganizationData, UserOrganizationService);

      // Create user app
      await createEntity(userAppData, UserAppService);

      // Create user role
      for (const role of selectedRoles) {
        if (role) {
          const roleCreationResponse = await createEntity(
            {
              ...userRoleData,
              ...{ role_id: role.id, context: { role_slug: role.slug, role_name: role.name } },
            },
            UserAppRoleService,
          );

          if (roleCreationResponse) {
            const claimsResponse = await getEntity({
              payload: {
                queryselector: 'role-id',
                search: role.id,
              },
              service: SecurityClaimService,
            });
            const claims = claimsResponse?.result?.items || [];

            for (const claim of claims) {
              await createEntity(
                {
                  user_id: userRoleData.user_id,
                  app_id: userRoleData.app_id,
                  organization_id: userRoleData.organization_id,
                  claim_id: claim.id,
                },
                UserAppClaimService,
              );

              const capsResponse = await getEntity({
                payload: {
                  queryselector: 'claim-id',
                  search: claim.id,
                },
                service: SecurityCapabilityService,
              });
              const capabilities = capsResponse?.result?.items || [];

              for (const capability of capabilities) {
                await createEntity(
                  {
                    user_id: userRoleData.user_id,
                    app_id: userRoleData.app_id,
                    organization_id: userRoleData.organization_id,
                    capability_id: capability.id,
                  },
                  UserAppCapabilityService,
                );
              }
            }
          }
        }
      }

      setIsLoading(false);
      onUpdatedEntity('create', userOrganizationResponse);
      setIsOpen(false);
    } catch (error) {
      setIsLoading(false);
      onUpdatedEntity('error', null);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (user) {
      setIsExistingUser(true);
      handleUserOrganizationDataChange('user_id', user?.id || '');
      handleUserAppDataChange('user_id', user?.id || '');
      handleUserRoleDataChange('user_id', user?.id ?? '');
    }
  }, [user]);

  useEffect(() => {
    getUser();
  }, [debouncedNationalId]);

  useEffect(() => {
    if (!selectedOrganization) {
      return;
    }

    const userOrganization = userOrganizationList.find(
      (organization) => organization.id === selectedOrganization.id,
    );

    handleUserOrganizationDataChange('organization_id', userOrganization?.id ?? '');
    handleUserOrganizationDataChange('context', {
      organization_slug: userOrganization?.profile?.slug ?? '',
      organization_display_name: userOrganization?.profile?.display_name ?? '',
    });

    handleUserAppDataChange('organization_id', userOrganization?.id || '');
    handleUserRoleDataChange('organization_id', userOrganization?.id ?? '');

    getProjectsByOrganization(selectedOrganization.id);
  }, [selectedOrganization]);

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    getAppsByProject(selectedProject.id);
    setSelectedRoles([]);
    handleUserAppDataChange('project_id', selectedProject.id || '');
  }, [selectedProject]);

  useEffect(() => {
    setSelectedRoles([]);
    handleUserRoleDataChange('app_id', selectedApp.id || '');
    handleUserAppDataChange('app_id', selectedApp.id || '');
    getRolesByApp(selectedApp.id);
  }, [selectedApp]);

  useEffect(() => {
    getMyOrganizations(authUser?.app_id ?? '');
  }, []);

  const userName = userOrganizationData?.context?.user_display_name;
  const nationalId = userOrganizationData?.context?.user_primary_national_id?.identification;

  const headerSection = (
    <>
      <Typography variant="h5" className="fw-bold text-dark mb-0">
        {userName || 'New user access'}
      </Typography>
      <Typography variant="caption" className="text-muted" sx={{ fontFamily: 'monospace' }}>
        {userOrganizationData?.context?.organization_slug || userOrganizationData?.organization_id || '—'}
      </Typography>
    </>
  );

  const overviewTab = (
    <>
      <Typography variant="body2" className="text-muted mb-3">
        User access records link a user to an organization and ground what they can do in it.
      </Typography>
      {!user && (
        <div className="mb-3">
          <NationalIdentificationSelector
            label="National identification number"
            defaultDocumentType="Passport"
            ui={{ documentType: false }}
            onChange={(event) => {
              handleDataChange('context.user_primary_national_id', event);
            }}
          />
          <FormHelperText>Please write the primary legal national id.</FormHelperText>
          {userNationalIdValidationInProgress && (
            <FormHelperText className="d-flex text-primary">
              <CircularProgress size={20} className="me-2" /> Validating user existence...
            </FormHelperText>
          )}
          {!isExistingUser && (
            <FormHelperText className="d-flex text-purple">Select a user to choose a role</FormHelperText>
          )}
        </div>
      )}
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <KeyValueRow label="User" value={userName || userOrganizationData?.user_id} mono={!userName} />
        </div>
        <div className="col-12 col-md-6">
          <KeyValueRow label="National ID" value={nationalId} mono />
        </div>
        <div className="col-12">
          <Autocomplete
            size="small"
            options={projectsList || []}
            getOptionLabel={(option) => option?.name || ''}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            value={selectedProject || null}
            readOnly={!isExistingUser}
            onChange={(event, newValue) => setSelectedProject(newValue || null)}
            renderInput={(params) => <TextField {...params} label="Project" fullWidth disabled={!isExistingUser} />}
          />
        </div>
        <div className="col-12">
          <Autocomplete
            size="small"
            options={organizationAppList || []}
            getOptionLabel={(option) => option?.name || ''}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            value={selectedApp || null}
            readOnly={!isExistingUser}
            onChange={(event, newValue) => setSelectedApp(newValue || null)}
            renderInput={(params) => <TextField {...params} label="App" fullWidth disabled={!isExistingUser} />}
          />
        </div>
        <div className="col-12">
          <Autocomplete
            size="small"
            multiple
            options={rolesByAppList || []}
            getOptionLabel={(option) => option?.name || ''}
            isOptionEqualToValue={(option, value) => option?.slug === value?.slug}
            value={selectedRoles || []}
            readOnly={!isExistingUser}
            onChange={(_, newValue) => setSelectedRoles(newValue || [])}
            renderInput={(params) => <TextField {...params} label="Roles" fullWidth disabled={!isExistingUser} />}
          />
        </div>
      </div>
    </>
  );

  const settingsTab = (
    <div className="row g-3">
      <div className="col-12 col-md-6">
        <KeyValueRow label="ID" value="—" mono />
      </div>
      <div className="col-12 col-md-6">
        <KeyValueRow label="User ID" value={userOrganizationData?.user_id} mono />
      </div>
      <div className="col-12 col-md-6">
        <KeyValueRow label="Organization ID" value={userOrganizationData?.organization_id} mono />
      </div>
      <div className="col-12 col-md-6">
        <KeyValueRow label="Status" value="New" />
      </div>
      <div className="col-12 col-md-6">
        <KeyValueRow label="Created" value="—" />
      </div>
      <div className="col-12 col-md-6">
        <KeyValueRow label="Last modified" value="—" />
      </div>
    </div>
  );

  return (
    <div style={{ width: 'min(780px, 92vw)', margin: '0 auto' }}>
      <section className="content w-100">
        <EntityDetailShell
          breadcrumbSection="User Access"
          title={userName || 'New user access'}
          renderHeader={headerSection}
          meta={[
            { label: 'User', value: userName || userOrganizationData?.user_id, mono: !userName },
            {
              label: 'Organization',
              render: (
                <Autocomplete
                  size="small"
                  options={userOrganizationList || []}
                  getOptionLabel={(option) => option?.profile?.display_name || ''}
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  value={selectedOrganization || null}
                  readOnly={!isExistingUser}
                  onChange={(event, newValue) => setSelectedOrganization(newValue || null)}
                  renderInput={(params) => <TextField {...params} size="small" hiddenLabel disabled={!isExistingUser} />}
                />
              ),
            },
          ]}
          tabs={[
            {
              id: 'overview',
              label: 'Overview',
              icon: <InfoOutlinedIcon sx={{ fontSize: 16 }} />,
              content: overviewTab,
            },
            { id: 'settings', label: 'Settings', icon: <SettingsIcon sx={{ fontSize: 16 }} />, content: settingsTab },
          ]}
          footer={
            <>
              <Button
                variant="text"
                color="inherit"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                sx={{ textTransform: 'none', color: THEME_COLORS.textSecondary }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disableElevation
                disabled={isLoading || !isExistingUser}
                onClick={handleSubmit}
                startIcon={
                  isLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  ) : (
                    <SaveIcon />
                  )
                }
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: THEME_COLORS.successDark,
                  '&:hover': { backgroundColor: THEME_COLORS.success },
                }}
              >
                {isLoading ? 'Saving' : 'Save'}
              </Button>
            </>
          }
        />
      </section>
    </div>
  );
}

export default UserOrganizationQuickCreateComponent;
