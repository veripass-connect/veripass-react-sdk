import React, { useState, useEffect } from 'react';
import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';
import { openSnackbar, DataGrid, StatusSelector, Alert, useNavigate } from '@link-loom/react-sdk';
import { Button } from '@mui/material';

import { fetchEntityCollection } from '@services/utils/entityServiceAdapter';
import { useUrlErrorHandler } from '@hooks/useUrlErrorHandler';
import { useAuth } from '@hooks/useAuth.hook';

import PlaceholderComponent from '@components/shared/Placeholder.component';
import emptyImageUrl from '@assets/utils/empty.svg';
import '@styles/fonts.css';
import '@styles/styles.css';

import { IdentityContractService } from '@services';

export const VeripassIdentityContractList = ({
  ui = {
    profilePhoto: {
      height: '95',
    },
    inputSize: 'small',
  },
  redirectUrl = '',
  environment = 'production',
  apiKey = '',
  isPopupContext = false,
  readOnly = false,
  contractParties = {
    principal_id: '',
    counterparty_id: '',
  },
}) => {
  // Hooks
  const { showErrorFromUrl } = useUrlErrorHandler();
  const authProvider = useAuth();

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
    { id: 'quick-view', icon: <i className="fe-search me-1"></i>, label: 'Vista rápida', type: 'action' },
    ...(!readOnly
      ? []
      : [
          { id: 'edit', icon: <i className="fe-edit me-1"></i>, label: 'Editar', type: 'action' },
          { id: 'inactive', icon: <i className="fe-power me-1"></i>, label: 'Inactivar', type: 'action' },
          { id: 'delete', icon: <i className="fe-delete me-1"></i>, label: 'Borrar', type: 'action' },
        ]),
  ];
  const columns = [
    {
      field: 'principal_party_id',
      headerName: 'Principal Party',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <section className="veripass-d-flex veripass-align-items-center veripass-w-100">
            <StatusSelector
              status={params?.row?.status}
              statuses={statuses}
              size="small"
              statusSelected={(status) => {
                itemOnAction('update-status', { entity: params?.row || {}, status });
              }}
            />
            <button
              className="veripass-btn veripass-btn-link-dark veripass-text-truncate"
              onClick={() => {
                itemOnAction('quick-view', { entity: params?.row || {} });
              }}
            >
              {params?.row?.context?.principal_party_display_name}
            </button>
          </section>
        );
      },
    },
    {
      field: 'counterparty_id',
      headerName: 'Counterparty',
      sortable: true,
      width: 300,
      flex: 2,
      valueGetter: (params) => params?.row?.counterparty_id || '',
      renderCell: (params) => {
        return <>{params?.row?.context?.counterparty_display_name}</>;
      },
    },
    {
      field: 'organization_id',
      headerName: 'Organization',
      width: 500,
      flex: 2,
      valueGetter: (params) => params?.row?.organization_id || '',
      renderCell: (params) => {
        return <>{params?.row?.context?.organization_display_name}</>;
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
    const relativeUrl = `https://me.veripass.com.co/contract/${id}`;
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
      service: UserManagementService,
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
        openSnackbar('Usuario creado satisfactoriamente.', 'success');
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

    openSnackbar('Item created successfully', 'success');
  };

  const itemOnCreated = (response) => {
    if (!response || !response?.success) {
      itemOnError({ title: 'Error', description: 'Algo ocurrió mientras se creaba el usuario.', action: 'error-created' });
      return;
    }

    entityCreatedSuccessfully(response);
  };

  const itemOnInactivated = (response) => {
    if (!response || !response.success) {
      itemOnError({ title: 'Error', description: 'Algo ocurrió mientras se inactivaba el usuario.', action: 'error-inactive' });
      return;
    }

    const updatedEntity = response.result ?? {};
    const updateEntity = (prevState) => {
      return prevState.map((entity) => (entity.id === updatedEntity.id ? updatedEntity : entity));
    };

    setFormattedEntities(updateEntity);

    openSnackbar('El usuario ha sido inactivado.', 'success');
  };

  const itemOnDeleted = (response) => {
    if (!response || !response.success) {
      itemOnError({ title: 'Error', description: 'Algo ocurrió mientras se eliminaba el usuario.', action: 'error-delete' });
      return;
    }

    const updatedEntity = response.result ?? {};
    const deleteEntity = (prevState) => {
      const newEntities = prevState.filter((_entity) => _entity.id !== updatedEntity.id);

      return newEntities;
    };

    setFormattedEntities(deleteEntity);

    openSnackbar('El usuario ha sido eliminado.', 'success');
  };

  const itemOnUpdate = (response) => {
    setActiveModal(null);

    if (!response || !response.success) {
      itemOnError({ title: 'Error', description: 'Algo ocurrió mientras se actualizaba el usuario.', action: 'error-update' });
      return;
    }

    refreshEntity(response);
    openSnackbar('Usuario actualizado exitosamente.', 'success');
  };

  const updateItemStatus = async ({ entity, status }) => {
    entity.status = status;
    const response = await updateEntityRecord({ service: UserManagementService, payload: entity });

    itemOnUpdate(response);
  };

  const refreshEntity = (response) => {
    const updatedEntity = response.result ?? {};
    const updateEntity = (prevState) => {
      return prevState.map((entity) => (entity.id === updatedEntity.id ? updatedEntity : entity));
    };

    setFormattedEntities(updateEntity);
  };

  const getIdentityContracts = async () => {
    if (!contractParties || !contractParties.counterparty_id || !contractParties.principal_id) {
      return;
    }

    const entityResponse = await fetchEntityCollection({
      service: IdentityContractService,
      payload: {
        queryselector: 'id',
        counterparty_id: contractParties.counterparty_id,
        principal_id: contractParties.principal_id,
      },
      apiKey,
      settings: { environment },
    });

    setLoading(false);

    if (!entityResponse?.success) {
      setIsEmptyEntities(true);
      return;
    }

    setEntities(entityResponse?.result?.items || []);
    setIsEmptyEntities(entityResponse?.result?.items <= 0);
  };

  const initializeComponent = async () => {
    showErrorFromUrl();
  };

  useEffect(() => {
    filterEntities();
  }, [entities]);

  useEffect(() => {
    getIdentityContracts();
  }, [paginationModel]);

  useEffect(() => {
    initializeComponent();
  }, []);

  return (
    <>
      <VeripassLayout isPopupContext={isPopupContext} ui={{ showLogo: true, vertical: 'bottom', alignment: 'end' }}>
        {loading ? (
          <PlaceholderComponent />
        ) : (
          <>
            {isEmptyEntities && (
              <>
                <section className="veripass-col-12 veripass-col-lg-12 veripass-col-xl-10 veripass-mx-auto veripass-d-block veripass-shadow-lg veripass-mt-4">
                  <div className="veripass-card veripass-rounded-8">
                    <div className="veripass-card-body">
                      <article className="veripass-container veripass-pt-2 veripass-text-center">
                        <h3 className="veripass-text-center">There is no information registered yet.</h3>
                        <p className="veripass-text-muted">
                          This section has no records yet. Once contracts are created or assigned, they will appear here.
                        </p>
                        <img src={emptyImageUrl} alt="empty content" className="veripass-d-block veripass-mx-auto" height="250" />
                        {!readOnly && (
                          <Button
                            className="veripass-btn veripass-btn-bordered-purple veripass-my-3 veripass-me-3"
                            onClick={() => itemOnAction('create')}
                          >
                            Crear usuario
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
                <section className="veripass-col-12 veripass-col-lg-12 veripass-col-xl-12 veripass-mx-auto veripass-d-block veripass-shadow-lg veripass-mt-4">
                  <div className="veripass-card veripass-rounded-8">
                    <header className="veripass-d-flex veripass-flex-row veripass-justify-content-between veripass-px-4 veripass-pt-4">
                      <section>
                        <h4 className="veripass-mt-0 header-title">Todos tus contratos</h4>
                        <p className="veripass-text-muted font-14 veripass-mb-3">
                          Visualiza, organiza y optimiza tus contratos con total facilidad.
                        </p>
                      </section>
                      <section className="veripass-align-items-sm-baseline veripass-d-flex veripass-dropdown">
                        {!readOnly && (
                          <Button
                            variant="contained"
                            onClick={(event) => {
                              event.preventDefault();
                              itemOnAction('create', null);
                            }}
                          >
                            <i className="mdi mdi-plus veripass-me-1"></i> Iniciar contrato
                          </Button>
                        )}
                      </section>
                    </header>

                    <section className="veripass-px-4 veripass-pb-4">
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
    </>
  );
};
