import BaseApi from '../base/api.service';

export default class UploadService extends BaseApi {
  constructor (args) {
    super(args);

    this.api_key = args?.apiKey || '';
    this.serviceEndpoints = {
      baseUrlProduction: process.env.VERIPASS_PRODUCTION_SERVICE_URL,
      baseUrlDevelopment: process.env.VERIPASS_DEVELOPMENT_SERVICE_URL,
      baseUrlLocal: process.env.VERIPASS_LOCAL_SERVICE_URL,
      post: '/storage/file/upload/single',
    };
    this.settings = args?.settings || {}
  }

  async post (payload) {
    return super.post(payload);
  }
}
