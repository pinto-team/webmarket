import { useState } from "react";
import { useSnackbar } from "notistack";
import { t } from "@/i18n/t";
import { handleApiError, ValidationErrors } from "@/utils/errorHandler";

export const useErrorHandler = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});

    const handleError = (err: any) => {
        const result = handleApiError(err);

        const message = t(result.messageKey, result.messageParams);

        if (result.validationErrors) {
            setFieldErrors(result.validationErrors);
            setError(null);
        } else {
            setError(message);
            setFieldErrors({});
        }

        if (result.shouldShowToast) {
            enqueueSnackbar(message, { variant: "error" });
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
        clearErrors,
    };
};