// src/index.js

/* Security Standard */
export { VeripassStandardSignin as VeripassStandardSignin } from './components/auth/signin/standard-signin/VeripassStandardSignin.jsx';
export { VeripassSignInManager as VeripassSignInManager } from './components/auth/signin/manager/VeripassSignInManager.component.jsx';
export { VeripassStandardSignup as VeripassStandardSignup } from './components/auth/signup/standard-signup/VeripassStandardSignup.component.jsx';
export { VeripassLogoutSuccess as VeripassLogoutSuccess } from './components/auth/logout/logout-success/VeripassLogoutSuccess.jsx';
export { VeripassStandardRecoverPassword as VeripassStandardRecoverPassword } from './components/auth/recover/recover-password/VeripassStandardRecoverPassword.jsx';
export { VeripassNewPassword as VeripassNewPassword } from './components/auth/recover/new-password/VeripassNewPassword.jsx';
export { VeripassStandardUnlock as VeripassStandardUnlock } from './components/auth/unlock/VeripassStandardUnlock.jsx';

/* User Quick Actions */
export { VeripassUserQuickStandardCreate as VeripassUserQuickStandardCreate } from './components/user/quick-actions/create/VeripassUserQuickStandardCreate.jsx';
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
export { VeripassUserNotVerifiedBanner as VeripassUserNotVerifiedBanner } from './components/user/verify/VeripassUserNotVerifiedBanner';
export { VeripassUserVerificationStatus as VeripassUserVerificationStatus } from './components/user/verify/VeripassUserVerificationStatus';
export { VeripassUserVerifiedBanner as VeripassUserVerifiedBanner } from './components/user/verify/VeripassUserVerifiedBanner';
export { VeripassUserVerifyButton as VeripassUserVerifyButton } from './components/user/verify/VeripassUserVerifyButton';

// Shared
export { VeripassActionButton } from './components/shared/buttons/VeripassActionButton.component';

/* User Profile */
export { VeripassUserProfileView as VeripassUserProfileView } from './components/user/profile/VeripassUserProfileView.jsx';

/* Organization Quick Actions */
export { VeripassOrganizationQuickStandardCreate as VeripassOrganizationQuickStandardCreate } from './components/organization/quick-actions/create/VeripassOrganizationQuickStandardCreate.jsx';

/* Organization Profile */
export { VeripassOrganizationProfileEdit as VeripassOrganizationProfileEdit } from './components/organization/profile/edit/VeripassOrganizationProfileEdit.jsx';
export { VeripassOrganizationProfilePreview as VeripassOrganizationProfilePreview } from './components/organization/profile/preview/VeripassOrganizationProfilePreview.jsx';
export { VeripassOrganizationProfileManage as VeripassOrganizationProfileManage } from './components/organization/profile/manage/VeripassOrganizationProfileManage.jsx';

/* Organization Onboarding (Tenancy) */
export { VeripassTenancyOnboardingManager as VeripassTenancyOnboardingManager } from './components/organization/onboarding/tenancy/manager/VeripassTenancyOnboardingManager.component.jsx';
export { VeripassTenancyOnboardingHub as VeripassTenancyOnboardingHub } from './components/organization/onboarding/tenancy/hub/VeripassTenancyOnboardingHub.component.jsx';
export { VeripassTenancyCreateOrganization as VeripassTenancyCreateOrganization } from './components/organization/onboarding/tenancy/create-organization/VeripassTenancyCreateOrganization.component.jsx';
export { VeripassTenancyFinishSetup as VeripassTenancyFinishSetup } from './components/organization/onboarding/tenancy/finish-setup/VeripassTenancyFinishSetup.component.jsx';
export { VeripassTenancyChooseOrganization as VeripassTenancyChooseOrganization } from './components/organization/onboarding/tenancy/choose-organization/VeripassTenancyChooseOrganization.component.jsx';
export { VeripassTenancyAllSet as VeripassTenancyAllSet } from './components/organization/onboarding/tenancy/all-set/VeripassTenancyAllSet.component.jsx';
export { VeripassSlugInput as VeripassSlugInput } from './components/organization/onboarding/tenancy/shared/VeripassSlugInput.component.jsx';
export { VeripassSelectableCard as VeripassSelectableCard } from './components/organization/onboarding/tenancy/shared/VeripassSelectableCard.component.jsx';

/* Identity */
export { VeripassIdentityContractList as VeripassIdentityContractList } from './components/identity/identity-contract/list/VeripassIdentityContractList.jsx';

/* Team */
export { VeripassTeamManagementList as VeripassTeamManagementList } from './components/team/team-management/list/VeripassTeamManagementList.jsx';
export { VeripassMyPrincipalTeamList as VeripassMyPrincipalTeamList } from './components/team/team-management/preview/VeripassMyPrincipalTeamList.jsx';

export { AuthContext, AuthProvider, useAuth } from './hooks/useAuth.hook.jsx';
export { useLocalStorage as useLocalStorage } from './hooks/useLocalStorage.hook.js';

import './styles/fonts.css';
import './styles/styles.css';
import './styles/bootstrap-namespaced.css';
