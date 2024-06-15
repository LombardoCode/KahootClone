import { jwtDecode } from 'jwt-decode';
import create from 'zustand';

interface JwtBody {
  nameid: null | string;
}

type GlobalStore = {
  user: {
    token: string;
    userName: null | string;
  },
  setUser: (token: string, userName: string | null) => void;
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

const useStore = create<GlobalStore>((set) => ({
  user: {
    token: getTokenFromLocalStorage(),
    userName: decodeJwtToken(getTokenFromLocalStorage())
  },
  setUser: (token: string, userName: null | string) => {
    localStorage.setItem('token', token);

    set({ user: { token, userName } })
  }
}));



export default useStore;
