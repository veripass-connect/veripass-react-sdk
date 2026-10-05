import BaseApi from '../../base/api.service';

export default class OrganizationManagementService extends BaseApi {
  constructor(args) {
    super(args);

    this.api_key = args?.apiKey || '';
    this.serviceEndpoints = {
      baseUrlProduction: process.env.VERIPASS_PRODUCTION_SERVICE_URL,
      baseUrlDevelopment: process.env.VERIPASS_DEVELOPMENT_SERVICE_URL,
      baseUrlLocal: process.env.VERIPASS_LOCAL_SERVICE_URL,
      get: '/organization/management/',
      create: '/organization/management',
      update: '/organization/management',
      delete: '/organization/management',
    };
    this.settings = args?.settings || {};
  }

  async getByParameters(payload, { session = false } = {}) {
    return super.getByParameters(payload, {
      endpoint: this.serviceEndpoints.get,
      ...this.settings,
      session,
    });
  }

  async update(payload) {
    return super.update(payload, {
      endpoint: this.serviceEndpoints.update,
      ...this.settings,
    });
  }

  // With `session` the signed-in person creates the organization and becomes its administrator.
  async create(payload, { session = false } = {}) {
    return super.create(payload, {
      endpoint: this.serviceEndpoints.create,
      ...this.settings,
      session,
    });
  }

  async delete(payload) {
    return super.delete(payload, {
      endpoint: this.serviceEndpoints.delete,
      ...this.settings,
    });
  }
}
