import { useState } from "react";
import { ZodIssue } from "zod";

interface UseCsvErrorReturn {
  errors: ZodIssue[];
  importErrors: any[];
  showImportErrors: boolean;
  setErrors: (errors: ZodIssue[]) => void;
  setImportErrors: (errors: any[]) => void;
  setShowImportErrors: (show: boolean) => void;
  resetErrors: () => void;
}

export function useCsvError(): UseCsvErrorReturn {
  const [errors, setErrors] = useState<ZodIssue[]>([]);
  const [importErrors, setImportErrors] = useState<any[]>([]);
  const [showImportErrors, setShowImportErrors] = useState(false);

  const resetErrors = () => {
    setErrors([]);
    setImportErrors([]);
    setShowImportErrors(false);
  };

  return {
    errors,
    importErrors,
    showImportErrors,
    setErrors,
    setImportErrors,
    setShowImportErrors,
    resetErrors,
  };
}
