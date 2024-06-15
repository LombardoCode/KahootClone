import create from 'zustand';

type GlobalStore = {
  errors: string[];
  setErrors: (errors: string[]) => void;
  clearErrors: () => void;
};

const useStore = create<GlobalStore>((set) => ({
  errors: [],
  setErrors: (errors: string[]) => set((state) => ({ errors })),
  clearErrors: () => set({ errors: [] })
}));

export default useStore;
