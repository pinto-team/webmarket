import { AxiosError } from "axios";
import { enqueueSnackbar } from "notistack";

export interface ValidationErrors {
  [field: string]: string;
}

export interface ErrorHandlerResult {
  message: string;
  validationErrors?: ValidationErrors;
  shouldShowToast?: boolean;
}

/**
 * مدیریت مرکزی خطاهای API
 */
export const handleApiError = (error: any): ErrorHandlerResult => {
  // خطای شبکه
  if (!error.response) {
    return {
      message: "خطا در اتصال به سرور",
      shouldShowToast: true
    };
  }

  const { status, data } = error.response;

  switch (status) {
    case 401:
      return {
        message: "جلسه شما منقضی شده است",
        shouldShowToast: false // چون در interceptor هندل میشه
      };

    case 422:
      // خطاهای validation که از interceptor میان
      if (error.validationErrors) {
        return {
          message: error.validationMessage || "اطلاعات وارد شده نامعتبر است",
          validationErrors: error.validationErrors,
          shouldShowToast: false
        };
      }
      return {
        message: data?.message || "اطلاعات وارد شده نامعتبر است",
        shouldShowToast: true
      };

    case 404:
      return {
        message: "اطلاعات مورد نظر یافت نشد",
        shouldShowToast: true
      };

    case 500:
      return {
        message: "خطای داخلی سرور",
        shouldShowToast: true
      };

    default:
      return {
        message: data?.message || "خطای غیرمنتظره",
        shouldShowToast: true
      };
  }
};

/**
 * نمایش خطا با toast
 */
export const showErrorToast = (error: any) => {
  const result = handleApiError(error);
  if (result.shouldShowToast) {
    enqueueSnackbar(result.message, { variant: "error" });
  }
  return result;
};