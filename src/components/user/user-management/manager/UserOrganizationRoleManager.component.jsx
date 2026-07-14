import React, { useEffect, useState, useMemo } from 'react';
import { Spinner, PopUp } from '@link-loom/react-sdk';
import { Button, Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Checkbox,
  ListItemIcon,
  TextField,
  InputAdornment, } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Add as AddIcon,
  Business as BusinessIcon,
  AccountTree as AccountTreeIcon,
  Apps as AppsIcon,
  Security as SecurityIcon,
  VpnKey as VpnKeyIcon,
  Extension as ExtensionIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import UserOrganizationQuickCreateComponent from '../../user-organization/quick-actions/create/UserOrganizationQuickCreate.component';
import {
  OrganizationMembershipService as UserOrganizationService,
  ApplicationEntitlementService as UserAppService,
  ApplicationRoleAssignmentService as UserAppRoleService,
  ClaimGrantService as UserAppClaimService,
  CapabilityGrantService as UserAppCapabilityService,
  ClaimService as SecurityClaimService,
  CapabilityService as SecurityCapabilityService,
  RoleService as SecurityRoleService,
  OrganizationManagementService,
  ProjectManagementService,
  AppManagementService,
} from '@services';
import {
  fetchEntityCollection,
  fetchMultipleEntities,
  updateEntityRecord,
  createEntityRecord,
  deleteEntityRecord,
} from '@services/utils/entityServiceAdapter';

// Configuration for hierarchy traversal
const HIERARCHY_CONFIG = {
  organization: { next: 'project', childKey: 'projects', idKey: 'organization_id' },
  project: { next: 'app', childKey: 'apps', idKey: 'id' },
  app: { next: 'role', childKey: 'roles', idKey: 'id' },
  role: { next: 'claim', childKey: 'claims', idKey: 'role_id', altIdKey: 'id' },
  claim: { next: 'capability', childKey: 'capabilities', idKey: 'id' },
  capability: { next: null, childKey: null, idKey: 'id' },
};

const setAllChildrenState = (nodes, type, state) => {
  if (!nodes) return [];
  const config = HIERARCHY_CONFIG[type];
  return nodes.map((node) => {
    const newNode = { ...node, isSelected: state };
    if (config.next && config.childKey && node[config.childKey]) {
      newNode[config.childKey] = setAllChildrenState(node[config.childKey], config.next, state);
    }
    return newNode;
  });
};

const updateHierarchyNode = (nodes, currentType, targetType, targetId, parentIds) => {
  if (!nodes) return [];

  const config = HIERARCHY_CONFIG[currentType];
  const { idKey, altIdKey, childKey, next } = config;

  return nodes.map((node) => {
    const nodeId = node[idKey] || (altIdKey && node[altIdKey]);
    let newNode = { ...node };

    // 1. Target Hit Logic
    if (currentType === targetType && nodeId === targetId) {
      const newSelectionState = !node.isSelected;
      newNode.isSelected = newSelectionState;

      // Cascade Down (Explosion): Role -> Claims -> Caps
      if (childKey && next) {
        newNode[childKey] = setAllChildrenState(node[childKey], next, newSelectionState);
      }
      return newNode;
    }

    // 2. Path Optimization
    const parentIdKey =
      currentType === 'organization'
        ? 'orgId'
        : currentType === 'project'
        ? 'projId'
        : currentType === 'app'
        ? 'appId'
        : currentType === 'role'
        ? 'roleId'
        : currentType === 'claim'
        ? 'claimId'
        : null;

    if (parentIdKey && parentIds[parentIdKey] && parentIds[parentIdKey] !== nodeId) {
      return node;
    }

    // 3. Recursion
    if (next && childKey && node[childKey]) {
      const updatedChildren = updateHierarchyNode(node[childKey], next, targetType, targetId, parentIds);
      newNode[childKey] = updatedChildren;

      // 4. Cascade Up (Validation): Cap -> Claim -> Role
      // Requirement: If user unchecks all caps, claim unchecks. If user checks a cap, claim checks.
      if (currentType === 'claim') {
        const hasSelectedCaps = updatedChildren.some((c) => c.isSelected);
        if (hasSelectedCaps && !newNode.isSelected) {
          newNode.isSelected = true;
        } else if (!hasSelectedCaps && newNode.isSelected) {
          newNode.isSelected = false;
        }
      }

      // Requirement: If user unchecks all claims, role unchecks.
      if (currentType === 'role') {
        const hasSelectedClaims = updatedChildren.some((c) => c.isSelected);
        if (hasSelectedClaims && !newNode.isSelected) {
          newNode.isSelected = true;
        } else if (!hasSelectedClaims && newNode.isSelected) {
          newNode.isSelected = false;
        }
      }
    }

    return newNode;
  });
};

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: 'none',
  '&:before': { display: 'none' },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: '0 16px',
  minHeight: '48px',
  '& .MuiAccordionSummary-content': { margin: '12px 0' },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: '0 0 0 16px',
  borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
}));

const StyledOrganizationAccordion = styled(StyledAccordion)(({ theme }) => ({
  border: '1.5px solid #101c42',
  borderRadius: '4px',
  marginBottom: theme.spacing(1),
  '&:before': {
    display: 'none',
  },
}));

const StyledPopUp = styled(PopUp)(({ theme }) => ({
  '& .btn-close': {
    color: 'rgba(0, 0, 0, 0.5) !important', // replicating text-black-50
  },
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: '70%',
  },
}));

const StyledSearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: '1.5px solid #101c42',
    },
    '&:hover fieldset': {
      border: '1.5px solid #101c42',
    },
    '&.Mui-focused fieldset': {
      border: '1.5px solid #101c42',
    },
  },
}));

const CapabilityNode = ({ capability, orgId, projId, appId, roleId, claimId, handleToggle }) => (
  <>
    <ListItem>
      <ListItemIcon>
        <Checkbox
          checked={!!capability.isSelected}
          edge="start"
          tabIndex={-1}
          disableRipple
          onClick={(e) => e.stopPropagation()}
          onChange={() =>
            handleToggle('capability', capability.id, {
              orgId,
              projId,
              appId,
              roleId,
              claimId,
            })
          }
        />
      </ListItemIcon>
      <ListItemText
        primary={
          <span className="d-flex align-items-center">
            <ExtensionIcon fontSize="small" className="me-2 text-muted" />
            <strong>Capability: </strong>
            <span className="ms-1">{capability.name}</span>
          </span>
        }
        secondary={`ID: ${capability.id}`}
      />
    </ListItem>
    <Divider component="li" />
  </>
);

const ClaimNode = ({ claim, orgId, projId, appId, roleId, handleToggle }) => (
  <StyledAccordion key={claim.id} disableGutters>
    <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box display="flex" alignItems="center" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={!!claim.isSelected}
          onClick={(e) => e.stopPropagation()}
          onChange={() =>
            handleToggle('claim', claim.id, {
              orgId,
              projId,
              appId,
              roleId,
              claimId: claim.id,
            })
          }
        />
        <VpnKeyIcon fontSize="small" className="me-2 text-muted" />
        <Typography>
          <strong>Claim: </strong>
          {claim.name || 'Claim'}
        </Typography>
        <Typography variant="caption" className="ms-2 text-muted align-self-center">
          (ID: {claim.id})
        </Typography>
      </Box>
    </StyledAccordionSummary>
    <StyledAccordionDetails>
      <List dense>
        {claim.capabilities?.length > 0 ? (
          claim.capabilities.map((cap) => (
            <CapabilityNode
              key={cap.id}
              capability={cap}
              orgId={orgId}
              projId={projId}
              appId={appId}
              roleId={roleId}
              claimId={claim.id}
              handleToggle={handleToggle}
            />
          ))
        ) : (
          <Typography variant="body2" className="text-muted fst-italic p-2">
            No capabilities found.
          </Typography>
        )}
      </List>
    </StyledAccordionDetails>
  </StyledAccordion>
);

const RoleNode = ({ role, orgId, projId, appId, handleToggle }) => (
  <StyledAccordion key={role.id} disableGutters>
    <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box display="flex" alignItems="center" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={!!role.isSelected}
          onClick={(e) => e.stopPropagation()}
          onChange={() =>
            handleToggle('role', role.role_id || role.id, {
              orgId,
              projId,
              appId,
            })
          }
        />
        <SecurityIcon fontSize="small" className="me-2 text-muted" />
        <Typography>
          <strong>Role: </strong>
          {role.name || 'Role'}
        </Typography>
        <Typography variant="caption" className="ms-2 text-muted align-self-center">
          (ID: {role.role_id || role.id})
        </Typography>
      </Box>
    </StyledAccordionSummary>
    <StyledAccordionDetails>
      {role.claims?.length > 0 ? (
        role.claims.map((claim) => (
          <ClaimNode
            key={claim.id}
            claim={claim}
            orgId={orgId}
            projId={projId}
            appId={appId}
            roleId={role.role_id || role.id}
            handleToggle={handleToggle}
          />
        ))
      ) : (
        <Typography variant="body2" className="text-muted fst-italic p-2">
          No claims found.
        </Typography>
      )}
    </StyledAccordionDetails>
  </StyledAccordion>
);

const AppNode = ({ app, orgId, projId, handleToggle }) => (
  <StyledAccordion key={app.id} disableGutters>
    <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box display="flex" alignItems="center" onClick={(e) => e.stopPropagation()}>
        <AppsIcon fontSize="small" className="me-2 text-muted" />
        <Typography>
          <strong>App: </strong>
          {app.name || app.app?.name || 'App'}
        </Typography>
        <Typography variant="caption" className="ms-2 text-muted align-self-center">
          (ID: {app.id})
        </Typography>
      </Box>
    </StyledAccordionSummary>
    <StyledAccordionDetails>
      {app.roles?.length > 0 ? (
        app.roles.map((role) => (
          <RoleNode
            key={role.id}
            role={role}
            orgId={orgId}
            projId={projId}
            appId={app.id}
            handleToggle={handleToggle}
          />
        ))
      ) : (
        <Typography variant="body2" className="text-muted fst-italic p-2">
          No roles found.
        </Typography>
      )}
    </StyledAccordionDetails>
  </StyledAccordion>
);

const ProjectNode = ({ project, orgId, handleToggle }) => (
  <StyledAccordion key={project.id} disableGutters>
    <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box display="flex" alignItems="center" onClick={(e) => e.stopPropagation()}>
        <AccountTreeIcon fontSize="small" className="me-2 text-muted" />
        <Typography>
          <strong>Project: </strong>
          {project.name}
        </Typography>
        <Typography variant="caption" className="ms-2 text-muted align-self-center">
          (ID: {project.id})
        </Typography>
      </Box>
    </StyledAccordionSummary>
    <StyledAccordionDetails>
      {project.apps?.length > 0 ? (
        project.apps.map((appItem) => (
          <AppNode key={appItem.id} app={appItem} orgId={orgId} projId={project.id} handleToggle={handleToggle} />
        ))
      ) : (
        <Typography variant="body2" className="text-muted fst-italic p-2">
          No apps found.
        </Typography>
      )}
    </StyledAccordionDetails>
  </StyledAccordion>
);

const OrganizationNode = ({ org, handleToggle }) => (
  <StyledOrganizationAccordion key={org.id || org.organization_id} disableGutters>
    <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box display="flex" alignItems="center" onClick={(e) => e.stopPropagation()}>
        <BusinessIcon fontSize="small" className="me-2 text-muted" />
        <Typography>
          <strong>Organization: </strong>
          {org.organization?.profile?.display_name ||
            org.organization?.name ||
            org.context_data?.organization_display_name ||
            'Organization'}
        </Typography>
        <Typography variant="caption" className="ms-2 text-muted align-self-center">
          (ID: {org.id})
        </Typography>
      </Box>
    </StyledAccordionSummary>
    <StyledAccordionDetails>
      {org.projects?.length > 0 ? (
        org.projects.map((project) => (
          <ProjectNode
            key={project.id}
            project={project}
            orgId={org.organization_id || org.id}
            handleToggle={handleToggle}
          />
        ))
      ) : (
        <Typography variant="body2" className="text-muted fst-italic p-2">
          No projects found.
        </Typography>
      )}
    </StyledAccordionDetails>
  </StyledOrganizationAccordion>
);

const UserOrganizationRoleManager = ({ entityId, apiKey = '', environment = 'production' }) => {
  const settings = { environment };
  const [hierarchyData, setHierarchyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [searchText, setSearchText] = useState('');
  /* Organization -> Project -> App -> Role -> Claim -> Capability */
  const fetchDeepHierarchy = async () => {
    setIsLoading(true);
    try {
      // 1. Get User Scope & Connections
      const [userOrgsResponse, userAppsResponse] = await fetchMultipleEntities([
        {
          service: UserOrganizationService,
          payload: {
            queryselector: 'user-id-expanded',
            query: { search: entityId },
          },
          apiKey,
          settings,
        },
        {
          service: UserAppService,
          payload: {
            queryselector: 'user-id-expanded',
            query: { search: entityId },
          },
          apiKey,
          settings,
        },
      ]);

      const userOrgs = (userOrgsResponse?.result?.items || []).filter((item) => item.status?.name !== 'deleted');
      const userApps = (userAppsResponse?.result?.items || []).filter((item) => item.status?.name !== 'deleted');

      // Map connection IDs for quick lookup and duplicate prevention
      // Map: organization_id -> user_organization_id (connection ID)
      const userOrgConnectionMap = new Map(userOrgs.map((uo) => [uo.organization_id, uo.id]));

      // Map: app_id -> user_app_id (connection ID)
      const userAppConnectionMap = new Map(userApps.map((ua) => [ua.app_id, ua.id]));

      // 2. Build Hierarchy (Mixed View: Connected Orgs Only -> Full Catalog Inside)
      // We iterate over userOrgs because the requirement is to show ONLY connected organizations.
      const hierarchy = await Promise.all(
        userOrgs.map(async (userOrg) => {
          const orgId = userOrg.organization_id;

          // Fetch Projects for Org
          const projectsResponse = await fetchEntityCollection({
            service: ProjectManagementService,
            payload: {
              queryselector: 'organization-id',
              query: { search: orgId },
            },
            apiKey,
            settings,
          });
          const allProjects = projectsResponse?.result?.items || [];

          const projectsWithApps = await Promise.all(
            allProjects.map(async (project) => {
              // Fetch Apps for Project
              const appsResponse = await fetchEntityCollection({
                service: AppManagementService,
                payload: {
                  queryselector: 'project-id',
                  query: { search: project.id },
                },
                apiKey,
                settings,
              });
              const allApps = appsResponse?.result?.items || [];

              const appsWithRoles = await Promise.all(
                allApps.map(async (app) => {
                  const appConnectionId = userAppConnectionMap.get(app.id);
                  const isAppSelected = !!appConnectionId;

                  // User Roles for Selection State
                  const userAppRolesMap = new Map(); // role_id -> user_app_role_id
                  const userAppClaimsMap = new Map();
                  const userAppCapabilitiesMap = new Map();

                  try {
                    class ScopedUserAppRoleService extends UserAppRoleService {
                      async getByParameters(params) {
                        return super.getByParameters({
                          ...params,
                          app_id: app.id,
                          user_id: entityId,
                        });
                      }
                    }

                    const userRolesResponse = await fetchEntityCollection({
                      service: ScopedUserAppRoleService,
                      payload: {
                        queryselector: 'application-entitlement-id',
                      },
                      apiKey,
                      settings,
                    });
                    const userRoles = (userRolesResponse?.result?.items || []).filter(
                      (item) => item.status?.name !== 'deleted',
                    );
                    userRoles.forEach((ur) => userAppRolesMap.set(ur.role_id, ur.id));

                    // User Claims for Selection State
                    try {
                      class ScopedUserAppClaimService extends UserAppClaimService {
                        async getByParameters(params) {
                          return super.getByParameters({
                            ...params,
                            app_id: app.id,
                            user_id: entityId,
                          });
                        }
                      }
                      const userClaimsResponse = await fetchEntityCollection({
                        service: ScopedUserAppClaimService,
                        payload: { queryselector: 'application-entitlement-id' },
                        apiKey,
                        settings,
                      });
                      const userClaims = (userClaimsResponse?.result?.items || []).filter(
                        (item) => item.status?.name !== 'deleted',
                      );
                      userClaims.forEach((uc) => userAppClaimsMap.set(uc.claim_id, uc.id));
                    } catch (e) {
                      // console.warn(`Failed to fetch user claims for app ${app.id}`, e);
                    }

                    // User Capabilities for Selection State
                    try {
                      class ScopedUserAppCapabilityService extends UserAppCapabilityService {
                        async getByParameters(params) {
                          return super.getByParameters({
                            ...params,
                            app_id: app.id,
                            user_id: entityId,
                          });
                        }
                      }
                      const userCapsResponse = await fetchEntityCollection({
                        service: ScopedUserAppCapabilityService,
                        payload: { queryselector: 'application-entitlement-id' },
                        apiKey,
                        settings,
                      });
                      const userCaps = (userCapsResponse?.result?.items || []).filter(
                        (item) => item.status?.name !== 'deleted',
                      );
                      userCaps.forEach((ucap) => userAppCapabilitiesMap.set(ucap.capability_id, ucap.id));
                    } catch (e) {
                      // console.warn(`Failed to fetch user capabilities for app ${app.id}`, e);
                    }
                  } catch (e) {
                    // console.warn(`Failed to fetch user roles for app ${app.id}`, e);
                  }

                  // Fetch Roles (Catalog) - Show all roles so user can Add/Remove
                  let allRoles = [];
                  try {
                    const rolesResponse = await fetchEntityCollection({
                      service: SecurityRoleService,
                      payload: {
                        queryselector: 'app-id',
                        query: { search: app.id },
                      },
                      apiKey,
                      settings,
                    });
                    allRoles = rolesResponse?.result?.items || [];
                  } catch (e) {
                    console.warn(`Failed to fetch roles for app ${app.id}`, e);
                  }

                  const rolesWithClaims = await Promise.all(
                    allRoles.map(async (role) => {
                      const roleConnectionId = userAppRolesMap.get(role.id) || null;
                      const isRoleSelected = !!roleConnectionId;

                      const claimsResponse = await fetchEntityCollection({
                        service: SecurityClaimService,
                        payload: {
                          queryselector: 'role-id',
                          query: { search: role.role_id || role.id },
                        },
                        apiKey,
                        settings,
                      });
                      const roleClaims = claimsResponse?.result?.items || [];

                      const claimsWithCaps = await Promise.all(
                        roleClaims.map(async (claim) => {
                          const capsResponse = await fetchEntityCollection({
                            service: SecurityCapabilityService,
                            payload: {
                              queryselector: 'claim-id',
                              query: { search: claim.id },
                            },
                            apiKey,
                            settings,
                          });
                          const capabilitiesRaw = capsResponse?.result?.items || [];
                          const capabilities = capabilitiesRaw.map((cap) => {
                            const capConnectionId = userAppCapabilitiesMap.get(cap.id);
                            return {
                              ...cap,
                              isSelected: !!capConnectionId,
                              connectionId: capConnectionId,
                            };
                          });

                          const claimConnectionId = userAppClaimsMap.get(claim.id);
                          return {
                            ...claim,
                            capabilities,
                            isSelected: !!claimConnectionId,
                            connectionId: claimConnectionId,
                          };
                        }),
                      );

                      return {
                        ...role,
                        claims: claimsWithCaps,
                        isSelected: isRoleSelected,
                        connectionId: roleConnectionId, // Store connection ID
                      };
                    }),
                  );

                  return {
                    ...app,
                    roles: rolesWithClaims,
                    isSelected: isAppSelected,
                    connectionId: appConnectionId, // Store connection ID
                    project_id: project.id,
                  };
                }),
              );

              return {
                ...project,
                apps: appsWithRoles,
                isSelected: appsWithRoles.some((a) => a.isSelected),
              };
            }),
          );

          return {
            ...userOrg,
            projects: projectsWithApps,
            isSelected: true,
            connectionId: userOrgConnectionMap.get(orgId),
          };
        }),
      );

      setHierarchyData(hierarchy);
    } catch (error) {
      console.error('Error fetching deep hierarchy:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHierarchy = useMemo(() => {
    if (!searchText.trim()) return hierarchyData;

    const query = searchText.toLowerCase();

    // Recursive matching function
    const hasMatch = (node) => {
      // Check current node
      const activeName =
        node.name ||
        node.profile?.display_name ||
        node.slug ||
        node.title || // Sometimes projects might have title? sticking to name usually
        '';

      if (activeName.toString().toLowerCase().includes(query)) return true;
      if (node.id && node.id.toString().toLowerCase().includes(query)) return true;

      // Check children
      if (node.projects && node.projects.some(hasMatch)) return true;
      if (node.apps && node.apps.some(hasMatch)) return true;
      if (node.roles && node.roles.some(hasMatch)) return true;
      if (node.claims && node.claims.some(hasMatch)) return true;
      if (node.capabilities && node.capabilities.some(hasMatch)) return true;

      return false;
    };

    return hierarchyData.filter((org) => hasMatch(org));
  }, [hierarchyData, searchText]);

  /**
   * Updates the hierarchy state locally based on checkbox interactions.
   * Tracks 'isSelected' property to reflect pending changes.
   */
  const handleToggle = (type, targetId, parents = {}) => {
    setHierarchyData((prevData) => updateHierarchyNode(prevData, 'organization', type, targetId, parents));
  };

  /**
   * Orchestrates the transactional saving of changes.
   */
  const handleSave = async () => {
    setIsLoading(true);
    const summary = {
      created: { organizations: 0, apps: 0, roles: 0 },
      created: { organizations: 0, apps: 0, roles: 0, claims: 0, capabilities: 0 },
      deleted: { organizations: 0, apps: 0, roles: 0, claims: 0, capabilities: 0 },
    };

    try {
      // Delta Analysis Arrays
      const orgsToCreate = [];
      const appsToCreate = [];
      const rolesToCreate = [];
      const claimsToCreate = [];
      const capsToCreate = [];

      const capsToDelete = [];
      const claimsToDelete = [];
      const rolesToDelete = [];
      const appsToDelete = [];
      const orgsToDelete = [];

      // Loop through hierarchy to identify changes
      hierarchyData.forEach((org) => {
        // Recursive check for all entities
        let orgHasActiveApps = false; // To determine if org should become orphan

        org.projects.forEach((project) => {
          project.apps.forEach((app) => {
            const hasSelectedRoles = app.roles.some((r) => r.isSelected);

            // App Creation Logic
            if (hasSelectedRoles) {
              orgHasActiveApps = true;

              if (!app.connectionId) {
                appsToCreate.push({
                  ...app,
                  organization_id: org.organization_id || org.id,
                  project_id: project.id,
                });
              }
            } else if (app.connectionId) {
              // Had connection, now has no roles -> Delete App
              appsToDelete.push(app);
            }

            // Role Logic
            app.roles.forEach((role) => {
              if (role.isSelected && !role.connectionId) {
                rolesToCreate.push({
                  ...role,
                  organization_id: org.organization_id || org.id,
                  app_id: app.id,
                });
              } else if (!role.isSelected && role.connectionId) {
                rolesToDelete.push(role);
              }

              // Claims Logic
              // Even if Role is not selected (deleted), we might need to clean up claims if logic demands
              // But theoretically if Role is deselected, all claims are deselected visually, so they will be caught here.
              if (role.claims) {
                role.claims.forEach((claim) => {
                  if (claim.isSelected && !claim.connectionId) {
                    claimsToCreate.push({
                      ...claim,
                      organization_id: org.organization_id || org.id,
                      app_id: app.id,
                      user_id: entityId,
                    });
                  } else if (!claim.isSelected && claim.connectionId) {
                    claimsToDelete.push(claim);
                  }

                  // Capabilities Logic
                  if (claim.capabilities) {
                    claim.capabilities.forEach((cap) => {
                      if (cap.isSelected && !cap.connectionId) {
                        capsToCreate.push({
                          ...cap,
                          organization_id: org.organization_id || org.id,
                          app_id: app.id,
                          user_id: entityId,
                        });
                      } else if (!cap.isSelected && cap.connectionId) {
                        capsToDelete.push(cap);
                      }
                    });
                  }
                });
              }
            });
          });
        });

        // Org Logic
        // If OrgImplied (has active apps) and no connection -> Create
        if (orgHasActiveApps && !org.connectionId) {
          orgsToCreate.push(org);
        } else if (!orgHasActiveApps && org.connectionId) {
          orgsToDelete.push(org);
        }
      });

      // --- EXECUTION PHASE ---

      // 1. Create Organizations (if new)
      for (const org of orgsToCreate) {
        await createEntityRecord({
          service: UserOrganizationService,
          payload: {
            user_id: entityId,
            organization_id: org.organization_id || org.id,
            context_data: {
              organization_display_name: org.profile?.display_name || org.name,
            },
          },
          apiKey,
          settings,
        });
        summary.created.organizations++;
      }

      // 2. Create Apps (if new)
      for (const app of appsToCreate) {
        await createEntityRecord({
          service: UserAppService,
          payload: {
            user_id: entityId,
            organization_id: app.organization_id,
            project_id: app.project_id,
            app_id: app.id,
            is_onboarding_completed: false,
            context_data: {
              app_name: app.name,
            },
          },
          apiKey,
          settings,
        });
        summary.created.apps++;
      }

      // 3. Create Roles
      // Use Promise.all for parallel role creation as dependency (App) is satisfied
      await Promise.all(
        rolesToCreate.map(async (role) => {
          await createEntityRecord({
            service: UserAppRoleService,
            payload: {
              user_id: entityId,
              role_id: role.role_id || role.id,
              organization_id: role.organization_id,
              app_id: role.app_id,
              context_data: {
                role_name: role.roleName || role.name,
              },
            },
            apiKey,
            settings,
          });
          summary.created.roles++;
        }),
      );

      // 4. Create Claims
      await Promise.all(
        claimsToCreate.map(async (claim) => {
          await createEntityRecord({
            service: UserAppClaimService,
            payload: {
              user_id: entityId,
              claim_id: claim.claim_id || claim.id,
              organization_id: claim.organization_id,
              app_id: claim.app_id,
              context_data: {
                claim_name: claim.name,
              },
            },
            apiKey,
            settings,
          });
          summary.created.claims++;
        }),
      );

      // 5. Create Capabilities
      await Promise.all(
        capsToCreate.map(async (cap) => {
          await createEntityRecord({
            service: UserAppCapabilityService,
            payload: {
              user_id: entityId,
              capability_id: cap.capability_id || cap.id,
              organization_id: cap.organization_id,
              app_id: cap.app_id,
              context_data: {
                capability_name: cap.name,
              },
            },
            apiKey,
            settings,
          });
          summary.created.capabilities++;
        }),
      );

      // 6. Delete Capabilities (First leaf nodes)
      await Promise.all(
        capsToDelete.map(async (cap) => {
          await deleteEntityRecord({
            service: UserAppCapabilityService,
            payload: { id: cap.connectionId },
            apiKey,
            settings,
          });
          summary.deleted.capabilities++;
        }),
      );

      // 7. Delete Claims
      await Promise.all(
        claimsToDelete.map(async (claim) => {
          await deleteEntityRecord({
            service: UserAppClaimService,
            payload: { id: claim.connectionId },
            apiKey,
            settings,
          });
          summary.deleted.claims++;
        }),
      );

      // 8. Delete Roles
      await Promise.all(
        rolesToDelete.map(async (role) => {
          console.log(`Deleting Role Connection: ${role.connectionId}`);
          await deleteEntityRecord({
            service: UserAppRoleService,
            payload: { id: role.connectionId },
            apiKey,
            settings,
          });
          summary.deleted.roles++;
        }),
      );

      // 9. Delete Apps (Orphans)
      await Promise.all(
        appsToDelete.map(async (app) => {
          console.log(`Deleting App Connection: ${app.connectionId}`);
          await deleteEntityRecord({
            service: UserAppService,
            payload: { id: app.connectionId },
            apiKey,
            settings,
          });
          summary.deleted.apps++;
        }),
      );

      // 10. Delete Organizations (Orphans)
      await Promise.all(
        orgsToDelete.map(async (org) => {
          console.log(`Deleting Org Connection: ${org.connectionId}`);
          await deleteEntityRecord({
            service: UserOrganizationService,
            payload: { id: org.connectionId },
            apiKey,
            settings,
          });
          summary.deleted.organizations++;
        }),
      );

      console.log('Save Operation Summary:', summary);

      // Refresh to sync state and IDs
      await fetchDeepHierarchy();
    } catch (error) {
      console.error('Error saving hierarchy changes:', error);
      // Ideally show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hierarchyData.length) return;

    // Sync selection state if needed, though handleToggle handles local state
    // We already keep hierarchyData updated with 'isSelected'
  }, [hierarchyData]);

  useEffect(() => {
    if (entityId) {
      fetchDeepHierarchy();
    }
  }, [entityId]);

  const onUpdatedEntity = () => {
    setActiveModal(null);
    fetchDeepHierarchy();
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner />
      </div>
    );
  }

  return (
    <Box className="p-3">
      <section className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-3">
        <SearchContainer>
          <StyledSearchField
            label="Search Organizations, Apps, Roles..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </SearchContainer>

        <div className="d-flex gap-2 align-self-end align-self-md-center">
          <Button
            variant="contained"
            disableElevation
            onClick={() => setActiveModal('create')}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '13px',
              backgroundColor: 'var(--ct-bg-topbar-dark)',
              '&:hover': { backgroundColor: 'var(--ct-bg-topbar-dark)', opacity: 0.92 },
            }}
          >
            <AddIcon fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
            Add new
          </Button>
          <button className="btn btn-primary" onClick={handleSave} disabled={isLoading}>
            Save
          </button>
        </div>
      </section>

      {!filteredHierarchy.length && <div className="p-3 text-center text-muted">No matches found.</div>}

      {filteredHierarchy.map((org) => (
        <OrganizationNode key={org.id || org.organization_id} org={org} handleToggle={handleToggle} />
      ))}

      <StyledPopUp
        data-testid="popup-modal"
        id="popup-modal"
        isOpen={Boolean(activeModal)}
        setIsOpen={(isOpen) => setActiveModal(isOpen ? Boolean(activeModal) : null)}
        className="col-lg-6 col-md-10 col-12"
      >
        {activeModal === 'create' && (
          <UserOrganizationQuickCreateComponent
            user={{ id: entityId }}
            onUpdatedEntity={onUpdatedEntity}
            setIsOpen={() => setActiveModal(null)}
            isPopupContext
          />
        )}
      </StyledPopUp>
    </Box>
  );
};

export default UserOrganizationRoleManager;
