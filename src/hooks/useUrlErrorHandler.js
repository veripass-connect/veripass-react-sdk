import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { SECURITY_STATUS_CODE_MESSAGES, SECURITY_REASON_CODES } from '../constants/security-status-code-messages.js';

const swal = withReactContent(Swal);

const defaultErrorMap = {
  insufficient_permissions: {
    title: 'Insufficient permissions',
    message: 'You do not have sufficient permissions to enter.',
  },
  access_denied: {
    title: 'Access denied',
    message: 'Your account does not have access to this application.',
  },
};

const DEFAULT_ERROR_TITLE = 'Error';

/**
 * Surfaces an error carried in the URL.
 *
 * Two producers exist and both are handled:
 *  - Legacy: `?veripass-error=<key>` resolved through `errorMap` (a fixed enum).
 *  - Federated callback: `?reason=<name>&error=<message>`. A redirect cannot carry an HTTP
 *    status, so the backend sends the catalog reason NAME; it is resolved to the same message a
 *    direct JSON response would produce via SECURITY_REASON_CODES -> SECURITY_STATUS_CODE_MESSAGES,
 *    falling back to the literal `error` text.
 *
 * Any error resolves to a modal — previously only the two enum keys did, so an arbitrary message
 * (e.g. a denied federated sign-in) was silently swallowed.
 */
export function useUrlErrorHandler(errorKeyName = 'veripass-error', errorMap = defaultErrorMap) {
  const resolveError = (searchParams) => {
    const legacyKey = searchParams.get(errorKeyName);
    if (legacyKey && errorMap[legacyKey]) {
      return { title: errorMap[legacyKey].title, message: errorMap[legacyKey].message, consumed: [errorKeyName] };
    }

    const reason = searchParams.get('reason');
    const errorText = searchParams.get('error');

    if (reason) {
      const catalogMessage = SECURITY_STATUS_CODE_MESSAGES[SECURITY_REASON_CODES[reason]];
      return { title: DEFAULT_ERROR_TITLE, message: catalogMessage || errorText || reason, consumed: ['reason', 'error'] };
    }

    if (errorText) {
      return { title: DEFAULT_ERROR_TITLE, message: errorText, consumed: ['error'] };
    }

    if (legacyKey) {
      return { title: DEFAULT_ERROR_TITLE, message: legacyKey, consumed: [errorKeyName] };
    }

    return null;
  };

  const showErrorFromUrl = () => {
    // Read at call time, not at hook-creation time, so a post-navigation URL is honored.
    const searchParams = new URLSearchParams(window?.location?.search);
    const resolved = resolveError(searchParams);

    if (!resolved) {
      return;
    }

    swal
      .fire({
        title: resolved.title,
        text: resolved.message,
        icon: 'error',
      })
      .then(() => {
        resolved.consumed.forEach((key) => searchParams.delete(key));
        const query = searchParams.toString();
        const nextUrl = query ? `${window?.location?.pathname}?${query}` : window?.location?.pathname;
        // replaceState keeps the SPA mounted; a full location.replace would reload the app.
        window?.history?.replaceState({}, '', nextUrl);
      });
  };

  return {
    showErrorFromUrl,
  };
}
