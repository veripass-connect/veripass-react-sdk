import BaseApi from '../base/api.service';

export default class UploadService extends BaseApi {
  constructor (args) {
    super(args);

    this.api_key = args?.apiKey || '';
    this.serviceEndpoints = {
      baseUrlProd: process.env.VERIPASS_SERVICE_URL,
      baseUrlDev: process.env.VERIPASS_DEV_SERVICE_URL,
      post: '/file/upload/single',
    };
  }

  async post (payload) {
    return super.post(payload);
  }
}
