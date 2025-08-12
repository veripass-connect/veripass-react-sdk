import React, { useEffect, useState } from 'react';
import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';
import { openSnackbar, DataGrid, StatusSelector, PopUp, Alert, useNavigate } from '@link-loom/react-sdk';
import { Button } from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

/* import {
  UserManagementCreate,
  UserManagementDeleteComponent,
  UserManagementInactiveComponent,
  UserManagementEditComponent,
} from '@components/pages'; */
import { fetchEntityCollection, fetchMultipleEntities, updateEntityRecord } from '@services/utils/entityServiceAdapter';

import PlaceholderComponent from '@components/shared/Placeholder.component';
import emptyImageUrl from '@assets/utils/empty.svg';

import { TeamManagementService } from '@services';

export const VeripassTeamManagementList = ({
  ui = {
    profilePhoto: {
      height: '95',
    },
    inputSize: 'small',
    sections: {
      emptyState: {
        title: 'No records found.',
        description: 'Start by creating your first team to begin managing this section.',
        primaryAction: 'Create team',
      },
      teams: {
        title: 'All organization teams',
        description: 'View, organize, and optimize your institutional teams with ease.',
        primaryAction: 'Create team',
      },
    },
  },
  entityManagementUrl = '/user/management/',
  environment = 'production',
  apiKey = '',
  isPopupContext = false,
  readOnly = false,
}) => {
  // Hooks
  const navigate = useNavigate();

  // Models
  const [statuses, setStatuses] = useState({});
  const [entities, setEntities] = useState([]);
  const [formattedEntities, setFormattedEntities] = useState([]);
  const [entitySelected, setEntitySelected] = useState(null);

  // UI states
  const [loading, setLoading] = useState(true);
  const [alertConfigs, setAlertConfigs] = useState(null);
  const [showAlert, setShowAlert] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [isEmptyEntities, setIsEmptyEntities] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);

  // Configs
  const actions = [
    {
      id: 'copy',
      label: 'Copy Actions',
      type: 'group',
      items: [
        { id: 'copy-id', label: 'Copiar Id' },
        { id: 'copy-link', label: 'Copiar link' },
        { id: 'new-tab', label: 'Tab nuevo' },
      ],
    },
    { id: 'quick-view', icon: <SearchIcon fontSize="small" className="me-1" />, label: 'Quick View', type: 'action' },
    { id: 'edit', icon: <EditIcon fontSize="small" className="me-1" />, label: 'Edit', type: 'action' },
    { id: 'inactive', icon: <PowerSettingsNewIcon fontSize="small" className="me-1" />, label: 'Inactive', type: 'action' },
    { id: 'delete', icon: <DeleteIcon fontSize="small" className="me-1" />, label: 'Delete', type: 'action' },
  ];
  const columns = [
    {
      field: 'display_name',
      headerName: 'Nombre',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <section className="d-flex align-items-center w-100">
            <StatusSelector
              status={params?.row?.status}
              statuses={statuses}
              size="small"
              statusSelected={(status) => {
                itemOnAction('update-status', { entity: params?.row || {}, status });
              }}
            />
            <button
              className="btn btn-link-dark text-truncate"
              onClick={() => {
                itemOnAction('quick-view', { entity: params?.row || {} });
              }}
            >
              {params?.row?.veripass_profile?.display_name}
            </button>
          </section>
        );
      },
    },
    {
      field: 'primary_email_address',
      headerName: 'Email',
      sortable: true,
      width: 300,
      flex: 2,
      valueGetter: (params) => params?.row?.veripass_profile?.primary_email_address || '',
      renderCell: (params) => {
        return <>{params?.row?.veripass_profile?.primary_email_address}</>;
      },
    },
    {
      field: 'primary_phone_number',
      headerName: 'Celular',
      width: 500,
      flex: 2,
      valueGetter: (params) => params?.row?.veripass_profile?.primary_phone_number || '',
      renderCell: (params) => {
        return (
          <>
            +{params?.row?.veripass_profile?.primary_phone_number?.country?.dial_code}{' '}
            {params?.row?.veripass_profile?.primary_phone_number?.phone_number}
          </>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'string',
      sortable: false,
      disableColumnMenu: true,
      editable: false,
      renderCell: 'actions',
    },
  ];

  // Component functions
  const getEntityUrl = ({ relative, id }) => {
    const relativeUrl = `${entityManagementUrl}${id}`;
    if (relative) {
      return relativeUrl;
    }

    return window.location.host + relativeUrl;
  };

  const filterEntities = () => {
    const formattedEntities = showDeleted ? entities : entities.filter((entity) => entity?.status?.name !== 'deleted');

    // TODO: Format entities here if is needed
    setFormattedEntities(formattedEntities.map((entity) => entity));
  };

  const handleFilterChange = async (newFilterModel) => {
    if (!newFilterModel.quickFilterValues?.length) {
      initializeComponent();
      return;
    }

    const filteredItemsResponse = await fetchEntityCollection({
      service: TeamManagementService,
      selector: 'name',
      query: {
        search: newFilterModel.quickFilterValues.join(' '),
      },
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      apiKey,
      settings: { environment },
    });

    if (!filteredItemsResponse?.success || !filteredItemsResponse.result?.items) {
      setEntities([]);
      setRowCount(0);
      return;
    }

    setEntities(filteredItemsResponse.result.items);
    setRowCount(filteredItemsResponse.result.totalItems);
  };

  /**
   * Executes an action when alert is confirmed
   * @param {boolean} isConfirmed Validates if alert is confirmed or not
   * @returns
   */
  const alertOnConfirmed = (isConfirmed) => {
    setShowAlert(false);

    if (!isConfirmed) {
      return;
    }

    switch (alertConfigs.currentAction) {
      case 'error-created':
        //navigate(getEntityUrl({ relative: true, id: entitySelected?.id }), { newTab: false });
        break;
      case 'error-inactive':
        break;
      case 'error-deleted':
        break;
      case 'error-update':
        break;
      default:
        break;
    }
  };

  const itemOnError = ({ title, description, action }) => {
    setAlertConfigs({
      title,
      description,
      typeIcon: 'error',
      confirmButtonText: 'Exit',
      cancelButtonText: 'Try again',
      cancelButtonClass: 'btn btn-white',
      showCancelButton: true,
      currentAction: action,
    });
    setShowAlert(true);
  };

  const itemOnAction = (action, entity) => {
    setEntitySelected(entity);

    switch (action) {
      case 'quick-view':
        setActiveModal(action);
        break;
      case 'create':
        setActiveModal(action);
        break;
      case 'edit':
        setActiveModal(action);
        break;
      case 'inactive':
        setActiveModal(action);
        break;
      case 'delete':
        setActiveModal(action);
        break;
      case 'update-status':
        updateItemStatus(entity);
        break;
      case 'copy-id':
        navigator.clipboard.writeText(entity.id);
        openSnackbar('Id copied!', 'success');
        break;
      case 'copy-link':
        navigator.clipboard.writeText(getEntityUrl({ relative: false, id: entity?.id }));
        openSnackbar('Link copied!', 'success');
        break;
      case 'new-tab':
        navigate(getEntityUrl({ relative: true, id: entity?.id }), { newTab: true });
        break;
      default:
        break;
    }
  };

  const onUpdatedEntity = (action, response) => {
    switch (action) {
      case 'create':
        itemOnCreated(response);
        openSnackbar('Team was created successfully.', 'success');
        break;
      case 'inactive':
        itemOnInactivated(response);

        break;
      case 'delete':
        itemOnDeleted(response);
        break;
    }
  };

  const entityCreatedSuccessfully = (response) => {
    const entity = response.result ?? {};

    const createdEntity = (prevState) => {
      const newEntities = [...prevState, entity];

      return newEntities;
    };

    setFormattedEntities(createdEntity);
    setEntities(createdEntity);

    setEntitySelected(entity);
    setIsEmptyEntities(false);

    if (showAlert) {
      return;
    }

    openSnackbar('Team created successfully', 'success');
  };

  const itemOnCreated = (response) => {
    if (!response || !response?.success) {
      itemOnError({ title: 'Error', description: 'An error occurred while creating the team.', action: 'error-created' });
      return;
    }

    entityCreatedSuccessfully(response);
  };

  const itemOnInactivated = (response) => {
    if (!response || !response.success) {
      itemOnError({ title: 'Error', description: 'An error occurred while deactivating the team.', action: 'error-inactive' });
      return;
    }

    const updatedEntity = response.result ?? {};
    const updateEntity = (prevState) => {
      return prevState.map((entity) => (entity.id === updatedEntity.id ? updatedEntity : entity));
    };

    setFormattedEntities(updateEntity);

    openSnackbar('The team has been deactivated.', 'success');
  };

  const itemOnDeleted = (response) => {
    if (!response || !response.success) {
      itemOnError({ title: 'Error', description: 'An error occurred while deleting the team.', action: 'error-delete' });
      return;
    }

    const updatedEntity = response.result ?? {};
    const deleteEntity = (prevState) => {
      const newEntities = prevState.filter((_entity) => _entity.id !== updatedEntity.id);

      return newEntities;
    };

    setFormattedEntities(deleteEntity);

    openSnackbar('The team has been eliminated.', 'success');
  };

  const itemOnUpdate = (response) => {
    setActiveModal(null);

    if (!response || !response.success) {
      itemOnError({ title: 'Error', description: 'An error occurred while updating the team.', action: 'error-update' });
      return;
    }

    refreshEntity(response);
    openSnackbar('Team updated succesfully.', 'success');
  };

  const updateItemStatus = async ({ entity, status }) => {
    entity.status = status;
    const response = await updateEntityRecord({
      service: TeamManagementService,
      payload: entity,
      apiKey,
      settings: { environment },
    });

    itemOnUpdate(response);
  };

  const refreshEntity = (response) => {
    const updatedEntity = response.result ?? {};
    const updateEntity = (prevState) => {
      return prevState.map((entity) => (entity.id === updatedEntity.id ? updatedEntity : entity));
    };

    setFormattedEntities(updateEntity);
  };

  const initializeComponent = async () => {
    const [users, statuses] = await fetchMultipleEntities([
      {
        service: TeamManagementService,
        payload: {
          queryselector: 'all',
          exclude_status: 'deleted',
          search: '',
          page: paginationModel.page + 1,
          pageSize: paginationModel.pageSize,
        },
        apiKey,
        settings: { environment },
      },
      {
        service: TeamManagementService,
        payload: {
          queryselector: 'statuses',
        },
        apiKey,
        settings: { environment },
      },
    ]);

    setLoading(false);

    if (!users?.success || !users?.result?.items?.length) {
      setIsEmptyEntities(true);
      return;
    }

    setEntities(users.result.items || []);
    setStatuses(statuses.result || {});
    setRowCount(users.result.totalItems || 0);
  };

  useEffect(() => {
    filterEntities();
  }, [entities]);

  useEffect(() => {
    setLoading(true);
    initializeComponent();
  }, [paginationModel]);

  return (
    <>
      <VeripassLayout isPopupContext={isPopupContext} ui={{ showLogo: true, vertical: 'bottom', alignment: 'end' }}>
        {loading ? (
          <PlaceholderComponent />
        ) : (
          <>
            {isEmptyEntities && (
              <>
                <section className="col-12 col-lg-12 col-xl-10 mx-auto d-block shadow-lg mt-4">
                  <div className="card rounded-8">
                    <div className="card-body">
                      <article className="container pt-2 text-center">
                        <h3 className="text-center">{ui?.sections?.emptyState?.title}</h3>
                        <p className="text-muted">{ui?.sections?.emptyState?.description}</p>
                        <img src={emptyImageUrl} alt="empty content" className="d-block mx-auto" height="250" />

                        {!readOnly && (
                          <Button  variant="contained" className="my-3 me-3" onClick={() => itemOnAction('create')}>
                            {ui?.sections?.emptyState?.primaryAction}
                          </Button>
                        )}
                      </article>
                    </div>
                  </div>
                </section>
              </>
            )}

            {!isEmptyEntities && (
              <>
                <section className="col-12 col-lg-12 col-xl-12 mx-auto d-block shadow-lg mt-4">
                  <div className="card rounded-8">
                    <header className="d-flex flex-row justify-content-between px-4 pt-4">
                      <section>
                        <h4 className="mt-0 header-title">{ui?.sections?.teams?.title}</h4>
                        <p className="text-muted font-14 mb-3">{ui?.sections?.teams?.description}</p>
                      </section>
                      <section className="align-items-sm-baseline d-flex dropdown">
                        <button
                          className="btn btn-purple"
                          onClick={(event) => {
                            event.preventDefault();
                            itemOnAction('create', null);
                          }}
                        >
                          <i className="mdi mdi-plus me-1"></i> {ui?.sections?.teams?.primaryAction}
                        </button>
                      </section>
                    </header>

                    <section className="px-4 pb-4">
                      <DataGrid
                        columns={columns}
                        rows={formattedEntities}
                        actions={actions}
                        enableActions
                        onMenuItemClick={itemOnAction}
                        localeText={undefined}
                        pageSizeOptions={[10, 20, 50, 100]}
                        disableRowSelectionOnClick={true}
                        initialState={{ pagination: { paginationModel } }}
                        paginationMode="server"
                        rowCount={rowCount}
                        paginationModel={paginationModel}
                        onPaginationModelChange={(model) => {
                          console.log(model);
                          setPaginationModel(model);
                        }}
                        onFilterModelChange={handleFilterChange}
                        onSortModelChange={(data) => {
                          console.log(data);
                        }}
                        loading={loading}
                        sx={{
                          border: 'none',
                        }}
                      />
                    </section>
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </VeripassLayout>

      {showAlert === true && <Alert config={alertConfigs} setConfirm={alertOnConfirmed} />}

      <PopUp
        data-testid="veripass-contract-modal"
        id="veripass-contract-modal"
        isOpen={Boolean(activeModal)}
        setIsOpen={(isOpen) => setActiveModal(isOpen ? Boolean(activeModal) : null)}
        className="col-lg-7 col-md-8 col-12"
      >
        {/*  {activeModal === 'create' && (
          <UserManagementCreate
            setIsOpen={() => setActiveModal(null)}
            onUpdatedEntity={onUpdatedEntity}
            entitySelected={entitySelected}
            isPopupContext
          />
        )}

        {activeModal === 'inactive' && (
          <UserManagementInactiveComponent
            setIsOpen={() => setActiveModal(null)}
            id={entitySelected.id}
            onUpdatedEntity={onUpdatedEntity}
            entitySelected={entitySelected}
            isPopupContext
          />
        )}

        {activeModal === 'delete' && (
          <UserManagementDeleteComponent
            setIsOpen={() => setActiveModal(null)}
            id={entitySelected.id}
            onUpdatedEntity={onUpdatedEntity}
            entitySelected={entitySelected}
            isPopupContext
          />
        )}

        {activeModal === 'edit' && (
          <UserManagementEditComponent
            onUpdatedEntity={onUpdatedEntity}
            entitySelected={entitySelected}
            setIsOpen={() => setActiveModal(null)}
            isPopupContext
          />
        )} */}
      </PopUp>
    </>
  );
};
