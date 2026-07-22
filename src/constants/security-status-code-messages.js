export const SECURITY_STATUS_CODE_MESSAGES = {
  461: 'The data provided does not match any registered application',
  462: 'Unauthorized user. After 3 failed attempts, your account will be locked for 24 hours.',
  463: 'The user is not registered in this application, needs to register',
  464: 'Unauthorized. After 3 failed attempts, your account will be locked for 24 hours.',
  465: 'API key is missing or invalid',
  466: 'You are not a member of this organization yet — join to continue.',
  467: 'You are not registered in this application yet — register to continue.',
  502: 'The authentication provider could not complete the request.',
  551: 'The provided user is already registered',
  401: 'Error authenticating',
};

/**
 * Reason name -> status code. Mirrors the `name` field of the backend security status catalog,
 * so a redirect that carries `reason=<name>` (the federated callback cannot carry an HTTP status)
 * resolves to the same message a direct JSON response would produce.
 */
export const SECURITY_REASON_CODES = {
  ok: 200,
  no_api_key: 465,
  no_user: 461,
  bad_credential: 464,
  token_error: 401,
  needs_organization_join: 466,
  needs_app_registration: 467,
  user_already_registered: 551,
  provider_error: 502,
};

/**
 * Backend authorization decisions (mirrors the AuthorizationDecision types). Hosts branch on
 * these to route: enter / onboarding manager / app registration / re-authenticate.
 */
export const AUTH_DECISIONS = {
  ALLOW: 'allow',
  NEEDS_ORGANIZATION_JOIN: 'needs_organization_join',
  NEEDS_APP_REGISTRATION: 'needs_app_registration',
  DENY: 'deny',
};
