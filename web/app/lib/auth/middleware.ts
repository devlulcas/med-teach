import { authContext } from "~/context";
import { LOGIN_URL } from "../helpers/common-links";
import {
  REASON_VALUE_UNAUTHORIZED,
  redirectWithReason,
} from "../helpers/redirect-with-reason";
import { serverLogger } from "../logger/logger.server";
import { auth } from "./better-auth";

type AuthMiddlewareArgs = {
  request: Request;
  context: any;
};

export async function authMiddleware({ request, context }: AuthMiddlewareArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    serverLogger.info(
      { method: request.method, url: request.url },
      "User not authenticated"
    );

    throw redirectWithReason({
      url: LOGIN_URL,
      reason: REASON_VALUE_UNAUTHORIZED,
      message: "Faça login para acessar este recurso!",
    });
  }

  context.set(authContext, session);
}
