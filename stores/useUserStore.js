
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TestUsers } from '../constants/TestUsers';
import deepMerge from '../util/deepMerge';

const STORAGE_KEY = 'user-storage';
const DSTORAGE_KEY = 'data-storage';


const structuredClone = (value) => JSON.parse(JSON.stringify(value));

const fillMissingKeys = (base, user) => {
  const filled = deepMerge(structuredClone(base), user || {});

  // ensure intermediate objects exist
  if (!filled.tracking) filled.tracking = { insights: {}, logging: {} };
  if (!filled.tracking.insights) filled.tracking.insights = {};
  if (!filled.tracking.logging) filled.tracking.logging = {};
  // optionally fill default logging categories if needed
  Object.keys(USER.tracking.logging).forEach((key) => {
    if (!filled.tracking.logging[key]) {
      filled.tracking.logging[key] = structuredClone(USER.tracking.logging[key]);
    }
  });
  // Remove older beta data
  if (filled?.tracking?.logging["calories"]) {
    delete filled.tracking.logging["calories"];
  }
  // update data
  if (filled?.tracking?.logging["water intake"]) {
    filled.tracking.logging["water intake"].layout = 'water';
  }

  // Remove older expenditure data
  if (filled?.tracking?.insights?.expenditure?.data[0]?.["amount"] === 2312 &&  filled?.tracking?.insights?.expenditure?.data[0]?.["date"] === 1756499105140) {
    filled.tracking.insights.expenditure.data = [];
  }
  return filled;
}

const USER = TestUsers[0]; // Default user

export const useUserStore = create((set, get) => ({

  options: {
    loading: false,
    animateDashboard: false,
    showOnboarding: true,
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
    // Fill in any missing data with default user data
    //const fillUser = {...USER, ...user, }; // Doesnt merge deep
    const fillUser = fillMissingKeys(USER, user);
    const newUsers = {...state.users, [user._id]: fillUser};
    const newFullData = { ...state, user: {...fillUser}, users: newUsers };
    set(newFullData);
    AsyncStorage.setItem(DSTORAGE_KEY, JSON.stringify(newFullData));
  },

  updateUser: (updates) => {
    const state = get();
    if (!state.user) return;
    const user = state.user; // state.users[state.loggedInAs];
    //const newUser = {...user, ...updates};
    const newUser = deepMerge(structuredClone(user), updates);
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
      const data = JSON.parse(checkData);
      const userData = fillMissingKeys(structuredClone(USER), data.user);
      const options = {loading: false, animateDashboard: false, showOnboarding: true, ...data.options };
      const newUsers = {...data.users, [userData._id]: userData};
      set({options, users: newUsers, user: userData});
    } else {
      const checkOldData = await AsyncStorage.getItem(STORAGE_KEY);
      if (checkOldData) {
        // Put all data that might not be in the user
        //const oldUserData = {...USER, ...JSON.parse(checkOldData)};
        //const oldUserData = deepMerge(structuredClone(USER), JSON.parse(checkOldData));
        const oldUserData = fillMissingKeys(structuredClone(USER), JSON.parse(checkOldData));
        const newUsers = {[oldUserData._id]: oldUserData};
        const options = {loading: false, animateDashboard: false, showOnboarding: true,};
        const newFullData = {options, users: newUsers, user: oldUserData};
        set(newFullData);
        AsyncStorage.setItem(DSTORAGE_KEY, JSON.stringify(newFullData));
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