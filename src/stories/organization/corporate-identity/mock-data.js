export const MOCK_ORGANIZATION_VERIFIED = {
  id: 'org-001',
  identity: 'org-fgn-7729bc207343671',
  organization_profile: {
    slug: 'fiscalia-general-de-la-nacion',
    display_name: 'Fiscalia General de la Nacion',
    logo_url: '',
    primary_national_id: {
      type: 'NIT',
      identification: '800.123.456-7',
      issuing_country: {
        iso_code: 'CO',
        country_name: 'Colombia',
      },
    },
    primary_email_address: 'contacto@fiscalia.gov.co',
    primary_phone_number: {
      country: { iso_code: 'CO', dial_code: '57', name: 'Colombia' },
      international_phone_number: '+57 601 5702000',
      phone_number: '6015702000',
    },
    primary_address: {
      formatted_address: 'Diagonal 22B No. 52-01, Bogota D.C., Colombia',
      address_line_1: 'Diagonal 22B No. 52-01',
      city: 'Bogota D.C.',
      country: 'Colombia',
      country_code: 'CO',
    },
    is_verified: true,
    profile_ui_settings: {
      cover_picture_url: '',
      profile_picture_url: '',
      brand_colors: {
        primary: '#1e1b3a',
        accent: '#0d9488',
        surface: '#f1f5f9',
      },
    },
  },
  organization_information: {
    description: 'Attorney General of Colombia',
    website_url: 'https://www.fiscalia.gov.co',
    industry: 'Government',
    size: 'Large',
    founded_year: '1991',
    headquarters: { country: 'Colombia', city: 'Bogota D.C.' },
  },
  status: { title: 'Active' },
  modified: { at: '2023-10-24T16:00:00Z', by: { display_name: 'Admin User' } },
};

export const MOCK_ORGANIZATION_UNVERIFIED = {
  id: 'org-002',
  identity: 'org-gsc-982341x',
  organization_profile: {
    slug: 'global-synergy-corp',
    display_name: 'Global Synergy Corp',
    logo_url: '',
    primary_national_id: {
      type: 'EIN',
      identification: 'US-DEL-982341-X',
      issuing_country: { iso_code: 'US', country_name: 'United States' },
    },
    primary_email_address: '',
    primary_phone_number: {},
    primary_address: {},
    is_verified: false,
    profile_ui_settings: {},
  },
  organization_information: {
    description: 'Enterprise Infrastructure Solutions',
    website_url: 'https://globalsynergy.com',
    industry: 'Technology Services',
    size: 'Medium',
    founded_year: '2012',
    headquarters: { country: 'United States', city: 'New York, NY' },
  },
  status: { title: 'Active' },
};

export const MOCK_ORGANIZATION_EMPTY = {
  id: 'org-003',
  identity: 'org-new-000000',
  organization_profile: {
    slug: 'new-organization',
    display_name: 'New Organization',
    is_verified: false,
    profile_ui_settings: {},
  },
  status: { title: 'Active' },
};
