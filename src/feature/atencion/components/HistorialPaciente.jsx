"use client";
import * as React from "react";
import useResultadosPorPacienteId from "../../pacientes/hooks/useResultadosPorPacienteId";
import useHistorialClinicoPorPacienteId from "../../pacientes/hooks/useHistorialClinicoPorPacienteId";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Eye, Calendar, History } from "lucide-react";

function parseResultados(data) {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.filter(
      (r) => r && typeof r.diagnostico === "string" && r.diagnostico.trim() !== ""
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

  // Parsear resultados (diagnósticos)
  const resultados = parseResultados(resultadosRaw);

  // Parsear historial y crear un mapa { idHistorial: fecha }
  const historialFechaMap = React.useMemo(() => {
    if (!Array.isArray(historialRaw)) return {};
    const map = {};
    for (const item of historialRaw) {
      if (item.id && item.fecha) {
        map[item.id] = item.fecha;
      }
    }
    return map;
  }, [historialRaw]);

  const [resultadoSeleccionado, setResultadoSeleccionado] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  if (loadingHistorial || loadingResultados)
    return <p className="text-sm">Cargando historial y resultados...</p>;

  if (errorHistorial)
    return <p className="text-sm text-red-600">Error al cargar historial clínico.</p>;

  if (errorResultados)
    return <p className="text-sm text-red-600">Error al cargar resultados.</p>;

  if (!resultados.length)
    return <p className="text-sm">No hay resultados para mostrar.</p>;

  return (
    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg p-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <History className="h-5 w-5" />
          Historial Clínico (Todos los resultados)
        </CardTitle>
        <CardDescription className="text-blue-100 text-sm">
          Listado de diagnósticos y tratamientos anteriores.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
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
            {resultados.map((resultado) => {
              // Buscar la fecha usando el historial clínico relacionado
              const fecha = historialFechaMap[resultado.historialClinicoId];
              return (
                <TableRow
                  key={resultado.id}
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  <TableCell className="font-medium flex items-center gap-2 text-xs text-gray-800">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {fecha ? formatearFecha(fecha) : <span className="text-gray-400 italic">Sin fecha</span>}
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
                <strong>Diagnóstico:</strong>{" "}
                {resultadoSeleccionado.diagnostico}
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
