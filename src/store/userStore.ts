import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GoogleUserInfo } from '../types/oauth';

export type UserState = {
  profile: GoogleUserInfo | null;
  setProfile: (profile: GoogleUserInfo | null) => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile: GoogleUserInfo | null) => set({ profile: profile }),
    }),
    {
      name: 'user-storage',
    },
  ),
);
