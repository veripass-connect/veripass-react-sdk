export const ORGANIZATION_EVENTS = {
  created: 'veripass::organization-created',
  switched: 'veripass::organization-switched',
};

/**
 * Announces an organization change to the host app through a cancelable DOM event on `window`.
 * The host reacts with `window.addEventListener(name, handler)`; calling `event.preventDefault()` tells the SDK
 * the host handles the navigation, so the SDK will not reload the page.
 *
 * @returns {boolean} `true` when nobody cancelled the event (the SDK may reload the page).
 */
export function dispatchOrganizationEvent(name, detail) {
  const event = new CustomEvent(name, { detail, cancelable: true });

  window.dispatchEvent(event);

  return !event.defaultPrevented;
}
