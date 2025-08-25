import z from "zod";

export const paginationSchema = z.object({
  page: z.number().min(1).max(500).optional(),
  perPage: z.number().min(1).max(500).optional(),
});

export type Pagination = z.infer<typeof paginationSchema>;

export function paginationToPrisma(pagination: Pagination) {
  const page = pagination.page || 1;
  const perPage = pagination.perPage || 10;

  return {
    take: perPage,
    skip: (page - 1) * perPage,
  };
}

export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  perPage: number;
};
