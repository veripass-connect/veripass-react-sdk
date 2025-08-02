import React, { useState, useEffect } from 'react';

import { fetchEntityCollection } from '@services/utils/entityServiceAdapter';

import { useUrlErrorHandler } from '@hooks/useUrlErrorHandler';
import { useAuth } from '@hooks/useAuth.hook';

import { VeripassOrganizationProfilePreview, VeripassOrganizationProfileEdit } from '@';

import '@styles/fonts.css';
import '@styles/styles.css';

import { OrganizationManagementService } from '@services';

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
    const { showErrorFromUrl } = useUrlErrorHandler();
  const authProvider = useAuth();
  const searchParams = new URLSearchParams(window?.location?.search);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [internalVeripassIdentity, setInternalVeripassIdentity] = useState(null);
  const hasExternal = veripassIdentity && Object.keys(veripassIdentity).length > 0;

  // Fixed Variables

  // Entity states

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
    showErrorFromUrl();
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
