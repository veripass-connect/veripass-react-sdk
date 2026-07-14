import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// import { VeripassLayout } from '@components/shared/layouts/VeripassLayout'; // Not available in webapp
import { TextField, FormHelperText, CircularProgress, Button } from '@mui/material';
import { NationalIdentificationSelector, PhoneCountrySelector } from '@link-loom/react-sdk';
import { UserManagementService } from '@services';

// Replicating Layout Container logic
const Container = styled.article`
  margin: 0 auto;
  min-width: 450px;
  width: ${(props) => (props.$ispopup ? '800px' : '100%')};
  ${(props) => (props.$ispopup ? '' : 'flex-grow: 1;')};

  @media (max-width: 1199px) {
    width: ${(props) => (props.$ispopup ? '700px' : '100%')};
  }

  @media (max-width: 991px) {
    width: ${(props) => (props.$ispopup ? '600px' : '100%')};
  }

  @media (max-width: 767px) {
    width: ${(props) => (props.$ispopup ? '500px' : '100%')};
  }

  @media (max-width: 575px) {
    width: 100%;
  }
`;

const VeripassLayoutReplica = ({ children, isPopupContext = false, ...props }) => {
  return (
    <Container $ispopup={isPopupContext} className="veripass" style={{ boxSizing: 'border-box' }} {...props}>
      <main>{children}</main>
    </Container>
  );
};

async function emitEvent({ action, payload, error, eventHandler }) {
  if (eventHandler) {
    eventHandler(action, payload || error);
  }
}

async function updateEntity({ Service, payload, apiKey, environment = 'production' }) {
  const entityService = new Service({ apiKey, settings: { environment } });
  // Ensure we send just the profile data or whatever update endpoint expects
  // The Create component sends { profile: ..., security: ... }
  // Update likely expects { id: ..., profile: ... } or just the fields.
  // Based on UserList updateEntity:
  // if (payload._id) delete payload._id;
  // entityService.update(payload);

  // We need to make sure we pass the ID.
  const entityResponse = await entityService.update(payload);

  if (!entityResponse || !entityResponse.result) {
    console.error(entityResponse);
    return null;
  }

  return entityResponse;
}

const initialState = {
  primary_national_id: {
    type: '',
    identification: '',
    issuing_country: {
      iso_code: '',
      country_name: '',
    },
  },
  primary_email_address: '',
  display_name: '',
  primary_phone_number: {
    country: {
      iso_code: '',
      dial_code: '',
      name: '',
    },
    international_phone_number: '',
    phone_number: '',
  },
  first_name: '',
  last_name: '',
  // Password removed for edit
};

export const VeripassUserQuickStandardEdit = ({
  ui = { showHeader: false },
  entity, // The user to edit
  onUpdatedEntity, // Callback for updates
  setIsOpen,
  isPopupContext = false,
  environment = 'production',
  apiKey = '',
  showFullDetailsLink = true,
}) => {
  // Models
  const navigate = useNavigate();
  const [userProfileData, setUserProfileData] = useState(initialState);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    if (entity) {
      // Map entity fields to userProfileData
      const data = entity.profile || entity;
      setUserProfileData((prev) => ({
        ...prev,
        ...data,
        // Ensure nested objects are handled if needed, but spread should work if structure matches
        primary_national_id: data.primary_national_id || prev.primary_national_id,
        primary_phone_number: data.primary_phone_number || prev.primary_phone_number,
      }));
    }
  }, [entity]);

  const handleDataChange = (fieldName, data) => {
    setUserProfileData((prevUserData) => ({
      ...prevUserData,
      [fieldName]: data,
    }));
  };

  const handleNameFocus = () => {
    if (!userProfileData.display_name && (userProfileData.first_name || userProfileData.last_name)) {
      setUserProfileData((prevUserData) => ({
        ...prevUserData,
        display_name: `${userProfileData.first_name} ${userProfileData.last_name}`.trim(),
      }));
    }
  };

  const handleSubmit = async (event) => {
    try {
      if (event) {
        event.preventDefault();
      }
      setIsLoading(true);

      // Prepare payload
      // Typically update requires ID and the fields to update.
      // entity.id is from the prop.
      // userProfileData has the profile fields.

      // Structure depends on backend. Based on Create, it sends { profile: ... }
      // The UserList `updateEntity` takes `payload` and calls `entityService.update(payload)`.
      // It implies payload should include ID.

      const payload = {
        id: entity.id,
        profile: {
          ...userProfileData,
        },
      };

      // If the backend expects wrapped 'profile' object for partial updates, we might need to adjust.
      // But UserList formatEntities flattens profile into the row.
      // If we assume UserManagementService.update expects the flat object with ID:

      const response = await updateEntity({ payload, Service: UserManagementService, environment, apiKey });

      // Update parent states
      setIsLoading(false);

      // emitEvent({ action: 'veripass-user-quick-standard::updated', payload: response, eventHandler: onEvent });
      // Using onUpdatedEntity compatible with UserList
      if (onUpdatedEntity) {
        // UserList uses itemOnUpdate(response, message)
        // Check UserList: itemOnUpdate takes (response, message)
        // AND UserList also passes `onUpdatedEntity` which calls `itemOnAction`...
        // Wait, UserList passes `onUpdatedEntity={onUpdatedEntity}` to Create/Preview.
        // And `onUpdatedEntity` in UserList defines cases: 'create', 'inactive', 'delete'.
        // It does NOT have 'edit' case or 'update' case in `onUpdatedEntity` switch.
        // It DOES have `itemOnUpdate` function.
        // But `VeripassUserQuickStandardCreate` calls `emitEvent` with `veripass-user-quick-standard::created`.
        // UserList listens to that in `onUpdatedEntity`.

        // I should emit `veripass-user-quick-standard::updated`.
        // I need to add that case to UserList as well.
        // OR reuse an existing case?
        // UserList connects `veripass-organization-quick-standard::created` (wait, organization? Copypasta in UserList?)

        // I will follow the pattern: call emitEvent.
        emitEvent({
          action: 'veripass-user-quick-standard::updated',
          payload: response,
          eventHandler: onUpdatedEntity,
        });
      }

      if (setIsOpen) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);

      setIsLoading(false);
      // emitEvent({ action: 'veripass-user-quick-standard::error', error, eventHandler: onEvent });
      if (onUpdatedEntity) {
        emitEvent({ action: 'error', error, eventHandler: onUpdatedEntity });
      }

      if (setIsOpen) {
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    if (ui?.showHeader !== undefined || ui?.showHeader !== null) {
      setShowHeader(ui?.showHeader);
    }
  }, [ui]);

  return (
    <VeripassLayoutReplica isPopupContext={isPopupContext}>
      <section className="mb-0">
        {showHeader && (
          <header className="row mb-4">
            <article className="col-12">
              <h4 className="header-title">{ui?.title || 'Edit User'}</h4>
              <p className="sub-header">{ui?.subtitle || 'Update information about the user.'}</p>
            </article>
          </header>
        )}

        <section>
          <form onSubmit={(event) => event.preventDefault()}>
            <article className="row">
              <section className="mb-2">
                <NationalIdentificationSelector
                  label="National identification number"
                  defaultDocumentType="Passport"
                  value={userProfileData?.primary_national_id} // Pass value
                  onChange={(event) => {
                    handleDataChange('primary_national_id', event);
                  }}
                  disabled={true} // Usually can't change ID
                />
                <FormHelperText>Primary legal national id (Read-only).</FormHelperText>
              </section>
            </article>

            <article className="row">
              <section className="mb-2 col-12 col-md-6">
                <TextField
                  className="w-100"
                  type="text"
                  id="first-name-input"
                  label="First name"
                  value={userProfileData.first_name || ''}
                  placeholder="Jhon"
                  helperText="This is the legal first name"
                  required
                  variant="outlined"
                  onChange={(event) => {
                    handleDataChange('first_name', event.target.value);
                  }}
                  autoComplete="off"
                />
              </section>
              <section className="mb-2 col-12 col-md-6">
                <TextField
                  className="w-100"
                  type="text"
                  id="last-name-input"
                  label="Last name"
                  value={userProfileData.last_name || ''}
                  placeholder="Doe"
                  helperText="This is the legal last name"
                  required
                  variant="outlined"
                  onChange={(event) => {
                    handleDataChange('last_name', event.target.value);
                  }}
                  autoComplete="off"
                />
              </section>
            </article>

            <article className="row">
              <section className="mb-2 col-12 col-md-6">
                <TextField
                  className="w-100"
                  id="fullname-input"
                  label="Display name"
                  value={userProfileData.display_name || ''}
                  placeholder="Jhon Doe"
                  helperText="Enter a name that will be displayed on the user's profile."
                  required
                  variant="outlined"
                  onFocus={handleNameFocus}
                  onChange={(event) => {
                    handleDataChange('display_name', event.target.value);
                  }}
                  autoComplete="off"
                />
              </section>

              <section className="mb-2 col-12 col-md-6">
                <PhoneCountrySelector
                  label="Phone number"
                  value={userProfileData?.primary_phone_number} // Pass value
                  onPhoneChange={(event) => {
                    handleDataChange('primary_phone_number', event);
                  }}
                  variant="outlined"
                />
                <FormHelperText>Principal phone number and or used with WhatsApp</FormHelperText>
              </section>
            </article>

            <article className="row">
              <section className="mb-2 col-12 col-md-6">
                <TextField
                  className="w-100"
                  type="email"
                  id="email-input"
                  label="Primary email address"
                  value={userProfileData.primary_email_address || ''}
                  placeholder="jhondoe@domain.com"
                  helperText="This is the email most used by user"
                  required
                  variant="outlined"
                  onChange={(event) => {
                    handleDataChange('primary_email_address', event.target.value);
                  }}
                  autoComplete="veripass-email"
                />
              </section>
              {/* Password field removed for Edit */}
            </article>

            <footer className="row">
              <section className="mb-0 h-25 d-flex justify-content-end align-items-end">
                <Button
                  type="button"
                  variant="contained"
                  className="my-2"
                  onClick={handleSubmit}
                  sx={{
                    backgroundColor: '#323a46',
                    borderColor: '#323a46',
                    '&:hover': {
                      backgroundColor: '#404651',
                      borderColor: '#404651',
                    },
                  }}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
                {showFullDetailsLink && (
                  <Button
                    type="button"
                    variant="outlined"
                    className="my-2 ms-2"
                    onClick={() => navigate(`/client/users/management/${entity.id}`)}
                    color="inherit"
                  >
                    Full Details
                  </Button>
                )}
              </section>
            </footer>
          </form>
        </section>
      </section>
    </VeripassLayoutReplica>
  );
};
