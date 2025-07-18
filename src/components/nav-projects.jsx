import { useAuthStore } from "@/store/useAuthStore";
import { MODULOS_ROLES } from "@/utils/ModulosRoles";

import {
  CalendarIcon,
  UsersIcon,
  StethoscopeIcon,
  UserCircle,
  HomeIcon,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const ALL_PROJECTS = [
  { key: "main", name: "Inicio", url: "/main", icon: HomeIcon },
  { key: "dashboard", name: "Dashboard", url: "/dashboard", icon: HomeIcon },
  { key: "citas", name: "Citas", url: "/citas", icon: CalendarIcon },
  { key: "pacientes", name: "Pacientes", url: "/pacientes", icon: UsersIcon },
  { key: "medicos", name: "Médicos", url: "/medicos", icon: StethoscopeIcon },
  {
    key: "recepcionistas",
    name: "Recepcionistas",
    url: "/recepcionistas",
    icon: UsersIcon,
  },
  { key: "perfil", name: "Perfil", url: "/perfil", icon: UserCircle },
  { key: "agenda", name: "Agenda", url: "/agenda", icon: CalendarIcon },
  {
    key: "atencion",
    name: "Atención",
    url: "/atencion",
    icon: StethoscopeIcon,
  },
];

export function NavProjects() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const role = (user?.rol || "").toLowerCase(); 

  const allowed = MODULOS_ROLES[role] || [];

  const projects = allowed
    .map((key) => ALL_PROJECTS.find((item) => item.key === key))
    .filter(Boolean);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Módulos</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <SidebarMenuItem
              key={item.key}
              className={isActive ? "bg-muted" : ""}
            >
              <SidebarMenuButton asChild tooltip={item.name}>
                <NavLink
                  to={item.url}
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }
                >
                  <item.icon style={{ marginRight: 10 }} />
                  <span>{item.name}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
