import BaseApi from '../../base/api.service';

export default class AuthEntraService extends BaseApi {
  constructor(args) {
    super(args);

    this.api_key = args?.apiKey || '';
    this.serviceEndpoints = {
      baseUrlProduction: process.env.VERIPASS_PRODUCTION_SERVICE_URL,
      baseUrlDevelopment: process.env.VERIPASS_DEVELOPMENT_SERVICE_URL,
      baseUrlLocal: process.env.VERIPASS_LOCAL_SERVICE_URL,
      getAuthOptions: '/security/auth/options/',
      initiateAuthorize: '/security/auth/entra/authorize',
    };
    this.settings = args?.settings || {};
  }

  async getAuthOptions({ queryselector = 'organization', search = '' } = {}) {
    const params = search ? { search } : {};
    return super.getByParameters(
      { queryselector, ...params },
      {
        endpoint: this.serviceEndpoints.getAuthOptions,
        ...this.settings,
      },
    );
  }

  async initiateAuthorize(payload) {
    return super.post(payload, {
      endpoint: this.serviceEndpoints.initiateAuthorize,
      ...this.settings,
    });
  }
}
