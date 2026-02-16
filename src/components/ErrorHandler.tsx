"use client";

import { useEffect } from "react";
import { useSnackbar } from "notistack";

export default function ErrorHandler() {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const handleApiError = (event: CustomEvent) => {
      const { message, variant } = event.detail;
      enqueueSnackbar(message, { variant });
    };

    window.addEventListener("api-error", handleApiError as EventListener);

    return () => {
      window.removeEventListener("api-error", handleApiError as EventListener);
    };
  }, [enqueueSnackbar]);

  return null;
}
