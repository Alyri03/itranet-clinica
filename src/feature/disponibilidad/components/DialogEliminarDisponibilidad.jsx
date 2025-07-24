import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDisponibilidadesPorMedico } from "../hooks/useDisponibilidadesPorMedico";
import { useEliminarDisponibilidad } from "../hooks/useEliminarDisponibilidad";
import { useBloquesByMedico } from "../../medicos/hooks/useBloquesByMedico";
import Spinner from "../../../components/Spinner";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

// Modal de confirmación simple
function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading,
  text = "¿Seguro?",
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Confirmar eliminación</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-gray-600 mb-4">{text}</div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1"
          >
            Sí, eliminar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function mostrarDiaYFecha(disponibilidad, bloques) {
  const dia = disponibilidad.diaSemana ?? "";
  // Busca el primer bloque que corresponda a la disponibilidad
  const bloque = bloques.find((b) => b.disponibilidadId === disponibilidad.id);
  if (bloque && bloque.fecha) {
    const fechaStr = format(new Date(bloque.fecha), "dd/MM/yyyy", {
      locale: es,
    });
    return (
      <span>
        <span className="text-blue-800 font-semibold">{dia}</span>
        <span className="ml-1 text-gray-600 font-normal">- {fechaStr}</span>
      </span>
    );
  }
  return <span className="text-blue-800 font-semibold">{dia}</span>;
}

export default function DialogEliminarDisponibilidad({
  open,
  onClose,
  medico,
}) {
  const {
    data: disponibilidades = [],
    isLoading,
    refetch,
  } = useDisponibilidadesPorMedico(medico?.id, { enabled: !!medico });

  // Trae los bloques para buscar la fecha real
  const { data: bloques = [], isLoading: isLoadingBloques } =
    useBloquesByMedico(medico?.id, { enabled: !!medico });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Hook para eliminar
  const { mutate: eliminar, isPending: eliminando } = useEliminarDisponibilidad(
    {
      onSuccess: () => {
        toast.success("Disponibilidad eliminada");
        setConfirmOpen(false);
        setSelectedId(null);
        refetch();
      },
      onError: (e) => {
        toast.error(e?.response?.data?.message || "Error al eliminar");
        setConfirmOpen(false);
        setSelectedId(null);
      },
    }
  );

  const handleOpenConfirm = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId) eliminar(selectedId);
  };

  if (!medico) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Disponibilidades de {medico.nombres} {medico.apellidos}
            </DialogTitle>
          </DialogHeader>

          {isLoading || isLoadingBloques ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Spinner className="w-8 h-8 mb-3" />
              <span className="text-gray-500">
                Cargando disponibilidades...
              </span>
            </div>
          ) : disponibilidades.length === 0 ? (
            <div className="py-6 text-center text-gray-500">
              No hay disponibilidades registradas para este médico.
            </div>
          ) : (
            <div className="space-y-3 max-h-[350px] overflow-y-auto">
              {disponibilidades.map((d) => (
                <div
                  key={d.id}
                  className="flex flex-col md:flex-row md:items-center justify-between border p-3 rounded-md gap-2 bg-muted"
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {mostrarDiaYFecha(d, bloques)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {d.horaInicio?.substring(0, 5)} -{" "}
                      {d.horaFin?.substring(0, 5)}
                    </div>
                    <div className="text-xs text-gray-400">{d.ubicacion}</div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleOpenConfirm(d.id)}
                    disabled={eliminando}
                    className="mt-2 md:mt-0"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              ))}
            </div>
          )}

          <DialogClose asChild>
            <Button variant="outline" className="mt-4 w-full">
              Cerrar
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Modal confirmación custom */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={eliminando}
        text="¿Seguro que deseas eliminar esta disponibilidad?"
      />
    </>
  );
}
