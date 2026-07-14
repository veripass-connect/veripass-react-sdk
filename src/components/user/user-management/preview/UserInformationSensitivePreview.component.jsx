import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@link-loom/react-sdk';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const UserInformationSensitivePreview = ({ entity, setIsOpen, isPopupContext }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const confirmOnClick = async () => {
    setIsOpen(false);
    navigate(`/client/users/management/${entity?.id}`);
  };

  const closeOnClick = async () => {
    setIsOpen(false);
  };

  const formatPhoneNumber = (phoneData) => {
    if (!phoneData || !phoneData.entry) return '';

    const { entry } = phoneData;

    if (typeof entry === 'object' && entry?.country?.dial_code && entry.phone_number) {
      return `+${entry?.country?.dial_code} ${entry.phone_number}`;
    }

    if (entry.international_phone_number) {
      return entry.international_phone_number;
    }

    return typeof entry === 'string' ? entry : '';
  };

  useEffect(() => {
    setIsLoading(false);
    console.log(entity);

    setRows([
      { title: 'Country Birth', value: entity?.country_birth || '-' },
      { title: 'Marital Status', value: entity?.marital_status || '-' },
      { title: 'Residence Housing Type', value: entity?.residence_housing_type || '-' },
      { title: 'Passport Number', value: entity?.passport_number || '-' },
      { title: 'Visas', value: entity?.visas || '-' },
      { title: 'Driver License Number', value: entity?.driver_license_number || '-' },
      { title: 'Biometric Data', value: entity?.biometric_data || '-' },
      { title: 'Criminal Records', value: entity?.criminal_records || '-' },
      { title: 'Political Affiliation', value: entity?.political_affiliation || '-' },
      { title: 'Religion', value: entity?.religion || '-' },
      { title: 'Sexual Orientation', value: entity?.sexual_orientation || '-' },
      { title: 'Medical History', value: entity?.medical_history || '-' },
      { title: 'Medical Issues', value: entity?.medical_issues || '-' },
      { title: 'Genetic Information', value: entity?.genetic_information || '-' },
      { title: 'Occupation', value: entity?.occupation || '-' },
      { title: 'Occupation Industry', value: entity?.occupation_industry || '-' },
      { title: 'Education Level', value: entity?.education_level || '-' },
      { title: 'Employment Status', value: entity?.employment_status || '-' },
      { title: 'Primary Language', value: entity?.primary_language || '-' },
      { title: 'Secondary Languages', value: entity?.secondary_languages || '-' },
      { title: 'Ethnicity', value: entity?.ethnicity || '-' },
      { title: 'Disability Status', value: entity?.disability_status || '-' },
      { title: 'Veteran Status', value: entity?.veteran_status || '-' },
      { title: 'Veteran Country', value: entity?.veteran_country || '-' },
      { title: 'Children', value: entity?.children || '-' },
      { title: 'Pets', value: entity?.pets || '-' },
      { title: 'Travel History', value: entity?.travel_history || '-' },
      { title: 'Voting Status', value: entity?.voting_status || '-' },
      { title: 'Interests', value: entity?.interests || '-' },
      { title: 'Subscription Services', value: entity?.subscription_services || '-' },
      { title: 'Professional Memberships', value: entity?.professional_memberships || '-' },
      { title: 'Social Clubs', value: entity?.social_clubs || '-' },
    ]);
  }, [entity]);

  useEffect(() => {
    console.log('rows', rows);
  }, [rows]);

  useEffect(() => {
    console.log('UserInformationSensitivePreview component mounted');

    return () => {
      console.log('UserInformationSensitivePreview component unmounted');
    };
  }, []);

  return (
    <section className="card-body p-0">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.title} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row" variant="head">
                      {row.title}
                    </TableCell>
                    <TableCell align="right">{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      {isPopupContext && (
        <section className="d-flex justify-content-center mt-4 pb-3">
          <button
            title="Submit"
            type="submit"
            className="btn btn btn-white btn-action mx-2"
            onClick={closeOnClick}
          >
            <i className="bi bi-check"></i> Close
          </button>
          <button
            title="Edit user"
            type="submit"
            className="btn btn-soft-success btn-action mx-2"
            onClick={confirmOnClick}
          >
            <i className="bi bi-check"></i> Edit user
          </button>
        </section>
      )}
    </section>
  );
};

export default UserInformationSensitivePreview;
