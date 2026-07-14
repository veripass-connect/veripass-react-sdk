import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';
import { UserManagementService } from '@services';
import styled from 'styled-components';

// Helper for Layout
const Container = styled.div`
  width: 100%;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const UserInformationSensitiveEdit = ({
  entity,
  entityId,
  fullEntity,
  onUpdatedEntity,
  apiKey = '',
  environment = 'production',
}) => {
  const [infoData, setInfoData] = useState({
    country_birth: '',
    marital_status: '',
    residence_housing_type: '',
    passport_number: '',
    visas: '',
    driver_license_number: '',
    biometric_data: '',
    criminal_records: '',
    political_affiliation: '',
    religion: '',
    sexual_orientation: '',
    medical_history: '',
    medical_issues: '',
    genetic_information: '',
    occupation: '',
    occupation_industry: '',
    education_level: '',
    employment_status: '',
    primary_language: '',
    secondary_languages: '',
    ethnicity: '',
    disability_status: '',
    veteran_status: '',
    veteran_country: '',
    children: '',
    pets: '',
    travel_history: '',
    voting_status: '',
    interests: '',
    subscription_services: '',
    professional_memberships: '',
    social_clubs: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (entity) {
      setInfoData({
        country_birth: entity.country_birth ?? '',
        marital_status: entity.marital_status ?? '',
        residence_housing_type: entity.residence_housing_type ?? '',
        passport_number: entity.passport_number ?? '',
        visas: entity.visas ?? '',
        driver_license_number: entity.driver_license_number ?? '',
        biometric_data: entity.biometric_data ?? '',
        criminal_records: entity.criminal_records ?? '',
        political_affiliation: entity.political_affiliation ?? '',
        religion: entity.religion ?? '',
        sexual_orientation: entity.sexual_orientation ?? '',
        medical_history: entity.medical_history ?? '',
        medical_issues: entity.medical_issues ?? '',
        genetic_information: entity.genetic_information ?? '',
        occupation: entity.occupation ?? '',
        occupation_industry: entity.occupation_industry ?? '',
        education_level: entity.education_level ?? '',
        employment_status: entity.employment_status ?? '',
        primary_language: entity.primary_language ?? '',
        secondary_languages: entity.secondary_languages ?? '',
        ethnicity: entity.ethnicity ?? '',
        disability_status: entity.disability_status ?? '',
        veteran_status: entity.veteran_status ?? '',
        veteran_country: entity.veteran_country ?? '',
        children: entity.children ?? '',
        pets: entity.pets ?? '',
        travel_history: entity.travel_history ?? '',
        voting_status: entity.voting_status ?? '',
        interests: entity.interests ?? '',
        subscription_services: entity.subscription_services ?? '',
        professional_memberships: entity.professional_memberships ?? '',
        social_clubs: entity.social_clubs ?? '',
      });
    }
  }, [entity]);

  const handleChange = (key, value) => {
    setInfoData({ ...infoData, [key]: value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const service = new UserManagementService({ apiKey, settings: { environment } });
      const payload = {
        ...fullEntity,
        id: entityId,
        information_sensitive: infoData,
      };

      const response = await service.update(payload);

      if (response && response.result) {
        if (onUpdatedEntity) {
          onUpdatedEntity('update', infoData);
        }
      }
    } catch (error) {
      console.error('Error updating information sensitive:', error);
      if (onUpdatedEntity) {
        onUpdatedEntity('error', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { key: 'country_birth', label: 'Country of Birth' },
    { key: 'marital_status', label: 'Marital Status' },
    { key: 'residence_housing_type', label: 'Housing Type' },
    { key: 'passport_number', label: 'Passport Number' },
    { key: 'visas', label: 'Visas' },
    { key: 'driver_license_number', label: 'Driver License Number' },
    { key: 'biometric_data', label: 'Biometric Data' },
    { key: 'criminal_records', label: 'Criminal Records' },
    { key: 'political_affiliation', label: 'Political Affiliation' },
    { key: 'religion', label: 'Religion' },
    { key: 'sexual_orientation', label: 'Sexual Orientation' },
    { key: 'medical_history', label: 'Medical History' },
    { key: 'medical_issues', label: 'Medical Issues' },
    { key: 'genetic_information', label: 'Genetic Information' },
    { key: 'occupation', label: 'Occupation' },
    { key: 'occupation_industry', label: 'Industry' },
    { key: 'education_level', label: 'Education Level' },
    { key: 'employment_status', label: 'Employment Status' },
    { key: 'primary_language', label: 'Primary Language' },
    { key: 'secondary_languages', label: 'Secondary Languages' },
    { key: 'ethnicity', label: 'Ethnicity' },
    { key: 'disability_status', label: 'Disability Status' },
    { key: 'veteran_status', label: 'Veteran Status' },
    { key: 'veteran_country', label: 'Veteran Country' },
    { key: 'children', label: 'Children' },
    { key: 'pets', label: 'Pets' },
    { key: 'travel_history', label: 'Travel History' },
    { key: 'voting_status', label: 'Voting Status' },
    { key: 'interests', label: 'Interests' },
    { key: 'subscription_services', label: 'Subscription Services' },
    { key: 'professional_memberships', label: 'Professional Memberships' },
    { key: 'social_clubs', label: 'Social Clubs' },
  ];

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
            Sensitive Information
          </Typography>
          <Grid container spacing={2}>
            {fields.map((field) => (
              <Grid item xs={12} sm={6} md={4} key={field.key}>
                <TextField
                  fullWidth
                  label={field.label}
                  value={infoData[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  size="small"
                />
              </Grid>
            ))}
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

export default UserInformationSensitiveEdit;
