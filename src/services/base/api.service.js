import axios from 'axios';
import { getVeripassConfig } from '../../config/veripass-config';

/**
 * Base-URL transport hygiene for the SDK's outbound requests.
 *
 * The SDK is MULTITENANT and deployment-agnostic: the consuming app supplies
 * its own backend base URL (per instance via `settings.baseUrl`, or app-wide
 * via `configureVeripass(...)`), typically from its own build-time env. The
 * SDK bakes NO tenant/client domain and knows nothing about nginx, proxies or
 * any particular deployment.
 *
 * This is HYGIENE, not a security boundary (the SDK is open source and cannot
 * gate destinations — that is the deployment's CSP `connect-src` + HTTPS job).
 * A supplied base URL is accepted when it is transport-safe:
 *   - an ABSOLUTE https URL (any host — multitenant), or http only for
 *     localhost / 127.0.0.1 in dev; with no embedded credentials
 *     (`user:pass@host` is rejected); OR
 *   - a SAME-ORIGIN relative prefix (starts with a single `/`, not `//` or
 *     `/\`) — safe by construction, since the browser resolves it against the
 *     current origin and it can never leave it. This is what enables a
 *     deployment to front the backend with a same-origin proxy without the
 *     SDK having to know about it.
 *
 * Absolute-URL validation uses the URL parser (never string matching), so
 * confusion attacks such as `https://api.tenant.com@evil.com` resolve to host
 * `evil.com` and are handled correctly.
 *
 * Returns a normalized, trailing-slash-free base URL, or null if the value is
 * not transport-safe (caller then falls back to the next precedence level).
 *
 * @param {string} candidate The requested base URL.
 * @returns {string|null}
 */
function sanitizeBaseUrl(candidate) {
  if (!candidate || typeof candidate !== 'string') {
    return null;
  }

  const trimmed = candidate.trim();
  if (!trimmed) {
    return null;
  }

  // Same-origin relative prefix: single leading slash, not protocol-relative
  // (`//host`) and not a backslash trick (`/\host`). Safe by construction.
  if (trimmed.startsWith('/')) {
    if (trimmed[1] === '/' || trimmed[1] === '\\') {
      return null;
    }
    return trimmed.replace(/\/+$/, '');
  }

  // Otherwise require a well-formed ABSOLUTE URL.
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch (error) {
    return null;
  }

  // Reject smuggled credentials (`https://user:pass@host`).
  if (parsed.username || parsed.password) {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  const isLoopback = host === 'localhost' || host === '127.0.0.1';

  // Enforce HTTPS to prevent downgrade/MITM; permit http only on loopback.
  if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && isLoopback)) {
    return null;
  }

  // Normalize to origin + path (drops query/hash) and strip trailing slashes
  // so `${base}${endpoint}` never doubles the separator.
  return `${parsed.origin}${parsed.pathname}`.replace(/\/+$/, '');
}

export default class BaseApi {
  constructor() {
    this.api_key = null;
    this.client = null;
    this.serviceEndpoints = {
      baseUrlProduction: process.env.VERIPASS_PRODUCTION_SERVICE_URL,
      baseUrlDevelopment: process.env.VERIPASS_DEVELOPMENT_SERVICE_URL,
      baseUrlLocal: process.env.VERIPASS_LOCAL_SERVICE_URL,
      get: '',
      create: '',
      update: '',
      delete: '',
      patch: '',
      put: '',
    };
    this.settings = {};
  }

  /**
   * Initializes and returns an Axios client instance with the necessary headers and configurations.
   *
   * @param {Object} settings Optional settings to override instance defaults during the request.
   * @returns {Object} Axios client instance.
   */
  request(settings = null) {
    let headers = {
      Accept: 'application/json',
    };

    if (this.api_key) {
      headers['api-key'] = this.api_key;
    }

    const mergedSettings = { ...this.settings, ...settings };

    this.client = axios.create({
      baseURL: this.api_url,
      timeout: mergedSettings?.timeout || 31000,
      headers: headers,
    });

    return this.client;
  }

  /**
   * Resolves the baked base URL for the current environment. This is the
   * FROZEN value selected at SDK build time and is always safe.
   */
  resolveEnvironmentBaseUrl() {
    const environment = this.settings?.environment || 'production';

    switch (environment) {
      case 'local':
        return this.serviceEndpoints.baseUrlLocal;
      case 'development':
        return this.serviceEndpoints.baseUrlDevelopment;
      case 'production':
      default:
        return this.serviceEndpoints.baseUrlProduction;
    }
  }

  /**
   * Resolves the effective base URL with a single precedence order:
   *   1. per-instance `settings.baseUrl` (same place as `settings.environment`),
   *   2. app-wide default set via `configureVeripass({ baseUrl })`,
   *   3. the environment-baked URL (backward-compatible fallback).
   * Each candidate must pass transport hygiene; an unsafe value is skipped
   * (with a warning) and the next level is tried. This runs for EVERY service
   * — including the ones instantiated internally by auth components and every
   * `new XxxService()` created without explicit config (which resolve via the
   * app-wide default).
   */
  resolveBaseUrl() {
    const candidates = [
      { source: 'settings.baseUrl', value: this.settings?.baseUrl },
      { source: 'configureVeripass', value: getVeripassConfig().baseUrl },
    ];

    for (const candidate of candidates) {
      if (candidate.value === undefined || candidate.value === null || candidate.value === '') {
        continue;
      }

      const safeBaseUrl = sanitizeBaseUrl(candidate.value);
      if (safeBaseUrl !== null) {
        return safeBaseUrl;
      }

      console.error(
        `[veripass-sdk] Ignored unsafe baseUrl from ${candidate.source} ("${candidate.value}"). ` +
          `Expected an absolute https URL (no embedded credentials) or a same-origin relative prefix. ` +
          `Trying the next configured source.`,
      );
    }

    return this.resolveEnvironmentBaseUrl();
  }

  urlBuilder({ endpoint }) {
    return `${this.resolveBaseUrl()}${endpoint}`;
  }

  /**
   * Serializes a nested object into a query string format.
   *
   * @param {Object} obj The object to be serialized.
   * @param {string} [prefix] Prefix for nested properties in the object.
   * @returns {string} Serialized query string.
   */
  serializerOjectToQueryString(obj, prefix) {
    if (obj && typeof obj === 'object') {
      const serializedArr = [];
      let key = {};

      for (key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const k = prefix ? prefix + '[' + key + ']' : key;
          const value = obj[key] || null;
          serializedArr.push(
            value !== null && typeof value === 'object'
              ? this.serializerOjectToQueryString(value, k)
              : encodeURIComponent(k) + '=' + encodeURIComponent(value),
          );
        }
      }
      return serializedArr.join('&');
    }
  }

  /**
   * Converts an object into a query string format.
   *
   * @param {Object} obj The object to be converted.
   * @returns {string} Query string starting with '?' or an empty string if the object is not valid.
   */
  objectToQueryString(obj) {
    if (obj && typeof obj === 'object') {
      const result = this.serializerOjectToQueryString(obj);
      return `?${result}`;
    } else {
      return '';
    }
  }

  /**
   * Execute a query to filter by parameters
   * @param {Object} payload Provides all information to get an entity by parameters
   * @param {string} payload.queryselector Is the selector of filter
   * @param {*} settings Configuration settings for the request
   * @returns an object to be processed
   */
  async getByParameters(payload, settings) {
    try {
      if (!payload) {
        return null;
      }

      if (!payload.queryselector) {
        console.error('Provide a query selector to query');
        return null;
      }

      const parameters = this.objectToQueryString(payload);
      const endpoint = this.urlBuilder({ endpoint: settings?.endpoint || this.serviceEndpoints.get });
      const url = `${endpoint}${payload.queryselector}${parameters}`;

      const result = await this.request(settings).get(url);

      return result.data;
    } catch (error) {
      console.error(error);
      return error?.body;
    }
  }

  /**
   * Execute a create query into backend service
   * @param {*} payload
   * @param {*} settings Configuration settings for the request
   * @returns
   */
  async create(payload, settings) {
    try {
      if (!payload) {
        return null;
      }

      const endpoint = this.urlBuilder({ endpoint: settings?.endpoint || this.serviceEndpoints.create });
      const result = await this.request(settings).post(endpoint, payload);

      return result.data;
    } catch (error) {
      console.error(error);
      if (error.code === 'ECONNABORTED' || (error.message && error.message.toLowerCase().includes('timeout'))) {
        return {
          success: false,
          isTimeout: true,
          message: 'The request took too long to complete (timeout).',
          code: error.code || 'ECONNABORTED',
        };
      }
      return error?.response?.data || null;
    }
  }

  /**
   * Execute an update query into backend service
   * @param {*} payload
   * @param {*} settings Configuration settings for the request
   * @returns
   */
  async update(payload, settings) {
    try {
      if (!payload) {
        return null;
      }

      const endpoint = this.urlBuilder({ endpoint: settings?.endpoint || this.serviceEndpoints.update });
      const result = await this.request(settings).patch(endpoint, payload);

      return result.data;
    } catch (error) {
      console.error(error);
      if (error.code === 'ECONNABORTED' || (error.message && error.message.toLowerCase().includes('timeout'))) {
        return {
          success: false,
          isTimeout: true,
          message: 'The request took too long to complete (timeout).',
          code: error.code || 'ECONNABORTED',
        };
      }
      return error?.body;
    }
  }

  /**
   * Execute a delete query into backend service
   * @param {*} payload
   * @param {*} settings Configuration settings for the request
   * @returns
   */
  async delete(payload, settings) {
    try {
      if (!payload) {
        return null;
      }

      const endpoint = this.urlBuilder({ endpoint: settings?.endpoint || this.serviceEndpoints.delete });
      const result = await this.request(settings).delete(endpoint, {
        data: payload,
      });

      return result.data;
    } catch (error) {
      console.error(error);
      if (error.code === 'ECONNABORTED' || (error.message && error.message.toLowerCase().includes('timeout'))) {
        return {
          success: false,
          isTimeout: true,
          message: 'The request took too long to complete (timeout).',
          code: error.code || 'ECONNABORTED',
        };
      }
      return error?.body;
    }
  }

  /**
   * Execute a post query
   * @param {*} payload Define what data need to be posted
   * @param {*} settings Configuration settings for the request
   * @returns
   */
  async post(payload, settings) {
    try {
      if (!payload) {
        return null;
      }

      const endpoint = this.urlBuilder({ endpoint: settings?.endpoint || this.serviceEndpoints.post });
      const result = await this.request(settings).post(endpoint, payload);

      return result.data;
    } catch (error) {
      console.error(error);
      if (error.code === 'ECONNABORTED' || (error.message && error.message.toLowerCase().includes('timeout'))) {
        return {
          success: false,
          isTimeout: true,
          message: 'The request took too long to complete (timeout).',
          code: error.code || 'ECONNABORTED',
        };
      }
      return error?.response?.data;
    }
  }

  /**
   * Execute a put query
   * @param {*} payload Define what data need to be posted
   * @param {*} settings Configuration settings for the request
   * @returns
   */

  async put(payload, settings) {
    try {
      if (!payload) {
        return null;
      }

      const endpoint = this.urlBuilder({ endpoint: settings?.endpoint || this.serviceEndpoints.put });
      const result = await this.request(settings).put(endpoint, payload);

      return result.data;
    } catch (error) {
      console.error(error);
      if (error.code === 'ECONNABORTED' || (error.message && error.message.toLowerCase().includes('timeout'))) {
        return {
          success: false,
          isTimeout: true,
          message: 'The request took too long to complete (timeout).',
          code: error.code || 'ECONNABORTED',
        };
      }
      return error?.response?.data;
    }
  }

  /**
   * Execute a patch query
   * @param {*} payload Define what data need to be posted
   * @param {*} settings Configuration settings for the request
   * @returns
   */
  async patch(payload, settings) {
    try {
      if (!payload) {
        return null;
      }

      const endpoint = this.urlBuilder({ endpoint: settings?.endpoint || this.serviceEndpoints.patch });
      const result = await this.request(settings).patch(endpoint, payload);

      return result.data;
    } catch (error) {
      console.error(error);
      if (error.code === 'ECONNABORTED' || (error.message && error.message.toLowerCase().includes('timeout'))) {
        return {
          success: false,
          isTimeout: true,
          message: 'The request took too long to complete (timeout).',
          code: error.code || 'ECONNABORTED',
        };
      }
      return error?.response?.data;
    }
  }

  /**
   * Execute a query get query
   * @param {*} payload
   * @param {*} endpoint
   * @returns
   */
  async get(payload, settings) {
    try {
      if (!payload) {
        return null;
      }

      const parameters = this.objectToQueryString(payload);
      const endpoint = this.urlBuilder({ endpoint: settings?.endpoint || this.serviceEndpoints.post });
      const result = await this.request().get(`${endpoint}${parameters}`);

      return result.data;
    } catch (error) {
      console.error(error);
      return error?.body;
    }
  }
}
