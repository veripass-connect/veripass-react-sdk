import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { TextField, FormHelperText } from '@mui/material';
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

const initialState = {
  nationality: '',
  birthdate: '',
  address: {
    address_line_1: '',
    address_line_2: '',
    city: '',
    region: '',
    postal_code: '',
    country: '',
    country_code: '',
  },
};

export const VeripassQuickUserKyc = ({
  ui,
  entity,
  onUpdatedEntity,
  setIsOpen,
  isPopupContext,
  extraFields,
  debug = false,
  apiKey = '',
}) => {
  // Models
  const [userData, setUserData] = useState(initialState);

  // UI States
  const [isMinor, setIsMinor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHeader, setShowHeader] = useState(true);

  // Update form data with the provided entity on load
  useEffect(() => {
    if (entity) {
      setUserData({
        ...initialState,
        nationality: entity?.nationality ?? '',
        birthdate: entity?.birthdate ?? '',
        address: {
          ...entity?.address,
        },
      });
    }
  }, [entity]);

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
      [field]: value,
    }));
  };

  const handleAddressChange = (field, value) => {
    setUserData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    onUpdatedEntity('update', userData);
    setIsLoading(false);
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (ui?.showHeader !== undefined || ui?.showHeader !== null) {
      setShowHeader(ui?.showHeader);
    }
  }, [ui]);

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
            <form onSubmit={handleSubmit}>
              <article className="row">
                {/* Nationality */}
                <section className="mb-3 col-12 col-md-6">
                  <CountrySelector
                    label="Nationality"
                    value={userData.nationality}
                    onChange={(event) => handleAddressChange('nationality', event)}
                  />
                </section>
                {/* Birthdate */}
                <section className="mb-3 col-12 col-md-6">
                  <TextField
                    label="Date of Birth"
                    className="mt-0"
                    type="date"
                    value={userData.birthdate}
                    onChange={(event) => handleDataChange('birthdate', event.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <FormHelperText>{isMinor ? 'User is a minor' : 'User is an adult'}</FormHelperText>
                </section>
              </article>
              <article className="row">
                {/* Address field principal */}
                <section className="mb-3 col-12 col-md-6">
                  <TextField
                    className="mt-0"
                    label="Street Address"
                    value={userData.address.street}
                    onChange={(event) => handleAddressChange('address_line_1', event.target.value)}
                    fullWidth
                    required
                    margin="normal"
                  />
                </section>
                {/* Address field 2 */}
                <section className="mb-3 col-12 col-md-6">
                  <TextField
                    className="mt-0"
                    label="Street Address 2"
                    value={userData.address.street}
                    onChange={(event) => handleAddressChange('address_line_2', event.target.value)}
                    fullWidth
                    required
                    margin="normal"
                  />
                </section>
              </article>
              <article className="row">
                {/* City */}
                <section className="mb-3 col-12 col-md-6">
                  <TextField
                    className="mt-0"
                    label="City"
                    value={userData.address.city}
                    onChange={(event) => handleAddressChange('city', event.target.value)}
                    fullWidth
                    required
                    margin="normal"
                  />
                </section>
                {/* State/Province */}
                <section className="mb-3 col-12 col-md-6">
                  <TextField
                    className="mt-0"
                    label="State/Province"
                    value={userData.address.state}
                    onChange={(event) => handleAddressChange('region', event.target.value)}
                    fullWidth
                    required
                    margin="normal"
                  />
                </section>
              </article>
              <article className="row">
                {/* Postal Code */}
                <section className="mb-3 col-12 col-md-6">
                  <TextField
                    className="mt-0"
                    label="Postal Code"
                    value={userData.address.postal_code}
                    onChange={(event) => handleAddressChange('postal_code', event.target.value)}
                    fullWidth
                    required
                    margin="normal"
                  />
                </section>
                {/* Country of Residence */}
                <section className="mb-3 col-12 col-md-6">
                  <CountrySelector
                    label="Country of Residence"
                    value={userData.address.country}
                    onChange={(event) => handleAddressChange('country', event)}
                  />
                </section>
              </article>

              {/* Submit button */}
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-success" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Next'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </Container>
  );
};
