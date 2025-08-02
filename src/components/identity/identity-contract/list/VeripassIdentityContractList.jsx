import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { fetchEntityCollection } from '@services/utils/entityServiceAdapter';
import { useUrlErrorHandler } from '@hooks/useUrlErrorHandler';
import { useAuth } from '@hooks/useAuth.hook';

import '@styles/fonts.css';
import '@styles/styles.css';

const swal = withReactContent(Swal);

import { OrganizationManagementService } from '@services';

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
  veripassIdentity = {},
  veripassId = '',
  readOnly = false,
}) => {
  // Hooks
  const { showErrorFromUrl } = useUrlErrorHandler();
  const authProvider = useAuth();
  const searchParams = new URLSearchParams(window?.location?.search);

  // Models

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Configs

  // Component functions
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

    //setInternalVeripassIdentity(entityResponse?.result?.items?.[0] || {});
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
    initializeComponent();
  }, []);

  return <></>;
};
