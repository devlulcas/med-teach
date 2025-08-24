import { addToast } from "@heroui/react";
import { useTransition } from "react";
import { authClient } from "./better-auth-client";

export function useSignOut() {
  const [isPending, startTransition] = useTransition();

  const execute = async () => {
    startTransition(async () => {
      try {
        await authClient.signOut();
      } catch (error) {
        addToast({
          title: "Erro ao fazer logout",
          description: "Por favor, tente novamente",
          color: "danger",
        });
      }
    });
  };

  return { execute, isPending };
}
