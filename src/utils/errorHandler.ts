import { enqueueSnackbar } from "notistack";
import { t } from "@/i18n/t";

export interface ValidationErrors {
    [field: string]: string;
}

export interface ErrorHandlerResult {
    messageKey: string;
    messageParams?: Record<string, any>;
    validationErrors?: ValidationErrors;
    shouldShowToast?: boolean;
}

export const handleApiError = (error: any): ErrorHandlerResult => {
    if (!error?.response) {
        return {
            messageKey: "errors.network",
            shouldShowToast: true,
        };
    }

    const status = error.response?.status as number | undefined;

    switch (status) {
        case 401:
            return {
                messageKey: "auth.sessionExpired",
                shouldShowToast: false,
            };

        case 422:
            if (error?.validationErrors) {
                return {
                    messageKey: error?.validationMessageKey || "validation.invalidInput",
                    validationErrors: error.validationErrors,
                    shouldShowToast: false,
                };
            }
            return {
                messageKey: "validation.invalidInput",
                shouldShowToast: true,
            };

        case 404:
            return {
                messageKey: "errors.notFound",
                shouldShowToast: true,
            };

        case 500:
            return {
                messageKey: "errors.serverError",
                shouldShowToast: true,
            };

        default:
            return {
                messageKey: "errors.general",
                shouldShowToast: true,
            };
    }
};

export const showErrorToast = (error: any) => {
    const result = handleApiError(error);

    if (result.shouldShowToast) {
        enqueueSnackbar(t(result.messageKey, result.messageParams), { variant: "error" });
    }

    return result;
};
