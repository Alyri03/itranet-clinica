import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {Calendar, Hospital, User } from "lucide-react";
import { normalizarEstadoBadge } from "../../../utils/badgeEstadoNormalizer";


export default function DialogCitaDetalle({ open, cita, onOpenChange }) {
    if (!cita) return null
    const { cita: datosCita, medico, paciente, servicio } = cita
    const badgeVariant = `estado-${normalizarEstadoBadge(
        datosCita?.estadoCita
    )}`;
    return (
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto px-10 py-8 rounded-2xl shadow-lg">
    <div className="space-y-10">

      {/* INFORMACIÓN GENERAL */}
      <section className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-gray-800">Información General</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm text-gray-700">
          <div className="flex flex-col">
            <span className="text-gray-700 font-medium">Fecha:</span>
            <span>{datosCita?.fecha}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-700 font-medium">Hora:</span>
            <span>{datosCita?.hora}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-700 font-medium">Servicio:</span>
            <span>{servicio?.nombre}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-700 font-medium">Estado:</span>
            <Badge variant={badgeVariant}>{datosCita?.estadoCita}</Badge>
          </div>
        </div>
      </section>

      {/* MÉDICO */}
      <section className="space-y-4 border-t pt-6">
        <div className="flex items-center justify-center gap-2">
          <Hospital className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-gray-800">Médico:</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm text-gray-700">
          <div className="flex flex-col">
            <span className="text-gray-700 font-medium">Nombre:</span>
            <span>{medico?.nombres}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-700 font-medium">Tipo:</span>
            <span>{medico?.tipoMedico}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-700 font-medium">Teléfono:</span>
            <span>{medico?.telefono}</span>
          </div>
        </div>
      </section>

      {/* PACIENTE */}
      <section className="space-y-4 border-t pt-6">
        <div className="flex items-center justify-center gap-2">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-gray-800">Paciente:</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm text-gray-700 break-words">
          <div className="flex flex-col">
            <span className="text-gray-700 font-medium">Nombre:</span>
            <span>{paciente?.nombres}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-700 font-medium">Teléfono:</span>
            <span>{paciente?.telefono}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-700 font-medium">Dirección:</span>
            <span>{paciente?.direccion}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-700 font-medium">Sexo:</span>
            <span>{paciente?.sexo}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-700 font-medium">Correo:</span>
            <span>{paciente?.email}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-700 font-medium">N° de Identificación:</span>
            <span>{paciente?.numeroIdentificacion}</span>
          </div>
        </div>
      </section>

    </div>
  </DialogContent>
</Dialog>

    )
}