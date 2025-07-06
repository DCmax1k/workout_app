// app/index.jsx
import { Redirect, router } from 'expo-router';
import { useUserStore } from '../stores/useUserStore';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import Login from './login'

export default function Index() {
  // Do Login check here
  const [loading, setLoading] = useState(true);
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    const rehydrate = async () => {
      await useUserStore.getState().rehydrate();
      setLoading(false);  // Mark loading as false after rehydration
    };

    rehydrate();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  // If user exists, show user info
  //console.log(user);
  if (user?._id) {
    return <Redirect href={"/dashboard"} />;
  }

  // If no user, show some fallback or prompt
  return <Login />;
}