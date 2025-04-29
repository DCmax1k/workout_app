import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useUserStore } from '../stores/useUserStore';
import { useRouter } from 'expo-router';

const USER = {
    _id: 1,
    username: "User1",
    name: 'John Doe',
    email: '',
    dateJoined: 234234234,
    rank: 'user',
    premium: false,
    premiumFeatures: {},
    settings: {},
    prefix: '',
    friendRequests: [],
    friendsAdded: [],
    friends: [],
    subscriptions: [],
    profileImg: {},
    trouble: {},
    completedExercises: { "chest": [{date: 23235235, sets: [{weight: "135", reps: "10"}], shared: true,}] },
    savedWorkouts: [{name: "Legs", exercises: [ {name: "Squats", sets: [{weight: "135", reps: "10"}]},] }],
    activeWorkout: {},
    analytics: {
      weight: [ {date: 235234, amount: 190.5, }, {date: 235235, amount: 188.5, }, {date: 235236, amount: 185.5, }, {date: 235237, amount: 185, }, {date: 235238, amount: 187, }, {date: 235239, amount: 185.5, }, {date: 235240, amount: 183.5, } ],	
      expenditure: [ {date: 235234, amount: 2500, }, {date: 235235, amount: 2525, }, {date: 235236, amount: 2520, }, {date: 235237, amount: 2500, }, {date: 235238, amount: 2490, }, {date: 235239, amount: 2480, }, {date: 235240, amount: 2525, } ],	
      sleep: [ {date: 235234, amount: 7.5, }, {date: 235235, amount: 8, }, {date: 235236, amount: 7.5, }, {date: 235237, amount: 7.5, }, {date: 235238, amount: 8, }, {date: 235239, amount: 7.5, }, {date: 235240, amount: 8, } ],
      hydration: [ {date: 235234, amount: 2.5, }, {date: 235235, amount: 2.2, }, {date: 235236, amount: 2.5, }, {date: 235237, amount: 2.4, }, {date: 235238, amount: 2.2, }, {date: 235239, amount: 2, }, {date: 235240, amount: 2.4, } ],
    },
};

const Login = () => {
    const setUser = useUserStore((state => state.setUser));
    const router = useRouter();
    // Login automatically
    useEffect(() => {
        const timoutId = setTimeout(() => {
            setUser(USER);
            router.replace("/dashboard");
        }, 1000);

        return () => clearTimeout(timoutId);
    }, [setUser]);

  return (
    <View>
      <Text>Login</Text>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({})