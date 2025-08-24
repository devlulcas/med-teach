import type { Prisma } from "@prisma/client";
import z from "zod";
import { authContext } from "~/context.js";
import * as repository from "~/lib/accountability-log/repository/mod";
import { authMiddleware } from "~/lib/auth/middleware.js";
import { paginationSchema } from "~/lib/database/pagination";
import { assertDefined } from "~/lib/helpers/general-assertions.js";
import { fail, isFail } from "~/lib/helpers/result";
import { serverLogger } from "~/lib/logger/logger.server.js";
import type { Route } from "./+types/api.accountability-log.$.tsx";

export const unstable_middleware: Route.unstable_MiddlewareFunction[] = [
  authMiddleware,
];

const getAccountabilityLogsSchema = z
  .object({
    search: z.string().optional(),
    mode: z.enum(["AND", "OR"]).default("AND"),
    orderBy: z
      .union([z.literal("createdAt"), z.literal("updatedAt")])
      .default("createdAt"),
    orderDirection: z.enum(["asc", "desc"]).default("desc"),
    who: z.string().optional(),
    after: z.coerce.date().optional(),
    before: z.coerce.date().optional(),
  })
  .extend(paginationSchema.shape);

export async function loader({ request, context }: Route.LoaderArgs) {
  const auth = context.get(authContext);
  assertDefined(auth);

  const url = new URL(request.url);

  const result = getAccountabilityLogsSchema.safeParse(url.searchParams);

  if (!result.success) {
    serverLogger.warn(
      { error: result.error },
      "Error parsing accountability logs query params"
    );

    return fail(result.error.message);
  }

  const { page, perPage, ...input } = result.data;

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
