import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, SnapData } from '@link-loom/react-sdk';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const UserIdentityPreview = ({ entity, setIsOpen, isPopupContext }) => {
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
      {
        title: 'Email Addresses',
        primary: entity?.email_addresses?.find((element) => element.is_primary)?.entry || '-',
        others:
          entity?.email_addresses
            ?.filter((element) => !element.is_primary)
            ?.map((element) => element.entry)
            ?.join(', ') || '-',
      },
      {
        title: 'Phone Numbers',
        primary: formatPhoneNumber(entity?.phone_numbers?.find((element) => element.is_primary)),
        others:
          entity?.phone_numbers
            ?.filter((element) => !element.is_primary)
            ?.map((element) => formatPhoneNumber(element))
            ?.join(', ') || '-',
      },
      {
        title: 'Social Media Profiles',
        primary: entity?.social_media_profiles?.find((element) => element.is_primary)?.entry || '-',
        others:
          entity?.social_media_profiles
            ?.filter((element) => !element.is_primary)
            ?.map((element) => element.entry)
            ?.join(', ') || '-',
      },
      {
        title: 'Web3 Wallets',
        primary: entity?.web3_wallets?.find((element) => element.is_primary)?.entry || '-',
        others:
          entity?.web3_wallets
            ?.filter((element) => !element.is_primary)
            ?.map((element) => element.entry)
            ?.join(', ') || '-',
      },
      {
        title: 'Gaming Usernames',
        primary: entity?.gaming_usernames?.find((element) => element.is_primary)?.entry || '-',
        others:
          entity?.gaming_usernames
            ?.filter((element) => !element.is_primary)
            ?.map((element) => element.entry)
            ?.join(', ') || '-',
      },
      {
        title: 'Personal Websites',
        primary: entity?.personal_websites?.find((element) => element.is_primary)?.entry || '-',
        others:
          entity?.personal_websites
            ?.filter((element) => !element.is_primary)
            ?.map((element) => element.entry)
            ?.join(', ') || '-',
      },
      {
        title: 'Online Marketplace Usernames',
        primary: entity?.online_marketplace_usernames?.find((element) => element.is_primary)?.entry || '-',
        others:
          entity?.online_marketplace_usernames
            ?.filter((element) => !element.is_primary)
            ?.map((element) => element.entry)
            ?.join(', ') || '-',
      },
      {
        title: 'Professional Portfolios',
        primary: entity?.professional_portfolios?.find((element) => element.is_primary)?.entry || '-',
        others:
          entity?.professional_portfolios
            ?.filter((element) => !element.is_primary)
            ?.map((element) => element.entry)
            ?.join(', ') || '-',
      },
      {
        title: 'Addresses',
        primary: entity?.addresses?.find((element) => element.is_primary)?.entry || '-',
        others:
          entity?.addresses
            ?.filter((element) => !element.is_primary)
            ?.map((element) => element.entry)
            ?.join(', ') || '-',
      },
    ]);
  }, [entity]);

  useEffect(() => {
    console.log('rows', rows);
  }, [rows]);

  useEffect(() => {
    console.log('UserIdentityPreview component mounted');

    return () => {
      console.log('UserIdentityPreview component unmounted');
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
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="right">Primary</TableCell>
                  <TableCell align="right">Others</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.title} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row" variant="head">
                      {row.title}
                    </TableCell>
                    <TableCell align="right">{row.primary}</TableCell>
                    <TableCell align="right">{row.others}</TableCell>
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

export default UserIdentityPreview;
