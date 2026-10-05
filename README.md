# @veripass/react-sdk

## Description

The @veripass/react-sdk is a collection of React-based UI components designed to aid in the development of web applications. This library includes a variety of user interface elements ranging from simple alerts and spinners to more complex components like document viewers and data grids, providing developers with essential tools to create intuitive and engaging user interfaces.

## Installation

Install the library in your project with the following command:

> npm install @veripass/react-sdk

## Components

- **VeripassStandardSignin**: A React component designed to handle user authentication via email and password to create an intuitive sign-in experience.


For more details on each component, including usage and configuration options, please refer to the full documentation.

## Organization switcher and organization creation

`VeripassOrganizationSwitcher` works with no props: it reads the session, remembers the connection (base URL, api-key, environment) used at sign-in, and opens its own "Create organization" dialog. A host that wants to replace the dialog passes `onCreateOrganizationClick`.

```jsx
<VeripassOrganizationSwitcher />
```

`VeripassOrganizationCreate` (page, drawer or any container) and `VeripassOrganizationCreateDialog` (modal) are the same flow: name and slug (suggested while typing, editable, availability checked), creation by the signed-in person, and the new organization becomes their active context. Props: `apiKey`, `environment`, `ui`, `onCreated`, `onError`, `onEvent`.

### Events for the host

The SDK announces changes with cancelable DOM events on `window`. The host implements nothing of Veripass; it only reacts.

| Event | `detail` | When |
|---|---|---|
| `veripass::organization-created` | `{ organization, session }` | An organization was created (`session` is `null` for a host administrator, who is not switched). |
| `veripass::organization-switched` | `{ organization, session }` | The active organization changed (`organization` is `null` when an administrator returns to Global). |

```js
window.addEventListener('veripass::organization-created', (event) => {
  event.preventDefault(); // the host handles navigation: the SDK will not reload the page
  startOnboarding(event.detail.organization);
});
```

Without `preventDefault()` the SDK reloads the page after a switch, so the host reloads its data under the new organization. The names are exported as `VERIPASS_ORGANIZATION_EVENTS`.

### Host administrator context

A person who administers the host organization sees two modes in the switcher: **Global** (everything, as before) and **Fixed context** (work inside one organization, chosen from a searchable list of every organization of the host; creating an organization fixes the context to it). The administrator keeps their own identity; entering and leaving a context is audited.

The context lives in memory only (a reload returns to Global). Hosts read and set it with `useAdminContext()`:

```js
const { isAdmin, adminContext, setAdminContext, clearAdminContext } = useAdminContext();
// adminContext: { organization_id, identity, slug, display_name } | null
```

`getContextAsHeaders()` adds `x-veripass-admin-context-organization` while a context is fixed, so the host can forward it to its backend, which verifies it through `session/introspect` (`admin_context.valid`).

## Development

### Requirements

> npm install -g sass

### Compile

> sass src/styles/_bootstrap-namespaced.scss src/styles/bootstrap-namespaced.css;npm run build

### Debug with Storybook

> npm run storybook

### Publish

⚠️ Compile first!

> npm version patch;npm publish

## Documentation

For detailed information on each component, including the props they accept and the events they emit, refer to the comprehensive documentation provided with the library.

## Contributions

Contributions to the library are welcome. If you wish to contribute, please review the contribution guidelines provided in the repository.

## License

This project is licensed under the Apache License. For more details, see the LICENSE file in the repository.
