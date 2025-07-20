import { useNavigate, useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Pill, CircleCheckBig } from "lucide-react";

import { useEnviarResultado } from "../hooks/useEnviarResultado";
import { useAtenderCita } from "../../citas/hooks/useAtenderCita";

export default function RegistroAtencion({ cita }) {
  const { citaId } = useParams();
  const navigate = useNavigate();

  const atenderCita = useAtenderCita({
    onSuccess: () => {
      navigate("/intranet/medico/agenda");
    },
    onError: (err) => {
      console.error("❌ Error al marcar como atendida", err);
    },
  });

  const enviarResultado = useEnviarResultado({
    onSuccess: (data) => {
      console.log("✅ Resultado enviado", data);
      atenderCita.mutate(citaId);
    },
    onError: (err) => {
      console.error("❌ Error al enviar resultado", err);
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
    <Card className="p-2 mt-4">
      <CardHeader>
        <CardTitle>Registro de atención</CardTitle>
        <CardDescription>Complete los campos para finalizar la cita médica.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Diagnóstico y Comentarios */}
            <div className="flex flex-col gap-4 w-full md:w-1/2">
              <label htmlFor="diagnostico" className="font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <FileText className="text-blue-600" />
                  <span>Diagnóstico</span>
                </div>
              </label>
              <Textarea name="diagnostico" required className="resize-none h-[100px]" placeholder="Ej. Hipertensión esencial" />

              <label htmlFor="comentario" className="font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <FileText className="text-blue-600" />
                  <span>Comentarios</span>
                </div>
              </label>
              <Textarea name="comentario" className="resize-none h-[100px]" placeholder="Notas adicionales del médico" />
            </div>

            {/* Tratamiento */}
            <div className="flex flex-col gap-4 w-full md:w-1/2">
              <label htmlFor="tratamiento" className="font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <Pill className="text-blue-600" />
                  <span>Tratamiento</span>
                </div>
              </label>
              <Textarea name="tratamiento" required className="resize-none h-[236px]" placeholder="Ej. Losartán 50mg cada 12h" />
            </div>
          </div>

          {/* Botón */}
          <CardFooter className="justify-end">
            <Button
              type="submit"
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={enviarResultado.isLoading || atenderCita.isLoading}
            >
              <CircleCheckBig className="w-5 h-5 mr-2" />
              Finalizar atención
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
