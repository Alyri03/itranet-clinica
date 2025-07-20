import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";

import Logo from "@/assets/Logo.png";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex justify-center px-2 py-2">
          <img
            src={Logo}
            alt="Logo de la clínica"
            style={{ width: "120px", height: "auto" }}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavProjects />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
