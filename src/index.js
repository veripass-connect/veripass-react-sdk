// src/index.js

/* Security Standard */
export { VeripassStandardSignin as VeripassStandardSignin } from './components/auth/signin/standard-signin/VeripassStandardSignin.jsx'
export { VeripassLogoutSuccess as VeripassLogoutSuccess } from './components/auth/logout/logout-success/VeripassLogoutSuccess.jsx'
export { VeripassStandardRecoverPassword as VeripassStandardRecoverPassword } from './components/auth/recover/recover-password/VeripassStandardRecoverPassword.jsx'
export { VeripassNewPassword as VeripassNewPassword } from './components/auth/recover/new-password/VeripassNewPassword.jsx'
export { VeripassStandardUnlock as VeripassStandardUnlock } from './components/auth/unlock/VeripassStandardUnlock.jsx'

/* Quick Actions */
export { VeripassQuickStandardUserCreate as VeripassQuickStandardUserCreate } from './components/quick-actions/create/VeripassQuickStandardUserCreate.jsx'
export { VeripassQuickUserKyc as VeripassQuickUserKyc } from './components/quick-actions/kyc/VeripassQuickUserKyc.jsx';
export { VeripassQuickUserPreview as VeripassQuickUserPreview } from './components/quick-actions/preview/VeripassQuickUserPreview.jsx';

/* Quick Biometrics */
export { VeripassQuickUserBiometrics as VeripassQuickUserBiometrics } from './components/quick-actions/biometrics/VeripassQuickUserBiometrics.jsx';
export { VeripassQuickUserBiometricsIdDocument as VeripassQuickUserBiometricsIdDocument } from './components/quick-actions/biometrics/VeripassQuickUserBiometricsIdDocument.jsx';
export { VeripassQuickUserBiometricsSelfie as VeripassQuickUserBiometricsSelfie } from './components/quick-actions/biometrics/VeripassQuickUserBiometricsSelfie.jsx';
export { VeripassQuickUserBiometricsFingerprint as VeripassQuickUserBiometricsFingerprint } from './components/quick-actions/biometrics/VeripassQuickUserBiometricsFingerprint.jsx';
export { VeripassQuickUserBiometricsVoice as VeripassQuickUserBiometricsVoice } from './components/quick-actions/biometrics/VeripassQuickUserBiometricsVoice.jsx';
export { VeripassQuickUserBiometricsSignature as UserQuickBiometricsSignature } from './components/quick-actions/biometrics/VeripassQuickUserBiometricsSignature.jsx';

/* Verify */
export { VeripassUserNotVerifiedBanner as VeripassUserNotVerifiedBanner } from './components/verify/VeripassUserNotVerifiedBanner';
export { VeripassUserVerificationStatus as VeripassUserVerificationStatus } from './components/verify/VeripassUserVerificationStatus';
export { VeripassUserVerifiedBanner as VeripassUserVerifiedBanner } from './components/verify/VeripassUserVerifiedBanner';
export { VeripassUserVerifyButton as VeripassUserVerifyButton } from './components/verify/VeripassUserVerifyButton';

export {
  AuthContext,
  AuthProvider,
  useAuth
} from './hooks/useAuth.hook.jsx';
export { useLocalStorage as useLocalStorage } from './hooks/useLocalStorage.hook.js';

import './styles/fonts.css';
