// app/index.jsx
import { Redirect, router } from 'expo-router';
import { useUserStore } from '../stores/useUserStore';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

    // return (
    //   <View style={{backgroundColor: "black"}}>
    //     <SafeAreaView>
    //       <ScrollView showsVerticalScrollIndicator={false}  >
    //         <Text selectable={true} style={{color: "white"}}>{JSON.stringify(user)}</Text>
    //       </ScrollView>
          
    //     </SafeAreaView>
          
    //   </View>
    // )

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return null;
}