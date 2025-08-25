import { z } from "zod";

export function zodErrorToFormErrors<T>(error: z.core.$ZodError<T> | null) {
  if (!error) return {};

  return z.flattenError(error).fieldErrors;
}
