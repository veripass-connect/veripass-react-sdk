import React, { useState, useEffect } from 'react';

import { fetchEntityCollection } from '@services/utils/entityServiceAdapter';
import { useAuth } from '@hooks/useAuth.hook';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { VeripassOrganizationProfilePreview, VeripassOrganizationProfileEdit } from '@';

import '@styles/fonts.css';
import '@styles/styles.css';

const swal = withReactContent(Swal);

import { OrganizationManagementService } from '@services';

const statusCodeMessages = {
  461: 'The data provided does not match any registered application',
  462: 'Unauthorized user. After 3 failed attempts, your account will be locked for 24 hours.',
  463: 'The user is not registered in this application, needs to register',
  464: 'Unauthorized. After 3 failed attempts, your account will be locked for 24 hours.',
  465: 'API key is missing or invalid',
  401: 'Error authenticating',
};

export const VeripassOrganizationProfileManage = ({
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
  veripassIdentity = {},
  veripassId = '',
}) => {
  // Hooks
  const authProvider = useAuth();
  const searchParams = new URLSearchParams(window?.location?.search);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [internalVeripassIdentity, setInternalVeripassIdentity] = useState(null);
  const hasExternal = veripassIdentity && Object.keys(veripassIdentity).length > 0;

  // Fixed Variables

  // Entity states
  const showError = ({ title, message }) => {
    Swal.fire({
      title: title || 'Failed to sign-in',
      text: message || '',
      icon: 'error',
    }).then(() => {
      searchParams.delete('error');
      window.location.replace(`${window?.location?.pathname}?${searchParams.toString()}`);
    });
  };

  const setErrors = () => {
    const error = searchParams.get('error');

    switch (error) {
      case 'insufficient_permissions':
        showError({ title: 'Insufficient permissions', message: 'You do not have sufficient permissions to enter.' });
        break;
      case 'access_denied':
        showError({ title: 'Access denied', message: 'Your account does not have access to this application.' });
        break;
      default:
        break;
    }
  };

  const itemOnAction = (action, entity) => {
    //setEntitySelected(entity);

    switch (action) {
      case 'edit':
        setIsEditMode(true);
        break;
      default:
        break;
    }
  };

  const onUpdatedEntity = (action, response) => {
    switch (action) {
      case 'edit':
        itemOnCreated(response);
        openSnackbar('Usuario creado satisfactoriamente.', 'success');
        break;
    }
  };

  const initializeComponent = async () => {
    setErrors();
  };

  const getOrganization = async () => {
    const entityResponse = await fetchEntityCollection({
      service: OrganizationManagementService,
      payload: {
        queryselector: 'id',
        query: {
          search: veripassId,
        },
      },
      apiKey,
      settings: { environment },
    });

    setIsLoading(false);

    if (!entityResponse?.success) {
      return;
    }

    setInternalVeripassIdentity(entityResponse?.result?.items?.[0] || {});
  };

  useEffect(() => {
    if (
      veripassIdentity &&
      Object.keys(veripassIdentity).length > 0 &&
      veripassIdentity?.identity !== internalVeripassIdentity?.identity
    ) {
      setInternalVeripassIdentity(veripassIdentity);
    }
  }, [veripassIdentity]);

  useEffect(() => {
    if (!hasExternal && veripassId) {
      setIsLoading(true);
      getOrganization();
    }
  }, [veripassId]);

  useEffect(() => {
    initializeComponent();
  }, []);

  return (
    <>
      {!isEditMode && (
        <VeripassOrganizationProfilePreview
          ui={ui}
          redirectUrl={redirectUrl}
          environment={environment}
          apiKey={apiKey}
          isPopupContext={isPopupContext}
          veripassIdentity={internalVeripassIdentity}
          itemOnAction={itemOnAction}
          onUpdatedEntity={onUpdatedEntity}
        />
      )}

      {isEditMode && (
        <VeripassOrganizationProfileEdit
          ui={ui}
          redirectUrl={redirectUrl}
          environment={environment}
          apiKey={apiKey}
          isPopupContext={isPopupContext}
          veripassIdentity={internalVeripassIdentity}
          itemOnAction={itemOnAction}
          onUpdatedEntity={onUpdatedEntity}
        />
      )}
    </>
  );
};
