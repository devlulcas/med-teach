import { addToast, Button, Form, Input, Link } from "@heroui/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaArrowRight, FaEye, FaEyeSlash, FaHouse } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { z } from "zod";
import Logo from "~/assets/logo";
import { AnimatedAlert } from "~/components/animated-alert";
import { authClient } from "~/lib/auth/better-auth-client";
import { zodErrorToFormErrors } from "~/lib/helpers/zod-error-to-form-errors";

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

type SignInSchema = z.infer<typeof signInSchema>;

function SignInForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [formSchemaError, setFormSchemaError] =
    useState<z.ZodError<SignInSchema> | null>(null);

  const resetForm = () => {
    setGeneralError(null);
    setFormSchemaError(null);
    setShowPassword(false);
  };

  const signIn: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const result = signInSchema.safeParse(data);

    if (!result.success) {
      setFormSchemaError(result.error);
      return;
    }

    await authClient.signIn.email(
      {
        email: result.data.email,
        password: result.data.password,
      },
      {
        onRequest: (_ctx) => {
          setIsLoading(true);
          resetForm();
        },
        onResponse: (_ctx) => {
          setIsLoading(false);
        },
        onSuccess: (_ctx) => {
          addToast({
            title: "Login realizado com sucesso",
            description: "Você já pode fazer login",
            color: "success",
            timeout: 3000,
          });

          resetForm();
          navigate("/");
        },
        onError: (ctx) => {
          setGeneralError(ctx.error.message);
        },
      }
    );
  };

  const formErrors = zodErrorToFormErrors(formSchemaError);

  return (
    <Form
      onSubmit={signIn}
      onReset={resetForm}
      className="flex flex-col gap-4 w-full max-w-md"
      validationErrors={formErrors}
    >
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <Logo className="w-8 h-8 shrink-0 inline-block" />
        Fazer login
      </h1>

      <AnimatePresence mode="wait">
        {generalError !== null && (
          <AnimatedAlert color="danger" title="Erro ao fazer login">
            {generalError}
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
          disabled={isLoading}
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
          isLoading={isLoading}
          isDisabled={isLoading}
          className="w-full"
          endContent={<FaArrowRight />}
        >
          Fazer login
        </Button>
        <Button type="reset" disabled={isLoading} onPress={resetForm}>
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
