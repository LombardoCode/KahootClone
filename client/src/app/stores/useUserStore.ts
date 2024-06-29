import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';

interface JwtBody {
  nameid: null | string;
}

type GlobalStore = {
  user: {
    token: string | null;
    userName: string | null;
  },
  setUser: (token: string, userName: string | null) => void;
  clearUser: () => void;
};

const getTokenFromLocalStorage = (): string => {
  return localStorage.getItem('token') || '';
}

const decodeJwtToken = (token: string): string | null => {
  if (token) {
    try {
      return jwtDecode<JwtBody>(token).nameid;
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }
  return null;
}

const useUserStore = create<GlobalStore>((set) => ({
  user: {
    token: getTokenFromLocalStorage(),
    userName: decodeJwtToken(getTokenFromLocalStorage())
  },
  setUser: (token: string, userName: null | string) => {
    localStorage.setItem('token', token);

    set({ user: { token, userName } })
  },
  clearUser: () => {
    localStorage.removeItem('token');
    
    set({
      user: {
        token: null,
        userName: null
      }
    })
  }
}));

export default useUserStore;
