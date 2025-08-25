import { Card, CardBody, CardHeader } from "@heroui/react";
import { AccountabilityLogSearchForm } from "~/lib/accountability-log/components/accountability-log-search-form";
import { AccountabilityTable } from "~/lib/accountability-log/components/accountability-log-table";
import type { Route } from "./+types/dashboard";

export default function DashboardPage({}: Route.ComponentProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Accountability Dashboard</h1>
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Search Filters</h2>
        </CardHeader>
        <CardBody>
          <AccountabilityLogSearchForm />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Accountability Logs</h2>
        </CardHeader>
        <CardBody>
          <AccountabilityTable />
        </CardBody>
      </Card>
    </div>
  );
}
