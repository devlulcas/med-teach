import { Alert, type AlertProps } from "@heroui/react";
import { motion } from "framer-motion";

const AnimatedAlertComponent = motion(Alert);

export function AnimatedAlert({ children, ...props }: AlertProps) {
  return (
    <AnimatedAlertComponent
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <Alert {...props}>{children}</Alert>
    </AnimatedAlertComponent>
  );
}
