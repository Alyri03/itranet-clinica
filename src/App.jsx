import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../src/router/layout"


function CitasPage() {
  return <div>Contenido de Citas</div>;
}
function PacientesPage() {
  return <div>Contenido de Pacientes</div>;
}
function MedicosPage() {
  return <div>Contenido de Médicos</div>;
}
function PerfilPage() {
  return <div>Contenido de Perfil</div>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "citas", element: <CitasPage /> },
      { path: "pacientes", element: <PacientesPage /> },
      { path: "medicos", element: <MedicosPage /> },
      { path: "perfil", element: <PerfilPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
