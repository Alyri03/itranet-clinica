import { Users, Calendar, UserPlus, DollarSign } from "lucide-react";

export default function DashboardPage() {
  // Datos de ejemplo
  const totalPacientes = 120;
  const citasHoy = 8;
  const nuevosPacientes = 5;
  const ingresos = 1500;

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
        "Consulta las citas programadas para hoy y agenda nuevas atenciones rápidamente.",
      icon: Calendar,
      colors: "from-indigo-500 to-indigo-600",
      count: citasHoy,
    },
    {
      key: "nuevosPacientes",
      title: "Nuevos Pacientes",
      description:
        "Revisa los pacientes registrados recientemente para hacerles seguimiento.",
      icon: UserPlus,
      colors: "from-green-500 to-green-600",
      count: nuevosPacientes,
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
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ key, title, description, icon: Icon, colors, count }) => (
          <div
            key={key}
            className={`bg-gradient-to-br ${colors} text-white rounded-2xl shadow-lg flex flex-row items-stretch min-h-[150px] overflow-hidden`}
          >
            <div className="flex flex-col justify-center px-8 py-6 w-full md:w-2/3 z-10">
              <div className="text-xl font-semibold mb-1">{title}</div>
              <div className="text-white/80 text-sm max-w-md">{description}</div>
            </div>
            <div className="hidden md:flex w-px bg-white/30 my-6 mx-2" />
            <div className="flex flex-col items-center justify-center px-6 py-6 w-full md:w-[180px]">
              <Icon className="h-8 w-8 text-white mb-2" />
              <span className="text-3xl font-bold">{count}</span>
            </div>
          </div>
        ))}
      </div>
      <h1 className="mt-10 text-3xl font-bold text-gray-900">Próximas Citas</h1>
    </>
  );
}
