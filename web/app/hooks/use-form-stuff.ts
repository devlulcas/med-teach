import { useState } from "react";
import type z from "zod";
import { zodErrorToFormErrors } from "~/lib/helpers/zod-error-to-form-errors";

type UseFormStuffProps<Z extends z.ZodType> = {
  schema: Z;
};

export function useFormStuff<Z extends z.ZodType>({
  schema,
}: UseFormStuffProps<Z>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [schemaErrors, setSchemaErrors] = useState<z.ZodError<
    z.output<Z>
  > | null>(null);

  const clearErrors = () => {
    setGeneralError(null);
    setSchemaErrors(null);
  };

  const createHandleSubmit = (
    onSubmit: (data: z.infer<Z>) => Promise<void>
  ) => {
    return async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const data = Object.fromEntries(new FormData(e.currentTarget));
      const result = schema.safeParse(data);

      if (!result.success) {
        setGeneralError(null);
        setSchemaErrors(result.error);
        return;
      }

      try {
        await onSubmit(result.data);
      } catch (error) {
        setGeneralError(
          error instanceof Error ? error.message : "Erro desconhecido"
        );
      } finally {
        setIsSubmitting(false);
      }
    };
  };

  const formErrors = zodErrorToFormErrors(schemaErrors);

  return {
    // Loading
    isSubmitting,
    setIsSubmitting,

    // Errors
    generalError,
    schemaErrors,
    formErrors,
    clearErrors,
    setSchemaErrors,
    setGeneralError,

    // Actions
    createHandleSubmit,
  };
}
