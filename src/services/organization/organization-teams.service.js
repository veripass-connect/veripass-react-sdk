import BaseApi from '../base/api.service';

export default class OrganizationTeamsService extends BaseApi {
  constructor (args) {
    super(args);

    this.api_key = args?.apiKey || '';
    this.serviceEndpoints = {
      baseUrlProd: process.env.VERIPASS_SERVICE_URL,
      baseUrlDev: process.env.VERIPASS_DEV_SERVICE_URL,
      get: '/organization/team/',
      create: '/organization/team',
      update: '/organization/team',
    };
    this.settings = args?.settings || {}
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
}
