import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { UserInformationService } from '@services';
import { TextField, FormHelperText, Button } from '@mui/material';
import { CountrySelector } from '@link-loom/react-sdk';
import dayjs from 'dayjs';

const Container = styled.article`
  width: ${(props) => (props.$isPopup ? '800px' : '100%')};
  ${(props) => (props.$isPopup ? '' : 'flex-grow: 1;')};

  @media (max-width: 1199px) {
    width: ${(props) => (props.$isPopup ? '700px' : '100%')};
  }

  @media (max-width: 991px) {
    width: ${(props) => (props.$isPopup ? '600px' : '100%')};
  }

  @media (max-width: 767px) {
    width: ${(props) => (props.$isPopup ? '500px' : '100%')};
  }

  @media (max-width: 575px) {
    width: ${(props) => (props.$isPopup ? '100%' : '100%')};
    min-width: ${(props) => (props.$isPopup ? '95vw' : '100%')};
  }
`;

async function updateEntity({ payload, Service, apiKey, debug = false }) {
  const entityService = new Service({ apiKey, settings: { debug } });
  const entityResponse = await entityService.update(payload);

  if (!entityResponse || !entityResponse.result) {
    console.error(entityResponse);
    return null;
  }

  return entityResponse;
}

const initialState = {
  principal_nationality: '',
  birthdate: '',
  residence: {
    address_line_1: '',
    address_line_2: '',
    city: '',
    region: '',
    postal_code: '',
    country: '',
    country_code: '',
  },
};

export const VeripassQuickUserKyc = ({ ui, entity, onUpdatedEntity, setIsOpen, isPopupContext, debug = false, apiKey = '' }) => {
  // Models
  const [userData, setUserData] = useState(entity || { user_information: initialState });

  // UI States
  const [isMinor, setIsMinor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHeader, setShowHeader] = useState(true);


  // Validate if the user is a minor based on birthdate
  useEffect(() => {
    if (userData.birthdate) {
      const age = dayjs().diff(userData.birthdate, 'year');
      setIsMinor(age < 18);
    }
  }, [userData.birthdate]);

  const handleDataChange = (field, value) => {
    setUserData((prevData) => ({
      ...prevData,
      user_information: {
        ...prevData.user_information,
        [field]: value,
      },
    }));
  };
  
  const handleAddressChange = (field, value) => {
    setUserData((prevData) => ({
      ...prevData,
      user_information: {
        ...prevData.user_information,
        residence: {
          ...(prevData.user_information?.residence || {}),
          [field]: value,
        },
      },
    }));
  };
 
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setIsLoading(true);

      var updatedEntity = userData?.user_information || {};
      updatedEntity.id = userData.id;

      const entityResponse = await updateEntity({ payload: updatedEntity, Service: UserInformationService, debug, apiKey });

      setIsLoading(false);

      if (!entityResponse || !entityResponse.success) {
        onUpdatedEntity('update', null);
        return null;
      }

      // Update parent states
      onUpdatedEntity('update', entityResponse);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      onUpdatedEntity('error', null);
    }
  };

  useEffect(() => {
    if (ui?.showHeader !== undefined || ui?.showHeader !== null) {
      setShowHeader(ui?.showHeader);
    }
  }, [ui]);

  // Update form data with the provided entity on load
  useEffect(() => {
    if (entity) {
      if (!entity.user_information) {
        entity.user_information = initialState;
      }

      setUserData(entity);
    }
  }, [entity]);

  return (
    <Container $isPopup={isPopupContext} className={!isPopupContext ? 'col-12' : ''}>
      <div className="card mb-0">
        <div className="card-body py-4">
          {showHeader && (
            <header className="row">
              <article className="col-12">
                <h4 className="header-title">{ui?.title || 'User quick KYC'}</h4>
                <p className="sub-header">
                  {ui?.subtitle ||
                    "Quickly provide the user's nationality, date of birth, and residential address to complete the KYC process."}
                </p>
              </article>
            </header>
          )}

          <section>
            <form onSubmit={(event) => event.preventDefault()}>
              <article className="row">
                {/* Nationality */}
                <section className="mb-2 col-12 col-md-6">
                  <CountrySelector
                    label="Nationality"
                    value={userData?.user_information?.principal_nationality}
                    onChange={(event) => handleDataChange('principal_nationality', event)}
                  />
                  <FormHelperText>Country associated with the user's nationality.</FormHelperText>
                </section>
                {/* Birthdate */}
                <section className="mb-2 col-12 col-md-6">
                  <TextField
                    label="Date of Birth"
                    className="mt-0"
                    type="date"
                    value={userData?.user_information?.birthdate}
                    onChange={(event) => handleDataChange('birthdate', event.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <FormHelperText>Date used to verify the user's age.</FormHelperText>
                </section>
              </article>
              <article className="row">
                {/* Address field principal */}
                <section className="mb-2 col-12 col-md-6">
                  <TextField
                    className="mt-0"
                    label="Residence Address"
                    value={userData?.user_information?.residence?.address_line_1}
                    onChange={(event) => handleAddressChange('address_line_1', event.target.value)}
                    fullWidth
                    required
                    margin="normal"
                    autoComplete="off"
                  />
                  <FormHelperText>Primary address where the user lives.</FormHelperText>
                </section>
                {/* Address field 2 */}
                <section className="mb-2 col-12 col-md-6">
                  <TextField
                    className="mt-0"
                    label="Residence Address 2"
                    value={userData?.user_information?.residence?.address_line_2}
                    onChange={(event) => handleAddressChange('address_line_2', event.target.value)}
                    fullWidth
                    required
                    margin="normal"
                    autoComplete="off"
                  />
                  <FormHelperText>Additional address details (e.g., apartment or suite).</FormHelperText>
                </section>
              </article>
              <article className="row">
                {/* City */}
                <section className="mb-2 col-12 col-md-6">
                  <TextField
                    className="mt-0"
                    label="Residence city"
                    value={userData?.user_information?.residence?.city}
                    onChange={(event) => handleAddressChange('city', event.target.value)}
                    fullWidth
                    required
                    margin="normal"
                    autoComplete="off"
                  />
                  <FormHelperText>City where the user currently resides.</FormHelperText>
                </section>
                {/* State/Province */}
                <section className="mb-2 col-12 col-md-6">
                  <TextField
                    className="mt-0"
                    label="Residence State/Province"
                    value={userData?.user_information?.residence?.state}
                    onChange={(event) => handleAddressChange('region', event.target.value)}
                    fullWidth
                    required
                    margin="normal"
                    autoComplete="off"
                  />
                  <FormHelperText>State or province of the user's residence.</FormHelperText>
                </section>
              </article>
              <article className="row">
                {/* Postal Code */}
                <section className="mb-2 col-12 col-md-6">
                  <TextField
                    className="mt-0"
                    label="Residence postal code"
                    value={userData?.user_information?.residence?.postal_code}
                    onChange={(event) => handleAddressChange('postal_code', event.target.value)}
                    fullWidth
                    required
                    margin="normal"
                    autoComplete="off"
                  />
                  <FormHelperText>Postal code for the residence address.</FormHelperText>
                </section>
                {/* Country of Residence */}
                <section className="mb-2 col-12 col-md-6">
                  <CountrySelector
                    label="Country of Residence"
                    value={userData?.user_information?.residence?.country}
                    onChange={(event) => handleAddressChange('country', event)}
                  />
                  <FormHelperText>Country where the user resides.</FormHelperText>
                </section>
              </article>

              {/* Submit button */}
              <footer className="d-flex justify-content-end">
                {isLoading && (
                  <button type="button" disabled className="btn btn-primary">
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </button>
                )}

                {!isLoading && (
                  <Button
                    type="button"
                    variant="contained"
                    className="my-2"
                    onClick={handleSubmit}
                    disabled={!entity}
                    sx={{
                      backgroundColor: !entity ? '#a0a0a0' : '#323a46',
                      borderColor: !entity ? '#a0a0a0' : '#323a46',
                      '&:hover': {
                        backgroundColor: !entity ? '#a0a0a0' : '#404651',
                        borderColor: !entity ? '#a0a0a0' : '#404651',
                      },
                    }}
                  >
                    Next
                  </Button>
                )}
              </footer>
            </form>
          </section>
        </div>
      </div>
    </Container>
  );
};
