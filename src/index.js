// src/index.js

export { VeripassStandardSignin as VeripassStandardSignin } from './components/auth/standard-signin/VeripassStandardSignin.jsx'
export { VeripassLogoutSuccess as VeripassLogoutSuccess } from './components/auth/logout/logout-success/VeripassLogoutSuccess.jsx'
export {
  AuthContext,
  AuthProvider,
  useAuth
} from './hooks/useAuth.hook.jsx';
export { useLocalStorage as useLocalStorage } from './hooks/useLocalStorage.hook.js';

import './styles/fonts.css';
