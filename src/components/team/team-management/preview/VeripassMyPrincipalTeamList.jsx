import React, { useState, useEffect } from 'react';
import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';
import { openSnackbar, DataGrid, StatusSelector, Alert, useNavigate } from '@link-loom/react-sdk';
import { Button } from '@mui/material';

import { fetchEntityCollection } from '@services/utils/entityServiceAdapter';
import { useAuth } from '@hooks/useAuth.hook';

import defaultAvatar from '@assets/characters/character-unknown.svg';
import '@styles/fonts.css';
import '@styles/styles.css';

import { TeamManagementService } from '@services';

const dummyTeamList = [
  {
    id: 1,
    profile_pic_uri: defaultAvatar,
    firstname: 'Paula',
    lastname: 'Medina',
    email: 'paula@micampus.com',
    position_name: 'Operations Manager',
  },
  {
    id: 2,
    profile_pic_uri: defaultAvatar,
    firstname: 'Mary',
    lastname: 'Rodriguez',
    email: 'mary@micampus.com',
    position_name: 'Accounting Manager',
  },
  {
    id: 3,
    profile_pic_uri: defaultAvatar,
    firstname: 'Isis',
    lastname: 'Medina',
    email: 'isis@micampus.com',
    position_name: 'Marketing head',
  },
  {
    id: 4,
    profile_pic_uri: defaultAvatar,
    firstname: 'Chloe',
    lastname: 'Rodriguez',
    email: 'chloe@micampus.com',
    position_name: 'Operations',
  },
];

export const VeripassMyPrincipalTeamList = ({
  ui = {
    profilePhoto: {
      height: '95',
    },
    inputSize: 'small',
  },
  environment = 'production',
  apiKey = '',
  isPopupContext = false,
}) => {
  // Hooks
  const authProvider = useAuth();

  // Models
  const [entities, setEntities] = useState([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [teamUserList, setTeamUserList] = useState([]);

  // Configs

  // Functions
  const getIdentityTeam = async () => {
    if (!contractParties || !contractParties.counterparty_id || !contractParties.principal_id) {
      return;
    }

    const entityResponse = await fetchEntityCollection({
      service: TeamManagementService,
      payload: {
        queryselector: 'id',
        counterparty_id: contractParties.counterparty_id,
        principal_id: contractParties.principal_id,
      },
      apiKey,
      settings: { environment },
    });

    setLoading(false);

    if (!entityResponse?.success) {
      setIsEmptyEntities(true);
      return;
    }

    setEntities(entityResponse?.result?.items || []);
    setIsEmptyEntities(entityResponse?.result?.items <= 0);
  };

  const initializeComponent = async () => {
    setTeamUserList(dummyTeamList);
  };

  useEffect(() => {
    initializeComponent();
  }, []);

  return (
    <>
      <VeripassLayout isPopupContext={isPopupContext} ui={{ showLogo: true, vertical: 'bottom', alignment: 'end' }}>
        <div className="row g-3">
          {teamUserList.map((_user) => (
            <article className="col-xl-3 col-md-6" key={_user.id}>
              <article className="card shadow">
                <div className="card-body widget-user">
                  <div className="d-flex align-items-center">
                    <header className="flex-shrink-0 avatar-lg me-3">
                      <img
                        src={_user.profile_pic_uri || '/assets/images/characters/character-unknown.svg'}
                        className="img-fluid rounded-circle border"
                        alt="user"
                        width="70"
                      />
                    </header>
                    <section className="flex-grow-1 overflow-hidden">
                      <h5 className="mt-0 mb-1 text-truncate">{_user.firstname + ' ' + _user.lastname}</h5>
                      <p className="text-muted mb-2 font-13 text-truncate">{_user.email}</p>
                      <p className="text-black-50 text-truncate">
                        <small>
                          <strong>{_user.position_name}</strong>
                        </small>
                      </p>
                    </section>
                  </div>
                </div>
              </article>
            </article>
          ))}
        </div>
      </VeripassLayout>
    </>
  );
};
