import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useUserStore } from '../stores/useUserStore';
import { useRouter } from 'expo-router';

const USER = {
    recentActivity: [{  "userId": "1",
      "timestamp": "1746060519969",
      "type": "posted",
      "details": {
        "postId": "123",
        "title": "User2 started a workout",
        "subtitle": "Chest and shoulders",
      },
      "visibility": "visible" // visible, hidden
    }], // From seperate collection, Activity, received from server

    _id: "1",
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
    schedule: {
      currentIndex: 0,
      rotation: [
        //"234" // Id of workout 1, 0's are rest days
      ],
    },
    createdExercises: [],
  //   [{
  //     name: "Bench Press Modifed",
  //     group: "chest"
  //     modified: true,
  //     tracks: ['lbs', 'reps'],
  //     description: "A compound exercise that targets the chest, shoulders, and triceps.",
  //     image: require("../assets/exercises/benchPress.png"),
  //     muscleGroups: ["chest", "shoulders", "triceps"],
  //     difficulty: "intermediate",
  //     previousId: "1",
  //     id: "2314234"
  // },],
    completedExercises:{},// { "2": [{date: 23235235, sets: [{weight: "135", reps: "10"}], shared: true,}] }, // by exerciseId
    savedWorkouts:[],// [{name: "Legs", id: "234", exercises: [ {id: "2", note:"", sets: [{lbs: "135", reps: "10"}]},] }, {name: "Chest and Shoulders", id: "2344", exercises: [ {id: "2314234", note:"", sets: [{lbs: "135", reps: "10"}]},{id: "4", note:"", sets: [{lbs: "135", reps: "10"}]}] }, {name: "Back", id: "345", exercises: [ {id: "4", note:"", sets: [{lbs: "135", reps: "10"}]},] }],
    analytics: {
      weight: [ {date: 235234, amount: 190.5, }, {date: 235235, amount: 188.5, }, {date: 235236, amount: 185.5, }, {date: 235237, amount: 185, }, {date: 235238, amount: 187, }, {date: 235239, amount: 185.5, }, {date: 235240, amount: 183.5, } ],	
      expenditure: [ {date: 235234, amount: 2500, }, {date: 235235, amount: 2525, }, {date: 235236, amount: 2520, }, {date: 235237, amount: 2500, }, {date: 235238, amount: 2490, }, {date: 235239, amount: 2480, }, {date: 235240, amount: 2525, } ],	
      sleep: [ {date: 235234, amount: 7.5, }, {date: 235235, amount: 8, }, {date: 235236, amount: 7.5, }, {date: 235237, amount: 7.5, }, {date: 235238, amount: 8, }, {date: 235239, amount: 7.5, }, {date: 235240, amount: 8, } ],
      hydration: [ {date: 235234, amount: 2.5, }, {date: 235235, amount: 2.2, }, {date: 235236, amount: 2.5, }, {date: 235237, amount: 2.4, }, {date: 235238, amount: 2.2, }, {date: 235239, amount: 2, }, {date: 235240, amount: 2.4, } ],
    },

    // Only local not in live db
    activeWorkout: {},
    editActiveWorkout: {},
};

const Login = () => {
    const setUser = useUserStore((state => state.setUser));
    const router = useRouter();
    // Login automatically
    useEffect(() => {
        const timoutId = setTimeout(() => {
            setUser(JSON.parse(JSON.stringify(USER)));
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