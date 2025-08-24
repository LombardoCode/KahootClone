"use client";

import { useEffect } from "react"
import axiosInstance from "../utils/axiosConfig"
import useUserStore from "../stores/useUserStore"

export const useUserData = () => {
  const { setUser, clearUser } = useUserStore();

  useEffect(() => {
    let mounted = true;

    axiosInstance.get('/auth/me')
      .then(res => {
        if (!mounted) {
          return;
        }

        const name = res.data.user.userName;
        setUser(name);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        clearUser();
      })
    
    return () => {
      mounted = false;
    };
  }, []);
}
