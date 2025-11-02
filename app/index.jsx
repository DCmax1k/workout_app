// app/index.jsx
import { Redirect, router } from 'expo-router';
import { useUserStore } from '../stores/useUserStore';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '../components/ThemedText';
import auth from '../util/server/auth';
import Loading from '../components/Loading';
// import Login from './login'

export default function Index() {

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore(state => state.setUser);
  const updateUser = useUserStore(state => state.updateUser);
  const loading = useUserStore((state) => state.options.loading);
  const updateOptions = useUserStore(state => state.updateOptions);


  // Redirect once loading is complete
  useEffect(() => {
    let hasRun = false;

    // Moved to home index and if updateOptions{}
    // const checkAuth = async () => {
    //   const authResponse = await auth(user.jsonWebToken);
    //   if (authResponse.status !== "success") {
    //     // Check if error was network issue of error auth
    //     if (authResponse.status === "network_error") {
    //       // Network error, sign in to loca account
    //       console.log("network error, sign into local account");
    //     } else {
    //       // Auth error, signing out
    //       console.log("auth error, signing out");
    //       //setUser(null);
    //       //router.replace('/onboarding');
    //       //return;
    //     }
    //   } else {
    //     // Auth success, update user with db info
    //     const {userInfo} = authResponse;
    //     updateUser(userInfo);
    //   }
      
    //   router.replace('/dashboard');
    //   updateOptions({loading: false});
    // }

    if (!loading) {
      if (user) {
        if (hasRun) return;
        hasRun=true;
        router.replace('/dashboard');
        updateOptions({loading: false, checkAuth: true});
      } else {
        if (hasRun) return;
        hasRun=true;
        router.replace('/onboarding');
      }
    }


  }, []);


  return <Loading text={user ? "Authenticating..." : "Loading..."} />;

}