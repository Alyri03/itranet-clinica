import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      pacienteId: null,
      medicoId: null,
      recepcionistaId: null,
      adminId: null,

      login: (user, extra = {}) =>
        set({
          user,
          pacienteId: extra.pacienteId ?? null,
          medicoId: extra.medicoId ?? null,
          recepcionistaId: extra.recepcionistaId ?? null,
          adminId: extra.adminId ?? null,
        }),

      logout: () =>
        set({
          user: null,
          pacienteId: null,
          medicoId: null,
          recepcionistaId: null,
          adminId: null,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
