import React, { useState, useEffect } from 'react';

import { Button } from '@mui/material';

import { Uploader } from '@link-loom/react-sdk';
import { UploadService } from '@services';

export const VeripassQuickUserBiometricsIdDocument = ({ entity, itemOnAction, onUpdatedEntity, setIsOpen, isPopupContext }) => {
  // UI States
  const [passportFrontside, setPassportFrontside] = useState([]);
  const [nationalIdFrontside, setNationalIdFrontside] = useState([]);
  const [nationalIdBackside, setNationalIdBackside] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [identificationType, setIdentificationType] = useState(null);

  const uploaderOnEvent = ({ uploader, event, data }) => {
    switch (event) {
      case 'onFileLoaded':
        onFileLoaded(uploader, data);
        break;
      case 'delete':
        onFileDeleted(uploader);
        break;
      default:
        break;
    }
  };

  const onFileLoaded = async (uploader, data) => {
    switch (uploader) {
      case 'national-id-frontside':
        setNationalIdFrontside(data);
        break;
      case 'national-id-backside':
        setNationalIdBackside(data);
        break;
      case 'passport-frontside':
        setPassportFrontside(data);
        break;
      default:
        break;
    }
  };

  const onFileDeleted = async (uploader) => {
    switch (uploader) {
      case 'national-id-frontside':
        setNationalIdFrontside(null);
        break;
      case 'national-id-backside':
        setNationalIdBackside(null);
        break;
      case 'passport-frontside':
        setPassportFrontside(null);
        break;
      default:
        break;
    }
  };

  const canSubmit = () => {
    if (!entity) {
      return false;
    }

    if (identificationType === 'national-id') {
      if (nationalIdFrontside && nationalIdBackside) {
        return true;
      }
    } else if (identificationType === 'passport') {
      if (passportFrontside) {
        return true;
      }
    }

    return false;
  };

  const handleSubmit = () => {
    if (itemOnAction) {
      itemOnAction('biometric-id-document-done', null);
    }
  };

  // Update form data with the provided entity on load
  useEffect(() => {
    if (entity) {
      setIsLoading(false);

      setUserData(entity);
    }
  }, [entity]);

  return (
    <>
      <section className="card-body p-0 mt-3">
        {!identificationType && (
          <section className="passport-input">
            <h4 className="text-center">Choose an option</h4>
            <article className="mt-2 w-50 mx-auto">
              <section className="my-1 text-center d-flex flex-column">
                <Button
                  size="small"
                  color="info"
                  variant="contained"
                  className="my-2"
                  onClick={() => {
                    setIdentificationType('passport');
                  }}
                  sx={{
                    backgroundColor: '#323a46',
                    borderColor: '#323a46',
                    '&:hover': {
                      backgroundColor: '#404651',
                      borderColor: '#404651',
                    },
                  }}
                >
                  Passport
                </Button>
                <Button
                  size="small"
                  color="info"
                  variant="contained"
                  className="my-2"
                  onClick={() => {
                    setIdentificationType('national-id');
                  }}
                  sx={{
                    backgroundColor: '#323a46',
                    borderColor: '#323a46',
                    '&:hover': {
                      backgroundColor: '#404651',
                      borderColor: '#404651',
                    },
                  }}
                >
                  National Identification
                </Button>
              </section>
            </article>
          </section>
        )}
        {identificationType === 'national-id' && (
          <section className="national-id-input d-flex flex-column">
            <header className="d-flex justify-content-center">
              <h4 className="text-center me-2">National identification</h4>
              <section className="d-flex">
                <Button
                  className="my-auto"
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setIdentificationType(null);
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  Change
                </Button>
              </section>
            </header>

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
                  folder={`${entity.identity}/national-id/frontside`}
                  onEvent={(event, data) => {
                    uploaderOnEvent({ uploader: 'national-id-frontside', event, data });
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
                  folder={`${entity.identity}/national-id/backside`}
                  onEvent={(event, data) => {
                    uploaderOnEvent({ uploader: 'national-id-backtside', event, data });
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
            <header className="d-flex justify-content-center">
              <h4 className="text-center me-2">Passport</h4>
              <section className="d-flex">
                <Button
                  className="my-auto"
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setIdentificationType(null);
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  Change
                </Button>
              </section>
            </header>
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
                  folder={`${entity.identity}/passport/frontside`}
                  onEvent={(event, data) => {
                    uploaderOnEvent({ uploader: 'passport-frontside', event, data });
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

        {/* Submit button */}
        <footer className="d-flex justify-content-end">
          {isLoading && (
            <button type="button" disabled className="btn btn-primary">
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Saving...
            </button>
          )}

          {!isLoading && (
            <Button
              type="button"
              variant="contained"
              className="my-2"
              onClick={handleSubmit}
              disabled={!canSubmit()}
              sx={{
                backgroundColor: !canSubmit() ? '#a0a0a0' : '#323a46',
                borderColor: !canSubmit() ? '#a0a0a0' : '#323a46',
                '&:hover': {
                  backgroundColor: !canSubmit() ? '#a0a0a0' : '#404651',
                  borderColor: !canSubmit() ? '#a0a0a0' : '#404651',
                },
              }}
            >
              Next
            </Button>
          )}
        </footer>
      </section>
    </>
  );
};
