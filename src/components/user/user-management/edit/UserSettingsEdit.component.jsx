import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Alert, MenuItem, Stack } from '@mui/material';
import { UserManagementService } from '@services';
import styled from 'styled-components';

// Helper for Layout
const Container = styled.div`
  width: 100%;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const UserSettingsEdit = ({ entity, entityId, fullEntity, onUpdatedEntity, apiKey = '', environment = 'production' }) => {
  const [settings, setSettings] = useState({
    notification_preferences: '{}',
    marketing_preferences: '{}',
    personal_data_preferences: '{}',
    language_preference: '',
  });
  const [jsonErrors, setJsonErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (entity) {
      setSettings({
        notification_preferences: JSON.stringify(entity.notification_preferences ?? {}, null, 2),
        marketing_preferences: JSON.stringify(entity.marketing_preferences ?? {}, null, 2),
        personal_data_preferences: JSON.stringify(entity.personal_data_preferences ?? {}, null, 2),
        language_preference: entity.language_preference ?? 'en',
      });
    }
  }, [entity]);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });

    if (['notification_preferences', 'marketing_preferences', 'personal_data_preferences'].includes(key)) {
      // Validate JSON
      try {
        JSON.parse(value);
        setJsonErrors({ ...jsonErrors, [key]: null });
      } catch (e) {
        setJsonErrors({ ...jsonErrors, [key]: 'Invalid JSON format' });
      }
    }
  };

  const handleSubmit = async () => {
    // Final validation before submit
    const errors = {};
    ['notification_preferences', 'marketing_preferences', 'personal_data_preferences'].forEach((key) => {
      try {
        JSON.parse(settings[key]);
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
        settings: {
          notification_preferences: JSON.parse(settings.notification_preferences),
          marketing_preferences: JSON.parse(settings.marketing_preferences),
          personal_data_preferences: JSON.parse(settings.personal_data_preferences),
          language_preference: settings.language_preference,
        },
      };

      const response = await service.update(payload);

      if (response && response.result) {
        if (onUpdatedEntity) {
          onUpdatedEntity('update', payload.settings);
        }
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      if (onUpdatedEntity) {
        onUpdatedEntity('error', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    // Add more as needed
  ];

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
            Settings
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Preferences must be entered in valid JSON format.
          </Alert>

          <Stack spacing={3}>
            <TextField
              select
              fullWidth
              label="Language Preference"
              value={settings.language_preference}
              onChange={(e) => handleChange('language_preference', e.target.value)}
              size="small"
            >
              {languages.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Notification Preferences"
              value={settings.notification_preferences}
              onChange={(e) => handleChange('notification_preferences', e.target.value)}
              error={!!jsonErrors.notification_preferences}
              helperText={jsonErrors.notification_preferences || 'Configure notification settings.'}
              sx={{ fontFamily: 'monospace' }}
            />

            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Marketing Preferences"
              value={settings.marketing_preferences}
              onChange={(e) => handleChange('marketing_preferences', e.target.value)}
              error={!!jsonErrors.marketing_preferences}
              helperText={jsonErrors.marketing_preferences || 'Configure marketing communications.'}
              sx={{ fontFamily: 'monospace' }}
            />

            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Personal Data Preferences"
              value={settings.personal_data_preferences}
              onChange={(e) => handleChange('personal_data_preferences', e.target.value)}
              error={!!jsonErrors.personal_data_preferences}
              helperText={jsonErrors.personal_data_preferences || 'Data usage controls.'}
              sx={{ fontFamily: 'monospace' }}
            />
          </Stack>
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

export default UserSettingsEdit;
