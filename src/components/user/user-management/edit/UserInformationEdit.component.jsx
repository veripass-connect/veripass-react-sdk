import React, { useState, useEffect } from 'react';
import { TextField, Button, Divider, Grid, Typography } from '@mui/material';
import { UserManagementService } from '@services';
import styled from 'styled-components';

// Helper for Layout
const Container = styled.div`
  width: 100%;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const UserInformationEdit = ({ entity, entityId, fullEntity, onUpdatedEntity, apiKey = '', environment = 'production' }) => {
  const [infoData, setInfoData] = useState({
    age: '',
    gender: '',
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
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (entity) {
      setInfoData({
        age: entity.age || '',
        gender: entity.gender || '',
        birthdate: entity.birthdate || '',
        residence: {
          address_line_1: entity.residence?.address_line_1 || '',
          address_line_2: entity.residence?.address_line_2 || '',
          city: entity.residence?.city || '',
          region: entity.residence?.region || '',
          postal_code: entity.residence?.postal_code || '',
          country: entity.residence?.country || '',
          country_code: entity.residence?.country_code || '',
        },
      });
    }
  }, [entity]);

  const handleChange = (key, value) => {
    setInfoData({ ...infoData, [key]: value });
  };

  const handleResidenceChange = (key, value) => {
    setInfoData({
      ...infoData,
      residence: {
        ...infoData.residence,
        [key]: value,
      },
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const service = new UserManagementService({ apiKey, settings: { environment } });
      const payload = {
        ...fullEntity,
        id: entityId,
        information: infoData,
      };

      const response = await service.update(payload);

      if (response && response.result) {
        if (onUpdatedEntity) {
          onUpdatedEntity('update', infoData);
        }
      }
    } catch (error) {
      console.error('Error updating information:', error);
      if (onUpdatedEntity) {
        onUpdatedEntity('error', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Section>
          <Typography variant="h6" gutterBottom>
            Personal Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Age"
                value={infoData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Gender"
                value={infoData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Birthdate"
                value={infoData.birthdate}
                onChange={(e) => handleChange('birthdate', e.target.value)}
                size="small"
                placeholder="YYYY-MM-DD"
              />
            </Grid>
          </Grid>
        </Section>

        <Divider sx={{ my: 2 }} />

        <Section>
          <Typography variant="h6" gutterBottom>
            Residence
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 1"
                value={infoData.residence.address_line_1}
                onChange={(e) => handleResidenceChange('address_line_1', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2"
                value={infoData.residence.address_line_2}
                onChange={(e) => handleResidenceChange('address_line_2', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={infoData.residence.city}
                onChange={(e) => handleResidenceChange('city', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Region"
                value={infoData.residence.region}
                onChange={(e) => handleResidenceChange('region', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Postal Code"
                value={infoData.residence.postal_code}
                onChange={(e) => handleResidenceChange('postal_code', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Country"
                value={infoData.residence.country}
                onChange={(e) => handleResidenceChange('country', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Country Code"
                value={infoData.residence.country_code}
                onChange={(e) => handleResidenceChange('country_code', e.target.value)}
                size="small"
              />
            </Grid>
          </Grid>
        </Section>

        <section className="row mt-4">
          <div className="col-12 d-flex justify-content-end">
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              sx={{
                backgroundColor: '#323a46',
                '&:hover': { backgroundColor: '#404651' },
              }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </section>
      </form>
    </Container>
  );
};

export default UserInformationEdit;
