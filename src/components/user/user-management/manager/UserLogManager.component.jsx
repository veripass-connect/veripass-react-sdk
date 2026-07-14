import React, { useState, useEffect } from 'react';
import { fetchMultipleEntities } from '@services/utils/entityServiceAdapter';

import { Spinner } from '@link-loom/react-sdk';

import UserLogsPreview from '../preview/UserLogsPreview.component';
import { EventLoggerService } from '@services';

const UserLogManager = (props) => {
  const { loadingState, entityId, apiKey, environment } = props;
  const [entities, setEntities] = useState([]);

  const initializeComponent = async () => {
    const [entityListResponse, entityStatusesResponse] = await fetchMultipleEntities([
      {
        service: EventLoggerService,
        payload: { queryselector: 'all', search: '', page: 1, pageSize: 10 },
        apiKey,
        settings: { environment },
      },
      {
        service: EventLoggerService,
        payload: { queryselector: 'status' },
        apiKey,
        settings: { environment },
      },
    ]);

    if (entityListResponse?.success && entityListResponse?.result?.items?.length) {
      const rawEntities = entityListResponse.result?.items || [];

      setEntities(rawEntities);
    }

    loadingState.setIsLoading(false);
  };

  useEffect(() => {
    if (entityId) {
      initializeComponent();
    }
  }, [entityId]);

  return (
    <section className="container-fluid">
      {loadingState.isLoading ? (
        <Spinner />
      ) : (
        <>
          <header className="d-flex flex-row justify-content-end"></header>

          <section className="content">
            <UserLogsPreview entities={entities} />
          </section>
        </>
      )}
    </section>
  );
};

export default UserLogManager;
