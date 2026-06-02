import { create } from "zustand";

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  department: string;
  year: string;
  hostel: string;
}

interface AppState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  walletBalance: number;
  setWalletBalance: (val: number) => void;
  monthlyBudget: number;
  setMonthlyBudget: (val: number) => void;
  notifications: string[];
  addNotification: (msg: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null, // Default to null, will be hydrated via auth flow
  setUser: (user) => set({ user }),
  
  walletBalance: 2500, // Mock initial wallet balance
  setWalletBalance: (walletBalance) => set({ walletBalance }),
  
  monthlyBudget: 5000,
  setMonthlyBudget: (monthlyBudget) => set({ monthlyBudget }),

  notifications: [],
  addNotification: (msg) => set((state) => ({ notifications: [msg, ...state.notifications] })),
}));
