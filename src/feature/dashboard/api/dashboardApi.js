import axiosInstance from "@/lib/axios";

export const getPanelStats = async () => {
  const res = await axiosInstance.get("/administradores/panel/stats");
  return res.data;
};

export const getCitasHoy = async () => {
  const res = await axiosInstance.get("/citas/todas/hoy");
  return res.data;
};
