import BaseApi from '../../base/api.service';

export default class TenancyProvisioningService extends BaseApi {
  constructor(args) {
    super(args);

    this.api_key = args?.apiKey || '';
    this.serviceEndpoints = {
      baseUrlProduction: process.env.VERIPASS_PRODUCTION_SERVICE_URL,
      baseUrlDevelopment: process.env.VERIPASS_DEVELOPMENT_SERVICE_URL,
      baseUrlLocal: process.env.VERIPASS_LOCAL_SERVICE_URL,
      provisionWorkspace: '/tenancy/provisioning',
      joinHost: '/tenancy/provisioning/join-host',
    };
    this.settings = args?.settings || {};
  }

  async provisionWorkspace(payload) {
    return super.create(payload, {
      endpoint: this.serviceEndpoints.provisionWorkspace,
      ...this.settings,
    });
  }

  async joinHost(payload) {
    return super.create(payload, {
      endpoint: this.serviceEndpoints.joinHost,
      ...this.settings,
    });
  }
}
