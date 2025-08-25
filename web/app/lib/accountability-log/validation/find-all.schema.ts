import z from "zod";
import { zfd } from "zod-form-data";

export const schema = zfd.formData({
  search: zfd.text().optional(),
  mode: zfd.text(z.enum(["AND", "OR"])).default("AND"),
  orderBy: zfd
    .text(z.union([z.literal("createdAt"), z.literal("updatedAt")]))
    .default("createdAt"),
  orderDirection: zfd.text(z.enum(["asc", "desc"])).default("desc"),
  who: zfd.text().optional(),
  after: zfd.text().optional(),
  before: zfd.text().optional(),
  page: zfd.numeric(z.coerce.number().min(1)).default(1),
  perPage: zfd.numeric(z.coerce.number().min(1).max(500)).default(10),
});

export function toSearchParams(data: FindAllAccountabilityLogsParams) {
  return new URLSearchParams({
    search: data.search ?? "",
    mode: data.mode,
    orderBy: data.orderBy,
    orderDirection: data.orderDirection,
    who: data.who ?? "",
    after: data.after ?? "",
    before: data.before ?? "",
    page: data.page?.toString() ?? "",
    perPage: data.perPage?.toString() ?? "",
  });
}

export const defaultObject = {
  search: "",
  mode: "AND",
  orderBy: "createdAt",
  orderDirection: "desc",
  who: "",
  after: "",
  before: "",
  page: 1,
  perPage: 10,
} satisfies FindAllAccountabilityLogsParams;

export const defaultSearchParams: URLSearchParams =
  toSearchParams(defaultObject);

export type FindAllAccountabilityLogsParams = z.infer<typeof schema>;
