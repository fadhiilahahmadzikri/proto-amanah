export type AuthScreen =
  | 'onboarding'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'otp'
  | 'change-password'
  | 'success'
  | 'dashboard'
  | 'id-card'
  | 'presence-history';

export type AuthFormData = {
  fullName: string;
  emailOrPhone: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  otp: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type AuthValidationErrors = Partial<Record<keyof AuthFormData, string>>;
