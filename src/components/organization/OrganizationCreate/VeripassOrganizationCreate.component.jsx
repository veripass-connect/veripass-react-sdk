import React, { useState, useEffect, useMemo } from 'react';
import { useAuth, useAdminContext } from '@hooks/useAuth.hook';
import OrganizationManagementService from '@services/organization/organization-management/organization-management.service';
import AuthStandardService from '@services/security/auth-standard/auth-standard.service';
import { VeripassTenancyCreateOrganization } from '@components/organization/onboarding/tenancy/create-organization/VeripassTenancyCreateOrganization.component';
import { ORGANIZATION_EVENTS, dispatchOrganizationEvent } from '@components/organization/shared/organization-context.events';

const NAMESPACE = 'veripass';
const ACTIONS = {
  CREATED: 'veripass-organization-create::created',
  FAILED: 'veripass-organization-create::failed',
};
const SLUG_CHECK_DEBOUNCE_MS = 400;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SLUG_TAKEN_MESSAGE = 'This slug is already taken.';
const CREATE_FAILED_MESSAGE = 'The organization could not be created.';
const SWITCH_FAILED_MESSAGE = 'The organization was created, but switching to it failed.';

/**
 * Creates an organization for the signed-in person and makes it their active context.
 * Self-contained: it validates the slug, calls Veripass and updates the session. The host can only listen to
 * the `veripass::organization-created` event (or the optional callbacks); it implements nothing of Veripass.
 *
 * A host administrator is not switched: the new organization becomes their fixed administrator context.
 */
export const VeripassOrganizationCreate = ({
  ui = {},
  apiKey = '',
  environment,
  organizationForm = { name: '', slug: '', description: '', isSlugEdited: false },
  onCreated,
  onError,
  onEvent,
  onCancel,
}) => {
  const { login } = useAuth();
  const { isAdmin, setAdminContext } = useAdminContext();

  const [form, setForm] = useState(organizationForm);
  const [slugError, setSlugError] = useState('');
  const [isSlugChecking, setIsSlugChecking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const organizationService = useMemo(
    () => new OrganizationManagementService({ apiKey, settings: { environment } }),
    [apiKey, environment],
  );
  const authService = useMemo(() => new AuthStandardService({ apiKey, settings: { environment } }), [apiKey, environment]);

  useEffect(() => {
    setSlugError('');

    if (!form.slug || !SLUG_PATTERN.test(form.slug)) {
      setIsSlugChecking(false);
      return undefined;
    }

    let isCancelled = false;
    setIsSlugChecking(true);

    const timer = setTimeout(async () => {
      const response = await organizationService.getByParameters({ queryselector: 'slug', search: form.slug });

      if (isCancelled) {
        return;
      }

      setSlugError(response?.result?.items?.length ? SLUG_TAKEN_MESSAGE : '');
      setIsSlugChecking(false);
    }, SLUG_CHECK_DEBOUNCE_MS);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [form.slug, organizationService]);

  const reportFailure = (message, response) => {
    setError(message);

    if (onError) {
      onError({ message, response });
    }

    if (onEvent) {
      onEvent({ action: ACTIONS.FAILED, namespace: NAMESPACE, payload: null, error: { message, response } });
    }
  };

  const announceCreated = ({ organization, session }) => {
    const shouldReload = dispatchOrganizationEvent(ORGANIZATION_EVENTS.created, { organization, session });

    if (onCreated) {
      onCreated({ organization, session });
    }

    if (onEvent) {
      onEvent({ action: ACTIONS.CREATED, namespace: NAMESPACE, payload: { organization, session }, error: null });
    }

    return shouldReload;
  };

  const handleSubmit = async ({ payload }) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const creationResponse = await organizationService.create(
        { profile: { display_name: payload.organization.name.trim(), slug: payload.organization.slug } },
        { session: true },
      );

      if (!creationResponse?.success || !creationResponse.result) {
        reportFailure(creationResponse?.message || CREATE_FAILED_MESSAGE, creationResponse);
        return;
      }

      const organization = creationResponse.result;

      if (isAdmin) {
        setAdminContext({
          organization_id: organization.id,
          identity: organization.identity,
          slug: organization.profile?.slug,
          display_name: organization.profile?.display_name,
        });
        announceCreated({ organization, session: null });
        return;
      }

      const switchResponse = await authService.switchContext({ target_organization_id: organization.id });

      if (!switchResponse?.success || !switchResponse.result) {
        reportFailure(switchResponse?.message || SWITCH_FAILED_MESSAGE, switchResponse);
        return;
      }

      await login({ user: switchResponse.result });

      if (announceCreated({ organization, session: switchResponse.result })) {
        window.location.reload();
      }
    } catch (exception) {
      reportFailure(CREATE_FAILED_MESSAGE, exception);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VeripassTenancyCreateOrganization
      ui={ui}
      organizationForm={form}
      updateOnAction={({ payload }) => setForm(payload)}
      itemOnAction={handleSubmit}
      isLoading={isLoading}
      isSlugChecking={isSlugChecking}
      onCancel={onCancel}
      slugError={slugError}
      error={error}
    />
  );
};
