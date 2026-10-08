import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_PUBLIC_PATHS,
  isPublicPath,
  matchesPublicPath,
  resolveLoginUrl,
  resolvePublicPaths,
  withBasename,
} from '../src/hooks/auth-paths.js';

test('without props the guard keeps today’s public paths and login URL', () => {
  assert.deepEqual(resolvePublicPaths(), [...DEFAULT_PUBLIC_PATHS]);
  assert.equal(resolveLoginUrl(), '/auth/login');
  assert.equal(isPublicPath('/auth/callback', resolvePublicPaths()), true);
  assert.equal(isPublicPath('/client/overview', resolvePublicPaths()), false);
});

test('a basename prefixes the defaults, the host paths and the login path', () => {
  const publicPaths = resolvePublicPaths({ publicPaths: ['/legal/terms'], basename: '/workspace/' });

  assert.equal(isPublicPath('/workspace/auth/login', publicPaths), true);
  assert.equal(isPublicPath('/workspace/legal/terms', publicPaths), true);
  assert.equal(isPublicPath('/auth/login', publicPaths), false);
  assert.equal(resolveLoginUrl({ basename: '/workspace' }), '/workspace/auth/login');
  assert.equal(resolveLoginUrl({ loginPath: '/auth/sign-in', basename: '/workspace' }), '/workspace/auth/sign-in');
});

test('absolute URLs are never prefixed', () => {
  assert.equal(withBasename('/workspace', 'https://portal.veripass.com.co/auth/login'), 'https://portal.veripass.com.co/auth/login');
  assert.equal(resolveLoginUrl({ loginPath: 'https://id.example.com/login', basename: '/x' }), 'https://id.example.com/login');
});

test('an empty route path stays empty without a basename', () => {
  assert.equal(withBasename('', ''), '');
  assert.equal(withBasename('/workspace', ''), '/workspace');
});

test('a pattern ending in /* covers the prefix and everything under it, and nothing else', () => {
  assert.equal(matchesPublicPath('/help', '/help/*'), true);
  assert.equal(matchesPublicPath('/help/articles/1', '/help/*'), true);
  assert.equal(matchesPublicPath('/helpdesk', '/help/*'), false);
});

test('a RegExp is tested against the full pathname', () => {
  assert.equal(matchesPublicPath('/share/abc123', /^\/share\/[a-z0-9]+$/), true);
  assert.equal(matchesPublicPath('/share/', /^\/share\/[a-z0-9]+$/), false);
});
