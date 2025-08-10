import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface UseFormInitializerOptions<T extends FieldValues> {
  schema: z.ZodSchema<any>;
  defaultValues?: any;
  onSubmit: (formValues: T) => Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }>;
  onSuccess?: (formValues: T, data?: any) => void;
  onError?: (error: Error) => void;
  onReset?: () => void;
  successMessage?: string;
  errorMessage?: string;
  resetOnSuccess?: boolean;
}

interface UseFormInitializerReturn<T extends FieldValues> {
  form: UseFormReturn<T>;
  isSubmitting: boolean;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  handleReset: () => void;
}

export function useFormInitializer<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  onSuccess,
  onError,
  onReset,
  successMessage,
  errorMessage,
  resetOnSuccess = true,
}: UseFormInitializerOptions<T>): UseFormInitializerReturn<T> {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onValidSubmit = async (formValues: T) => {
    setIsSubmitting(true);
    try {
      const result = await onSubmit(formValues);

      if (result.success) {
        toast.success(successMessage || result.message);
        onSuccess?.(formValues, result.data);

        if (resetOnSuccess) {
          handleReset();
        }
      } else {
        throw new Error(errorMessage || result.message);
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      const errorMsg = errorMessage || error.message;
      toast.error(errorMsg);
      onError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset(defaultValues);
    onReset?.();
  };

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(onValidSubmit),
    handleReset,
  };
}
