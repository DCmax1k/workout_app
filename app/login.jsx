import { Image, StyleSheet, Text, View , ScrollView, Pressable} from 'react-native'
import React, { useEffect } from 'react'
import { useUserStore } from '../stores/useUserStore';
import { Redirect, useRouter } from 'expo-router';
import ThemedView from '../components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import Spacer from '../components/Spacer';
import figureOneWeight from "../assets/onboarding/figureOneWeight.png"
import googleIcon from "../assets/onboarding/googleIcon.png"
import appleIconWhite from "../assets/onboarding/appleIconWhite.png"
import { Colors } from '../constants/Colors';

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
    name: 'Test Name',
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
    archivedExercises: {}, // {exerciseId: true, exerciseId: false, ...},
    createdExercises: [],
  //   [{
  //     name: "Bench Press Modifed",
  //     group: "chest"
  //     modified: true,
  //     tracks: ['weight', 'reps'],
  //     description: "A compound exercise that targets the chest, shoulders, and triceps.",
  //     image: require("../assets/exercises/benchPress.png"),
  //     muscleGroups: ["chest", "shoulders", "triceps"],
  //     difficulty: "intermediate",
  //     previousId: "1",
  //     id: "2314234"
  // },],
    completedExercises:{},// { "2": [{date: 23235235, sets: [{weight: "135", reps: "10"}], shared: true,}] }, // by exerciseId
    savedWorkouts:[],// [{name: "Legs", id: "234", exercises: [ {id: "2", note:"", sets: [{lbs: "135", reps: "10"}]},] }, {name: "Chest and Shoulders", id: "2344", exercises: [ {id: "2314234", note:"", sets: [{lbs: "135", reps: "10"}]},{id: "4", note:"", sets: [{lbs: "135", reps: "10"}]}] }, {name: "Back", id: "345", exercises: [ {id: "4", note:"", sets: [{lbs: "135", reps: "10"}]},] }],
    progress: {
      sections: [
        {title: "Analytics",
          widgets:
          {
            weight: {
              data: [ {date: 235234, amount: 190.5, }, {date: 235235, amount: 188.5, }, {date: 235236, amount: 185.5, }, {date: 235237, amount: 185, }, {date: 235238, amount: 187, }, {date: 235239, amount: 185.5, }, {date: 235240, amount: 183.5, } ],
              active: true,
              unit: "lbs",
              layout: "weight", // weight, calorie, 
            },
          }
        },
            
      ]
    },

    pastWorkouts: [], // [{workoutName, time, workoutLength, totalWeightLifted, exercises, fullWorkout}, {workoutName, time, workoutLength, totalWeightLifted, exercises, fullWorkout}, ],

    // Only local not in live db
    activeWorkout: null,
    editActiveWorkout: null,
    activeReopenExercise: null,
};

const Login = () => {
    const users = useUserStore((state) => state.users);
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state => state.setUser));
    const router = useRouter();
    // Login automatically
    useEffect(() => {
        const timoutId = setTimeout(() => {

            // RESET USER
            //setUser(JSON.parse(JSON.stringify(USER)));


            // ReLogin user
            // if (Object.keys(users).length > 0) {
            //   setUser(JSON.parse(JSON.stringify(users[Object.keys(users)[0]])));
            // } 
            

        }, 1000);

        return () => clearTimeout(timoutId);
    }, []);

    const login = () => {
      // ReLogin user
      if (Object.keys(users).length > 0) {
        setUser(JSON.parse(JSON.stringify(users[Object.keys(users)[0]])));
      } else {
        setUser(JSON.parse(JSON.stringify(USER)));
      }
    }

  return user ? (
    <Redirect href={"/dashboard"} />
  )
  : (
    <ThemedView style={{flex: 1, padding: 30}}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <View style={{flexDirection: "column",}}>
            <Spacer height={20} />

            <Text style={{color: "#6684FF", fontSize: 30,  fontFamily: "Bals-Bold"}}>Welcome</Text>
            <Text style={{color: "white", fontSize: 17, fontFamily: "Exo2-ExtraLight"}}>Please login or sign up to start tracking your workouts.</Text>

            <View style={{height: 200}}>
              <Image style={{width: "100%", height: 200, objectFit: "contain",}} source={figureOneWeight} />
            </View>

            <Spacer />

            {/* Third party logins */}
            <View style={{alignItems: "center",}}>

              <View style={{backgroundColor: "white", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 999999}}>
                <Image style={{height: 30, width: 30, marginRight: 15, objectFit: "contain"}} source={googleIcon} />
                <Text style={{fontSize: 17}}>Sign in with Google</Text>
              </View>

              <Spacer />

              <View style={{backgroundColor: "black", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 999999, borderColor: "white", borderWidth: 1}}>
                <Image style={{height: 30, width: 30, marginRight: 15, objectFit: "contain"}} source={appleIconWhite} />
                <Text style={{fontSize: 17, color: "white"}}>Sign in with Apple </Text>
              </View>

            </View>

            <Spacer />

            <View style={{alignItems: "center",}}>

              <Text style={{color: "white", fontSize: 13}}>or login with email</Text>
              
              <Spacer />

              <View style={{height: 80, backgroundColor: "#6684FF", width: "100%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                <Text style={{color: "white", fontSize: 30, fontFamily: "Bals-Bold"}}>Sign up</Text>
              </View>

            </View>

            <Spacer height={20} />

            <View style={{flexDirection: "row"}}>
              <Text style={{color: "white", fontSize: 13}}>You already have an account?</Text>
              <Pressable style={{marginLeft: 5}} onPress={login}>
                <Text style={{color: "#8FA6FF", fontSize: 13}}>Login</Text>
              </Pressable>
            </View>
            
            
            

          </View>
        </ScrollView>
        

        

      </SafeAreaView>
    </ThemedView>
  )
}

export default Login

const styles = StyleSheet.create({})