import { redirect } from "react-router";

export const REASON_KEY = "reason";
export const REASON_VALUE_UNAUTHORIZED = "unauthorized";
export const REASON_VALUE_FORBIDDEN = "forbidden";

export type Reason =
  | typeof REASON_VALUE_UNAUTHORIZED
  | typeof REASON_VALUE_FORBIDDEN;

export function redirectWithReason({
  url,
  reason,
  message,
}: {
  url: string;
  reason: Reason;
  message?: string;
}) {
  const urlObject = new URL(url, import.meta.env.VITE_APP_URL);

  urlObject.searchParams.set(REASON_KEY, reason);

  if (message) {
    urlObject.searchParams.set("message", message);
  }

  return redirect(urlObject.toString());
}
