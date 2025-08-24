import type { Prisma } from "@prisma/client";
import { paginationToPrisma, type Pagination } from "~/lib/database/pagination";
import { prisma } from "~/lib/database/prisma";
import { wrapAsync, type Result } from "~/lib/helpers/result";

export type AccountabilityLogWithActor = Prisma.AccountabilityLogGetPayload<{
  include: {
    who: true;
  };
}>;

export async function register(log: Prisma.AccountabilityLogCreateInput) {
  const result = await wrapAsync(
    prisma.accountabilityLog.create({ data: log })
  );

  return result;
}

export async function findAll(
  where: Prisma.AccountabilityLogWhereInput,
  orderBy: Prisma.AccountabilityLogOrderByWithRelationInput,
  pagination: Pagination
) {
  const { take, skip } = paginationToPrisma(pagination);

  const result = await wrapAsync(
    prisma.accountabilityLog.findMany({
      where,
      orderBy,
      take,
      skip,
      include: {
        who: true,
      },
    })
  );

  return result satisfies Result<AccountabilityLogWithActor[]>;
}
