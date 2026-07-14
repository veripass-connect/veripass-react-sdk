import React, { useState, useEffect } from 'react';

import { FormGroup, FormControlLabel, Switch } from '@mui/material';
import { Alert, Spinner } from '@link-loom/react-sdk';

import UserSecurityPreview from '../preview/UserSecurityPreview.component';

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

const UserSecurityManager = (props) => {
  const { entityState, entityRef, relatedEntities, loadingState, apiKey, environment } = props;

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
          <header className="d-flex flex-row justify-content-end"></header>

          <section className="content">
            <UserSecurityPreview entity={entityState?.entity[entityRef]} apiKey={apiKey} environment={environment} />
          </section>
        </>
      )}
    </section>
  );
};

export default UserSecurityManager;
