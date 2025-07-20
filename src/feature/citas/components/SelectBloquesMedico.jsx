import { useState, useMemo } from "react";
import { useBloquesByMedico } from "../../medicos/hooks/useBloquesByMedico";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Spinner from "../../../components/Spinner";

export default function SelectBloquesMedico({ medicoId, value, onChange }) {
  const {
    data: bloques = [],
    isLoading,
    isError,
  } = useBloquesByMedico(medicoId, !!medicoId);

  const diasDisponibles = useMemo(
    () => [...new Set((bloques || []).map((b) => b.fecha))],
    [bloques]
  );
  const [diaSeleccionado, setDiaSeleccionado] = useState("");

  const bloquesDeEseDia = useMemo(
    () => (bloques || []).filter((b) => b.fecha === diaSeleccionado),
    [bloques, diaSeleccionado]
  );

  const bloqueSeleccionado = bloquesDeEseDia.find(
    (b) => String(b.id) === String(value)
  );

  // 👉 Muestra el Spinner mientras carga
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Spinner />
        <span className="mt-3 text-gray-500">Cargando horarios...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        {/* Día */}
        <div className="flex-1 min-w-[210px] max-w-xs w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
            Día disponible
          </label>
          <Select
            value={diaSeleccionado}
            onValueChange={(v) => {
              setDiaSeleccionado(v);
              onChange(""); // limpiar selección anterior
            }}
            disabled={diasDisponibles.length === 0}
          >
            <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-base focus:ring-2 focus:ring-blue-500">
              {diaSeleccionado ? (
                diaSeleccionado
              ) : (
                <span className="text-gray-400">Selecciona un día</span>
              )}
            </SelectTrigger>
            <SelectContent>
              {diasDisponibles.map((dia) => (
                <SelectItem key={dia} value={dia} className="text-center">
                  {dia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Horario */}
        <div className="flex-1 min-w-[210px] max-w-xs w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
            Horario disponible
          </label>
          <Select
            value={value}
            onValueChange={onChange}
            disabled={!diaSeleccionado || bloquesDeEseDia.length === 0}
          >
            <SelectTrigger
              className={`w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-base focus:ring-2 focus:ring-blue-500 ${
                !diaSeleccionado ? "bg-gray-100 text-gray-400" : ""
              }`}
            >
              {!diaSeleccionado ? (
                <span className="text-gray-400">Selecciona un día primero</span>
              ) : bloquesDeEseDia.length === 0 ? (
                <span className="text-gray-400">No hay horarios</span>
              ) : bloqueSeleccionado ? (
                <span className="font-semibold text-blue-700">
                  {bloqueSeleccionado.horaInicio.slice(0, 5)} -{" "}
                  {bloqueSeleccionado.horaFin.slice(0, 5)}
                </span>
              ) : (
                <span className="text-gray-400">Selecciona un horario</span>
              )}
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {bloquesDeEseDia.map((bloque) => (
                <SelectItem
                  key={bloque.id}
                  value={String(bloque.id)}
                  disabled={bloque.estadoBloque === "OCUPADO"}
                  className={`flex justify-between ${
                    bloque.estadoBloque === "OCUPADO"
                      ? "bg-red-50 text-red-700 line-through"
                      : "hover:bg-blue-50"
                  }`}
                >
                  {bloque.horaInicio.slice(0, 5)} - {bloque.horaFin.slice(0, 5)}
                  {bloque.estadoBloque === "OCUPADO" && (
                    <span className="ml-2 text-xs font-semibold">Ocupado</span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Feedback */}
      {isError && (
        <p className="text-red-500 text-xs mt-1 text-center">
          Error al cargar los horarios.
        </p>
      )}
      {!isError && diasDisponibles.length === 0 && (
        <p className="text-orange-500 text-xs mt-1 text-center">
          No hay horarios disponibles para este médico.
        </p>
      )}
    </div>
  );
}
