import type { Prisma } from "@prisma/client";
import { authContext } from "~/context.js";
import * as repository from "~/lib/accountability-log/repository/mod";
import * as validation from "~/lib/accountability-log/validation/find-all.schema.js";
import { authMiddleware } from "~/lib/auth/middleware.js";
import { assertDefined } from "~/lib/helpers/general-assertions.js";
import { fail, isFail } from "~/lib/helpers/result";
import { serverLogger } from "~/lib/logger/logger.server.js";
import type { Route } from "./+types/api.accountability-log.$.tsx";

export const unstable_middleware: Route.unstable_MiddlewareFunction[] = [
  authMiddleware,
];

export async function loader({ request, context }: Route.LoaderArgs) {
  const auth = context.get(authContext);
  assertDefined(auth);

  const url = new URL(request.url);

  const inputResult = validation.schema.safeParse(url.searchParams);

  if (!inputResult.success) {
    serverLogger.warn(
      { error: inputResult.error },
      "Error parsing accountability logs query params"
    );

    return fail(inputResult.error.message);
  }

  const { page, perPage, ...input } = inputResult.data;

  const where: Prisma.AccountabilityLogWhereInput = {
    [input.mode]: {
      OR: [
        { payload: { contains: input.search } },
        { action: { contains: input.search } },
        { who: { name: { contains: input.search } } },
        { who: { email: { contains: input.search } } },
        { what: { contains: input.search } },
      ],
      who: input.who ? { id: input.who } : undefined,
      when: {
        gte: input.after,
        lte: input.before,
      },
    },
  };

  const orderBy: Prisma.AccountabilityLogOrderByWithRelationInput = {
    [input.orderBy]: input.orderDirection,
  };

  const findAllResult = await repository.findAll(where, orderBy, {
    page,
    perPage,
  });

  if (isFail(findAllResult)) {
    serverLogger.error(findAllResult, "Error finding all accountability logs");
  }

  return findAllResult;
}
