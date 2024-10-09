import BaseApi from '../base/api.service';

export default class TeamManagementService extends BaseApi {
  constructor (args) {
    super(args);

    this.api_key = args?.apiKey || '';
    this.serviceEndpoints = {
      baseUrlProd: process.env.VERIPASS_SERVICE_URL,
      baseUrlDev: process.env.VERIPASS_DEV_SERVICE_URL,
      get: '/team/management/',
      create: '/team/management',
      update: '/team/management',
      delete: '/team/management',
    };
  }

  async getByParameters (data) {
    return super.getByParameters(data);
  }

  async update (data) {
    return super.update(data);
  }

  async create (data) {
    return super.create(data);
  }

  async delete (data) {
    return super.delete(data);
  }
}
