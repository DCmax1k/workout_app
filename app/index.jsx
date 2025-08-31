// app/index.jsx
import { Redirect, router } from 'expo-router';
import { useUserStore } from '../stores/useUserStore';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
// import Login from './login'

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

  useEffect(() => {
    if (!loading) {
      // If user exists, redirect to dashboard
      if (user?._id) {
        router.replace('/dashboard');
      } else {
        router.replace('/onboarding');
      }
    }
    
  }, [user, loading, router]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return null;
}