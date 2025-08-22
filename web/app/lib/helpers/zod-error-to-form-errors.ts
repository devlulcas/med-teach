import { z } from "zod";

export function zodErrorToFormErrors<T>(error: z.ZodError<T> | null) {
  if (!error) return {};

  return z.flattenError(error).fieldErrors;
}
