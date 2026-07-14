import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, DataGrid, SnapData } from '@link-loom/react-sdk';

const UserLogsPreview = ({ entities, setIsOpen, isPopupContext }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <section className="w-100">
            <span>{params.row?.title}</span>
            <SnapData id="name" data={params.row?.id} alignment="between" variant="small" className="text-muted" />
          </section>
        );
      },
    },
    {
      field: 'date_creation',
      headerName: 'Timestamp',
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => params.row?.date_creation,
      renderCell: (params) => {
        return <section className="w-100">{new Date(+params.row?.date_creation).toLocaleString()}</section>;
      },
    },
    {
      field: 'activity',
      headerName: 'Activity',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return <section className="w-100">{params.row?.activity}</section>;
      },
    },
    {
      field: 'level',
      headerName: 'Level',
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => params.row?.level?.title,
      renderCell: (params) => {
        return <section className="w-100">{params.row?.level?.title}</section>;
      },
    },
  ];

  const closeOnClick = async () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setIsLoading(false);
    console.log(entities);
  }, [entities]);

  useEffect(() => {
    console.log('UserLogsPreview component mounted');

    return () => {
      console.log('UserLogsPreview component unmounted');
    };
  }, []);

  return (
    <section className="card-body p-0">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <DataGrid
            sx={{
              border: 'none',
            }}
            columns={columns}
            rows={entities}
            localeText={undefined}
            pageSizeOptions={[10, 20, 50, 100]}
            disableRowSelectionOnClick={true}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          />
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
        </section>
      )}
    </section>
  );
};

export default UserLogsPreview;
