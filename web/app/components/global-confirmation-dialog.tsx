import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { createContext, useCallback, useContext, useState } from "react";

type State = {
  isOpen: boolean;
  title: React.ReactNode;
  description: React.ReactNode;
  confirmText: string;
  cancelText: string;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
};

const DEFAULTS: State = {
  isOpen: false,
  title: null,
  description: null,
  confirmText: "Confirmar",
  cancelText: "Cancelar",
  onConfirm: null,
  onCancel: null,
};

type ActionFn = () => void | Promise<void>;

type GlobalConfirmationDialogContextType = [
  State,
  React.Dispatch<React.SetStateAction<State>>
];

const GlobalConfirmationDialogContext =
  createContext<GlobalConfirmationDialogContextType | null>(null);

export function GlobalConfirmationDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<State>(DEFAULTS);

  return (
    <GlobalConfirmationDialogContext.Provider value={[state, setState]}>
      <ConfirmationDialogUI />
      {children}
    </GlobalConfirmationDialogContext.Provider>
  );
}

function useGlobalConfirmationDialogInternal() {
  const context = useContext(GlobalConfirmationDialogContext);
  if (!context) {
    throw new Error(
      "useGlobalConfirmationDialog must be used within a GlobalConfirmationDialogProvider"
    );
  }
  return context;
}

export function useGlobalConfirmationDialog() {
  const [state, setState] = useGlobalConfirmationDialogInternal();

  type WrapOnConfirmOptions = {
    fn: ActionFn;
    onCancel?: ActionFn;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
  };

  const wrapOnConfirm = useCallback(
    (options: WrapOnConfirmOptions) => {
      const handleCancel = () => {
        if (options.onCancel) {
          options.onCancel();
        }

        setState(DEFAULTS);
      };

      const handleConfirm = () => {
        if (options.fn) {
          options.fn();
        }

        setState(DEFAULTS);
      };

      setState((prev) => ({
        ...prev,
        isOpen: true,
        title: options.title,
        description: options.description,
        confirmText: options.confirmText ?? "Confirmar",
        cancelText: options.cancelText ?? "Cancelar",
        onConfirm: handleConfirm,
        onCancel: handleCancel,
      }));
    },
    [setState]
  );

  return { wrapOnConfirm };
}

function ConfirmationDialogUI() {
  const [state, setState] = useGlobalConfirmationDialogInternal();

  const handleClose = () => {
    setState(DEFAULTS);
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={state.isOpen}
      onClose={handleClose}
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{state.title}</ModalHeader>
        <ModalBody>{state.description}</ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={state.onCancel ?? handleClose}
          >
            {state.cancelText}
          </Button>
          <Button color="primary" onPress={state.onConfirm ?? handleClose}>
            {state.confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
