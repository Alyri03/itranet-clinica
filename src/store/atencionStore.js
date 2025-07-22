import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAtencionStore = create(
  persist(
    (set) => ({
      enAtencion: false,
      iniciarAtencion: () => {
        console.log("%c[atencionStore] iniciarAtencion", "color: green");
        set({ enAtencion: true });
      },
      finalizarAtencion: () => {
        console.log("%c[atencionStore] finalizarAtencion", "color: red");
        set({ enAtencion: false });
      },
    }),
    {
      name: "atencion-storage",
      getStorage: () => localStorage,
    }
  )
);
