import React, { createContext, useContext, useMemo } from 'react';

import * as VeripassServices from '../../../services/index';

const VeripassSDKContext = createContext(null);

/**
 * App-wide provider for the Veripass SDK, mirroring `@link-loom/cloud-sdk`'s
 * `SupportSDKProvider`. The consuming app passes its own `baseUrl` (from its
 * build-time env, e.g. `import.meta.env.VITE_APP_SERVICE_VERIPASS_URL`) plus
 * `apiKey`/`environment`; every service obtained through this provider is
 * pre-configured with them.
 *
 * The SDK is deployment-agnostic: `baseUrl` may be an absolute https URL or a
 * same-origin relative prefix (for deployments that front the backend with a
 * proxy). Transport hygiene is applied in `BaseApi`.
 *
 * Maintainability: the exposed services are derived automatically from the
 * `services/index.js` barrel — adding or removing a service there is reflected
 * here with no changes to this file. Instances are keyed by their export name
 * (e.g. `services.UserManagementService`).
 *
 * Note: this provider is an ergonomic convenience. The app-wide default set
 * via `configureVeripass({ baseUrl })` already covers every `new XxxService()`
 * (including those instantiated internally by auth components), so wrapping
 * with this provider is optional.
 */
const VeripassSDKProvider = ({ baseUrl, apiKey, environment, children }) => {
  const value = useMemo(() => {
    // `baseUrl` and `environment` both live in `settings` (the SDK convention);
    // `apiKey` is the top-level constructor arg used by every service.
    const settings = {};
    if (environment) settings.environment = environment;
    if (baseUrl) settings.baseUrl = baseUrl;

    const config = {};
    if (apiKey) config.apiKey = apiKey;
    if (Object.keys(settings).length > 0) config.settings = settings;

    const createService = (ServiceClass) => new ServiceClass(config);

    // Auto-enumerate every service class exported by the barrel. Constructing
    // a service is cheap (no I/O), and `useMemo` keeps this to once per
    // config change.
    const services = {};
    for (const [name, ServiceClass] of Object.entries(VeripassServices)) {
      if (typeof ServiceClass === 'function') {
        services[name] = createService(ServiceClass);
      }
    }

    return { config, createService, services };
  }, [baseUrl, apiKey, environment]);

  return <VeripassSDKContext.Provider value={value}>{children}</VeripassSDKContext.Provider>;
};

/**
 * Access the Veripass SDK context. Returns `{ config, createService, services }`.
 * - `services.<ServiceExportName>` — a pre-configured instance of any service
 *   exported from `services/index.js` (e.g. `services.UserManagementService`).
 * - `createService(ServiceClass)` — build any service pre-configured with the
 *   provider's baseUrl/apiKey/environment.
 */
const useVeripassSDK = () => {
  const context = useContext(VeripassSDKContext);

  if (!context) {
    throw new Error('useVeripassSDK must be used within a VeripassSDKProvider');
  }

  return context;
};

export { VeripassSDKProvider, useVeripassSDK };
