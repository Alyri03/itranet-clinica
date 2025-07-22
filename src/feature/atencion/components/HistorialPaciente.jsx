import * as React from "react";
import useResultadosPorPacienteId from "../../pacientes/hooks/useResultadosPorPacienteId";
import useHistorialClinicoPorPacienteId from "../../pacientes/hooks/useHistorialClinicoPorPacienteId";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Calendar, History } from "lucide-react";

function parseResultados(data) {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.filter(
      (r) =>
        r && typeof r.diagnostico === "string" && r.diagnostico.trim() !== ""
    );
  }
  if (
    typeof data === "object" &&
    data !== null &&
    typeof data.diagnostico === "string" &&
    data.diagnostico.trim() !== ""
  ) {
    return [data];
  }
  return [];
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return "Sin fecha";
  const fecha = new Date(fechaStr);
  if (isNaN(fecha)) return "Sin fecha";
  return fecha.toLocaleDateString();
}

export default function HistorialPaciente({ pacienteId }) {
  const {
    data: resultadosRaw,
    isLoading: loadingResultados,
    isError: errorResultados,
  } = useResultadosPorPacienteId(pacienteId);

  const {
    data: historialRaw,
    isLoading: loadingHistorial,
    isError: errorHistorial,
  } = useHistorialClinicoPorPacienteId(pacienteId);

  const resultados = parseResultados(resultadosRaw);

  const historialFechaMap = React.useMemo(() => {
    if (Array.isArray(historialRaw)) {
      return Object.fromEntries(
        historialRaw
          .filter((x) => x && x.id && x.fecha)
          .map((x) => [x.id, x.fecha])
      );
    }
    if (
      historialRaw &&
      typeof historialRaw === "object" &&
      historialRaw.id &&
      historialRaw.fecha
    ) {
      return { [historialRaw.id]: historialRaw.fecha };
    }
    return {};
  }, [historialRaw]);

  const fallbackFecha = Object.values(historialFechaMap)[0];

  const [resultadoSeleccionado, setResultadoSeleccionado] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // PAGINACION
  const [paginaActual, setPaginaActual] = React.useState(1);
  const resultadosPorPagina = 5;

  const totalPaginas = Math.ceil(resultados.length / resultadosPorPagina);

  // Obtener resultados solo de la página actual
  const resultadosPagina = resultados.slice(
    (paginaActual - 1) * resultadosPorPagina,
    paginaActual * resultadosPorPagina
  );

  if (loadingHistorial || loadingResultados)
    return <p className="text-sm">Cargando historial y resultados...</p>;

  if (errorHistorial)
    return (
      <p className="text-sm text-red-600">Error al cargar historial clínico.</p>
    );

  if (errorResultados)
    return <p className="text-sm text-red-600">Error al cargar resultados.</p>;

  if (!resultados.length)
    return <p className="text-sm">No hay resultados para mostrar.</p>;

  return (
    <Card className="w-full h-full flex flex-col border-0 shadow-lg bg-white/90 rounded-lg">
      <CardHeader className="bg-blue-600 text-white rounded-t-lg p-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <History className="h-5 w-5" />
          Historial Clínico (Todos los resultados)
        </CardTitle>
        <CardDescription className="text-blue-100 text-sm">
          Listado de diagnósticos y tratamientos anteriores.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 py-8 flex-1 flex flex-col">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[150px] text-xs font-semibold text-gray-700">
                Fecha
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-700">
                Diagnóstico
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resultadosPagina.map((resultado) => {
              const fecha =
                historialFechaMap[resultado.historialClinicoId] ||
                fallbackFecha ||
                null;

              return (
                <TableRow
                  key={resultado.id}
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  <TableCell className="font-medium flex items-center gap-2 text-xs text-gray-800">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {fecha ? (
                      formatearFecha(fecha)
                    ) : (
                      <span className="text-gray-400 italic">Sin fecha</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-gray-700">
                    {resultado.diagnostico}
                  </TableCell>
                  <TableCell className="text-xs text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => {
                        setResultadoSeleccionado(resultado);
                        setDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver detalle
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* PAGINACIÓN */}
        <div className="mt-4 flex justify-center items-center gap-4">
          <Button
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual((p) => p - 1)}
          >
            Anterior
          </Button>
          <span>
            Página {paginaActual} de {totalPaginas}
          </span>
          <Button
            disabled={paginaActual === totalPaginas}
            onClick={() => setPaginaActual((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Resultado Detallado
            </DialogTitle>
            <DialogClose />
          </DialogHeader>
          {resultadoSeleccionado && (
            <div className="space-y-2 text-sm text-gray-700">
              <div>
                <strong>Diagnóstico:</strong> {resultadoSeleccionado.diagnostico}
              </div>
              <div>
                <strong>Tratamiento:</strong>{" "}
                {resultadoSeleccionado.tratamiento || "No registrado"}
              </div>
              <div>
                <strong>Notas:</strong>{" "}
                {resultadoSeleccionado.notasResultado || "No registrado"}
              </div>
              <div>
                <strong>Cita ID:</strong>{" "}
                {resultadoSeleccionado.citaId || "No registrado"}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
