// src/index.js

/* Security Standard */
export { VeripassStandardSignin as VeripassStandardSignin } from './components/auth/signin/standard-signin/VeripassStandardSignin.jsx'
export { VeripassLogoutSuccess as VeripassLogoutSuccess } from './components/auth/logout/logout-success/VeripassLogoutSuccess.jsx'
export { VeripassStandardRecoverPassword as VeripassStandardRecoverPassword } from './components/auth/recover/recover-password/VeripassStandardRecoverPassword.jsx'
export { VeripassNewPassword as VeripassNewPassword } from './components/auth/recover/new-password/VeripassNewPassword.jsx'
export { VeripassStandardUnlock as VeripassStandardUnlock } from './components/auth/unlock/VeripassStandardUnlock.jsx'

/* User Quick Actions */
export { VeripassUserQuickStandardCreate as VeripassUserQuickStandardCreate } from './components/user/quick-actions/create/VeripassUserQuickStandardCreate.jsx'
export { VeripassQuickUserKyc as VeripassQuickUserKyc } from './components/user/quick-actions/kyc/VeripassQuickUserKyc.jsx';
export { VeripassQuickUserPreview as VeripassQuickUserPreview } from './components/user/quick-actions/preview/VeripassQuickUserPreview.jsx';
export { VeripassAssignAccessProfile as VeripassAssignAccessProfile } from './components/user/quick-actions/assign-access-profile/VeripassAssignAccessProfile.jsx';

/* User Quick Biometrics */
export { VeripassQuickUserBiometrics as VeripassQuickUserBiometrics } from './components/user/quick-actions/biometrics/VeripassQuickUserBiometrics.jsx';
export { VeripassQuickUserBiometricsIdDocument as VeripassQuickUserBiometricsIdDocument } from './components/user/quick-actions/biometrics/VeripassQuickUserBiometricsIdDocument.jsx';
export { VeripassQuickUserBiometricsSelfie as VeripassQuickUserBiometricsSelfie } from './components/user/quick-actions/biometrics/VeripassQuickUserBiometricsSelfie.jsx';
export { VeripassQuickUserBiometricsFingerprint as VeripassQuickUserBiometricsFingerprint } from './components/user/quick-actions/biometrics/VeripassQuickUserBiometricsFingerprint.jsx';
export { VeripassQuickUserBiometricsVoice as VeripassQuickUserBiometricsVoice } from './components/user/quick-actions/biometrics/VeripassQuickUserBiometricsVoice.jsx';
export { VeripassQuickUserBiometricsSignature as UserQuickBiometricsSignature } from './components/user/quick-actions/biometrics/VeripassQuickUserBiometricsSignature.jsx';

/* User Verify */
export { VeripassUserNotVerifiedBanner as VeripassUserNotVerifiedBanner } from '.components/user/verify/VeripassUserNotVerifiedBanner';
export { VeripassUserVerificationStatus as VeripassUserVerificationStatus } from '.components/user/verify/VeripassUserVerificationStatus';
export { VeripassUserVerifiedBanner as VeripassUserVerifiedBanner } from '.components/user/verify/VeripassUserVerifiedBanner';
export { VeripassUserVerifyButton as VeripassUserVerifyButton } from '.components/user/verify/VeripassUserVerifyButton';

/* Organization Quick Actions */
export { VeripassOrganizationQuickStandardCreate as VeripassOrganizationQuickStandardCreate } from './components/organization/quick-actions/create/VeripassOrganizationQuickStandardCreate.jsx';

export {
  AuthContext,
  AuthProvider,
  useAuth
} from './hooks/useAuth.hook.jsx';
export { useLocalStorage as useLocalStorage } from './hooks/useLocalStorage.hook.js';

import './styles/styles.css';
import './styles/fonts.css';
import './styles/bootstrap-namespaced.css';
