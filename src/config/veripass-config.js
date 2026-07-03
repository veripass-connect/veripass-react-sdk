/**
 * Global SDK configuration (app-wide defaults).
 *
 * The SDK is MULTITENANT and deployment-agnostic: the consuming app supplies
 * its own backend base URL once, at boot, via `configureVeripass(...)`. Every
 * service — including the ones instantiated internally by the SDK's own auth
 * components, and every `new XxxService()` created without explicit config —
 * reads this default through `BaseApi.urlBuilder` when no per-instance
 * `baseUrl` is provided.
 *
 * This is the pre-bundled-SDK equivalent of the `import.meta.env.*` fallback
 * used by `@link-loom/cloud-sdk` (which is consumed as source). The SDK bakes
 * no tenant/client domain; the app provides the value from its own build-time
 * env (e.g. `import.meta.env.VITE_APP_SERVICE_VERIPASS_URL`).
 *
 * Security note: this is NOT a security boundary. The SDK is open source and
 * cannot gate destinations. The real anti-exfiltration / anti-MITM control is
 * the deployment's Content-Security-Policy (`connect-src`) + HTTPS/HSTS, plus
 * the transport hygiene applied in `BaseApi` (https-or-same-origin, no
 * embedded credentials).
 */

let globalConfig = {
  baseUrl: undefined,
  apiKey: undefined,
  environment: undefined,
};

let isConfigured = false;

/**
 * Set the SDK-wide defaults. Call once at app boot, before any service is
 * used. Only defined keys override the current config; last write wins, with
 * a warning if reconfigured (to surface accidental re-initialization).
 *
 * @param {Object} config
 * @param {string} [config.baseUrl] Tenant backend base URL (absolute https or
 *   same-origin relative prefix). Validated for transport safety at use time.
 * @param {string} [config.apiKey] Default API key for services.
 * @param {string} [config.environment] Fallback environment ('production' |
 *   'development' | 'local') used only when no baseUrl is resolvable.
 * @returns {Object} The resulting global config (read-only copy).
 */
export function configureVeripass(config = {}) {
  if (isConfigured) {
    console.warn(
      '[veripass-sdk] configureVeripass() called more than once; the latest configuration overrides the previous one.',
    );
  }

  const next = { ...globalConfig };
  if (config.baseUrl !== undefined) next.baseUrl = config.baseUrl;
  if (config.apiKey !== undefined) next.apiKey = config.apiKey;
  if (config.environment !== undefined) next.environment = config.environment;

  globalConfig = next;
  isConfigured = true;

  return { ...globalConfig };
}

/**
 * Read the current SDK-wide defaults. Returns a copy so callers cannot mutate
 * the internal state directly.
 *
 * @returns {{ baseUrl: string|undefined, apiKey: string|undefined, environment: string|undefined }}
 */
export function getVeripassConfig() {
  return { ...globalConfig };
}

/**
 * Test-only helper: reset the global config so unit tests start clean.
 * Not part of the public contract.
 */
export function __resetVeripassConfigForTesting() {
  globalConfig = { baseUrl: undefined, apiKey: undefined, environment: undefined };
  isConfigured = false;
}
