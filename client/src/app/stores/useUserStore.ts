import { create } from 'zustand';

interface UserData {
  userName: string | null;
  mediaUrl: string | null;
}

type GlobalStore = {
  user: {
    userName: string | null;
    mediaUrl: string | null;
  },
  isUserLoaded: boolean;
  markLoaded: () => void;
  setUser: (userData: UserData) => void;
  changeUserProfilePicture: (mediaUrl: string | null) => void;
  clearUser: () => void;
};

const useUserStore = create<GlobalStore>((set) => ({
  user: {
    userName: null,
    mediaUrl: null
  },
  isUserLoaded: false,
  markLoaded: () => set({
    isUserLoaded: true
  }),
  setUser: (userData: UserData) => {
    set({ user: userData })
  },
  changeUserProfilePicture: (mediaUrl: string | null) => {
    set((state) => ({
      user: {
        ...state.user,
        mediaUrl
      }
    }))
  },
  clearUser: () => {
    set({
      user: {
        userName: null,
        mediaUrl: null
      }
    })
  }
}));

export default useUserStore;
