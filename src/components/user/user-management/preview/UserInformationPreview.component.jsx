import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@link-loom/react-sdk';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const UserInformationPreview = ({ entity, setIsOpen, isPopupContext }) => {
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
      { title: 'Age', value: entity?.age || '-' },
      { title: 'Gender', value: entity?.gender || '-' },
      { title: 'Birthdate', value: entity?.birthdate || '-' },
      { title: 'Address Line 1', value: entity?.residence?.address_line_1 || '-' },
      { title: 'Address Line 2', value: entity?.residence?.address_line_2 || '-' },
      { title: 'City', value: entity?.residence?.city || '-' },
      { title: 'Region', value: entity?.residence?.region || '-' },
      { title: 'Postal Code', value: entity?.residence?.postal_code || '-' },
      { title: 'Country', value: entity?.residence?.country || '-' },
      { title: 'Country Code', value: entity?.residence?.country_code || '-' },
    ]);
  }, [entity]);

  useEffect(() => {
    console.log('rows', rows);
  }, [rows]);

  useEffect(() => {
    console.log('UserInformationPreview component mounted');

    return () => {
      console.log('UserInformationPreview component unmounted');
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

export default UserInformationPreview;
