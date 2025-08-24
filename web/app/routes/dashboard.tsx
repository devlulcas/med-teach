import type { Route } from "./+types/dashboard";

export function loader({}: Route.LoaderArgs) {
  return {
    user: {
      id: "1",
    },
  };
}

export default function DashboardPage({}: Route.ComponentProps) {
  return <div>Dashboard</div>;
}
