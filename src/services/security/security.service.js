import BaseApi from '../base/api.service';

export default class SecurityService extends BaseApi {
  constructor (args) {
    super(args);

    this.api_key = args?.apiKey || '';
    this.serviceEndpoints = {
      baseUrlProd: process.env.VERIPASS_SERVICE_URL,
      signUpWithPassword: '/security/signup/standard',
      signInStandard: '/security/signin/standard',
      emailRecoverPassword: '/security/password/reset/standard',
      update: '/security/password/new/standard',
      logout: '/security/logout',
    };
    this.settings = args?.settings || {}
  }

  async signUpWithPassword (payload) {
    return super.post(payload, {
      endpoint: this.serviceEndpoints.signUpWithPassword,
      settings: this.settings
    });
  }

  async signInStandard (payload) {
    return super.post(payload, {
      endpoint: this.serviceEndpoints.signInStandard,
      settings: this.settings
    });
  }

  async logout (payload) {
    return super.post(payload, {
      endpoint: this.serviceEndpoints.logout,
      settings: this.settings
    });
  }

  async emailRecoverPassword (payload) {
    return super.post(payload, {
      endpoint: this.serviceEndpoints.emailRecoverPassword,
      settings: this.settings
    });
  }

  async newPassword (payload) {
    return super.update(payload);
  }
}
