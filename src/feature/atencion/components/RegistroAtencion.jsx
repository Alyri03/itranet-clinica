import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Pill, CircleCheckBig } from "lucide-react";

import { useEnviarResultado } from "../hooks/useEnviarResultado";
import { useAtenderCita } from "../../citas/hooks/useAtenderCita";
import { useNavigate, useParams } from "react-router-dom";

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
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-lg max-w-4xl mx-auto">
      <CardHeader className="bg-blue-600 text-white rounded-t-lg px-6 py-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-3">
          <FileText className="h-5 w-5" />
          Registro de atención
        </CardTitle>
        <CardDescription className="text-blue-200 text-sm mt-1">
          Complete los campos para finalizar la cita médica.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Diagnóstico */}
            <section className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-md">
                  <FileText className="h-4 w-4 text-blue-700" />
                </div>
                <label
                  htmlFor="diagnostico"
                  className="text-lg font-semibold text-gray-900"
                >
                  Diagnóstico
                </label>
              </div>
              <Textarea
                id="diagnostico"
                name="diagnostico"
                placeholder="Ej. Hipertensión esencial"
                className="min-h-[90px] border border-blue-300 rounded-md resize-none focus:ring-1 focus:ring-blue-600 text-sm"
                required
              />
            </section>

            {/* Tratamiento */}
            <section className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-md">
                  <Pill className="h-4 w-4 text-blue-700" />
                </div>
                <label
                  htmlFor="tratamiento"
                  className="text-lg font-semibold text-gray-900"
                >
                  Tratamiento
                </label>
              </div>
              <Textarea
                id="tratamiento"
                name="tratamiento"
                placeholder="Ej. Losartán 50mg cada 12h"
                className="min-h-[90px] border border-blue-300 rounded-md resize-none focus:ring-1 focus:ring-blue-600 text-sm"
                required
              />
            </section>
          </div>

          {/* Comentarios */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-md">
                <FileText className="h-4 w-4 text-blue-700" />
              </div>
              <label
                htmlFor="comentario"
                className="text-lg font-semibold text-gray-900"
              >
                Comentarios
              </label>
            </div>
            <Textarea
              id="comentario"
              name="comentario"
              placeholder="Notas adicionales del médico"
              className="min-h-[80px] border border-blue-300 rounded-md resize-none focus:ring-1 focus:ring-blue-600 text-sm"
            />
          </section>

          {/* Submit */}
          <CardFooter className="flex justify-end border-t border-gray-300 pt-6">
            <Button
              type="submit"
              size="md"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              disabled={enviarResultado.isLoading || atenderCita.isLoading}
            >
              <CircleCheckBig className="h-5 w-5" />
              Finalizar atención
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
