
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'user-storage';
const DSTORAGE_KEY = 'data-storage';

export const useUserStore = create((set, get) => ({

  options: {
    loading: false,
    animateDashboard: false,
  },
  user: null, // loggedInAs user but full details
  users: {},

  setUser: (user) => {
    if (user===null) {
      const data = {...get(), user: null};
      set(data);
      AsyncStorage.setItem(DSTORAGE_KEY, JSON.stringify(data));
      return;
    }
    const state = get();
    const newUsers = {...state.users, [user._id]: user};
    const newFullData = { ...state, user: {...user}, users: newUsers };
    set(newFullData);
    AsyncStorage.setItem(DSTORAGE_KEY, JSON.stringify(newFullData));
  },

  updateUser: (updates) => {
    const state = get();
    if (!state.user) return;
    const user = state.user; // state.users[state.loggedInAs];
    const newUser = {...user, ...updates};
    const newUsers = {...state.users, [state.user?._id]: newUser};
    const newFullData = { ...state, user: newUser, users: newUsers };
    set(newFullData);
    AsyncStorage.setItem(DSTORAGE_KEY, JSON.stringify(newFullData));
  },

  clearUser: () => {
    const newFullData = { ...get(), user: null };
    set(newFullData);
    AsyncStorage.setItem(DSTORAGE_KEY, JSON.stringify(newFullData));
  },

  updateOptions: (updates) => {
    const options = { ...get().options, ...updates };
    set({ options, });
    AsyncStorage.setItem(DSTORAGE_KEY, JSON.stringify({ ...get(), options, }));
  },

  rehydrate: async () => {
    const checkData = await AsyncStorage.getItem(DSTORAGE_KEY);
    if (checkData) {
      set(JSON.parse(checkData));
    } else {
      const checkOldData = await AsyncStorage.getItem(STORAGE_KEY);
      if (checkOldData) {
        const oldUserData = JSON.parse(checkOldData);
        const newUsers = {[oldUserData._id]: oldUserData};
        set({loading: false, users: newUsers, user: oldUserData});
      }
    }
  },
}));
/*

{
  user: user,
}

to

{
  loggedInAs: UserID,
  users: {
    "userID": {...user},
  }
}

*/



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