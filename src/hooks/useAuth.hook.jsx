import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage.hook';

const defaulPublicUrlList = ['/auth/login', '/auth/signup'];

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
export const AuthProvider = ({ children, publicUrls = [] }) => {
  const [publicUrlsList, setPublicUrlsList] = useState(defaulPublicUrlList);

  // State to manage user data, persisted in local storage
  const [user, setUser] = useLocalStorage('veripass-user-data', null);

  useEffect(()=>{console.log(children)}, [children])

  React.Children.forEach(children, (child) => {
    // Check if child is a valid React element
    if (React.isValidElement(child) && child.props.isPublic) {debugger
      publicPaths.add(child.props.path); // Assumes `path` is passed as prop
    }
  });

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

  // Effect to update public URLs whenever additionalPublicUrls prop changes
  useEffect(() => {
    setPublicUrlsList([...defaultPublicUrlList, ...additionalPublicUrls]);
  }, [additionalPublicUrls]);


  // Effect to redirect if user is null
  useEffect(() => {
    const currentPath = window.location.pathname;
    const isWhitelisted = publicUrlsList.includes(currentPath);

    if (user === null && !isWhitelisted) {
      window.location.replace('/auth/login');
    }
  }, [user, publicUrlsList]);

  /**
   * Memoized value containing the user data and authentication functions.
   *
   * @typedef {object} AuthContextValue
   * @property {object|null} user - The currently authenticated user or null if not authenticated.
   * @property {function(object): Promise<void>} login - Function to log in the user.
   * @property {function(): void} logout - Function to log out the user.
   * @property {function(): object|null} getToken - Function to get the current user's token.
   *
   * @returns {AuthContextValue} The context value with user data and authentication functions.
   */
  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      getToken,
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
