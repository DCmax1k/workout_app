import { AppState, Dimensions, Modal, Platform, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Redirect, router, Stack, Tabs } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {Colors} from '../../constants/Colors'
import TabBar from '../../components/TabBar'
import { useUserStore } from '../../stores/useUserStore'
import BottomSheet from '@gorhom/bottom-sheet'
import { BottomSheetContext } from '../../context/BottomSheetContext'
import ActiveWorkout from '../../components/workout/ActiveWorkout'
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'
import FinishWorkout from '../../components/workout/FinishWorkout'
import { PaperProvider, Provider } from 'react-native-paper'
import StackTabBar from '../../components/StackTabBar'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import AlertNotification from '../../components/AlertNotification'
import auth from '../../util/server/auth'
import { socket } from '../../util/server/socket'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import noInternet from '../../assets/icons/noInternet.svg'

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

const Dashboard = () => {
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore(state => state.updateUser);
  const options = useUserStore(state => state.options);
  const updateOptions = useUserStore((state) => state.updateOptions);
  const {animateDashboard} = useUserStore((state) => state.options);
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme];

  const testingWorkout = {name: "Legs", id: "234", exercises: [ {id: "2", note:"", tracks: [], sets: [{lbs: "135", reps: "10"}]},], fullWorkout: {name: "Legs", id: "234", exercises: [ {id: "2", note:"", tracks: [], sets: [{lbs: "135", reps: "10"}]},], } };
  const [finishWorkoutData, setFinishWorkoutData] = useState(null);

  const alertRef = useRef(null);

  const finishWorkoutPositionTop = useSharedValue(screenHeight);
  const finishWorkoutStyle = useAnimatedStyle(() => {
    return {
      top: finishWorkoutPositionTop.value,
    }
  }, [])

  const showAlert = (message, good=true, time=3000) => {
    alertRef.current.showAlert(message, good, time);
  }

  const [showDisconnectIndicator, setShowDisconnectIndicator] = useState(false);

  useEffect(() => {
    let intervalId;

    // Only start checking if disconnected
    if (showDisconnectIndicator) {
      intervalId = setInterval(async () => {


          await checkAuth();
        }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showDisconnectIndicator]);

  const checkAuth = async () => {
    console.log("Called check auth");
    if (!user.jsonWebToken) {
      showAlert("No authentication token provided.", false);
      setTimeout(() => {
        showAlert("Please go to Profile -> Account Recovery to transfer your data and back up your account.", false);
      }, 1500);
      
      return;
    } 
    const authResponse = await auth(user.jsonWebToken);
    //console.log("auth response", authResponse);
    if (authResponse.status !== "success") {
      // Check if error was network issue of error auth
      if (authResponse.status === "network_error") {
        // Network error, sign in to local account
        console.log("network error, sign into local account");
        // Swtich this network error alert to a no internet logo
        //showAlert(authResponse.message, false);
        setShowDisconnectIndicator(true);
      } else {
        // Auth error, signing out
        console.log("auth error");
        showAlert(authResponse.message, false); 
        //setUser(null);
        //router.replace('/onboarding'); // Probably dont need from home index
        setShowDisconnectIndicator(false);
        //return;
      }
    } else {
      // Auth success, update user with db info, connect socket
      setShowDisconnectIndicator(false);
      console.log("Successfully authenticated");
      if (!authResponse.goodVersion) {
        showAlert("Version outdated! A new updated developement build is available.", true);
        setTimeout(() => {showAlert("If not provided, ask the developer for the new build.", true, 6000)}, 1500)
      };
      //showAlert("Successfully authenticated", true);
      const {userInfo} = authResponse;
      updateUser(userInfo);
      // Start SOCKET IO connection
      console.log("Connecting socket...");
      if (!socket.connected) {
        socket.connect();
        socket.emit("join_room", userInfo.dbId);
        
      } else {
        console.log("Already connected");
      }
    }
    updateOptions({checkAuth: false});
    
    
  }

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextState => {
      if (appState.current.match(/inactive|background/) && nextState === "active") {
        console.log("📲 App has come back to foreground!");
        // Run your function here
        checkAuth();
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, []);

  const sheetRef = useRef(null);
  // Check auth - Move to dashboard layout
  useEffect(() => {

    socket.on('connect', () => {
      console.log("connected");
      socket.emit("join_room", user.dbId);
    });

    socket.on("receive_recent_activity", (activity) => {
      if (!activity) return;
      // Update client with activity model
      const recentActivity = user.recentActivity;
      const newRecentActivity = [activity, ...recentActivity];
      console.log("Activity received: ", activity);
      updateUser({recentActivity: newRecentActivity});
    });

    socket.on("receive_activity_react", ({senderID, activityInfo, emoji}) => {
      if (!activityInfo || !emoji || !senderID) return;
      // Update client with new react in recent activity
      const allRecentActivity = user.recentActivity;
      const idx = allRecentActivity.findIndex(a => a._id === activityInfo._id);
      if (idx < 0) return console.log('React not added to undefined activity');
      const activity = allRecentActivity[idx];

      const reactions = activity.reactions ?? {};
      Object.keys(reactions).forEach(e => {
          if (reactions[e].includes(senderID)) {
              reactions[e] = reactions[e].filter(id => id !== senderID)
          }
      });
      if (emoji) {
          if (reactions[emoji]) {
              reactions[emoji] = [...reactions[emoji], senderID];
          } else {
              reactions[emoji] = [senderID];
          }
      }
      allRecentActivity[idx].reactions = reactions;
      updateUser({recentActivity: allRecentActivity});
    });

    socket.on("receive_add_user", ({userInfo}) => {
      if (!userInfo) return;
      if (user.friendsAdded.findIndex(f => f._id === userInfo._id) < 0) {
        // Client update as a a friend request received
        const friendRequests = user.friendRequests.filter(fr => fr._id !== userInfo._id);
        updateUser({friendRequests: [{...userInfo, read: false}, ...friendRequests]});
      } else {
        // Request was from someone in our added, just remove from friendsAdded and add to friends
        const newAdded = user.friendsAdded.filter(fa => fa._id !== userInfo._id);
        const newFriends = [...user.friends, userInfo];
        updateUser({friendsAdded: newAdded, friends: newFriends});
      }
    });

    socket.on("receive_unadd_user", ({userInfo}) => {
      if (!userInfo) return;
      if (user.friends.findIndex(f => f._id === userInfo._id) < 0) {
        // User is not a friend, so remove the friend request
        const friendRequests = user.friendRequests.filter(fr => fr._id !== userInfo._id);
        updateUser({friendRequests: [...friendRequests]});
      } else {
        // User is friend, so remove from friends
        const newFriends = user.friends.filter(f => f._id !== userInfo._id);
        updateUser({friends: newFriends});
      }
    });

    socket.on("receive_reject_user", ({userInfo}) => {
      if (!userInfo) return;
      // User is not a friend, so remove the friend request
      const friendsAdded = user.friendsAdded.filter(fr => fr._id !== userInfo._id);
      updateUser({friendsAdded,});

    });

    

    if (options.checkAuth) {
      //console.log("Calling checkAuth");
      checkAuth();
    }

    return () => {
      socket.off();
    }
  }, [user, updateUser, options.checkAuth]);

    useEffect(() => {
      if (animateDashboard) {
        // do your animation here
        // then reset so future visits are default
        setTimeout(() => {
            updateOptions({ animateDashboard: false });
        }, 1000)
      }

      //showFinishWorkout(testingWorkout);
    }, [animateDashboard]);

  

  const tabBarHeight = 115;
  const activePreview = 85;
  const firstSnap = tabBarHeight+activePreview;
  const snapPoints = [firstSnap, 0.95*screenHeight];

  const animatedPosition = useSharedValue(0);
  
  // Bottom sheet position
  const [currentPosition, setCurrentPosition] = React.useState(0);
  const [currentRoute, setCurrentRoute] = useState(0); // route index 

  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleCloseSheet = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  

  const animatedFinishOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedPosition.value,
      [screenHeight-firstSnap-30, screenHeight-0.95 * screenHeight],
      [0, 1], Extrapolation.CLAMP );
    return {opacity};
  });

  const animatedHeaderOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedPosition.value,
      [screenHeight-firstSnap, screenHeight-0.95 * screenHeight],
      [1, 0],
      Extrapolation.CLAMP );
    return {opacity};
  });

  const animatedTabbarPosition = useAnimatedStyle(() => {
    const bottom = interpolate(
      animatedPosition.value,
      [screenHeight-firstSnap-30, screenHeight-0.95 * screenHeight],
      [0, -tabBarHeight],
      Extrapolation.CLAMP);
    return {bottom};
  })

  const showFinishWorkout = (data) => {
    setFinishWorkoutData(data);
    // Animate
    finishWorkoutPositionTop.value = withTiming(0, {duration: 300});
  }

  const closeFinishWorkout = () => {
    const animateTime = 300;
    finishWorkoutPositionTop.value = withTiming(screenHeight, {duration: animateTime});
    setTimeout(() => {setFinishWorkoutData(null);}, animateTime);
  }

  

  return user ? (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      <BottomSheetContext.Provider value={{
        openSheet: handleSnapPress,
        closeSheet: handleCloseSheet,
        showFinishWorkout,
        setTabBarRoute: setCurrentRoute,
        showAlert: showAlert,
        setShowDisconnectIndicator,
        }}>
        <>
          {/* <Tabs tabBar={props => <TabBar animatedTabbarPosition={animatedTabbarPosition} {...props} />} screenOptions={{animation: "none", headerShown: false, headerStyle: { backgroundColor: theme.background, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0,}, headerTintColor: theme.title, tabBarStyle: { backgroundColor: "#000" }, tabBarActiveTintColor: theme.title, tabBarInactiveTintColor: "#868686", }}> 
              <Tabs.Screen name="home" options={{ title: 'Home', headerTintColor: "transparent"  }} />
              <Tabs.Screen name="friends" options={{ title: 'Friends' }} />
              <Tabs.Screen name="workout" options={{ title: 'Workouts', popToTopOnBlur: true }} />
              <Tabs.Screen name="exercises" options={{ title: 'Exercises' }} />
              <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
            </Tabs> */}

            <AlertNotification ref={alertRef} />

            <Stack screenOptions={{animation: "fade", animationDuration: 150, headerShown: false, contentStyle: {backgroundColor: theme.background,}}}>
              <Stack.Screen name="home" options={{ title: 'Home', }} />
              <Stack.Screen name="friends" options={{ title: 'Friends' }} />
              <Stack.Screen name="workout" options={{ title: 'Workouts', }} />
              <Stack.Screen name="exercises" options={{ title: 'Exercises' }} />
              <Stack.Screen name="progress" options={{ title: 'Progress' }} />
            </Stack>

            <BottomSheet
              ref={sheetRef}
              snapPoints={snapPoints}
              enableDynamicSizing={false}
              backgroundStyle={{backgroundColor: "#313131"}}
              handleIndicatorStyle={{backgroundColor: "white", width: 80}}
              animatedPosition={animatedPosition}
              index={user.activeWorkout !== null ? 1 : -1}
              onChange={index => setCurrentPosition(index)}
            >

                {user.activeWorkout && (
                  <ActiveWorkout
                    animatedFinishOpacity={animatedFinishOpacity}
                    animatedHeaderOpacity={animatedHeaderOpacity}
                    currentPosition={currentPosition}
                  />
                )}
                

            </BottomSheet>

            {/* Stack TabBar */}
            <StackTabBar animatedTabbarPosition={animatedTabbarPosition} currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} />

            

            <Animated.View style={[{position: "absolute", /* top: (finishWorkoutData !== null ? true : false) ? 0 : screenHeight, */ left: 0, height: screenHeight, width: "100%", zIndex: 5, elevation: 5}, finishWorkoutStyle]}>
                {finishWorkoutData !== null && (
                <FinishWorkout data={finishWorkoutData} closeModal={closeFinishWorkout} />
                )}
            </Animated.View>

            {user.trouble.frozen && (
            <ThemedView  style={{flex: 1, padding: 20, backgroundColor: "rgba(0, 0, 0, 0.77)", position: "absolute", width: screenWidth, height: screenHeight, zIndex: 99, justifyContent: "center", alignItems: "center"}}>
              <ThemedText style={{fontSize: 15, textAlign: "center", color: "white"}}>Your account has been frozen.</ThemedText>
              <ThemedText style={{fontSize: 15, textAlign: "center",}}>Please contact our support team if you believe this is an error.</ThemedText>
            </ThemedView>
            )}


            {showDisconnectIndicator && (
              <View style={[StyleSheet.absoluteFill, { height: screenHeight, width: screenWidth, pointerEvents: "none", zIndex: 98, }]}>
                <SafeAreaView >
                  <View style={{width: "100%", alignItems: "flex-end", paddingHorizontal: 15, marginTop: -5}}>
                    <Image source={noInternet} contentFit='contain' style={{height: 15, width: 15, tintColor: Colors.protein}} />
                  </View>
                </SafeAreaView>
              </View>
            )}


          </>

                
      
        

      </BottomSheetContext.Provider>
    </View>
    
  ) : (
    <Redirect href="/onboarding" />
  )
}

export default Dashboard

const styles = StyleSheet.create({})