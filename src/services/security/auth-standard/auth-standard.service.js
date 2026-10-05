import BaseApi from '../../base/api.service';
import { saveVeripassConnection } from '../../../config/veripass-connection';

export default class AuthStandardService extends BaseApi {
  constructor(args) {
    super(args);

    this.api_key = args?.apiKey || '';
    this.serviceEndpoints = {
      baseUrlProduction: process.env.VERIPASS_PRODUCTION_SERVICE_URL,
      baseUrlDevelopment: process.env.VERIPASS_DEVELOPMENT_SERVICE_URL,
      baseUrlLocal: process.env.VERIPASS_LOCAL_SERVICE_URL,
      signUpStandard: '/security/signup/standard',
      signInStandard: '/security/signin/standard',
      switchContext: '/security/auth/switch-context',
      registerApp: '/security/auth/register-app',
      joinOrganization: '/security/auth/join-organization',
      emailRecoverPassword: '/security/password/reset/standard',
      update: '/security/password/new/standard',
      logout: '/security/logout',
    };
    this.settings = args?.settings || {};
  }

  // Self-service: grant the minimum-privilege member role for the api-key's app to an already
  // established identity (the needs_app_registration path). Body: { identity: <user_id> }.
  async registerApp(payload) {
    return super.post(payload, {
      endpoint: this.serviceEndpoints.registerApp,
      ...this.settings,
    });
  }

  // Self-service: grant baseline membership in the api-key's organization for an established identity
  // (the needs_organization_join path). Body: { identity: <user_id>, organization_id? }.
  async joinOrganization(payload) {
    return super.post(payload, {
      endpoint: this.serviceEndpoints.joinOrganization,
      ...this.settings,
    });
  }

  async signUpStandard(payload) {
    return super.post(payload, {
      endpoint: this.serviceEndpoints.signUpStandard,
      ...this.settings,
    });
  }

  async signInStandard(payload) {
    const response = await super.post(payload, {
      endpoint: this.serviceEndpoints.signInStandard,
      ...this.settings,
    });

    if (response?.result?.token) {
      saveVeripassConnection({
        baseUrl: this.resolveBaseUrl(),
        apiKey: this.api_key,
        environment: this.settings?.environment,
      });
    }

    return response;
  }

  // Acts on behalf of the signed-in person (Bearer token + the host api-key remembered at sign-in).
  async switchContext(payload) {
    return super.post(payload, {
      endpoint: this.serviceEndpoints.switchContext,
      ...this.settings,
      session: true,
    });
  }

  async logout(payload) {
    return super.post(payload, {
      endpoint: this.serviceEndpoints.logout,
      ...this.settings,
    });
  }

  async emailRecoverPassword(payload) {
    return super.post(payload, {
      endpoint: this.serviceEndpoints.emailRecoverPassword,
      ...this.settings,
    });
  }

  async newPassword(payload) {
    return super.update(payload, {
      endpoint: this.serviceEndpoints.update,
      ...this.settings,
    });
  }
}
