import { useState } from 'react';

import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';
import { AsyncAutocomplete } from '@link-loom/react-sdk';
import { SecurityAccessProfileService, UserManagementService } from '@services';
import { Button } from '@mui/material';

async function emitEvent({ action, payload, error, eventHandler }) {
  if (eventHandler) {
    eventHandler({ action, namespace: 'veripass', payload, error });
  }
}

async function assignAccessProfile({ identity, accessProfileSlug, apiKey, environment = 'production' }) {
  const service = new UserManagementService({ apiKey, settings: { environment } });

  const response = await service.assign({
    identity: identity,
    access_profile_slug: accessProfileSlug,
  });

  return response;
}

export const VeripassAssignAccessProfile = ({
  ui,
  entity = {},
  onEvent,
  setIsOpen,
  environment = 'production',
  apiKey = '',
  isPopupContext = false,
}) => {
  const [selectedAccessProfile, setSelectedAccessProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!selectedAccessProfile?.slug || !entity?.identity) {
        return;
      }

      setIsLoading(true);

      const response = await assignAccessProfile({
        identity: entity.identity,
        accessProfileSlug: selectedAccessProfile.slug,
        apiKey,
        environment,
      });

      setIsLoading(false);

      emitEvent({ action: 'veripass-assign-access-profile::assigned', payload: response, eventHandler: onEvent });

      if (setIsOpen) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);

      setIsLoading(false);

      emitEvent({ action: 'veripass-assign-access-profile::error', error, eventHandler: onEvent });

      if (setIsOpen) {
        setIsOpen(false);
      }
    }
  };

  return (
    <VeripassLayout isPopupContext={isPopupContext}>
      <section className="mb-0">
        {ui?.showHeader && (
          <header className="row">
            <article className="col-12">
              <h4 className="header-title">{ui?.title || 'Assign Access Profile'}</h4>
              <p className="sub-header">
                {ui?.subtitle || 'Select an access profile to link the user to specific projects, apps, and roles.'}
              </p>
            </article>
          </header>
        )}

        <section>
          <AsyncAutocomplete
            label="Access Profile"
            placeholder="Select an access profile"
            value={selectedAccessProfile}
            onChange={(selected) => setSelectedAccessProfile(selected)}
            fetchOptions={async (query) => {
              const service = new SecurityAccessProfileService({ apiKey, settings: { environment } });
              const response = await service.getByParameters({
                queryselector: 'all',
                search: query,
              });
              return response?.result?.items || [];
            }}
            isOptionEqualToValue={(option, value) => option?.slug === value?.slug}
            getOptionLabel={(option) => option?.name || option?.slug || ''}
            openOnEmptyQuery={true}
          />

          <footer className="row">
            <section className="mb-0 h-25 d-flex justify-content-end align-items-end">
              <Button
                type="button"
                variant="contained"
                className="my-2"
                onClick={handleSubmit}
                disabled={!selectedAccessProfile?.slug || !entity?.identity}
              >
                {isLoading
                  ? ui?.labels?.buttons?.assignProfile?.loading || 'Assigning...'
                  : ui?.labels?.buttons?.assignProfile?.default || 'Assign Profile'}
              </Button>
            </section>
          </footer>
        </section>
      </section>
    </VeripassLayout>
  );
};
