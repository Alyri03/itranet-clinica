import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import ServiciosGrid from "./ServiciosGrid";
import MedicosGrid from "./MedicosGrid";
import SelectBloquesMedico from "./SelectBloquesMedico";
import NotasCita from "./NotasCita";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useCrearCita } from "../hooks/useCrearCita";
import { useServicios } from "../../medicos/hooks/useServicios";
import { useBloquesByMedico } from "../../medicos/hooks/useBloquesByMedico";
import { useMedico } from "../../medicos/hooks/useMedico";
import { useEspecialidadByMedico } from "../../medicos/hooks/useEspecialidadByMedico";
import { useBuscarPacientePorDocumento } from "../../pacientes/hooks/useBuscarPacientePorDocumento";

export default function CrearCita({ onSuccess }) {
  const user = useAuthStore((s) => s.user);
  const rol = user?.rol;
  const pacienteIdFromAuth = useAuthStore((s) => s.pacienteId);
  const { data: servicios = [] } = useServicios();
  const { data: medicos = [] } = useMedico();

  const [modo, setModo] = useState("servicio");
  const [servicioId, setServicioId] = useState("");
  const [especialidadId, setEspecialidadId] = useState("");
  const [medicoId, setMedicoId] = useState("");
  const [bloqueId, setBloqueId] = useState("");
  const [nota, setNota] = useState("");
  const [dni, setDni] = useState("");

  const { data: bloques = [] } = useBloquesByMedico(medicoId);
  const bloqueSeleccionado = bloques.find((b) => String(b.id) === String(bloqueId));

  const { data: especialidadesMedico = [] } = useEspecialidadByMedico(
    medicoId,
    modo === "medico" && !!medicoId
  );

  const especialidadDelMedico = especialidadesMedico[0]?.especialidadId;
  const servicioEncontrado = servicios.find((s) => s.especialidadId === especialidadDelMedico);
  const servicioIdDesdeMedico = servicioEncontrado?.id ?? null;

  const { mutate: registrarCita, isLoading } = useCrearCita(() => {
    setServicioId("");
    setEspecialidadId("");
    setMedicoId("");
    setBloqueId("");
    setNota("");
    setDni("");
    onSuccess?.();
  });

  const {
    data: pacienteBuscado,
    refetch: buscarPaciente,
    isFetching: buscandoPaciente,
  } = useBuscarPacientePorDocumento(dni, { enabled: false });

  const pacienteId = rol === "PACIENTE" ? pacienteIdFromAuth : pacienteBuscado?.id;

  const handleServicioSeleccionado = (id, especialidad) => {
    setServicioId(id);
    setEspecialidadId(especialidad);
    setMedicoId("");
    setBloqueId("");
  };

  const handleRegistrar = () => {
    if (!pacienteId || !medicoId || !bloqueId || !bloqueSeleccionado) return;

    const body = {
      pacienteId: Number(pacienteId),
      servicioId: modo === "servicio" ? Number(servicioId) : servicioIdDesdeMedico,
      medicoId: Number(medicoId),
      fecha: bloqueSeleccionado.fecha,
      hora: bloqueSeleccionado.horaInicio,
      notas: nota,
      antecedentes: "No hay antecedentes relevantes",
      seguroId: null,
      coberturaId: null,
    };

    registrarCita(body);
    console.log("Enviando cita:", body);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-center">Reservar nueva cita</h2>

      {rol === "RECEPCIONISTA" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Buscar paciente por DNI</label>
          <div className="flex gap-2">
            <Input
              placeholder="Número de DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
            <Button onClick={() => buscarPaciente()} disabled={!dni}>
              Buscar
            </Button>
          </div>
          {buscandoPaciente && <p className="text-sm text-muted-foreground">Buscando paciente...</p>}
          {pacienteBuscado && (
            <p className="text-sm text-green-600">
              Paciente: {pacienteBuscado.nombres} {pacienteBuscado.apellidos}
            </p>
          )}
        </div>
      )}

      <Tabs value={modo} onValueChange={setModo} className="space-y-6 w-full">
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="servicio">Por Servicio</TabsTrigger>
            <TabsTrigger value="medico">Por Médico</TabsTrigger>
          </TabsList>
        </div>

        {/* Por Servicio */}
        <TabsContent value="servicio" className="space-y-6">
          <div>
            <p className="font-medium mb-2">1. Selecciona un servicio</p>
            <ServiciosGrid
              value={servicioId}
              onChange={(id) => {
                const servicio = servicios.find((s) => String(s.id) === String(id));
                handleServicioSeleccionado(id, servicio?.especialidadId);
              }}
            />
          </div>

          {especialidadId && (
            <div>
              <p className="font-medium mb-2">2. Selecciona un médico</p>
              <MedicosGrid especialidadId={especialidadId} value={medicoId} onChange={setMedicoId} />
            </div>
          )}

          {medicoId && (
            <div>
              <p className="font-medium mb-2">3. Selecciona un horario</p>
              <SelectBloquesMedico medicoId={medicoId} value={bloqueId} onChange={setBloqueId} />
            </div>
          )}

          {bloqueId && (
            <div>
              <p className="font-medium mb-2">4. Motivo de consulta</p>
              <NotasCita value={nota} onChange={setNota} />
            </div>
          )}
        </TabsContent>

        {/* Por Médico */}
        <TabsContent value="medico" className="space-y-6">
          <div>
            <p className="font-medium mb-2">1. Selecciona un médico</p>
            <MedicosGrid modoDirecto value={medicoId} onChange={setMedicoId} />
            {especialidadesMedico.length > 0 && (
              <div className="bg-slate-50 border rounded-md p-3 text-sm text-gray-700">
                <p>
                  <strong>Especialidad:</strong> {especialidadesMedico[0]?.nombreEspecialidad || "No especificada"}
                </p>
                <p>
                  <strong>Servicio:</strong> {servicioEncontrado?.nombre || "No asignado"}
                </p>
              </div>
            )}
          </div>

          {medicoId && (
            <div>
              <p className="font-medium mb-2">2. Selecciona un horario</p>
              <SelectBloquesMedico medicoId={medicoId} value={bloqueId} onChange={setBloqueId} />
            </div>
          )}

          {bloqueId && (
            <div>
              <p className="font-medium mb-2">3. Motivo de consulta</p>
              <NotasCita value={nota} onChange={setNota} />
            </div>
          )}
        </TabsContent>
      </Tabs>

      {bloqueId && (
        <div className="flex justify-end pt-4">
          <Button onClick={handleRegistrar} disabled={isLoading || !pacienteId || !medicoId || !bloqueId}>
            {isLoading ? "Registrando..." : "Confirmar cita"}
          </Button>
        </div>
      )}
    </div>
  );
}
