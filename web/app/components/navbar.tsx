import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Skeleton,
} from "@heroui/react";
import { useState } from "react";
import { FaChartLine, FaSkull, FaUser } from "react-icons/fa6";
import Logo from "~/assets/logo";
import { authClient } from "~/lib/auth/better-auth-client";
import { useSignOut } from "~/lib/auth/use-signout";
import { META_TITLE } from "~/lib/helpers/metadata";
import { useGlobalConfirmationDialog } from "./global-confirmation-dialog";

const menuItems = [
  {
    label: "Início",
    href: "/",
  },
  {
    label: "Funcionalidades",
    href: "/functionalities",
  },
  {
    label: "Feedback",
    href: "/feedback",
  },
];

function UserNavbarContent() {
  const session = authClient.useSession();
  const signOut = useSignOut();
  const { wrapOnConfirm } = useGlobalConfirmationDialog();

  if (session.isPending) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Skeleton className="w-[10ch] h-[2ch] rounded" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </>
    );
  }

  if (session.data) {
    return (
      <NavbarItem>
        <Dropdown placement="bottom-end" className="mt-2">
          <DropdownTrigger>
            <div className="flex items-center gap-2">
              <p
                title={session.data.user.name}
                className="font-semibold max-w-[10ch] truncate capitalize"
              >
                {session.data.user.name}
              </p>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name={session.data.user.name}
                size="sm"
                src={session.data.user.image ?? "/default-avatar.svg"}
              />
            </div>
          </DropdownTrigger>

          <DropdownMenu aria-label="Ações do usuário" variant="flat">
            <DropdownItem
              key="profile"
              as={Link}
              href="/profile"
              className="text-foreground"
              startContent={<FaUser className="size-3" />}
            >
              <p className="max-w-[20ch] truncate">{session.data.user.email}</p>
            </DropdownItem>

            <DropdownItem
              key="dashboard"
              as={Link}
              href="/dashboard"
              startContent={<FaChartLine className="size-3" />}
              color="success"
              className="text-foreground"
            >
              Dashboard
            </DropdownItem>

            <DropdownItem
              key="logout"
              color="danger"
              startContent={<FaSkull className="size-3" />}
              onPress={() =>
                wrapOnConfirm({
                  fn: signOut.execute,
                  title: "Sair",
                  description: "Tem certeza que deseja sair?",
                  confirmText: "Sair",
                  cancelText: "Cancelar",
                })
              }
            >
              <p className="font-semibold">Sair</p>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarItem>
    );
  }

  return (
    <>
      <NavbarItem as={Link} href="/signin">
        Entrar
      </NavbarItem>
      <NavbarItem as={Link} href="/signup">
        Cadastrar
      </NavbarItem>
    </>
  );
}

function MiddleContent({ as }: { as: "item" | "menu-item" }) {
  const Comp = as === "item" ? NavbarItem : NavbarMenuItem;

  return menuItems.map((item) => (
    <Comp key={item.href}>
      <Link href={item.href}>{item.label}</Link>
    </Comp>
  ));
}

export function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <MobileContent isMenuOpen={isMenuOpen} />
        <NavbarBrand>
          <Logo className="size-8 mr-2" />
          <p className="font-bold text-inherit">{META_TITLE}</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <MiddleContent as="item" />
      </NavbarContent>

      <NavbarContent justify="end">
        <UserNavbarContent />
      </NavbarContent>
    </Navbar>
  );
}

function MobileContent({ isMenuOpen }: { isMenuOpen: boolean }) {
  return (
    <>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarMenu>
        <MiddleContent as="menu-item" />
      </NavbarMenu>
    </>
  );
}
