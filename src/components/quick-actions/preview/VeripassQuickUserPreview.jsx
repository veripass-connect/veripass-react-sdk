import React, { useState, useEffect } from 'react';
import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';
import { Spinner, SnapData, useNavigate } from '@link-loom/react-sdk';
import { VeripassUserVerificationStatus } from '@components/verify/VeripassUserVerificationStatus';
import styled from 'styled-components';

import defaultCover from '@assets/cover/cover-11.jpg';
import defaultCharacter from '@assets/characters/character-unknown.svg';

// Styled components for the specific elements
const UserQuickViewContainer = styled.section`
  min-width: 450px;
`;

const QuickViewNotch = styled.svg`
  width: 260px;
  height: 118px;
  color: rgb(255, 255, 255);
  left: 0px;
  right: 0px;
  z-index: 10;
  margin-left: auto;
  margin-right: auto;
  bottom: -51px;
  position: absolute;
`;

const ProfileImage = styled.img`
  z-index: 11;
  bottom: -54px;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
`;

const CoverContainer = styled.section`
  width: 100%;
  height: 100%;
  vertical-align: bottom;
  background-size: cover !important;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: rgba(22, 28, 36, 0.48);
    position: absolute;
  }
`;

const CoverImage = styled.img`
  width: 100%;
  height: 130px;
  object-fit: cover;
  vertical-align: bottom;
  top: 0px;
  left: 0px;
`;

export const VeripassQuickUserPreview = ({ entity, setIsOpen, isPopupContext = false }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const confirmOnClick = async () => {
    setIsOpen(false);
    navigate(`/admin/users/management/${entity?.id}`);
  };

  const closeOnClick = async () => {
    setIsOpen(false);
  };

  const onEditUserProfile = (id) => {
    if (isPopupContext) {
      confirmOnClick();
    }
  };

  useEffect(() => {
    setIsLoading(false);
    console.log(entity);
  }, [entity]);

  return (
    <VeripassLayout isPopupContext={isPopupContext}>
      <section className="card-body p-0">
        {isLoading ? (
          <Spinner />
        ) : (
          <UserQuickViewContainer className="user-quick-view border-1 mx-auto rounded shadow">
            <article
              className={
                isPopupContext ? 'text-center card-body p-0' : 'text-center card-body p-0 border-bottom border-end border-start'
              }
            >
              <header className="position-relative mb-5">
                <CoverContainer className="user-quickview-cover-container rounded-top">
                  <CoverImage
                    src={entity?.profile_ui_settings?.cover_picture_url ?? defaultCover}
                    alt="cover-image"
                    className="user-quick-view-cover rounded-top"
                  />
                </CoverContainer>
                <QuickViewNotch
                  className="user-quick-view-notch"
                  fill="none"
                  viewBox="0 0 144 62"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m111.34 23.88c-10.62-10.46-18.5-23.88-38.74-23.88h-1.2c-20.24 0-28.12 13.42-38.74 23.88-7.72 9.64-19.44 11.74-32.66 12.12v26h144v-26c-13.22-.38-24.94-2.48-32.66-12.12z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                </QuickViewNotch>
                <ProfileImage
                  src={entity?.profile_ui_settings?.profile_picture_url ?? defaultCharacter}
                  className="rounded-circle avatar-xl img-thumbnail mb-2 user-quick-view-profile-img"
                  alt="profile-image"
                />
              </header>

              <section className="m-2">
                <p className="text-muted font-13 mb-3">{entity?.bio}</p>

                <article className="text-center">
                  <h4 className="mb-0">{entity?.display_name}</h4>

                  <p className="text-muted mt-1">{entity?.identity ? <span className="">{entity?.identity}</span> : null}</p>

                  <section className="d-flex flex-column">
                    <article className="col-12 d-flex justify-content-between border-bottom px-2 my-2 py-1">
                      <section>
                        <strong>Email:</strong>
                      </section>
                      <section>
                        <SnapData
                          id="primary_email_address"
                          data={entity?.primary_email_address}
                          alignment="right"
                          onEdit={onEditUserProfile}
                        />
                      </section>
                    </article>
                    <article className="col-12 d-flex justify-content-between border-bottom px-2 my-2 py-1">
                      <section>
                        <strong>Phone:</strong>
                      </section>
                      <section>
                        <SnapData
                          id="primary_phone_number"
                          data={
                            entity?.primary_phone_number
                              ? `+${entity?.primary_phone_number?.country?.dial_code} ${entity?.primary_phone_number?.phone_number}`
                              : ''
                          }
                          alignment="right"
                          onEdit={onEditUserProfile}
                        />
                      </section>
                    </article>
                    <article className="col-12 d-flex justify-content-between border-bottom px-2 my-2 py-1">
                      <section>
                        <strong>National Id:</strong>
                      </section>
                      <section>
                        <SnapData
                          id="primary_national_id"
                          data={entity?.primary_national_id}
                          alignment="right"
                          onEdit={onEditUserProfile}
                        />
                      </section>
                    </article>
                    <article className="col-12 d-flex justify-content-between border-bottom px-2 my-2 py-1">
                      <section>
                        <strong>Organization status:</strong>
                      </section>
                      <section>
                        <SnapData
                          id="primary_email_address"
                          data={entity?.status?.title}
                          alignment="right"
                          onEdit={onEditUserProfile}
                        />
                      </section>
                    </article>

                    <section className={isPopupContext ? 'mt-2' : 'my-2'}>
                      <VeripassUserVerificationStatus entity={entity} />
                    </section>
                  </section>
                </article>
              </section>

              {isPopupContext && (
                <section className="d-flex justify-content-center mt-4 pb-3">
                  <button title="Submit" type="submit" className="btn btn btn-white btn-action mx-2" onClick={closeOnClick}>
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
            </article>
          </UserQuickViewContainer>
        )}
      </section>
    </VeripassLayout>
  );
};
