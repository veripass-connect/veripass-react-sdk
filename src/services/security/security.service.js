import BaseApi from '../base/api.service';

export default class SecurityService extends BaseApi {
  constructor (args) {
    super(args);

    this.api_key = args?.apiKey || '';
    this.serviceEndpoints = {
      baseUrlProd: process.env.VERIPASS_SERVICE_URL,
      baseUrlDev: process.env.VERIPASS_DEV_SERVICE_URL,
      signUpWithStandard: '/security/signup/standard',
      signInStandard: '/security/signin/standard',
      emailRecoverPassword: '/security/password/reset/standard',
      update: '/security/password/new/standard',
      logout: '/security/logout',
    };
    this.settings = args?.settings || {}
  }

  async signUpWithStandard (payload) {
    return super.post(payload, {
      endpoint: this.serviceEndpoints.signUpWithStandard,
      ...this.settings
    });
  }

  async signInStandard (payload) {
    return super.post(payload, {
      endpoint: this.serviceEndpoints.signInStandard,
      ...this.settings
    });
  }

  async logout (payload) {
    return super.post(payload, {
      endpoint: this.serviceEndpoints.logout,
      ...this.settings
    });
  }

  async emailRecoverPassword (payload) {
    return super.post(payload, {
      endpoint: this.serviceEndpoints.emailRecoverPassword,
      ...this.settings
    });
  }

  async newPassword (payload) {
    return super.update(payload, {
      endpoint: this.serviceEndpoints.update,
      ...this.settings
    });
  }
}
