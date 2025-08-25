import { addToast, Button, Form, Input, Link } from "@heroui/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaArrowRight, FaEye, FaEyeSlash, FaHouse } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { z } from "zod";
import Logo from "~/assets/logo";
import { AnimatedAlert } from "~/components/animated-alert";
import { useFormStuff } from "~/hooks/use-form-stuff";
import { authClient } from "~/lib/auth/better-auth-client";

export default function SignIn() {
  return (
    <main className="grid place-items-center h-screen">
      <SignInForm />
    </main>
  );
}

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

function SignInForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useFormStuff({ schema: signInSchema });

  const resetForm = () => {
    form.clearErrors();
    setShowPassword(false);
  };

  const signIn = form.createHandleSubmit(async (data) => {
    const result = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      const message = result.error.message ?? "Erro ao fazer login";
      throw new Error(message);
    }

    addToast({
      title: "Login realizado com sucesso",
      description: "Você já pode fazer login",
      color: "success",
      timeout: 3000,
    });

    resetForm();
    navigate("/");
  });

  return (
    <Form
      onSubmit={signIn}
      onReset={resetForm}
      className="flex flex-col gap-4 w-full max-w-md"
      validationErrors={form.formErrors}
    >
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <Logo className="w-8 h-8 shrink-0 inline-block" />
        Fazer login
      </h1>

      <AnimatePresence mode="wait">
        {form.generalError !== null && (
          <AnimatedAlert color="danger" title="Erro ao fazer login">
            {form.generalError}
          </AnimatedAlert>
        )}
      </AnimatePresence>

      <Input
        isRequired
        errorMessage="Por favor, insira um email válido"
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Insira seu email"
        type="email"
        autoComplete="email"
      />

      <Input
        isRequired
        errorMessage="Por favor, insira uma senha válida"
        label="Senha"
        labelPlacement="outside"
        name="password"
        placeholder="Insira sua senha"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        endContent={
          <Button
            className="-mr-2"
            variant="light"
            size="sm"
            isIconOnly
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </Button>
        }
      />

      <div className="flex gap-2 mt-4 w-full">
        <Button
          type="button"
          disabled={form.isSubmitting}
          variant="flat"
          isIconOnly
          aria-label="Voltar para a página inicial"
          title="Voltar para a página inicial"
          href="/"
          as={Link}
        >
          <FaHouse />
        </Button>
        <Button
          color="primary"
          type="submit"
          isLoading={form.isSubmitting}
          isDisabled={form.isSubmitting}
          className="w-full"
          endContent={<FaArrowRight />}
        >
          Fazer login
        </Button>
        <Button type="reset" disabled={form.isSubmitting} onPress={resetForm}>
          Limpar
        </Button>
      </div>

      <p className="text-sm text-default-500 text-center w-full mt-4">
        Não tem uma conta?{" "}
        <Link href="/signup" size="sm">
          Cadastre-se
        </Link>
      </p>
    </Form>
  );
}
