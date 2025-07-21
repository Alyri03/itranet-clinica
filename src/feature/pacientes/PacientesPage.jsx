import { useAuthStore } from "@/store/useAuthStore";
import TablaGestionPaciente from "./recepcionista/components/TablaGestionPacientes";
import ListaPacientes from "./medico/components/ListaPacientes";
import CardPacientes from "./medico/components/CardPacientes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PacientesPage() {
  const rol = useAuthStore((state) => state.user?.rol);

  if (rol === "RECEPCIONISTA" || rol === "ADMINISTRADOR") {
    return (
      <div className="p-6 space-y-6">
        <TablaGestionPaciente />
      </div>
    );
  }
  if (rol === "MEDICO") {
    return (
      <div className="p-6 space-y-6">
        <Tabs defaultValue="lista">
          <div className="flex justify-center mb-4">
            <TabsList className="w-max">
              <TabsTrigger value="lista">Vista de Lista</TabsTrigger>
              <TabsTrigger value="card">Vista de Tarjetas</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="lista">
            <ListaPacientes />
          </TabsContent>

          <TabsContent value="card">
            <CardPacientes />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="p-4 text-center text-muted-foreground">
      No tienes permisos para acceder a esta vista.
    </div>
  );
}
