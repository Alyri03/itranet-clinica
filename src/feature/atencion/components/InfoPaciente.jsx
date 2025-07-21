import { usePacientePorId } from "../../pacientes/hooks/usePacientePorId";
import { useAlergiasPorPaciente } from "../../pacientes/hooks/useAlergiasPorPaciente";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Phone, AlertTriangle, Contact, FileText } from "lucide-react";

const mapTipoSangre = {
  A_POSITIVO: "A+",
  A_NEGATIVO: "A-",
  B_POSITIVO: "B+",
  B_NEGATIVO: "B-",
  AB_POSITIVO: "AB+",
  AB_NEGATIVO: "AB-",
  O_POSITIVO: "O+",
  O_NEGATIVO: "O-",
  Raro: "Raro",
};

export default function InfoPaciente({ pacienteId }) {
  const {
    data: paciente,
    isLoading: pacienteLoading,
    isError: pacienteError,
    error: pacienteErrorMsg,
  } = usePacientePorId(pacienteId);

  const {
    data: alergias = [],
    isLoading: alergiasLoading,
    isError: alergiasError,
    error: alergiasErrorMsg,
  } = useAlergiasPorPaciente(pacienteId);

  if (pacienteLoading || alergiasLoading)
    return <p>Cargando información del paciente...</p>;

  if (pacienteError)
    return (
      <p>
        Error al cargar paciente:{" "}
        {pacienteErrorMsg?.message || "Error desconocido"}
      </p>
    );

  if (alergiasError)
    return (
      <p>
        Error al cargar alergias:{" "}
        {alergiasErrorMsg?.message || "Error desconocido"}
      </p>
    );

  if (!paciente) return <p>No se encontró información para este paciente.</p>;

  return (
    <Card className="max-w-md mx-auto border-0 shadow-lg bg-white/90 rounded-lg">
      <CardHeader className=" bg-blue-600 text-white rounded-t-lg px-6 py-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-3">
          <User className="h-5 w-5" />
          {paciente.nombres} {paciente.apellidos}
        </CardTitle>
        <p className="text-blue-100 text-sm mt-1">
          Información detallada del paciente
        </p>
      </CardHeader>
      <CardContent className="px-6 py-6 space-y-6">
        {/* Datos Personales */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            Datos Personales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
            <div>
              <p className="font-medium">Documento:</p>
              <p>
                {paciente.tipoDocumento?.nombre} -{" "}
                {paciente.numeroIdentificacion}
              </p>
            </div>
            <div>
              <p className="font-medium">Fecha de nacimiento:</p>
              <p>{new Date(paciente.fechaNacimiento).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium">Sexo:</p>
              <p>{paciente.sexo}</p>
            </div>
            <div>
              <p className="font-medium">Tipo de sangre:</p>
              <p>{mapTipoSangre[paciente.tipoSangre] || paciente.tipoSangre}</p>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* Información de Contacto */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Phone className="h-4 w-4 text-green-600" />
            Información de Contacto
          </h3>
          <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
            <div>
              <p className="font-medium">Teléfono:</p>
              <p>{paciente.telefono}</p>
            </div>
            <div>
              <p className="font-medium">Dirección:</p>
              <p>{paciente.direccion}</p>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* Contacto de Emergencia */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Contact className="h-4 w-4 text-purple-600" />
            Contacto de Emergencia
          </h3>
          <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
            <div>
              <p className="font-medium">Nombre:</p>
              <p>{paciente.contactoDeEmergenciaNombre || "No disponible"}</p>
            </div>
            <div>
              <p className="font-medium">Teléfono:</p>
              <p>{paciente.contactoDeEmergenciaTelefono || "No disponible"}</p>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* Alergias */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            Alergias
          </h3>
          <div className="space-y-2 text-gray-700 text-sm">
            {alergias.length === 0 ? (
              <p>No se encontraron alergias.</p>
            ) : (
              <ul>
                {alergias.map(({ id, alergia, gravedad }) => (
                  <li key={id} className="flex items-center gap-2">
                    <span className="font-medium">{alergia.nombre}:</span>
                    <span className="text-red-500 font-semibold">
                      {gravedad}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
