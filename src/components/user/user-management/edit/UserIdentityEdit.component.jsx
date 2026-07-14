import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  IconButton,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { UserManagementService } from '@services';
import styled from 'styled-components';

// Helper for Layout
const Container = styled.div`
  width: 100%;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const getEntryDisplayValue = (entry) => {
  if (!entry) return '';
  if (typeof entry === 'string') return entry;
  if (typeof entry === 'object') {
    // Handle phone object structure
    if (entry.country?.dial_code && entry.phone_number) {
      return `+${entry.country.dial_code} ${entry.phone_number}`;
    }
    // Fallback for other objects or if structure differs
    return entry.entry || JSON.stringify(entry);
  }
  return '';
};

const FieldList = ({ title, items, onItemChange, onItemAdd, onItemRemove, type = 'text', placeholder = '' }) => {
  return (
    <Section>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {items.map((item, index) => (
        <Row key={index}>
          <TextField
            fullWidth
            label={`${title} ${index + 1}`}
            value={getEntryDisplayValue(item.entry)}
            onChange={(e) => onItemChange(index, 'entry', e.target.value)}
            placeholder={placeholder}
            size="small"
          />
          <FormControl size="small" style={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={item.is_primary ? 'primary' : 'secondary'}
              label="Type"
              onChange={(e) => onItemChange(index, 'is_primary', e.target.value === 'primary')}
            >
              <MenuItem value="primary">Primary</MenuItem>
              <MenuItem value="secondary">Secondary</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={() => onItemRemove(index)} color="error">
            <DeleteIcon />
          </IconButton>
        </Row>
      ))}
      <Button startIcon={<AddIcon />} onClick={onItemAdd} variant="outlined" size="small">
        Add {title}
      </Button>
    </Section>
  );
};

const UserIdentityEdit = ({ entity, entityId, fullEntity, onUpdatedEntity, apiKey = '', environment = 'production' }) => {
  const [contactData, setContactData] = useState({
    email_addresses: [],
    phone_numbers: [],
    web3_wallets: [],
    social_media_profiles: [],
    gaming_usernames: [],
    personal_websites: [],
    online_marketplace_usernames: [],
    professional_portfolios: [],
    addresses: [], // Not implemented fully yet as per mock but structure is there
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (entity) {
      setContactData({
        email_addresses: entity.email_addresses || [],
        phone_numbers: entity.phone_numbers || [],
        web3_wallets: entity.web3_wallets || [],
        social_media_profiles: entity.social_media_profiles || [],
        gaming_usernames: entity.gaming_usernames || [],
        personal_websites: entity.personal_websites || [],
        online_marketplace_usernames: entity.online_marketplace_usernames || [],
        professional_portfolios: entity.professional_portfolios || [],
        addresses: entity.addresses || [],
      });
    }
  }, [entity]);

  const handleItemChange = (field, index, key, value) => {
    const newItems = [...contactData[field]];
    let newValue = value;

    // Custom logic to preserve object structure for phone numbers
    if (field === 'phone_numbers' && key === 'entry') {
      // Check if previous value was an object to maintain consistency
      // Or just always try to parse if it looks like a phone number
      // Simple parser: "+Code Number"
      const phoneRegex = /^\+(\d+)\s+(.+)$/;
      const match = value.match(phoneRegex);

      if (match) {
        // Reconstruct object
        // Keep the full string representation? Or remove?
        // The issue description says: "load... as [object Object]".
        // ...

        const currentItemEntry = newItems[index].entry;
        const originalCountry = typeof currentItemEntry === 'object' ? currentItemEntry.country : {};

        newValue = {
          entry: value,
          country: {
            ...originalCountry,
            dial_code: match[1],
          },
          phone_number: match[2],
          international_phone_number: value, // Optional, often useful
        };
      }
      // If doesn't match regex, we might just leave it as string (user editing freely)
      // or we try to keep it as object if it was object?
      // If it was object and user clears it, it becomes string.
    }

    newItems[index] = { ...newItems[index], [key]: newValue };

    // Ensure only one primary
    if (key === 'is_primary' && value === true) {
      newItems.forEach((item, i) => {
        if (i !== index) item.is_primary = false;
      });
    }

    setContactData({ ...contactData, [field]: newItems });
  };

  const handleItemAdd = (field) => {
    setContactData({
      ...contactData,
      [field]: [...contactData[field], { entry: '', is_primary: false }],
    });
  };

  const handleItemRemove = (field, index) => {
    const newItems = contactData[field].filter((_, i) => i !== index);
    setContactData({ ...contactData, [field]: newItems });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const service = new UserManagementService({ apiKey, settings: { environment } });
      const payload = {
        ...fullEntity,
        id: entityId, // Ensure ID is correct
        contact: contactData,
      };

      const response = await service.update(payload);

      if (response && response.result) {
        if (onUpdatedEntity) {
          onUpdatedEntity('update', contactData); // Update local parent state with just the contact data or full user?
          // Usually we might want to refresh the full user or just the part.
          // UserIdentityManager expects 'update' action and payload as the new state for that section.
        }
      }
    } catch (error) {
      console.error('Error updating identity:', error);
      if (onUpdatedEntity) {
        onUpdatedEntity('error', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reworking handleSubmit to actually call the service:
  // We need 'id' of the user.
  // We need to emit the updated entity back.

  // I'll make this a presentational component that calls an update function?
  // Or does it do the work?
  // VeripassUserQuickStandardEdit does the work.

  return (
    <Container>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <FieldList
          title="Email Addresses"
          items={contactData.email_addresses}
          onItemChange={(i, k, v) => handleItemChange('email_addresses', i, k, v)}
          onItemAdd={() => handleItemAdd('email_addresses')}
          onItemRemove={(i) => handleItemRemove('email_addresses', i)}
          placeholder="example@domain.com"
        />

        <Divider sx={{ my: 2 }} />

        <FieldList
          title="Phone Numbers"
          items={contactData.phone_numbers}
          onItemChange={(i, k, v) => handleItemChange('phone_numbers', i, k, v)}
          onItemAdd={() => handleItemAdd('phone_numbers')}
          onItemRemove={(i) => handleItemRemove('phone_numbers', i)}
          placeholder="+1 234 567 8900"
        />

        <Divider sx={{ my: 2 }} />

        <FieldList
          title="Social Media"
          items={contactData.social_media_profiles}
          onItemChange={(i, k, v) => handleItemChange('social_media_profiles', i, k, v)}
          onItemAdd={() => handleItemAdd('social_media_profiles')}
          onItemRemove={(i) => handleItemRemove('social_media_profiles', i)}
          placeholder="https://twitter.com/username"
        />

        <Divider sx={{ my: 2 }} />

        <FieldList
          title="Web3 Wallets"
          items={contactData.web3_wallets}
          onItemChange={(i, k, v) => handleItemChange('web3_wallets', i, k, v)}
          onItemAdd={() => handleItemAdd('web3_wallets')}
          onItemRemove={(i) => handleItemRemove('web3_wallets', i)}
          placeholder="0x..."
        />

        <Divider sx={{ my: 2 }} />

        <FieldList
          title="Gaming Usernames"
          items={contactData.gaming_usernames}
          onItemChange={(i, k, v) => handleItemChange('gaming_usernames', i, k, v)}
          onItemAdd={() => handleItemAdd('gaming_usernames')}
          onItemRemove={(i) => handleItemRemove('gaming_usernames', i)}
          placeholder="Gamertag"
        />

        <Divider sx={{ my: 2 }} />

        <FieldList
          title="Personal Websites"
          items={contactData.personal_websites}
          onItemChange={(i, k, v) => handleItemChange('personal_websites', i, k, v)}
          onItemAdd={() => handleItemAdd('personal_websites')}
          onItemRemove={(i) => handleItemRemove('personal_websites', i)}
          placeholder="https://mysite.com"
        />

        <Divider sx={{ my: 2 }} />

        <FieldList
          title="Online Marketplace Usernames"
          items={contactData.online_marketplace_usernames}
          onItemChange={(i, k, v) => handleItemChange('online_marketplace_usernames', i, k, v)}
          onItemAdd={() => handleItemAdd('online_marketplace_usernames')}
          onItemRemove={(i) => handleItemRemove('online_marketplace_usernames', i)}
          placeholder="Username"
        />

        <Divider sx={{ my: 2 }} />

        <FieldList
          title="Professional Portfolios"
          items={contactData.professional_portfolios}
          onItemChange={(i, k, v) => handleItemChange('professional_portfolios', i, k, v)}
          onItemAdd={() => handleItemAdd('professional_portfolios')}
          onItemRemove={(i) => handleItemRemove('professional_portfolios', i)}
          placeholder="https://portfolio.com"
        />

        <Divider sx={{ my: 2 }} />

        <FieldList
          title="Addresses"
          items={contactData.addresses}
          onItemChange={(i, k, v) => handleItemChange('addresses', i, k, v)}
          onItemAdd={() => handleItemAdd('addresses')}
          onItemRemove={(i) => handleItemRemove('addresses', i)}
          placeholder="Full Address"
        />

        <section className="row mt-4">
          <div className="col-12 d-flex justify-content-end">
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
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

export default UserIdentityEdit;
