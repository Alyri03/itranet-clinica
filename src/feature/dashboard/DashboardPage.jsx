import { Users, Calendar, DollarSign } from "lucide-react";
import { usePanelStats } from "./hooks/usePanelStats";
import TablaCitasHoy from "./components/TablaCitasHoy";

export default function DashboardPage() {
  const { data, isLoading, error } = usePanelStats();

  if (isLoading) {
    return (
      <div className="p-10 text-center text-lg font-semibold text-gray-500">
        Cargando estadísticas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-lg font-semibold text-red-500">
        Error cargando estadísticas
      </div>
    );
  }

  const totalPacientes = data?.totalPaciente ?? 0;
  const citasHoy = data?.citasHoy ?? 0;
  const ingresos = data?.ingresosMes ?? 0;

  const cards = [
    {
      key: "totalPacientes",
      title: "Total Pacientes",
      description:
        "Gestiona la información y expedientes clínicos de tus pacientes de manera fácil y segura.",
      icon: Users,
      colors: "from-blue-500 to-blue-600",
      count: totalPacientes,
    },
    {
      key: "citasHoy",
      title: "Citas Hoy",
      description:
        "Consulta las citas programadas el día hoy y agenda nuevas atenciones rápidamente.",
      icon: Calendar,
      colors: "from-indigo-500 to-indigo-600",
      count: citasHoy,
    },
    {
      key: "ingresos",
      title: "Ingresos",
      description: "Visualiza los ingresos generados en el periodo actual.",
      icon: DollarSign,
      colors: "from-purple-500 to-purple-600",
      count: ingresos,
    },
  ];

  return (
    <>
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(({ key, title, description, icon: Icon, colors, count }) => (
          <div
            key={key}
            className={`bg-gradient-to-br ${colors} text-white rounded-2xl shadow-lg flex flex-col md:flex-row items-stretch min-h-[150px] overflow-hidden transition-transform hover:scale-[1.025]`}
          >
            <div className="flex flex-col justify-center px-6 py-6 md:w-2/3 w-full z-10">
              <div className="text-xl font-semibold mb-1">{title}</div>
              <div className="text-white/80 text-sm">{description}</div>
            </div>
            <div className="hidden md:flex w-px bg-white/30 my-6 mx-2" />
            <div className="flex flex-row md:flex-col items-center justify-center px-6 py-6 md:w-[140px] w-full">
              <Icon className="h-8 w-8 text-white mb-2" />
              <span className="text-3xl font-bold md:ml-0 ml-4">{count}</span>
            </div>
          </div>
        ))}
      </div>

      <h1 className="mt-10 text-3xl font-bold text-gray-900 dark:text-white">
        Citas Hoy
      </h1>

      <div className="mt-6 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow">
        <TablaCitasHoy />
      </div>
    </>
  );
}
