import { useParams } from "react-router-dom";
import InfoPaciente from "./components/InfoPaciente";
import HistorialPaciente from "./components/HistorialPaciente";
import RegistroAtencion from "./components/RegistroAtencion";
import { useCitaByID } from "../citas/hooks/useCitaByID";

export default function AtencionPage() {
  const { pacienteId, citaId } = useParams();

  if (!pacienteId || !citaId) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Para realizar una atención, debes ir al módulo de agendas y presionar{" "}
        <strong>“Atender paciente”</strong>.
      </div>
    );
  }

  const {
    data: cita,
    isLoading,
    isError,
  } = useCitaByID(citaId, {
    onError: (err) => {
      console.error("❌ Error al obtener la cita:", err);
    },
  });

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
      <InfoPaciente pacienteId={pacienteId} citaId={citaId} />
      <HistorialPaciente pacienteId={pacienteId} />
      <RegistroAtencion cita={cita} />
    </div>
  );
}
