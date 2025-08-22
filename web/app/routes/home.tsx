import { addToast, Button, Link } from "@heroui/react";
import { motion } from "framer-motion";
import { FaAndroid, FaApple, FaArrowRight } from "react-icons/fa6";
import { useLoaderData } from "react-router";
import Logo from "~/assets/logo";
import { auth } from "~/lib/auth/better-auth";
import { authClient } from "~/lib/auth/better-auth-client";
import { useIsOutOfScreen } from "../modules/home/hooks/use-is-out-of-screen";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({ headers: request.headers });
  return { user: session?.user };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { isOutOfScreen, ref } = useIsOutOfScreen();

  return (
    <div className="flex flex-col h-[200dvh] relative">
      <header className="flex items-center w-full p-4 sticky top-0 z-10 bg-background/50 border-b backdrop-blur-sm border-b-foreground/10">
        <Link href="/" className="flex items-center flex-1">
          <Logo className="w-8 h-8 mr-2" />
          <p className="font-bold text-inherit">Med Teach</p>
        </Link>

        <div className="flex items-center gap-4 flex-1 justify-center">
          <Navbar />
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end">
          {isOutOfScreen && (
            <>
              <DownloadButtonAndroid />
              <DownloadButtonIos />
            </>
          )}

          {loaderData.user ? (
            <>
              <Button
                onPress={async () => {
                  try {
                    await authClient.signOut();
                  } catch (error) {
                    addToast({
                      title: "Erro ao fazer logout",
                      description: "Por favor, tente novamente",
                      color: "danger",
                    });
                  }
                }}
                color="danger"
                href="/signout"
                variant="flat"
              >
                Sair
              </Button>
              <Button
                as={Link}
                color="success"
                href="/dashboard"
                variant="flat"
                endContent={<FaArrowRight />}
              >
                <span className="sr-only lg:not-sr-only">Dashboard</span>
                <span className="lg:sr-only">Dashboard</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">Entrar</Link>
              <Button as={Link} color="primary" href="/signup" variant="flat">
                Cadastrar
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto py-4">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="flex items-center justify-center relative flex-col container">
            <h1 className="text-center inline-block bg-gradient-to-r from-secondary via-cyan-400 to-secondary bg-clip-text text-5xl font-black text-transparent lg:text-9xl mt-[24dvh]">
              Med Teach
            </h1>
            <p className="text-center text-lg mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          <nav ref={ref}>
            {!isOutOfScreen ? (
              <div className="flex items-center gap-4 flex-1 justify-center">
                <DownloadButtonAndroid />
                <DownloadButtonIos />
              </div>
            ) : null}
          </nav>
        </div>
      </main>
    </div>
  );
}

const AnimatedDownloadButton = motion(Button, {
  forwardMotionProps: true,
});

const DOWNLOAD_LINKS = {
  android: "https://play.google.com/store/apps/details?id=com.medapp",
  ios: "https://apps.apple.com/us/app/medapp/id1234567890",
};

function DownloadButtonAndroid() {
  return (
    <AnimatedDownloadButton
      variant="flat"
      as={Link}
      href={DOWNLOAD_LINKS.android}
      className="gap-2"
      layoutId="download-button-android"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FaAndroid className="w-6 h-6" />
      <span className="sr-only lg:not-sr-only">Baixe para Android</span>
      <span className="lg:sr-only">Android</span>
    </AnimatedDownloadButton>
  );
}

function DownloadButtonIos() {
  return (
    <AnimatedDownloadButton
      variant="flat"
      as={Link}
      href={DOWNLOAD_LINKS.ios}
      className="gap-2"
      layoutId="download-button-ios"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FaApple className="w-6 h-6" />
      <span className="sr-only lg:not-sr-only">Baixe para iOS</span>
      <span className="lg:sr-only">iOS</span>
    </AnimatedDownloadButton>
  );
}

function Navbar() {
  const { user } = useLoaderData();

  return (
    <>
      {user ? <Link href="/dashboard">Dashboard</Link> : null}
      <Link color="foreground" href="#resources">
        Recursos
      </Link>
      <Link aria-current="page" href="#about">
        Sobre
      </Link>
      <Link color="foreground" href="#contact">
        Contato
      </Link>
    </>
  );
}
