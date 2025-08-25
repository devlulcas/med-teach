import type { Prisma } from "@prisma/client";
import {
  paginationToPrisma,
  type Paginated,
  type Pagination,
} from "~/lib/database/pagination";
import { prisma } from "~/lib/database/prisma";
import { isFail, ok, wrapAsync } from "~/lib/helpers/result";

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
  const page = pagination.page || 1;
  const perPage = pagination.perPage || 10;

  const [dataResult, totalResult] = await Promise.all([
    wrapAsync(
      prisma.accountabilityLog.findMany({
        where,
        orderBy,
        take,
        skip,
        include: {
          who: true,
        },
      })
    ),
    wrapAsync(prisma.accountabilityLog.count({ where })),
  ]);

  if (isFail(dataResult)) {
    return dataResult;
  }

  if (isFail(totalResult)) {
    return totalResult;
  }

  const paginated: Paginated<AccountabilityLogWithActor> = {
    data: dataResult.value,
    total: totalResult.value,
    page,
    perPage,
  };

  return ok(paginated);
}
