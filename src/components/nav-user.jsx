import { useState } from "react";
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/feature/auth/hooks/useLogout";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function NavUser() {
  // Aquí deberías obtener el user real del store
  // const user = useAuthStore((s) => s.user);
  // Para pruebas puedes dejarlo estático, pero usa el store en producción
  const user = {
    name: "Luis Martínez",
    email: "luis@prueba.com",
    avatar: "",
    initials: "LM",
    role: "Administrador",
    active: true,
  };

  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const logoutStore = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { mutate: logout, isLoading } = useLogout({
    onSuccess: () => {
      logoutStore();
      toast.success("Sesión cerrada correctamente");
      navigate("/");
    },
    onError: (error) => {
      logoutStore();
      toast.error("Error al cerrar sesión. Intenta de nuevo.");
      navigate("/");
    },
  });

  const handleConfirmLogout = () => {
    setOpen(false);
    logout();
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar>
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-gray-700 text-white dark:text-black dark:bg-white">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56 rounded-lg"
              side="right"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar>
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="bg-gray-700 text-white dark:text-black dark:bg-white">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setOpenProfile(true)}>
                  <BadgeCheck />
                  Cuenta
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpen(true)}>
                <LogOut />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Dialog de confirmación de logout */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Desea cerrar sesión?</DialogTitle>
            <DialogDescription>
              Se cerrará tu sesión actual y regresarás al inicio de sesión.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmLogout}
              disabled={isLoading}
            >
              {isLoading ? "Cerrando..." : "Cerrar sesión"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para ver el perfil */}
      <Dialog open={openProfile} onOpenChange={setOpenProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Perfil de usuario</DialogTitle>
            <DialogDescription>Consulta tus datos de cuenta.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2">
            <Avatar className="w-16 h-16">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : null}
              <AvatarFallback className="bg-gray-700 text-white dark:text-black dark:bg-white">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center space-y-1">
              <div className="font-bold text-lg">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenProfile(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
