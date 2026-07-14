import React, { useState, useEffect } from 'react';

import { FormGroup, FormControlLabel, Switch } from '@mui/material';
import { Alert, Spinner } from '@link-loom/react-sdk';

import UserSettingsPreview from '../preview/UserSettingsPreview.component';
import UserSettingsEdit from '../edit/UserSettingsEdit.component';

const defaultAlertConfigs = {
  success: {
    title: 'Success',
    description: 'Operation completed successfully, do you want to continue editing?',
    typeIcon: 'success',
    confirmButtonText: 'Yes, continue editing',
    cancelButtonText: 'No',
    cancelButtonClass: 'btn btn-white',
    showCancelButton: true,
    currentAction: 'updated',
  },
  error: {
    title: 'Error',
    description: 'Something was wrong while executing action.',
    typeIcon: 'error',
    confirmButtonText: 'Exit',
    cancelButtonText: 'Try again',
    cancelButtonClass: 'btn btn-white',
    showCancelButton: true,
    currentAction: 'updated',
  },
};

const UserSettingsManager = (props) => {
  const { entityState, entityRef, relatedEntities, loadingState, apiKey, environment } = props;
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDialog, setShowDialog] = useState(null);
  const [dialogConfigs, setDialogConfigs] = useState(null);

  const handleEditChange = () => {
    setIsEditMode((prevEditMode) => !prevEditMode);
  };

  const dialogOnConfirmed = (isConfirmed) => {
    switch (dialogConfigs.currentAction) {
      case 'updated':
        setIsEditMode(isConfirmed);
        break;

      default:
        break;
    }

    setShowDialog(false);
  };

  const onUpdatedEntity = (action, updatedEntity) => {
    if (!updatedEntity) {
      setDialogConfigs(defaultAlertConfigs.error);
      setShowDialog(true);
      return;
    }

    switch (action) {
      case 'update':
        entityState.setEntity((prevUserData) => ({
          ...prevUserData,
          [entityRef]: updatedEntity,
        }));
        setDialogConfigs(defaultAlertConfigs.success);
        setShowDialog(true);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (entityState === false) {
      loadingState.setIsLoading(false);
    }
  }, [entityState]);

  return (
    <section className="container-fluid">
      {loadingState.isLoading ? (
        <Spinner />
      ) : (
        <>
          <header className="d-flex flex-row justify-content-end">
            <section className="d-flex align-items-sm-baseline">
              <FormGroup>
                <FormControlLabel
                  control={<Switch checked={isEditMode} onChange={handleEditChange} name="editmode" />}
                  label="Edit mode"
                />
              </FormGroup>
            </section>
          </header>

          <section className="content">
            {isEditMode ? (
              <UserSettingsEdit
                entity={entityState?.entity[entityRef]}
                fullEntity={entityState?.entity}
                entityId={entityState?.entity?.id}
                apiKey={apiKey}
                environment={environment}
                onUpdatedEntity={onUpdatedEntity}
              />
            ) : (
              <UserSettingsPreview entity={entityState?.entity[entityRef]} apiKey={apiKey} environment={environment} />
            )}
          </section>
        </>
      )}

      {showDialog === true && <Alert config={dialogConfigs} setConfirm={dialogOnConfirmed} />}
    </section>
  );
};

export default UserSettingsManager;
