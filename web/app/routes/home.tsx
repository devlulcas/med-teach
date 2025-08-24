import { addToast, Button } from "@heroui/react";
import { useGlobalConfirmationDialog } from "~/components/global-confirmation-dialog";
import { auth } from "~/lib/auth/better-auth";
import { META_TITLE } from "~/lib/helpers/metadata";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: META_TITLE },
    { name: "description", content: "Work in progress" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({ headers: request.headers });
  return { user: session?.user };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { wrapOnConfirm } = useGlobalConfirmationDialog();
  return (
    <div className="flex flex-col h-screen relative container mx-auto">
      <h1>Home</h1>
      <pre>{JSON.stringify(loaderData, null, 2)}</pre>
      <Button
        onPress={() =>
          wrapOnConfirm({
            title: "Hello",
            description: "Are you sure you want to do this?",
            fn: () => {
              addToast({
                title: "Hello",
                description: "World",
              });
            },
          })
        }
      >
        Confirm
      </Button>
    </div>
  );
}
