"use client";

import { useEffect } from "react"
import axiosInstance from "../utils/axiosConfig"
import useUserStore from "../stores/useUserStore"

export const useUserData = () => {
  const { setUser, clearUser, markLoaded } = useUserStore();

  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      await axiosInstance.get('/auth/me')
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
        .finally(() => {
          if (mounted) {
            markLoaded();
          }
        })
    }

    getUser();

    return () => {
      mounted = false;
    };
  }, []);
}
