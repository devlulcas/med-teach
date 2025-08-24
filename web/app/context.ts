import type { Prisma } from "@prisma/client";
import type * as BetterAuth from "better-auth";
import { unstable_createContext as createMiddlewareContext } from "react-router";

type AuthContextType = null | {
  session: BetterAuth.Session;
  user: BetterAuth.User;
};

export const authContext = createMiddlewareContext<AuthContextType>(null);

type UserContextType = {
  user: null | Prisma.UserGetPayload<{
    include: {
      permissions: true;
      userRoleAssignments: {
        include: {
          role: true;
        };
      };
    };
  }>;
};

export const userContext = createMiddlewareContext<UserContextType>({
  user: null,
});
