import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { useHref, useNavigate } from "react-router";
import { GlobalConfirmationDialogProvider } from "./components/global-confirmation-dialog";

export function Providers({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <HeroUIProvider navigate={navigate} useHref={useHref} locale="pt-BR">
      <GlobalConfirmationDialogProvider>
        <ToastProvider />
        {children}
      </GlobalConfirmationDialogProvider>
    </HeroUIProvider>
  );
}
