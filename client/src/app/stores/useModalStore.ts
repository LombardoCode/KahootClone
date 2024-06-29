import React from 'react';
import { create } from 'zustand'

type ModalStore = {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  setIsOpen: (isOpen: boolean) => void;
  openModal: (title: string, content: React.ReactNode) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  title: '',
  content: null,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  openModal: (title: string, content: React.ReactNode) => set({ isOpen: true, title, content }),
  closeModal: () => set({ isOpen: false, title: '', content: null })
}));

export default useModalStore;
