import { useAuthStore } from "@/store/useAuthStore";
import { usePacientesDeUnMedico } from "../../../citas/hooks/usePacientesDeUnMedico";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ListaPacientes() {
  const medicoId = useAuthStore((s) => s.medicoId);
  const { data: pacientes = [], isLoading, isError } = usePacientesDeUnMedico(medicoId);

  if (isLoading) return <p className="text-muted-foreground">Cargando pacientes...</p>;
  if (isError) return <p className="text-red-500">Error al cargar pacientes</p>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Lista de Pacientes</h2>
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombres</TableHead>
              <TableHead>Apellidos</TableHead>
              <TableHead>Edad</TableHead>
              <TableHead>Sexo</TableHead>
              <TableHead>N° Identificación</TableHead>
              <TableHead>Teléfono</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pacientes.map((paciente, index) => (
              <TableRow key={index}>
                <TableCell>{paciente.nombres}</TableCell>
                <TableCell>{paciente.apellidos}</TableCell>
                <TableCell>{paciente.edad}</TableCell>
                <TableCell>{paciente.sexo}</TableCell>
                <TableCell>{paciente.numeroIdentificacion}</TableCell>
                <TableCell>{paciente.telefono}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
