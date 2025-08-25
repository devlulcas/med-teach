import {
  Link,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@heroui/react";
import { FaUser } from "react-icons/fa6";
import { AnimatedAlert } from "~/components/animated-alert";
import { isFail } from "~/lib/helpers/result";
import { useAccountabilityLogFetcher } from "../hooks/use-accountability-log-search-form";
import * as validation from "../validation/find-all.schema";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function AccountabilityTable() {
  const fetcher = useAccountabilityLogFetcher();

  if (fetcher.state === "loading" || fetcher.state === "submitting") {
    return <Spinner label="Carregando..." />;
  }

  if (fetcher.data && isFail(fetcher.data)) {
    return (
      <AnimatedAlert color="danger" title="Algo deu errado!">
        {fetcher.data.fail}
      </AnimatedAlert>
    );
  }

  const data = {
    logs: fetcher.data?.value.data ?? [],
    pagination: fetcher.data?.value ?? {
      ...validation.defaultObject,
      total: 0,
    },
  };

  return (
    <div>
      <Table
        aria-label="Accountability logs"
        removeWrapper
        className="min-w-full"
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Quem</TableColumn>
          <TableColumn>O que</TableColumn>
          <TableColumn>Quando</TableColumn>
          <TableColumn>Ação</TableColumn>
          <TableColumn>Dados</TableColumn>
        </TableHeader>
        <TableBody>
          <>
            {data.logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.id}</TableCell>
                <TableCell>
                  {log.who ? (
                    <User
                      avatarProps={{
                        src: log.who.image ?? undefined,
                        alt: log.who.name ?? undefined,
                        showFallback: true,
                        fallback: <FaUser />,
                      }}
                      description={
                        <Link
                          isExternal
                          href={`/profiles/${log.who.id}`}
                          size="sm"
                        >
                          {log.who.email}
                        </Link>
                      }
                      name={log.who.name}
                    />
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>{log.what}</TableCell>
                <TableCell>{dateFormatter.format(log.when)}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.payload}</TableCell>
              </TableRow>
            ))}

            {data.logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Nenhum log encontrado
                </TableCell>
              </TableRow>
            )}
          </>
        </TableBody>
      </Table>
      <div className="flex justify-center mt-4">
        <Pagination
          total={data.pagination.total}
          initialPage={1}
          page={data.pagination.page}
          onChange={(page) => {
            fetcher.submit(
              { ...validation.defaultObject, page },
              { method: "get" }
            );
          }}
        />
      </div>
    </div>
  );
}
