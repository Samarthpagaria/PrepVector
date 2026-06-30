import { create } from 'zustand'

// Define the User type based on what the backend returns
export interface User {
  _id: string;
  username: string;
  email: string;
  credits: number;
  reportGenerationCount: number;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, // Initially, no user is logged in
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
