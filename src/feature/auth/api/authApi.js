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
export async function verifyDocumentApi({ tipoDocumento, documento }) {
  const { data } = await axiosInstance.post("/auth/verify-document", {
    tipoDocumento,
    documento,
  });
  return data;
}

export async function sendVerificationCodeApi({ documento, email }) {
  const { data } = await axiosInstance.post("/auth/send-code", {
    documento,
    email,
  });
  return data;
}

export async function verifyCodeApi({ email, code }) {
  const { data } = await axiosInstance.post(`/auth/verify-code?email=${email}`, {
    code,
  });
  return data;
}

export async function completeRegistrationApi({ documento, email, password }) {
  const { data } = await axiosInstance.post(
    `/auth/complete-registration?documento=${documento}&email=${email}`,
    { email, password }
  );
  return data;
}

export async function fullRegisterApi(fullRegisterData) {
  const { data } = await axiosInstance.post("/auth/register", fullRegisterData);
  return data;
}