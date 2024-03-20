import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TokenState = {
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
};

export const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      accessToken: '',
      setAccessToken: (accessToken: string) =>
        set({ accessToken: accessToken }),
    }),
    {
      name: 'token-storage',
    },
  ),
);
