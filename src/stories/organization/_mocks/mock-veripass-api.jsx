import React, { useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '@hooks/useAuth.hook';

/**
 * Story-only network double. The SDK creates a fresh axios client per request from `axios.defaults`, so replacing
 * the default adapter intercepts every Veripass call without a mock server.
 *
 * `routes`: [{ method, match, reply }] where `match` is a substring of the request URL and `reply` is
 * `{ status, body }` or a function of the request config returning that.
 */
export function installMockApi({ routes, calls }) {
  const originalAdapter = axios.defaults.adapter;
  calls.length = 0;

  axios.defaults.adapter = async (config) => {
    const method = (config.method || 'get').toLowerCase();
    const url = config.url || '';
    const route = routes.find((candidate) => candidate.method === method && url.includes(candidate.match));
    const body = config.data ? JSON.parse(config.data) : null;

    calls.push({ method, url, body, headers: config.headers });

    const { status = 200, body: replyBody } = route
      ? typeof route.reply === 'function'
        ? route.reply({ url, body })
        : route.reply
      : { status: 404, body: { success: false, message: 'No mock route' } };

    const response = { data: replyBody, status, statusText: String(status), headers: {}, config };

    if (status >= 400) {
      throw new axios.AxiosError(`Request failed with status code ${status}`, 'ERR_BAD_REQUEST', config, null, response);
    }

    return response;
  };

  return () => {
    axios.defaults.adapter = originalAdapter;
  };
}

/** Decorator: installs `parameters.mockApi = { routes, calls }` for the lifetime of the story. */
export const MockApiDecorator = (Story, context) => {
  const mockApi = context.parameters.mockApi;
  const restore = React.useMemo(() => (mockApi ? installMockApi(mockApi) : null), [mockApi]);

  useEffect(() => restore || undefined, [restore]);

  return <Story />;
};

export const MockAuthProvider = ({ children, user, ...overrides }) => (
  <AuthContext.Provider
    value={{
      user,
      login: async () => {},
      logout: () => {},
      getToken: () => ({ token: 'mock-token' }),
      isAdmin: false,
      adminContext: null,
      setAdminContext: () => {},
      clearAdminContext: () => {},
      ...overrides,
    }}
  >
    {children}
  </AuthContext.Provider>
);

/** Listens to a window event and cancels it, so the SDK does not reload the story page. */
export function captureOrganizationEvent(name) {
  const received = [];
  const handler = (event) => {
    received.push(event.detail);
    event.preventDefault();
  };

  window.addEventListener(name, handler);

  return { received, stop: () => window.removeEventListener(name, handler) };
}
