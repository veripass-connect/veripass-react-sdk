// src/index.js

export { VeripassStandardSignin as VeripassStandardSignin } from './components/auth/signin/standard-signin/VeripassStandardSignin.jsx'
export { VeripassLogoutSuccess as VeripassLogoutSuccess } from './components/auth/logout/logout-success/VeripassLogoutSuccess.jsx'
export { VeripassStandardRecoverPassword as VeripassStandardRecoverPassword } from './components/auth/recover/recover-password/VeripassStandardRecoverPassword.jsx'
export { VeripassNewPassword as VeripassNewPassword } from './components/auth/recover/new-password/VeripassNewPassword.jsx'
export { VeripassStandardUnlock as VeripassStandardUnlock } from './components/auth/unlock/VeripassStandardUnlock.jsx'
export { VeripassUserQuickCreate as VeripassUserQuickCreate } from './components/quick-actions/create/VeripassUserQuickCreate.jsx'
export { VeripassQuickKyc as VeripassQuickKyc } from './components/quick-actions/kyc/VeripassQuickKyc.jsx';

export {
  AuthContext,
  AuthProvider,
  useAuth
} from './hooks/useAuth.hook.jsx';
export { useLocalStorage as useLocalStorage } from './hooks/useLocalStorage.hook.js';

import './styles/fonts.css';
