import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';

// Wrap AsyncStorage to match zustand's storage interface
const zustandStorage = {
    getItem: async (key) => {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null; // parse it back into object
    },
    setItem: async (key, value) => {
      await AsyncStorage.setItem(key, JSON.stringify(value)); // stringify before saving
    },
    removeItem: async (key) => {
      await AsyncStorage.removeItem(key);
    },
  };

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      storage: zustandStorage, // <-- use the wrapped storage
    }
  )
);