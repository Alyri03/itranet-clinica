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

// Importa tu custom hook:
import { useUserProfile } from "@/feature/perfil/hooks/useUserProfile";

export function NavUser() {
  // Usa el hook para obtener el perfil, loading y error
  const { data: profile, isLoading, isError } = useUserProfile();

  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const logoutStore = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { mutate: logout, isLoading: isLoggingOut } = useLogout({
    onSuccess: () => {
      logoutStore();
      toast.success("Sesión cerrada correctamente");
      navigate("/");
    },
    onError: () => {
      logoutStore();
      toast.error("Error al cerrar sesión. Intenta de nuevo.");
      navigate("/");
    },
  });

  const handleConfirmLogout = () => {
    setOpen(false);
    logout();
  };

  // Loader, error o nulo según el estado de la petición
  if (isLoading)
    return <div className="px-4 py-3 text-sm">Cargando usuario...</div>;
  if (isError || !profile) return null;

  // Procesa los datos del perfil:
  const fullName = `${profile.nombres ?? ""} ${profile.apellidos ?? ""}`.trim();
  const initials =
    (profile.nombres?.[0] ?? "").toUpperCase() +
    (profile.apellidos?.[0] ?? "").toUpperCase();
  const email =
    profile.email || profile.usuario?.correo || profile.correo || "Sin correo";
  const avatarUrl = profile.imagenUrl || null;

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
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={fullName} />
                  ) : null}
                  <AvatarFallback className="bg-gray-700 text-white dark:text-black dark:bg-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{fullName}</span>
                  <span className="truncate text-xs">{email}</span>
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
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={fullName} />
                    ) : null}
                    <AvatarFallback className="bg-gray-700 text-white dark:text-black dark:bg-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{fullName}</span>
                    <span className="truncate text-xs">{email}</span>
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
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
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
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={fullName} />
              ) : null}
              <AvatarFallback className="bg-gray-700 text-white dark:text-black dark:bg-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center space-y-1">
              <div className="font-bold text-lg">{fullName}</div>
              <div className="text-sm text-muted-foreground">{email}</div>
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
