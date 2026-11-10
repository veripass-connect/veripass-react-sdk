import BaseApi from '../../base/api.service';

export default class IdentityContractService extends BaseApi {
  constructor(args) {
    super(args);

    this.api_key = args?.apiKey || '';
    this.serviceEndpoints = {
      baseUrlProduction: process.env.VERIPASS_PRODUCTION_SERVICE_URL,
      baseUrlDevelopment: process.env.VERIPASS_DEVELOPMENT_SERVICE_URL,
      baseUrlLocal: process.env.VERIPASS_LOCAL_SERVICE_URL,
      get: '/identity/contract/',
      create: '/identity/contract/',
      update: '/identity/contract/',
      delete: '/identity/contract/',
      sign: '/identity/contract/sign',
      decline: '/identity/contract/decline',
    };
    this.settings = args?.settings || {};
  }

  async getByParameters(payload) {
    return super.getByParameters(payload, {
      endpoint: this.serviceEndpoints.get,
      ...this.settings,
    });
  }

  async getMine(payload = {}) {
    return this.getByParameters({ ...payload, queryselector: 'mine' });
  }

  async sign({ id, otp }) {
    return super.post({ id, otp }, { endpoint: this.serviceEndpoints.sign, ...this.settings });
  }

  async decline({ id }) {
    return super.post({ id }, { endpoint: this.serviceEndpoints.decline, ...this.settings });
  }

  async update(payload) {
    return super.update(payload, {
      endpoint: this.serviceEndpoints.update,
      ...this.settings,
    });
  }

  async create(payload) {
    return super.create(payload, {
      endpoint: this.serviceEndpoints.create,
      ...this.settings,
    });
  }

  async delete(payload) {
    return super.delete(payload, {
      endpoint: this.serviceEndpoints.delete,
      ...this.settings,
    });
  }
}
