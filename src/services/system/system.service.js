import BaseApi from '../base/api.service';

export default class SystemService extends BaseApi {
  constructor(args) {
    super(args);

    this.api_key = args?.apiKey || '';
    this.service_uri = {
      baseUrlProd: process.env.VERIPASS_SERVICE_URL,
      baseUrlDev: process.env.VERIPASS_DEV_SERVICE_URL,
      status: '/status',
    };
    this.settings = args?.settings || {}
  }

  async getStatus(payload) {
    return super.get(payload, this.service_uri.status);
  }
}
