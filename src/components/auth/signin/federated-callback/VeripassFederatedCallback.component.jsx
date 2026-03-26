import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../hooks/useAuth.hook';

export const VeripassFederatedCallback = ({ onSuccess, onError, redirectUrl, loadingComponent }) => {
  const authProvider = useAuth();
  const [status, setStatus] = useState('processing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const sessionData = urlParams.get('session');
        const errorParam = urlParams.get('error');

        if (errorParam) {
          setStatus('error');
          setErrorMessage(decodeURIComponent(errorParam));
          if (onError) onError(new Error(errorParam));
          return;
        }

        if (!token && !sessionData) {
          setStatus('error');
          setErrorMessage('No authentication data received');
          if (onError) onError(new Error('No authentication data received'));
          return;
        }

        let userData = null;

        if (sessionData) {
          try {
            userData = JSON.parse(decodeURIComponent(sessionData));
          } catch {
            userData = null;
          }
        }

        if (token && !userData) {
          try {
            const [, payloadBase64] = token.split('.');
            const payload = JSON.parse(atob(payloadBase64));
            userData = {
              token,
              identity: payload.identity,
              ...payload.payload,
            };
          } catch {
            setStatus('error');
            setErrorMessage('Failed to process authentication token');
            if (onError) onError(new Error('Failed to process authentication token'));
            return;
          }
        }

        if (!userData) {
          setStatus('error');
          setErrorMessage('Invalid authentication data');
          if (onError) onError(new Error('Invalid authentication data'));
          return;
        }

        const finalRedirectUrl = urlParams.get('redirect') || redirectUrl;
        authProvider.login({ user: userData, redirectUrl: finalRedirectUrl });

        setStatus('success');
        if (onSuccess) onSuccess(userData);
      } catch (err) {
        setStatus('error');
        setErrorMessage(err.message || 'Authentication failed');
        if (onError) onError(err);
      }
    };

    processCallback();
  }, []);

  if (status === 'processing') {
    return (
      loadingComponent || (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <p>Completing authentication...</p>
          </div>
        </div>
      )
    );
  }

  if (status === 'error') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p>Authentication failed</p>
          <p style={{ color: '#666', fontSize: '0.875rem' }}>{errorMessage}</p>
        </div>
      </div>
    );
  }

  return null;
};
