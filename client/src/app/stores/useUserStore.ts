import { create } from 'zustand';

type GlobalStore = {
  user: {
    userName: string | null;
  },
  setUser: (userName: string) => void;
  clearUser: () => void;
};

const useUserStore = create<GlobalStore>((set) => ({
  user: {
    userName: null
  },
  setUser: (userName: string | null) => {
    set({ user: { userName } })
  },
  clearUser: () => {
    set({
      user: {
        userName: null
      }
    })
  }
}));

export default useUserStore;
