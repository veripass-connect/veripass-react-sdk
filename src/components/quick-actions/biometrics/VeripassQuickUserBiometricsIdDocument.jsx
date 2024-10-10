import React, { useState, useEffect } from 'react';

import { Button } from '@mui/material';

import { Uploader } from '@link-loom/react-sdk';
import { UploadService } from '@services';

export const VeripassQuickUserBiometricsIdDocument = ({ entity, onUpdatedEntity, setIsOpen, isPopupContext }) => {
  const [principalImage, setPrincipalImage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [identificationType, setIdentificationType] = useState(null);

  const onFileLoaded = async ({ file, metadata }) => {
    const today = new Date();
    const dateCreated = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;

    /* setPrincipalImage([
      {
        uri: file.url || '',
        filename: file.filename || '',
        path: file.path || '',
        attachmentType: metadata?.attachmentType,
        dateCreated,
        isPrincipal: true,
      },
    ]); */
  };

  const onFileDeleted = async (file) => {
    setPrincipalImage([]);
  };

  useEffect(() => {
    setIsLoading(false);
  }, [entity]);

  return (
    <>
      <section className="card-body p-0 mt-3">
        {!identificationType && (
          <section className="passport-input">
            <h3 className="text-center">Choose an option</h3>
            <article className="mt-2 w-50 mx-auto">
              <section className="my-1 text-center d-flex flex-column">
                <Button
                  size="large"
                  color="info"
                  variant="contained"
                  className="my-2"
                  onClick={() => {
                    setIdentificationType('national-id');
                  }}
                >
                  National Identification
                </Button>
                <Button
                  size="large"
                  color="info"
                  variant="contained"
                  className="my-2"
                  onClick={() => {
                    setIdentificationType('passport');
                  }}
                >
                  Passport
                </Button>
              </section>
            </article>
          </section>
        )}
        {identificationType === 'national-id' && (
          <section className="national-id-input d-flex flex-column">
            <h3 className="text-center">National identification </h3>
            <section className="mx-auto">
              <Button
                variant="text"
                onClick={() => {
                  setIdentificationType(null);
                }}
              >
                Select other
              </Button>
            </section>

            <article className="mt-2 w-50 mx-auto">
              <label htmlFor="image" className="form-label">
                Front side
              </label>

              <section className="my-1">
                <Uploader
                  uploadService={UploadService}
                  file={principalImage?.[0]}
                  behaviors={{
                    isInline: true,
                    isMultipleFile: false,
                  }}
                  accept="image/x-png, image/gif, image/jpeg, image/webp, image/svg+xml, image/bmp, image/tiff"
                  height="200px"
                  folder="course"
                  onEvent={(event, data) => {
                    switch (event) {
                      case 'onFileLoaded':
                        onFileLoaded(data);
                        break;
                      case 'delete':
                        onFileDeleted();
                        break;
                      default:
                        break;
                    }
                  }}
                  actions={[
                    {
                      title: 'Copiar',
                      action: 'copy',
                      disabled: false,
                    },
                    {
                      title: 'Ver',
                      action: 'view',
                      disabled: false,
                    },
                    {
                      title: 'Eliminar',
                      action: 'delete',
                      disabled: false,
                    },
                  ]}
                  componentTexts={{
                    file: 'Archivo',
                    delete: 'Eliminar',
                    description: 'Arrastre y suelte un archivo aquí o selecciona archivo',
                    buttonUpload: 'Subir',
                    buttonSelectFile: 'Seleccionar archivo',
                    fileAccepted: 'Archivos aceptados',
                    maxFileSize: 'Tamaño maximo',
                    uploadFile: 'Cargar archivo',
                    fileSize: '5Mb',
                  }}
                />
              </section>
            </article>
            <article className="mt-2 w-50 mx-auto">
              <label htmlFor="image" className="form-label">
                Back side
              </label>

              <section className="my-1">
                <Uploader
                  uploadService={UploadService}
                  file={principalImage?.[0]}
                  behaviors={{
                    isInline: true,
                    isMultipleFile: false,
                  }}
                  accept="image/x-png, image/gif, image/jpeg, image/webp, image/svg+xml, image/bmp, image/tiff"
                  height="200px"
                  folder="course"
                  onEvent={(event, data) => {
                    switch (event) {
                      case 'onFileLoaded':
                        onFileLoaded(data);
                        break;
                      case 'delete':
                        onFileDeleted();
                        break;
                      default:
                        break;
                    }
                  }}
                  actions={[
                    {
                      title: 'Copiar',
                      action: 'copy',
                      disabled: false,
                    },
                    {
                      title: 'Ver',
                      action: 'view',
                      disabled: false,
                    },
                    {
                      title: 'Eliminar',
                      action: 'delete',
                      disabled: false,
                    },
                  ]}
                  componentTexts={{
                    file: 'Archivo',
                    delete: 'Eliminar',
                    description: 'Arrastre y suelte un archivo aquí o selecciona archivo',
                    buttonUpload: 'Subir',
                    buttonSelectFile: 'Seleccionar archivo',
                    fileAccepted: 'Archivos aceptados',
                    maxFileSize: 'Tamaño maximo',
                    uploadFile: 'Cargar archivo',
                    fileSize: '5Mb',
                  }}
                />
              </section>
            </article>
          </section>
        )}
        {identificationType === 'passport' && (
          <section className="passport-input d-flex flex-column">
            <h3 className="text-center">Passport</h3>
            <section className="mx-auto">
              <Button
                variant="text"
                onClick={() => {
                  setIdentificationType(null);
                }}
              >
                Select other
              </Button>
            </section>
            <article className="mt-2 w-50 mx-auto">
              <label htmlFor="image" className="form-label">
                Front side
              </label>

              <section className="my-1">
                <Uploader
                  uploadService={UploadService}
                  file={principalImage?.[0]}
                  behaviors={{
                    isInline: true,
                    isMultipleFile: false,
                  }}
                  accept="image/x-png, image/gif, image/jpeg, image/webp, image/svg+xml, image/bmp, image/tiff"
                  height="200px"
                  folder="course"
                  onEvent={(event, data) => {
                    switch (event) {
                      case 'onFileLoaded':
                        onFileLoaded(data);
                        break;
                      case 'delete':
                        onFileDeleted();
                        break;
                      default:
                        break;
                    }
                  }}
                  actions={[
                    {
                      title: 'Copiar',
                      action: 'copy',
                      disabled: false,
                    },
                    {
                      title: 'Ver',
                      action: 'view',
                      disabled: false,
                    },
                    {
                      title: 'Eliminar',
                      action: 'delete',
                      disabled: false,
                    },
                  ]}
                  componentTexts={{
                    file: 'Archivo',
                    delete: 'Eliminar',
                    description: 'Arrastre y suelte un archivo aquí o selecciona archivo',
                    buttonUpload: 'Subir',
                    buttonSelectFile: 'Seleccionar archivo',
                    fileAccepted: 'Archivos aceptados',
                    maxFileSize: 'Tamaño maximo',
                    uploadFile: 'Cargar archivo',
                    fileSize: '5Mb',
                  }}
                />
              </section>
            </article>
          </section>
        )}
      </section>
    </>
  );
};
