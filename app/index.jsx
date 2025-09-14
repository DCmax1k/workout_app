// app/index.jsx
import { Redirect, router } from 'expo-router';
import { useUserStore } from '../stores/useUserStore';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '../components/ThemedText';
// import Login from './login'

export default function Index() {

  const user = useUserStore((state) => state.user);
  const loading = useUserStore((state) => state.options.loading);


  // Redirect once loading is complete
  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <ThemedText>Loading...</ThemedText>;
    
  }

  return null;
}