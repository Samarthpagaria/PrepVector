import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  isOpen: boolean;
  message: string;
  type: ToastType;
  openToast: (message: string, type?: ToastType) => void;
  closeToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  isOpen: false,
  message: '',
  type: 'success',
  openToast: (message: string, type: ToastType = 'success') => {
    set({ isOpen: true, message, type });
    setTimeout(() => {
      set({ isOpen: false });
    }, 3000);
  },
  closeToast: () => set({ isOpen: false }),
}));
