export const DEFAULT_LOGIN_PATH = '/auth/login';

export const DEFAULT_PUBLIC_PATHS = Object.freeze([
  'https://portal.veripass.com.co/auth/login',
  '/auth/login',
  '/auth/signup',
  '/setup/workspace',
  // The federated (OIDC) callback lands here with user===null while PostLoginRedirect parses the
  // decision and routes (enter / join / register). Without whitelisting, the AuthProvider guard
  // races and replaces to /auth/login before the decision is read.
  '/auth/callback',
]);

const isAbsoluteUrl = (path) => /^[a-z][a-z\d+.-]*:\/\//i.test(path);

/**
 * Prefixes an app path with the router basename. Absolute URLs and patterns that are not strings pass through.
 */
export const withBasename = (basename, path) => {
  if (typeof path !== 'string' || isAbsoluteUrl(path)) {
    return path;
  }

  const prefix = (basename || '').replace(/\/+$/, '');

  if (!path) {
    return prefix;
  }

  return `${prefix}/${path.replace(/^\/+/, '')}`.replace(/\/+/g, '/');
};

/**
 * A public path is an exact path, a prefix ending in `/*` (the prefix and everything under it) or a RegExp.
 */
export const matchesPublicPath = (pathname, pattern) => {
  if (pattern instanceof RegExp) {
    return pattern.test(pathname);
  }

  if (typeof pattern !== 'string') {
    return false;
  }

  if (!pattern.endsWith('/*')) {
    return pathname === pattern;
  }

  const prefix = pattern.slice(0, -2);

  return pathname === prefix || pathname.startsWith(`${prefix}/`);
};

/**
 * The public paths the guard lets through: the Veripass defaults plus the host's own, all under the basename.
 */
export const resolvePublicPaths = ({ publicPaths = [], basename = '' } = {}) =>
  [...DEFAULT_PUBLIC_PATHS, ...publicPaths].map((path) => withBasename(basename, path));

export const isPublicPath = (pathname, publicPaths) => publicPaths.some((pattern) => matchesPublicPath(pathname, pattern));

export const resolveLoginUrl = ({ loginPath = DEFAULT_LOGIN_PATH, basename = '' } = {}) => withBasename(basename, loginPath);
