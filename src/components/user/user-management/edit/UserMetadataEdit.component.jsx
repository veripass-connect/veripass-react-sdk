import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Alert } from '@mui/material';
import { UserManagementService } from '@services';
import styled from 'styled-components';

// Helper for Layout
const Container = styled.div`
  width: 100%;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const UserMetadataEdit = ({ entity, entityId, fullEntity, onUpdatedEntity, apiKey = '', environment = 'production' }) => {
  const [metadata, setMetadata] = useState({
    public_metadata: '{}',
    private_metadata: '{}',
    unsafe_metadata: '{}',
  });
  const [jsonErrors, setJsonErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (entity) {
      setMetadata({
        public_metadata: JSON.stringify(entity.public_metadata || {}, null, 2),
        private_metadata: JSON.stringify(entity.private_metadata || {}, null, 2),
        unsafe_metadata: JSON.stringify(entity.unsafe_metadata || {}, null, 2),
      });
    }
  }, [entity]);

  const handleChange = (key, value) => {
    setMetadata({ ...metadata, [key]: value });

    // Validate JSON
    try {
      JSON.parse(value);
      setJsonErrors({ ...jsonErrors, [key]: null });
    } catch (e) {
      setJsonErrors({ ...jsonErrors, [key]: 'Invalid JSON format' });
    }
  };

  const handleSubmit = async () => {
    // Final validation before submit
    const errors = {};
    Object.keys(metadata).forEach((key) => {
      try {
        JSON.parse(metadata[key]);
      } catch (e) {
        errors[key] = 'Invalid JSON';
      }
    });

    if (Object.keys(errors).length > 0) {
      setJsonErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const service = new UserManagementService({ apiKey, settings: { environment } });
      const payload = {
        ...fullEntity,
        id: entityId,
        user_metadata: {
          public_metadata: JSON.parse(metadata.public_metadata),
          private_metadata: JSON.parse(metadata.private_metadata),
          unsafe_metadata: JSON.parse(metadata.unsafe_metadata),
        },
      };

      const response = await service.update(payload);

      if (response && response.result) {
        if (onUpdatedEntity) {
          onUpdatedEntity('update', payload.user_metadata);
        }
      }
    } catch (error) {
      console.error('Error updating metadata:', error);
      if (onUpdatedEntity) {
        onUpdatedEntity('error', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            Metadata
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Metadata must be entered in valid JSON format.
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Public Metadata"
                value={metadata.public_metadata}
                onChange={(e) => handleChange('public_metadata', e.target.value)}
                error={!!jsonErrors.public_metadata}
                helperText={jsonErrors.public_metadata || 'Visible to the public.'}
                sx={{ fontFamily: 'monospace' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Private Metadata"
                value={metadata.private_metadata}
                onChange={(e) => handleChange('private_metadata', e.target.value)}
                error={!!jsonErrors.private_metadata}
                helperText={jsonErrors.private_metadata || 'Visible only to authorized users.'}
                sx={{ fontFamily: 'monospace' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Unsafe Metadata"
                value={metadata.unsafe_metadata}
                onChange={(e) => handleChange('unsafe_metadata', e.target.value)}
                error={!!jsonErrors.unsafe_metadata}
                helperText={jsonErrors.unsafe_metadata || 'Sensitive data (handle with care).'}
                sx={{ fontFamily: 'monospace' }}
              />
            </Grid>
          </Grid>
        </Section>

        <section className="row mt-4">
          <div className="col-12 d-flex justify-content-end">
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading || Object.values(jsonErrors).some((e) => e)}
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

export default UserMetadataEdit;
