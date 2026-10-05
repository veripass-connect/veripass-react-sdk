/**
 * Connection of the last successful sign-in: where Veripass lives and which host api-key was used.
 *
 * The sign-in components receive `apiKey` / `environment` from the host app. Components that run later
 * (the organization switcher, the create-organization form) must talk to the same Veripass with the same
 * key, and the host should not have to wire any of that again, so the sign-in service remembers it here.
 *
 * Only a few bytes are stored, in their own key and apart from the session. The api-key is not a secret:
 * it already ships in every host's bundle. Reading and writing never throws (storage can be blocked).
 */
const CONNECTION_STORAGE_KEY = 'veripass::auth::connection';
const SESSION_STORAGE_KEY = 'veripass::auth::user-data';

export function saveVeripassConnection({ baseUrl, apiKey, environment }) {
  try {
    window.localStorage.setItem(CONNECTION_STORAGE_KEY, JSON.stringify({ baseUrl, apiKey, environment }));
  } catch (error) {
    console.warn('[veripass-sdk] Could not remember the sign-in connection.', error);
  }
}

export function readVeripassConnection() {
  try {
    const stored = window.localStorage.getItem(CONNECTION_STORAGE_KEY);

    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    return {};
  }
}

export function clearVeripassConnection() {
  try {
    window.localStorage.removeItem(CONNECTION_STORAGE_KEY);
  } catch (error) {
    console.warn('[veripass-sdk] Could not clear the sign-in connection.', error);
  }
}

/**
 * Bearer token of the persisted session, for calls that act on behalf of the signed-in person.
 */
export function readVeripassSessionToken() {
  try {
    const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);

    return stored ? JSON.parse(stored)?.token || null : null;
  } catch (error) {
    return null;
  }
}
