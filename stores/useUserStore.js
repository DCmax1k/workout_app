
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'user-storage';

export const useUserStore = create((set, get) => ({
  user: null,
  setUser: async (user) => {
    set({ user });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },
  updateUser: async (updates) => {
    const newUser = { ...get().user, ...updates };
    set({ user: newUser });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  },
  clearUser: async () => {
    set({ user: null });
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
  rehydrate: async () => {
    const savedUser = await AsyncStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      set({ user: JSON.parse(savedUser) });
    }
  },
}));



// import { create } from 'zustand';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { persist } from 'zustand/middleware/async-storage';

// // Wrap AsyncStorage to match zustand's storage interface
// const zustandStorage = {
//     getItem: async (key) => {
//       const value = await AsyncStorage.getItem(key);
//       return value ? JSON.parse(value) : null; // parse it back into object
//     },
//     setItem: async (key, value) => {
//       await AsyncStorage.setItem(key, JSON.stringify(value)); // stringify before saving
//     },
//     removeItem: async (key) => {
//       await AsyncStorage.removeItem(key);
//     },
//   };

// export const useUserStore = create(
//   persist(
//     (set) => ({
//       user: null,
//       setUser: (user) => set({ user }),
//       updateUser: (updates) =>
//         set((state) => ({
//           user: { ...state.user, ...updates },
//         })),
//       clearUser: () => set({ user: null }),
//     }),
//     {
//       name: 'user-storage',
//       storage: zustandStorage, // <-- use the wrapped storage
//     }
//   )
// );