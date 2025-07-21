import ProximasCitas from "./ProximasCitas";
import { useUserProfile } from "../../../perfil/hooks/useUserProfile";
import { Users, Calendar } from "lucide-react";
import doctora from "@/assets/doctora.png";

export default function InicioMedico() {
  const { data: perfil, isLoading } = useUserProfile();

  // Datos de ejemplo
  const totalPacientes = 9;
  const totalCitas = 1;

  if (isLoading) return <p>Cargando perfil...</p>;
  if (!perfil) return <p>No se pudo cargar el perfil.</p>;

  return (
    <div className="p-6">
      {/* CARD GRANDE ENCABEZADO TAMAÑO INTERMEDIO */}
      <div className="bg-gradient-to-tr from-white via-blue-50 to-white rounded-2xl shadow border px-10 py-6 mb-8 flex items-center justify-between gap-4 min-h-[110px] max-h-[150px]">
        <div className="flex-1 min-w-0">
          <span className="text-xs text-blue-700 bg-blue-100 px-3 py-1 rounded-full font-semibold">
            Panel del médico
          </span>
          <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-1 text-gray-900">
            ¡Hola, Dr. {perfil.nombres} {perfil.apellidos}!
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Gestiona tus pacientes, citas y expedientes médicos fácilmente.
          </p>
        </div>
        {/* Imagen, más pequeña y sutil */}
        <div className="relative hidden md:block w-24 h-24 ml-6 shrink-0">
          <div className="absolute inset-0 rounded-full bg-blue-100 z-0" />
          <img
            src={doctora}
            alt="Doctora"
            className="relative z-10 w-full h-full object-contain"
            draggable={false}
          />
        </div>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* PACIENTES */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg border-0 flex flex-row items-stretch min-h-[150px] overflow-hidden">
          {/* Izquierda */}
          <div className="flex flex-col justify-center px-8 py-6 w-full md:w-2/3 z-10">
            <div className="text-xl font-semibold mb-1">Pacientes</div>
            <div className="text-white/80 text-sm mb-3 max-w-md">
              Gestiona la información y expedientes clínicos de tus pacientes de
              manera fácil y segura.
            </div>
            <button
              type="button"
              className="px-5 py-1 bg-white text-blue-600 font-semibold rounded-lg shadow-sm hover:bg-blue-50 transition w-fit"
            >
              Ver pacientes
            </button>
          </div>
          {/* Separador */}
          <div className="hidden md:flex w-px bg-white/30 my-6 mx-2" />
          {/* Derecha */}
          <div className="flex flex-col items-center justify-center px-6 py-6 w-full md:w-[180px]">
            <Users className="h-8 w-8 text-white mb-2" />
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">{totalPacientes}</span>
            </div>
            <span className="text-white/80 text-base font-semibold mt-1">
              Total Pacientes
            </span>
          </div>
        </div>

        {/* CITAS */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl shadow-lg border-0 flex flex-row items-stretch min-h-[150px] overflow-hidden">
          <div className="flex flex-col justify-center px-8 py-6 w-full md:w-2/3 z-10">
            <div className="text-xl font-semibold mb-1">Citas</div>
            <div className="text-white/80 text-sm mb-3 max-w-md">
              Consulta tus próximas citas y agenda nuevas atenciones de forma
              rápida.
            </div>
            <button
              type="button"
              className="px-5 py-1 bg-white text-indigo-600 font-semibold rounded-lg shadow-sm hover:bg-indigo-50 transition w-fit"
            >
              Ver citas
            </button>
          </div>
          <div className="hidden md:flex w-px bg-white/30 my-6 mx-2" />
          <div className="flex flex-col items-center justify-center px-6 py-6 w-full md:w-[180px]">
            <Calendar className="h-8 w-8 text-white mb-2" />
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">{totalCitas}</span>
            </div>
            <span className="text-white/80 text-base font-semibold mt-1">
              Citas
            </span>
          </div>
        </div>
      </div>

      {/* Próximas Citas */}
      <ProximasCitas />
    </div>
  );
}
