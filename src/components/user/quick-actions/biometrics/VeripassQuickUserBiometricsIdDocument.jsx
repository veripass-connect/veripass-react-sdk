import React, { useState, useEffect } from 'react';
import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';

import { Button } from '@mui/material';

import { Uploader } from '@link-loom/react-sdk';
import { UploadService } from '@services';

async function createEntity({ Service, payload, apiKey, environment = 'production' }) {
  const entityService = new Service({ apiKey, settings: { environment } });
  const entityResponse = await entityService.post(payload);

  if (!entityResponse || !entityResponse.result) {
    console.error(entityResponse);
    return null;
  }

  return entityResponse;
}

async function emitEvent({ action, payload, error, eventHandler }) {
  if (eventHandler) {
    eventHandler({ action, namespace: 'veripass', payload, error });
  }
}

const initialState = {
  identity: '',
  metadata: {
    biometrics: {
      identification_documents: {
        identification_type: '',
        passport_frontside: {},
        national_identification_frontside: {},
        national_identification_backside: {},
      },
    },
  },
};

export const VeripassQuickUserBiometricsIdDocument = ({
  entity,
  onEvent,
  environment = 'production',
  apiKey = '',
  isPopupContext = false,
}) => {
  // Models
  const [identityData, setIdentityData] = useState(initialState);

  // UI States
  const [nationalIdFrontside, setNationalIdFrontside] = useState([]);
  const [nationalIdBackside, setNationalIdBackside] = useState([]);
  const [passportFrontside, setPassportFrontside] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [identificationType, setIdentificationType] = useState(null);

  const handleDataChange = (path, value) => {
    setIdentityData((prevData) => {
      const newData = { ...prevData };
      const keys = path.split('.');
      let current = newData;

      keys.slice(0, -1).forEach((key) => {
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      });

      current[keys[keys.length - 1]] = value;

      return newData;
    });
  };

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
        setNationalIdFrontside(data?.file);
        handleDataChange('metadata.biometrics.identification_documents.national_identification_frontside', data?.file);
        break;
      case 'national-id-backside':
        setNationalIdBackside(data?.file);
        handleDataChange('metadata.biometrics.identification_documents.national_identification_frontside', data?.file);
        break;
      case 'passport-frontside':
        setPassportFrontside(data?.file);
        handleDataChange('metadata.biometrics.identification_documents.passport_frontside', data?.file);
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
    if (!entity || !entity?.identity) {
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
    emitEvent({ action: 'veripass-quick-user-biometrics-id-document::done', eventHandler: onEvent });
  };

  const handleUploadFile = async (fileData) => {
    try {
      setIsLoading(true);

      const fileUploadedResponse = await createEntity({ payload: fileData.payload, Service: UploadService, environment, apiKey });

      setIsLoading(false);

      if (!fileUploadedResponse || !fileUploadedResponse.success) {
        console.error(fileUploadedResponse);
        emitEvent({ action: 'quick-user-biometrics-id-document::error', error: fileUploadedResponse, eventHandler: onEvent });
        return null;
      }

      // return data to control
      return fileUploadedResponse;
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      emitEvent({ action: 'quick-user-biometrics-id-document::error', error, eventHandler: onEvent });
    }
  };

  useEffect(() => {
    if (identificationType) {
      handleDataChange('metadata.biometrics.identification_documents.identification_type', identificationType);
    }
  }, [identificationType]);

  // Update form data with the provided entity on load
  useEffect(() => {
    if (entity) {
      setIsLoading(false);

      handleDataChange('identity', entity?.identity);
    }
  }, [entity]);

  const primaryBtnSx = {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.9375rem',
    py: 1.25,
    borderRadius: '0.75rem',
    boxShadow: 'none',
    backgroundColor: '#344898',
    '&:hover': { backgroundColor: '#2a3a7d', boxShadow: '0 8px 24px rgba(52, 72, 152, 0.18)' },
  };

  return (
    <>
      <VeripassLayout isPopupContext={isPopupContext}>
        <section className="mb-0">
          {!identificationType && (
            <section className="passport-input">
              <h4 className="text-center mb-1" style={{ fontWeight: 700, color: '#1f2937' }}>
                Choose your document type
              </h4>
              <p className="text-center text-muted mb-3" style={{ fontSize: '0.9375rem' }}>
                Select which official document you'll upload to verify your identity.
              </p>
              <article className="col-12 col-md-8 col-lg-6 mx-auto">
                <section className="d-flex flex-column gap-2">
                  <Button
                    size="large"
                    variant="contained"
                    fullWidth
                    onClick={() => setIdentificationType('passport')}
                    sx={primaryBtnSx}
                  >
                    Passport
                  </Button>
                  <Button
                    size="large"
                    variant="contained"
                    fullWidth
                    onClick={() => setIdentificationType('national-id')}
                    sx={primaryBtnSx}
                  >
                    National Identification
                  </Button>
                </section>
              </article>
            </section>
          )}
          {identificationType === 'national-id' && (
            <section className="national-id-input d-flex flex-column">
              <header className="d-flex justify-content-center align-items-center mb-2">
                <h4 className="mb-0 me-2" style={{ fontWeight: 700, color: '#1f2937' }}>
                  National identification
                </h4>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setIdentificationType(null)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '0.625rem',
                    color: '#344898',
                    borderColor: '#cbd5e1',
                    '&:hover': { borderColor: '#344898', backgroundColor: '#eef1f7' },
                  }}
                >
                  Change
                </Button>
              </header>

              <article className="col-12 col-md-10 col-lg-8 mx-auto">
                <label htmlFor="image" className="form-label">
                  Front side
                </label>

                <section className="my-1">
                  <Uploader
                    upload={handleUploadFile}
                    file={nationalIdFrontside}
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
              <article className="col-12 col-md-10 col-lg-8 mx-auto mt-2">
                <label htmlFor="image" className="form-label">
                  Back side
                </label>

                <section className="my-1">
                  <Uploader
                    upload={handleUploadFile}
                    file={nationalIdBackside}
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
              <header className="d-flex justify-content-center align-items-center mb-2">
                <h4 className="mb-0 me-2" style={{ fontWeight: 700, color: '#1f2937' }}>
                  Passport
                </h4>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setIdentificationType(null)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '0.625rem',
                    color: '#344898',
                    borderColor: '#cbd5e1',
                    '&:hover': { borderColor: '#344898', backgroundColor: '#eef1f7' },
                  }}
                >
                  Change
                </Button>
              </header>
              <article className="col-12 col-md-10 col-lg-8 mx-auto">
                <label htmlFor="image" className="form-label">
                  Front side
                </label>

                <section className="my-1">
                  <Uploader
                    upload={handleUploadFile}
                    file={passportFrontside}
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
          <footer className="d-flex justify-content-end mt-3">
            <Button
              type="button"
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!canSubmit() || isLoading}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9375rem',
                py: 1.1,
                px: 3,
                borderRadius: '0.75rem',
                boxShadow: 'none',
                backgroundColor: !canSubmit() ? '#cbd5e1' : '#344898',
                '&:hover': {
                  backgroundColor: !canSubmit() ? '#cbd5e1' : '#2a3a7d',
                  boxShadow: '0 8px 24px rgba(52, 72, 152, 0.18)',
                },
                '&.Mui-disabled': {
                  color: '#ffffff',
                  backgroundColor: '#cbd5e1',
                },
              }}
            >
              {isLoading ? 'Saving...' : 'Next'}
            </Button>
          </footer>
        </section>
      </VeripassLayout>
    </>
  );
};
