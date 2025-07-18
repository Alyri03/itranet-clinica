import axiosInstance from "@/lib/axios";

export async function loginApi({ correo, password }) {
  const { data } = await axiosInstance.post("/auth/login", {
    correo,
    password,
  });
  return data;
}
export async function logoutApi() {
  const { data } = await axiosInstance.post("/auth/logout");
  return data;
}
