import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchEntityCollection, updateEntityRecord } from '@services/utils/entityServiceAdapter';
import { Container } from '@link-loom/react-sdk';

import { TextField, FormHelperText, CircularProgress } from '@mui/material';
import { NationalIdentificationSelector, PhoneCountrySelector, useDebounce } from '@link-loom/react-sdk';
import { UserProfileService } from '@services';

async function getUserByNationalId({ nationalId, apiKey, environment }) {
  try {
    const userResponsePromiseResponse = fetchEntityCollection({
      payload: {
        queryselector: 'primary-national-id',
        search: nationalId ?? '',
      },
      service: UserProfileService,
      apiKey,
      settings: { environment },
    });

    const [userResponse] = await Promise.all([userResponsePromiseResponse]);

    return { userResponse };
  } catch (error) {
    console.error(error);
  }
}

const initialState = {
  username: '',
  display_name: '',
  primary_national_id: '',
  primary_email_address: '',
  primary_phone_number: {},
  first_name: '',
  last_name: '',
  profile_ui_settings: {},
};

function UserManagementEdit(props) {
  const {
    entity = null,
    onUpdatedEntity = () => {},
    isPopupContext = false,
    apiKey = '',
    environment = 'production',
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [internalEntity, setInternalEntity] = useState(entity ?? initialState);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const debouncedNationalId = useDebounce(internalEntity?.primary_national_id, 500);
  const [userNationalIdValidationInProgress, setUserNationalIdValidationInProgress] = useState(false);

  useEffect(() => {
    const fetchDebounceUserByNationalId = async () => {
      if (debouncedNationalId && entity?.primary_national_id !== internalEntity.primary_national_id) {
        setUserNationalIdValidationInProgress(true);

        const { userResponse } = await getUserByNationalId({
          nationalId: entity?.primary_national_id,
          apiKey,
          environment,
        });

        if (!userResponse || !userResponse.success) {
        }

        if (userResponse.result?.items.length === 0) {
          setIsExistingUser(false);
          setInternalEntity({
            ...initialState,
            primary_national_id: entity?.primary_national_id,
          });
        } else {
          setIsExistingUser(true);
          setInternalEntity(
            userResponse.result?.items[0] ?? {
              ...initialState,
              primary_national_id: entity?.primary_national_id,
            },
          );
        }
      }

      setUserNationalIdValidationInProgress(false);
    };

    fetchDebounceUserByNationalId();
  }, [debouncedNationalId]);

  const handleDataChange = (fieldName, data) => {
    setInternalEntity((prevUserData) => ({
      ...prevUserData,
      [fieldName]: data,
    }));
  };

  const handleNameFocus = () => {
    if (!entity?.display_name && (entity?.first_name || entity?.last_name)) {
      setInternalEntity((prevUserData) => ({
        ...prevUserData,
        display_name: `${entity?.first_name} ${entity?.last_name}`.trim(),
      }));
    }
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setIsLoading(true);

      // Setup random ui settings
      var updatedEntity = internalEntity;

      const entityResponse = await updateEntityRecord({
        service: UserProfileService,
        payload: updatedEntity,
        apiKey,
        settings: { environment },
      });

      if (!entityResponse || !entityResponse.success) {
        onUpdatedEntity('update', null);
        return null;
      }

      // Update parent states
      setIsLoading(false);
      onUpdatedEntity('update', entityResponse);
    } catch (error) {
      setIsLoading(false);
      onUpdatedEntity('update', null);
    }
  };

  useEffect(() => {
    if (entity) {
      setInternalEntity(entity);
    }
  }, [entity]);

  return (
    <section>
      <Container $isPopup={isPopupContext} className={!isPopupContext ? 'col-12 my-2' : ''}>
        <form onSubmit={handleSubmit}>
          <article className="row">
            <section className="mb-3 col-12 col-md-6">
              <TextField
                className="w-100"
                id="fullname-input"
                label="Username"
                value={internalEntity?.username}
                placeholder="jhon.doe"
                helperText="Enter a name that will be displayed on the user's profile."
                required
                onFocus={handleNameFocus}
                onChange={(event) => {
                  handleDataChange('username', event.target.value);
                }}
                autoComplete="off"
              />
            </section>
            <section className="mb-3 col-12 col-md-6">
              <TextField
                className="w-100"
                id="fullname-input"
                label="Display name"
                value={internalEntity?.display_name}
                placeholder="Jhon Doe"
                helperText="Enter a name that will be displayed on the user's profile."
                required
                onFocus={handleNameFocus}
                onChange={(event) => {
                  handleDataChange('display_name', event.target.value);
                }}
                autoComplete="off"
              />
            </section>
          </article>

          <article className="row">
            <section className="mb-3">
              <NationalIdentificationSelector
                label="National identification number"
                defaultDocumentType="Passport"
                onChange={(event) => {
                  handleDataChange('primary_national_id', event);
                }}
              />
              <FormHelperText>Please write the primary legal national id.</FormHelperText>
              {userNationalIdValidationInProgress && (
                <FormHelperText className="d-flex text-primary">
                  <CircularProgress size={20} className="me-2" /> Validating user existence...
                </FormHelperText>
              )}
              {isExistingUser && (
                <FormHelperText className="d-flex text-danger">
                  National identification number already exists, please review.
                </FormHelperText>
              )}
            </section>
          </article>

          <article className="row">
            <section className="mb-3 col-12 col-md-6">
              <TextField
                className="w-100"
                type="text"
                id="first-name-input"
                label="First name"
                value={internalEntity?.first_name}
                placeholder="Jhon"
                helperText="This is the legal first name"
                required
                onChange={(event) => {
                  handleDataChange('first_name', event.target.value);
                }}
                autoComplete="off"
              />
            </section>
            <section className="mb-3 col-12 col-md-6">
              <TextField
                className="w-100"
                type="text"
                id="last-name-input"
                label="Last name"
                value={internalEntity?.last_name}
                placeholder="Doe"
                helperText="This is the legal last name"
                required
                onChange={(event) => {
                  handleDataChange('last_name', event.target.value);
                }}
                autoComplete="off"
              />
            </section>
          </article>

          <article className="row">
            <section className="mb-3 col-12 col-md-6">
              <TextField
                className="w-100"
                type="email"
                id="email-input"
                label="Primary email address"
                value={internalEntity?.primary_email_address}
                placeholder="jhondoe@domain.com"
                helperText="This is the email most used by user"
                required
                onChange={(event) => {
                  handleDataChange('primary_email_address', event.target.value);
                }}
                autoComplete="veripass-email"
              />
            </section>

            <section className="mb-3 col-12 col-md-6">
              <PhoneCountrySelector
                label="Phone number"
                value={internalEntity?.primary_phone_number}
                onPhoneChange={(event) => {
                  handleDataChange('primary_phone_number', event);
                }}
              />
              <FormHelperText>Principal phone number and or used with WhatsApp</FormHelperText>
            </section>
          </article>

          <article className="row">
            <section className="mb-0 h-25 d-flex justify-content-end align-items-end">
              {isLoading ? (
                <button type="button" disabled className="btn btn-dark">
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Saving changes
                </button>
              ) : (
                <button type="submit" className="btn btn-dark waves-effect waves-light">
                  Save changes
                </button>
              )}
            </section>
          </article>
        </form>
      </Container>
    </section>
  );
}

export default UserManagementEdit;
