import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage.hook';

const defaultPublicUrlList = ['/auth/login', '/auth/signup'];

/**
 * Authentication context used to provide user authentication data and functions.
 */
export const AuthContext = createContext();

/**
 * AuthProvider component that wraps around the application or part of it to provide authentication context.
 * It uses local storage to persist user data and provides login, logout, and token retrieval functions.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The children components that require access to the authentication context.
 * @returns {JSX.Element} The provider component for AuthContext.
 */
export const AuthProvider = ({ children, debug }) => {
  const publicUrlsList = defaultPublicUrlList;
  const [isInitialized, setIsInitialized] = useState(false);

  // State to manage user data, persisted in local storage
  const [user, setUser] = useLocalStorage('veripass-user-data', null);

  useEffect(() => {
    const extractPublicPaths = (child, parentPath = '') => {
      if (React.isValidElement(child)) {
        const currentPath = `${parentPath}${child.props.path ? `/${child.props.path}` : ''}`.replace(/\/+/g, '/');

        if (child.props.isPublic && !publicUrlsList.includes(currentPath)) {
          publicUrlsList.push(currentPath);
        }

        if (child.props.children) {
          React.Children.forEach(child.props.children, (grandchild) => extractPublicPaths(grandchild, currentPath));
        }
      }
    };

    React.Children.forEach(children, (child) => extractPublicPaths(child));

    setIsInitialized(true);
  }, [children]);

  /**
   * Logs in the user by saving their data to local storage and navigating to the admin page.
   *
   * @param {object} user - The user data to be stored.
   */
  const login = async ({ user, redirectUrl = '' }) => {
    setUser(user);

    if (redirectUrl) {
      window.location.replace(redirectUrl);
    }
  };

  /**
   * Logs out the current user by clearing their data from local storage.
   */
  const logout = () => {
    setUser(null);
  };

  /**
   * Retrieves the stored user data (token) from local storage.
   *
   * @returns {object|null} The user data stored in local storage, or null if not found.
   */
  const getToken = () => {
    const value = window.localStorage.getItem('veripass-user-data');
    return JSON.parse(value);
  };

  const getContextAsHeaders = () => {
    const user = context?.user;

    if (!user) return {};

    const profile = user.payload?.profile || {};

    return {
      'x-veripass-organization-identity': user.payload?.organization_id || '',
      'x-veripass-app-id': user.payload?.app_id || '',
      'x-veripass-user-identity': user.identity,
      'x-veripass-user-display-name': profile.display_name || profile.primary_email_address || user.identity,
      'x-veripass-username': profile.username || '',
    };
  };

  // Effect to redirect if user is null
  useEffect(() => {
    if (isInitialized) {
      const currentPath = window.location.pathname;
      const isWhitelisted = publicUrlsList.includes(currentPath);

      if (user === null && !isWhitelisted) {
        if (!debug) {
          window.location.replace('/auth/login');
        }
      }
    }
  }, [user, isInitialized]);

  /**
   * Memoized value containing the user data and authentication functions.
   *
   * @typedef {object} AuthContextValue
   * @property {object|null} user - The currently authenticated user or null if not authenticated.
   * @property {function(object): Promise<void>} login - Function to log in the user.
   * @property {function(): void} logout - Function to log out the user.
   * @property {function(): object|null} getToken - Function to get the current user's token.
   * @property {function(): object} getContextAsHeaders - Function to get the context as headers.
   *
   * @returns {AuthContextValue} The context value with user data and authentication functions.
   */
  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      getToken,
      getContextAsHeaders
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to access the authentication context.
 *
 * @returns {AuthContextValue} The authentication context value, including user data, login, logout, and getToken functions.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
