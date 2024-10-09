import BaseApi from '../base/api.service';

export default class UserProfileService extends BaseApi {
  constructor (args) {
    super(args);

    this.api_key = args?.apiKey || '';
    this.serviceEndpoints = {
      baseUrlProd: process.env.VERIPASS_SERVICE_URL,
      baseUrlDev: process.env.VERIPASS_DEV_SERVICE_URL,
      get: '/user/identity/',
      create: '/user/identity',
      update: '/user/identity',
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
}
