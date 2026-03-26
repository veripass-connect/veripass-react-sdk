import { useState, useCallback } from 'react';
import AuthEntraService from '../services/security/auth-entra/auth-entra.service';

export const useFederatedAuth = ({ apiKey, environment } = {}) => {
  const [authOptions, setAuthOptions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthOptions = useCallback(
    async ({ queryselector = 'organization', search = '' } = {}) => {
      try {
        setIsLoading(true);
        setError(null);
        const service = new AuthEntraService({ apiKey, settings: { environment } });
        const response = await service.getAuthOptions({ queryselector, search });

        if (response?.success) {
          setAuthOptions(response.result);
          return response.result;
        }

        setAuthOptions(null);
        return null;
      } catch (err) {
        setError(err);
        setAuthOptions(null);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey, environment],
  );

  const initiateProviderLogin = useCallback(
    async ({
      organizationId,
      organizationSlug,
      providerType = 'entra_oidc',
      loginHint,
      redirectAfterLogin,
    } = {}) => {
      try {
        setIsLoading(true);
        setError(null);
        const service = new AuthEntraService({ apiKey, settings: { environment } });
        const response = await service.initiateAuthorize({
          organization_id: organizationId,
          organization_slug: organizationSlug,
          provider_type: providerType,
          login_hint: loginHint,
          redirect_after_login: redirectAfterLogin?.startsWith('http')
            ? redirectAfterLogin
            : `${window.location.origin}${redirectAfterLogin || ''}`,
        });

        if (response?.success && response?.result?.redirect_url) {
          window.location.href = response.result.redirect_url;
          return;
        }

        setError(new Error(response?.message || 'Failed to initiate provider login'));
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey, environment],
  );

  return {
    authOptions,
    isLoading,
    error,
    getAuthOptions,
    initiateProviderLogin,
  };
};
