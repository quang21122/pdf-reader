// Authentication hooks
export { useLogin } from "./useLogin";
export { useRegister } from "./useRegister";
export { useForgotPassword } from "./useForgotPassword";
export { useResetPassword } from "./useResetPassword";
export {
  usePasswordVisibility,
  useMultiplePasswordVisibility,
} from "./usePasswordVisibility";

// Form management hooks
export { useFormValidation, commonValidationRules } from "./useFormValidation";
export { useFormState, useSimpleFormState } from "./useFormState";

// OCR hooks
export { useOCR } from "./useOCR";
export { useOCRProgress } from "./useOCRProgress";
export {
  useLanguageSelection,
  SUPPORTED_LANGUAGES,
} from "./useLanguageSelection";

// Navigation hooks
export { useUserMenu } from "./useUserMenu";
export { useNavigation } from "./useNavigation";

// PDF hooks
export { usePDFUrl } from "./usePDFUrl";
export { usePDFValidation } from "./usePDFValidation";

// Type exports
export type {
  ValidationRule,
  ValidationRules,
  ValidationErrors,
} from "./useFormValidation";
export type { FormState, FormStateOptions } from "./useFormState";
export type { OCRResult } from "./useOCR";
export type { OCRProgress } from "./useOCRProgress";
export type { Language } from "./useLanguageSelection";
export type { MenuAction } from "./useUserMenu";
export type { NavigationItem } from "./useNavigation";
export type {
  PDFValidationError,
  PDFValidationResult,
} from "./usePDFValidation";
export type { PDFUrlState, UsePDFUrlOptions } from "./usePDFUrl";
