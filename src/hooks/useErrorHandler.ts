import { useState } from "react";
import { useSnackbar } from "notistack";
import { handleApiError, ValidationErrors } from "@/utils/errorHandler";

export const useErrorHandler = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});

  const handleError = (err: any) => {
    const result = handleApiError(err);
    
    if (result.validationErrors) {
      setFieldErrors(result.validationErrors);
      setError(null);
    } else {
      setError(result.message);
      setFieldErrors({});
    }
    
    if (result.shouldShowToast) {
      enqueueSnackbar(result.message, { variant: "error" });
    }
    
    return result;
  };

  const clearErrors = () => {
    setError(null);
    setFieldErrors({});
  };

  return {
    error,
    fieldErrors,
    setFieldErrors,
    handleError,
    clearErrors
  };
};