import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      profile: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null, profile: null }),
      setProfile: (profile) => set({ profile }),
    }),
    {
      name: "auth-storage",
    }
  )
);
