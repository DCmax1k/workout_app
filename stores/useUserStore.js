
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TestUsers } from '../constants/TestUsers';
import deepMerge from '../util/deepMerge';

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

  // Update sleep amount layout
  if (!filled?.tracking?.logging?.["sleep amount"]?.extraData.goal) {
    filled.tracking.logging["sleep amount"].extraData.goal = 8;
  }

  if (filled?.tracking?.logging?.["water intake"]?.data[0]?.["date"] === 235234) {
    filled.tracking.logging["water intake"].data = [];
  }

  // Remove older expenditure layout
  if (filled?.tracking?.insights?.expenditure?.layout === "none" ) {
    filled.tracking.insights.expenditure.layout = "expenditure";
  }

  if (filled?.recentActivity?.length === 1 && filled.recentActivity[0].userId==="1" && filled.recentActivity[0].timestamp === "1746060519969") {
    filled.recentActivity = [];
  }

  //filled.tracking.visibleWidgets = ["nutrition"];
  //filled.consumedMeals["12/12/2025"] = [];
  //console.log(JSON.stringify(filled.savedWorkouts.reverse()));

  return filled;
}

const USER = TestUsers[0]; // Default user

export const useUserStore = create((set, get) => {
  // Initial state
  const initialState = {
    options: {
      loading: false,
      animateDashboard: false,
      showOnboarding: true,
      checkAuth: false,
    },
    user: null,
    users: {},
  };

  // Async rehydration from DSTORAGE_KEY
  AsyncStorage.getItem(DSTORAGE_KEY).then((stored) => {
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.user) {
          const userData = fillMissingKeys(structuredClone(USER), data.user);
          const options = { ...initialState.options, ...data.options, loading: false};
          const newUsers = { ...data.users, [userData._id]: userData };
          set({ options, users: newUsers, user: userData });
        } else {
          const options = { ...initialState.options, ...data.options, loading: false };
          const newUsers = { ...data.users, };
          set({ options, users: newUsers, user: null });
        }
        
      } catch (e) {
        console.error('Failed to rehydrate user store:', e);
      }
    }
  });

  return {
    ...initialState,

    setUser: (user) => {
      if (user === null) {
        const newState = { ...get(), user: null };
        set(newState);
        AsyncStorage.setItem(DSTORAGE_KEY, JSON.stringify(newState));
        return;
      }
      const fillUser = fillMissingKeys(USER, user);
      const newUsers = { ...get().users, [user._id]: fillUser };
      const newState = { ...get(), user: fillUser, users: newUsers };
      set(newState);
      AsyncStorage.setItem(DSTORAGE_KEY, JSON.stringify(newState));
    },

    hardSetUsers: (users) => {
      const newState = {...get(), users,};
      set(newState);
      AsyncStorage.setItem(DSTORAGE_KEY, JSON.stringify(newState));
    },

    updateUser: (updates) => {
      const state = get();
      if (!state.user) return;
      const newUser = deepMerge(structuredClone(state.user), updates);
      const newUsers = { ...state.users, [newUser._id]: newUser };
      const newState = { ...state, user: newUser, users: newUsers };
      set(newState);
      AsyncStorage.setItem(DSTORAGE_KEY, JSON.stringify(newState));
    },

    clearUser: () => {
      const newState = { ...get(), user: null };
      set(newState);
      AsyncStorage.setItem(DSTORAGE_KEY, JSON.stringify(newState));
    },

    updateOptions: (updates) => {
      const options = { ...get().options, ...updates };
      const newState = { ...get(), options };
      set(newState);
      AsyncStorage.setItem(DSTORAGE_KEY, JSON.stringify(newState));
    },
  };
});
