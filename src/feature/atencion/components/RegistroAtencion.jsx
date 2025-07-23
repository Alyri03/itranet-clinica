import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText, Pill, CircleCheckBig } from "lucide-react";

import { useEnviarResultado } from "../hooks/useEnviarResultado";
import { useAtenderCita } from "../../citas/hooks/useAtenderCita";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAtencionStore } from "@/store/atencionStore"; // <-- Importa el store

export default function RegistroAtencion({ cita }) {
  const { citaId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const finalizarAtencion = useAtencionStore((s) => s.finalizarAtencion); // <-- Usa el hook del store

  // Útil para asegurar persistencia del cambio en el store antes de navegar
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const atenderCita = useAtenderCita({
    onSuccess: async () => {
      queryClient.invalidateQueries(["PacientesDeUnMedico", cita.medicoId]);
      toast.success("Atención finalizada correctamente");
      setOpen(false);
      finalizarAtencion(); // <-- Cambia el estado del store
      await delay(60); // Espera para persistencia localStorage
      navigate("/agenda");
    },
    onError: async (err) => {
      toast.error("Error al marcar como atendida");
      console.error("❌ Error al marcar como atendida", err);
      finalizarAtencion();
      await delay(60);
      navigate("/agenda");
    },
  });

  const enviarResultado = useEnviarResultado({
    onSuccess: () => {
      toast.success("Resultado enviado correctamente");
      atenderCita.mutate(citaId);
    },
    onError: async (err) => {
      toast.error("Error al enviar resultado");
      console.error("❌ Error al enviar resultado", err);
      finalizarAtencion(); // Asegura liberar el flag también aquí
      await delay(60);
      navigate("/agenda");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const diagnostico = e.target.diagnostico.value;
    const tratamiento = e.target.tratamiento.value;
    const notasResultado = e.target.comentario.value;

    const payload = {
      diagnostico,
      tratamiento,
      notasResultado,
      citaId: Number(citaId),
    };

    enviarResultado.mutate(payload);
  };

  return (
    <>
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 h-12 min-w-[220px] rounded-md shadow transition-all duration-200 flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <FileText className="h-5 w-5" />
        Registrar Atención
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registro de atención</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-4">
              <label className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Diagnóstico
              </label>
              <Textarea
                id="diagnostico"
                name="diagnostico"
                placeholder="Ej. Hipertensión esencial"
                required
              />
            </div>
            <div className="flex flex-col gap-4">
              <label className="font-semibold flex items-center gap-2">
                <Pill className="w-4 h-4" />
                Tratamiento
              </label>
              <Textarea
                id="tratamiento"
                name="tratamiento"
                placeholder="Ej. Losartán 50mg cada 12h"
                required
              />
            </div>
            <div className="flex flex-col gap-4">
              <label className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Comentarios
              </label>
              <Textarea
                id="comentario"
                name="comentario"
                placeholder="Notas adicionales del médico"
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2"
                disabled={enviarResultado.isLoading || atenderCita.isLoading}
              >
                <CircleCheckBig className="h-5 w-5" />
                Finalizar atención
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
