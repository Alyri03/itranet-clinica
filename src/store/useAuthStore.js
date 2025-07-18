import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      pacienteId: null,
      medicoId: null,
      login: (user, extra = {}) =>
        set({
          user,
          pacienteId: extra.pacienteId ?? null,
          medicoId: extra.medicoId ?? null,
        }),
      logout: () =>
        set({
          user: null,
          pacienteId: null,
          medicoId: null,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
