import { useFetcher, useSearchParams } from "react-router";
import { useFormStuff } from "~/hooks/use-form-stuff";
import type { Paginated } from "~/lib/database/pagination";
import type { Result } from "~/lib/helpers/result";
import type { AccountabilityLogWithActor } from "../repository/mod";
import * as validation from "../validation/find-all.schema";

export function useAccountabilityLogFetcher() {
  const fetcher = useFetcher<Result<Paginated<AccountabilityLogWithActor>>>({
    key: "accountability-log",
  });

  return fetcher;
}

export function useAccountabilityLogSearchForm() {
  const [searchParams, setSearchParams] = useSearchParams(
    validation.defaultSearchParams
  );

  const fetcher = useAccountabilityLogFetcher();

  const goGetIt = (searchParams: URLSearchParams) => {
    const endpoint = "/api/accountability-log";
    fetcher.load(endpoint + "?" + searchParams.toString());
  };

  const form = useFormStuff({ schema: validation.schema });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const result = validation.schema.safeParse({ [name]: value });

    if (result.success) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set(name, (value ?? "").toString());
        return newParams;
      });
    } else {
      form.setSchemaErrors(result.error);
    }
  };

  const handleSubmit = form.createHandleSubmit(async (data) => {
    goGetIt(validation.toSearchParams(data));
  });

  return { form, handleChange, handleSubmit, searchParams };
}
