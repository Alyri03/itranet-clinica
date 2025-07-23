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
            <DialogContent className="w-full max-w-[95vw] sm:max-w-fit px-6 py-4">

                <div className="flex flex-col gap-3">
                    <section className="flex flex-col items-center gap-2">
                        <Calendar />
                        <h2 className="font-bold text-center text-sm sm:text-base">Información general</h2>
                        <div className="flex flex-wrap justify-center gap-3 text-sm">
                            <span><strong>Fecha: </strong>{datosCita?.fecha}</span>
                            <span><strong>Hora: </strong>{datosCita?.hora}</span>
                            <span><strong>Servicio: </strong>{servicio?.nombre}</span>
                            <span><strong>Estado: </strong><Badge variant={badgeVariant}>{datosCita?.estadoCita}</Badge></span>
                        </div>
                    </section>
                    <section className="flex flex-col items-center gap-2">
                        <Hospital />
                        <h2 className="font-bold text-center text-sm sm:text-base">Médico</h2>
                        <div className="flex flex-wrap justify-center gap-3 text-sm">
                            <span><strong>Nombre: </strong>{medico?.nombres}</span>
                            <span><strong>Tipo: </strong>{medico?.tipoMedico}</span>
                            <span><strong>Telefono: </strong>{medico?.telefono}</span>
                        </div>
                    </section>

                    <section className="flex flex-col items-center gap-2">
                        <User />
                        <h2 className="font-bold text-center text-sm sm:text-base">Paciente</h2>
                        <div className="flex flex-wrap justify-center gap-3 text-sm">
                            <span><strong>Nombre: </strong>{paciente?.nombres}</span>
                            <span><strong>Telefono: </strong>{paciente?.telefono}</span>
                            <span><strong>Dirección: </strong>{paciente?.direccion}</span>
                            <span><strong>Sexo: </strong>{paciente?.sexo}</span>
                            <span><strong>Correo: </strong>{paciente?.email}</span>
                            <span><strong>Numero de identificación: </strong>{paciente?.numeroIdentificacion}</span>
                        </div>
                    </section>
                </div>

            </DialogContent>
        </Dialog>
    )
}