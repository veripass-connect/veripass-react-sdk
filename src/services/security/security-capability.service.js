import BaseApi from '../base/api.service';

export default class SecurityCapabilityService extends BaseApi {
  constructor (args) {
    super(args);

    this.api_key = args?.apiKey || '';
    this.serviceEndpoints = {
      baseUrlProd: process.env.VERIPASS_SERVICE_URL,
      baseUrlDev: process.env.VERIPASS_DEV_SERVICE_URL,
      get: '/security/capability/',
      create: '/security/capability/',
      update: '/security/capability/',
      delete: '/security/capability/',
    };
  }

  async getByParameters (payload) {
    return super.getByParameters(payload, {
      endpoint: this.serviceEndpoints.get,
      ...this.settings
    });
  }

  async update (payload) {
    return super.update(payload, {
      endpoint: this.serviceEndpoints.update,
      ...this.settings
    });
  }

  async create (payload) {
    return super.create(payload, {
      endpoint: this.serviceEndpoints.create,
      ...this.settings
    });
  }

  async delete (payload) {
    return super.delete(payload, {
      endpoint: this.serviceEndpoints.delete,
      ...this.settings
    });
  }
}
