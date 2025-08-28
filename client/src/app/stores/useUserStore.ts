import { create } from 'zustand';

type GlobalStore = {
  user: {
    userName: string | null;
  },
  isUserLoaded: boolean;
  markLoaded: () => void;
  setUser: (userName: string) => void;
  clearUser: () => void;
};

const useUserStore = create<GlobalStore>((set) => ({
  user: {
    userName: null
  },
  isUserLoaded: false,
  markLoaded: () => set({
    isUserLoaded: true
  }),
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
