import {
  CalendarIcon,
  UsersIcon,
  StethoscopeIcon,
  UserCircle,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const projects = [
  { key: "citas", name: "Citas", url: "/citas", icon: CalendarIcon },
  { key: "pacientes", name: "Pacientes", url: "/pacientes", icon: UsersIcon },
  { key: "medicos", name: "Médicos", url: "/medicos", icon: StethoscopeIcon },
  { key: "perfil", name: "Perfil", url: "/perfil", icon: UserCircle },
];

export function NavProjects() {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Módulos</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          const isActive = location.pathname === item.url;

          return (
            <SidebarMenuItem
              key={item.name}
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
