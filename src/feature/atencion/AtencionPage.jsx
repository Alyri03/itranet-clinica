import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InfoPaciente from "./components/InfoPaciente";
import HistorialPaciente from "./components/HistorialPaciente";
import RegistroAtencion from "./components/RegistroAtencion";
import { useCitaByID } from "../citas/hooks/useCitaByID";
import { Clock, Info } from "lucide-react";
import { useAtencionStore } from "../../store/atencionStore";
import { toast } from "sonner";
import { useEnviarResultado } from "./hooks/useEnviarResultado";
import { useAtenderCita } from "../citas/hooks/useAtenderCita";
import { useQueryClient } from "@tanstack/react-query";

export default function AtencionPage() {
  const { pacienteId, citaId } = useParams();
  const finalizarAtencion = useAtencionStore((s) => s.finalizarAtencion);
  const enAtencion = useAtencionStore((s) => s.enAtencion);

  console.log(
    "%c[AtencionPage] enAtencion:",
    "color: blue; font-weight: bold;",
    enAtencion
  );

  const [secondsLeft, setSecondsLeft] = useState(30); // SOLO PARA PRUEBAS: 30s
  const intervalRef = useRef();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Mutaciones para enviar resultado y finalizar cita
  const enviarResultado = useEnviarResultado({
    onSuccess: () => {
      console.log(
        "%c[AtencionPage] Resultado enviado automáticamente",
        "color: green;"
      );
      atenderCita.mutate(citaId);
    },
    onError: (err) => {
      toast.error("Error al guardar el resultado automático");
      console.error(err);
      finalizarAtencion(); // forzamos liberar estado aunque falle
      console.log(
        "%c[AtencionPage] finalizarAtencion llamado por error en enviar resultado",
        "color: orange;"
      );
      navigate("/agenda");
    },
  });

  const atenderCita = useAtenderCita({
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Atención finalizada automáticamente");
      finalizarAtencion(); // libera flag
      console.log(
        "%c[AtencionPage] finalizarAtencion llamado por éxito en marcar cita atendida",
        "color: orange;"
      );
      navigate("/agenda");
    },
    onError: (err) => {
      toast.error("Error al marcar cita como atendida");
      console.error(err);
      finalizarAtencion(); // libera flag
      console.log(
        "%c[AtencionPage] finalizarAtencion llamado por error en marcar cita atendida",
        "color: orange;"
      );
      navigate("/agenda");
    },
  });

  // Cronómetro y avisos
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    console.log("%c[AtencionPage] Cronómetro iniciado", "color: purple;");
    return () => {
      clearInterval(intervalRef.current);
      console.log("%c[AtencionPage] Cronómetro detenido", "color: purple;");
    };
  }, []);

  // Avisos toast en los tiempos críticos (modifica avisos para producción)
  useEffect(() => {
    const avisos = [15, 10, 5, 2];
    if (avisos.includes(secondsLeft)) {
      toast.warning(
        `¡Te quedan solo ${secondsLeft} segundo${
          secondsLeft > 1 ? "s" : ""
        } para finalizar la atención!`,
        { duration: 3000 }
      );
      console.log(
        `%c[AtencionPage] Aviso de tiempo restante: ${secondsLeft} segundos`,
        "color: orange;"
      );
    }

    if (secondsLeft === 0) {
      toast.error("Tiempo agotado. La cita será finalizada automáticamente.");
      console.log(
        "%c[AtencionPage] Tiempo agotado, enviando resultado automático",
        "color: red; font-weight: bold;"
      );
      enviarResultado.mutate({
        diagnostico: "Diagnóstico no ingresado",
        tratamiento: "Tratamiento no ingresado",
        notasResultado: "Sin comentarios",
        citaId: Number(citaId),
      });
      // NOTA: no liberar aquí porque se libera en onSuccess/onError de mutación
    }
  }, [secondsLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  // NO liberar finalizarAtencion aquí para que el flag no se reseteé al salir
  // useEffect(() => {
  //   return () => {
  //     finalizarAtencion();
  //     console.log("%c[AtencionPage] finalizarAtencion llamado al desmontar la página", "color: orange;");
  //   };
  // }, []);

  // Hook cita
  const {
    data: cita,
    isLoading,
    isError,
  } = useCitaByID(citaId, {
    onError: (err) => {
      console.error("❌ Error al obtener la cita:", err);
    },
  });

  function formatTime(secs) {
    const h = Math.floor(secs / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((secs % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  if (!pacienteId || !citaId) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Para realizar una atención, debes ir al módulo de agendas y presionar{" "}
        <strong>“Atender paciente”</strong>.
      </div>
    );
  }
  if (isLoading) {
    return <div className="p-4 text-muted-foreground">Cargando cita...</div>;
  }
  if (isError || !cita) {
    return (
      <div className="p-4 text-center text-red-600">
        Error al obtener la cita.
      </div>
    );
  }
  if (cita.estadoCita !== "CONFIRMADA") {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Esta cita no puede ser atendida porque su estado es{" "}
        <strong>{cita.estadoCita}</strong>. Solo se pueden atender citas
        <strong> CONFIRMADAS</strong>.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Encabezado compacto */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 mb-2 p-3 bg-white rounded-lg border max-w-8xl mx-auto">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            {cita.hora?.slice(0, 5)} |{" "}
            {new Date(cita.fecha).toLocaleDateString()}
          </span>
          {cita.notas && (
            <span className="flex items-center gap-1 text-gray-600">
              <Info className="w-4 h-4 text-cyan-500" />
              <span>
                <span className="font-semibold text-gray-700">Notas:</span>{" "}
                {cita.notas}
              </span>
            </span>
          )}
        </div>
        {/* Cronómetro: badge amarillo */}
        <span className="flex items-center gap-1 bg-yellow-200 text-yellow-900 px-3 py-1 rounded-full font-mono text-base shadow-sm border border-yellow-300 select-none">
          <Clock className="w-4 h-4 text-yellow-700" />
          <span className="font-bold tabular-nums">
            {formatTime(secondsLeft)}
          </span>
        </span>
      </div>

      <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch min-h-[600px]">
        <div className="h-full flex flex-col">
          <InfoPaciente pacienteId={pacienteId} />
        </div>
        <div className="h-full flex flex-col">
          <HistorialPaciente pacienteId={pacienteId} />
        </div>
      </div>

      {/* Botón más alto, a la izquierda */}
      <div className="max-w-8xl mx-auto flex justify-start mt-8 mb-8">
        <RegistroAtencion cita={cita} />
      </div>
    </div>
  );
}
