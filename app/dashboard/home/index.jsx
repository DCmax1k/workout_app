import { Alert, Button, Dimensions, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, Slot, Stack, useRouter } from 'expo-router'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import { Colors } from '../../../constants/Colors'
import Spacer from '../../../components/Spacer'
import { useUserStore } from '../../../stores/useUserStore'
import BlueButton from '../../../components/BlueButton'
import NotificationCard from '../../../components/NotificationCard'

import profileIcon from '../../../assets/icons/profileIcon.png'
import search from '../../../assets/icons/search.png'
import rightArrow from '../../../assets/icons/rightArrow.png'
import hollowClock from '../../../assets/icons/hollowClock.png'
import rotate from '../../../assets/icons/rotate.png'
import { LinearGradient } from 'expo-linear-gradient'
import StartWorkout from '../../../components/workout/StartWorkout'
import { Exercises } from '../../../constants/Exercises'
import WorkoutDescription from '../../../components/workout/WorkoutDescription'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { generateUniqueId } from '../../../util/uniqueId'
import playCircle from '../../../assets/icons/playCircle.png'
import Animated, { Easing, FadeIn, FadeInDown, FadeOut, FadeOutDown, FlipInXUp, FlipOutXDown, runOnJS, SlideInDown, SlideOutDown, useAnimatedStyle, useSharedValue, withSequence, withTiming, ZoomIn } from 'react-native-reanimated'
import { Portal } from 'react-native-paper'
import OpenExercise from '../../../components/workout/OpenExercise'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useIsFocused } from '@react-navigation/native'

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const QUICK_START_CARD_HEIGHT = 80;

const IndexHome = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const updateUser = useUserStore((state) => state.updateUser);

  const { openSheet } = useBottomSheet();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [cardFlipAnimation, setCardFlipAnimation] = useState(false);
  const [switchContinuedWorkouts, setSwitchContinuedWorkouts] = useState(false);
  const [openExercise, setOpenExercise] = useState(false);
  const [exerciseOpen, setExerciseOpen] = useState({});

  // Rotate to next workout in schedule
  const findNextScheduleIndex = () => {
    if (user.schedule.rotation.length === 0) {
      // No workouts in schedule, return 0
      return 0;
    }
    const currentIndex = user.schedule.currentIndex;
    const nextIndex = (currentIndex + 1) % user.schedule.rotation.length;
    return nextIndex;
  }

  //const continuedWorkout = {name: 'test', id: "32", exercises: []}
  const [continuedWorkout, setContinuedWorkout] = useState(null);

  // Reopen exercise
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused && user.activeReopenExercise) {
      const theExer = JSON.parse(JSON.stringify(user.activeReopenExercise))
      setExerciseOpen(theExer);
      setOpenExercise(true);
      if (user.activeReopenExercise !== null) {
        updateUser({ activeReopenExercise: null });
      }
    }
  }, [user, isFocused])

  useEffect(() => {

    if (user?.schedule?.rotation.length > 0) {
      const currentId = user.schedule.rotation[user.schedule.currentIndex];
      if (currentId === "0") {
        setContinuedWorkout({ name: "Rest Day", id: "0" });
      } else {
        const workout = user.savedWorkouts.find(w => w.id === currentId);
        setContinuedWorkout(workout || null);
      }
    } else {
      setContinuedWorkout(null);
    }


  }, [user]);
  //const [continuedWorkout, setContinuedWorkout] = useState(user.schedule.rotation.length > 0 ? user.schedule.rotation[user.schedule.currentIndex] === "0" ? {name: "Rest Day", id: "0",} : user.savedWorkouts.find(w => w.id === user.schedule.rotation[user.schedule.currentIndex]) : null);
  //let continuedWorkout = user.schedule.rotation.length > 0 ? user.schedule.rotation[user.schedule.currentIndex] === "0" ? {name: "Rest Day", id: "0",} : user.savedWorkouts.find(w => w.id === user.schedule.rotation[user.schedule.currentIndex]) : null;
  const continuedWorkoutNext = user.schedule.rotation.length > 0 ? user.schedule.rotation[findNextScheduleIndex()] === "0" ? {name: "Rest Day", id: "0",} : user.savedWorkouts.find(w => w.id === user.schedule.rotation[findNextScheduleIndex()]) : null;


  const clearUserData = () => {
    // Clear user data
    setUser(null);
  }
  const changeUsernameTest = () => {
    // Change username test
    //setUsername("NewUsername")
    updateUser({username: "User1"});
  }

  const openWorkout = (workout) => {
    setSelectedWorkout(workout);
    setModalVisible(true);
  }

  // ANIMATE QUICK START CARD
  const topCardOffset = useSharedValue(0); 
  const topCardScale = useSharedValue(1); // to 180deg
  const [topCardZIndex, setTopCardZIndex] = useState(1);

  const BHND_CARD_VERTICAL_OFFSET = 0; // -15
  const behindCardOffset = useSharedValue(BHND_CARD_VERTICAL_OFFSET); // behind card offset
  const behindCardScale = useSharedValue(0.9);

  const topCardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: topCardOffset.value, }, { scale: topCardScale.value }],
    };
  });
  const behindCardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: behindCardScale.value}, { translateY: behindCardOffset.value }],
    };
  });

  const ANIMATION_DURATION = 500;
  const rotateNext = () => {
    if (cardFlipAnimation) return;
    setCardFlipAnimation(true);

    const newIndex = findNextScheduleIndex();

    // Start animation
    // Beginning animation, lasts 150
    topCardOffset.value = withTiming(80, { duration: ANIMATION_DURATION/2, easing: Easing.bezier(0.42, 0.57, 0.21, 1.03), });
    behindCardScale.value = withTiming(1, { duration: ANIMATION_DURATION / 2 });
    behindCardOffset.value = withTiming(0, { duration: ANIMATION_DURATION/2 });
    topCardScale.value = withTiming(0.3, { duration: ANIMATION_DURATION/2 });
    setTimeout(() => {

      // Halfway - these set top card back to ceil, top card scale smaller, and behind card scale 1
      setTopCardZIndex(-1);

      topCardOffset.value = withTiming(0, { duration: ANIMATION_DURATION/2 });
      behindCardScale.value = withTiming(1, { duration: ANIMATION_DURATION/2 });
      topCardScale.value = withTiming(0.5, { duration: ANIMATION_DURATION/2 });

      setTimeout(() => {
        // Make both the next one
        setContinuedWorkout(continuedWorkoutNext);
        //setSwitchContinuedWorkouts(true);

        setTimeout(() => {
          // Reset positions ecept top
          topCardScale.value = withTiming(1, { duration: 0 });

          setTimeout(() => {
            setTopCardZIndex(1);
            //console.log(continuedWorkout);
            setTimeout(() => {
              // Broken because the back one is not correct for some reason.
              behindCardOffset.value = withTiming(0, { duration: 0 });
              behindCardScale.value = withTiming(0.9, { duration: 0 });
              setTimeout(() => {
                // Small adjust at end
                behindCardOffset.value = withTiming(BHND_CARD_VERTICAL_OFFSET, { duration: 100 })
                setTimeout(() => {  
                  // Update state
                  updateUser({schedule: {...user.schedule, currentIndex: newIndex}});
                  //setSwitchContinuedWorkouts(false);
                  setCardFlipAnimation(false);
                  
                }, 5)
              }, 5);
            }, 5)



          }, 5);
        }, 5)
        
      }, (ANIMATION_DURATION/2))

    }, (ANIMATION_DURATION/2));



    

    
    
  }


  const startEmptyWorkout = (bypassCheck = false) => {
    if (bypassCheck === false && user.activeWorkout !== null) {
          // Make sure active workout is visible
          openSheet(0);
          //Alert
        Alert.alert(
            "Workout in progress",
            "If you start a new workout, your current one will be discarded",
            [
                {text: "Start new workout", style: "destructive", onPress: () => startEmptyWorkout(true)},
                {text: "Do Nothing", style: "cancel"}
            ]
        )
        return;
    } 

    const clonedWorkout = {
      name: "New workout",
      exercises: [],
      startTime: Date.now(),
      id: generateUniqueId(),
    };
    updateUser({activeWorkout: clonedWorkout});
    openSheet(1);
}

  const truncate = (text, maxLength) =>
    text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  const openTheExerciseFromWorkout = (exercise, workout) => {
      //console.log(workout);
      //workoutToComeBackTo = workout;
      setExerciseOpen(exercise);
      setOpenExercise(true);
    }

    
    const setOpenExerciseExtra = (value) => { // To set close from the openWorkout
      setOpenExercise(value);
      // Callback when closing
      if (value===false) {
        setModalVisible(true);
      }
    }

    const openSheetForAndroid = () => {
      openSheet(1);
    }

    const navigateToSchedule = () => {
      router.navigate('/dashboard/workout');
      setTimeout(() => {
        router.push('/dashboard/workout/schedule');
      }, 100);
    }

  let isThereWorkout = (continuedWorkout !== null && continuedWorkout.id !== "0") ? "yes" : (continuedWorkout !== null && continuedWorkout.id === "0") ? "rest" : "none";
  let isThereWorkoutNext = (continuedWorkoutNext !== null && continuedWorkoutNext.id !== "0") ? "yes" : (continuedWorkoutNext !== null && continuedWorkoutNext.id === "0") ? "rest" : "none";

  // if (switchContinuedWorkouts) {
  //   console.log("")
  //   console.log(continuedWorkout);
  //   console.log(continuedWorkoutNext)
  //   continuedWorkout = continuedWorkoutNext || {name: "Rest Day", id: "0",};
  // }
  return (
    <ThemedView style={styles.container}> 



      {openExercise && (
        <Portal >
          <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", width: screenWidth, height: screenHeight, zIndex: 2}} >



              <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={{position: "absolute", width: screenWidth-20, top: 50, left: 10, zIndex: 2}}>
                <OpenExercise exercise={exerciseOpen} setOpenExercise={setOpenExerciseExtra} forceCloseOpenExercise={() => setOpenExercise(false)} />
              </Animated.View>

            

          </Animated.View>
        </Portal>
        
      )}

      <SafeAreaView style={{flex: 1}} >
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}} contentContainerStyle={{paddingBottom: 120}}>
          {/* <BlueButton onPress={clearUserData} title={"[BETA] RESET USER DATA"} style={{marginLeft: 20}} /> */}
          {/* <BlueButton onPress={changeUsernameTest} title={"Change username"} style={{marginLeft: 20}} /> */}
          <View style={styles.welcomeCont}>
            <View>
              <Text style={{color: Colors.primaryOrange, fontSize: 15}} >Welcome back,</Text>
              <ThemedText title={true} style={{fontSize: 25, fontWeight: 700}}>{user.username}</ThemedText>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {/* Profile Icon */}
              {/* <Pressable style={styles.actionButtonCont} onPress={() => router.push('/dashboard/home/search')} >
                  <Image style={{width: "70%", height: "70%"}} source={search} />
              </Pressable> */}
              <Pressable style={styles.actionButtonCont} onPress={() => router.push('/dashboard/home/profile')}>
                  <Image style={{width: "100%", height: "100%"}} source={profileIcon} />
              </Pressable>
              
            </View>
          </View>

          <Spacer />

          <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
                <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10,}}>Quick start</ThemedText>

                {isThereWorkout !== "none" && (<Pressable onPress={rotateNext} style={{flexDirection: "row", alignItems: "center",  padding: 5}}>
                  <Text style={{color: "#5a5a5a"}}>Skip </Text>
                  <Image source={rightArrow} style={{height: 10, width: 10, tintColor: "#5a5a5a"}} />
                </Pressable>)}
          </View>
          


          {/* If a schedule, show next in schedule. Else, show create a schedule */}
          <Pressable style={{height: QUICK_START_CARD_HEIGHT, overflow: "visible", }} onPress={isThereWorkout==="yes" ?  () => openWorkout(continuedWorkout) : isThereWorkout==="rest" ? rotateNext : navigateToSchedule}>
            {/* Behind element to animate */}
              {/* cardFlipAnimation && */(<Animated.View style={[styles.animateQuickCard, {zIndex: 0, elevation: 0,}, behindCardAnimatedStyle ]}>
                <LinearGradient style={[styles.gradientView]} colors={['#262C47', '#473326']} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
                  <View style={{height: 80, width: 50, justifyContent: "center", alignItems: "center"}}>
                    <View style={{height: 40, width: 40, backgroundColor: "#3D52A6", borderWidth: 2, borderColor: Colors.primaryBlue, borderRadius: "50%", marginRight: 3, padding: 7}}>
                      <Image source={isThereWorkoutNext === "yes" ? rightArrow : isThereWorkoutNext === "rest" ? hollowClock : rotate} style={[{height: "100%", width: "100%"}, isThereWorkoutNext === "yes" ? {transform: [{rotate: "-90deg"}]} : null]} />
                    </View>

                  </View>
                  <View style={styles.quickStartTexts}>
                    <Text style={{fontSize: 17, color: "white", fontWeight: 700}}>{isThereWorkoutNext === "yes" ? truncate(continuedWorkoutNext.name, 30) : isThereWorkoutNext === "rest" ? "Rest Day" : "Create a schedule" }</Text>
                    {isThereWorkoutNext === "yes" ? (
                      <WorkoutDescription style={{fontSize: 13, color: "#E4E4E4", fontWeight: 400}} workout={continuedWorkoutNext} />
                    ) : (
                      <Text style={{fontSize: 13, color: "#E4E4E4", fontWeight: 400}}>{isThereWorkoutNext === "rest" ? "Click here for your next workout!" : "Add or create workouts to add!"}</Text>
                    )}
                    
                  </View>
                  {/* <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", width: "100%"}}>
                    <Pressable style={{padding: 10, backgroundColor: "#546FDB", borderRadius: 10, marginRight: 10}} onPress={isThereWorkoutNext==="yes" ?  () => openWorkout(continuedWorkoutNext) : isThereWorkoutNext==="rest" ? rotateNext : () => router.push('/dashboard/workout') }>
                      <Text style={{fontSize: 14, color: "white"}}>{isThereWorkoutNext==="yes" ?  "Open workout" : isThereWorkoutNext==="rest" ? "Next" : "Go to workouts"}</Text>
                    </Pressable>
                    {isThereWorkoutNext==="yes" && (
                      <Pressable onPress={rotateNext} style={{padding: 5, backgroundColor: "#656565", borderRadius: 10}}>
                        <Text style={{fontSize: 12, color: "white"}}>Skip</Text>
                      </Pressable>
                    )}
                    
                  </View> */}
                </LinearGradient>
              </Animated.View>)}
              {/* Top element to animate */}
              {/*!cardFlipAnimation && */(<Animated.View style={[styles.animateQuickCard, {zIndex: topCardZIndex, elevation: 1,}, topCardAnimatedStyle]} >
                <LinearGradient style={[styles.gradientView]} colors={['#262C47', '#473326']} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
                  <View style={{height: 80, width: 50, justifyContent: "center", alignItems: "center"}}>
                    <View style={{height: 40, width: 40, backgroundColor: "#3D52A6", borderWidth: 2, borderColor: Colors.primaryBlue, borderRadius: "50%", marginRight: 3, padding: 7}}>
                      <Image source={isThereWorkout === "yes" ? rightArrow : isThereWorkout === "rest" ? hollowClock : rotate} style={[{height: "100%", width: "100%"}, isThereWorkout === "yes" ? {transform: [{rotate: "-90deg"}]} : null]} />
                    </View>

                  </View>
                  <View style={styles.quickStartTexts}>
                    <Text style={{fontSize: 17, color: "white", fontWeight: 700}}>{isThereWorkout === "yes" ? truncate(continuedWorkout.name, 30) : isThereWorkout === "rest" ? "Rest Day" : "Create a schedule" }</Text>
                    {isThereWorkout === "yes" ? (
                      <WorkoutDescription style={{fontSize: 13, color: "#E4E4E4", fontWeight: 400}} workout={continuedWorkout} />
                    ) : (
                      <Text style={{fontSize: 13, color: "#E4E4E4", fontWeight: 400}}>{isThereWorkout === "rest" ? "Click here for your next workout!" : "Add or create workouts to add!"}</Text>
                    )}
                    
                  </View>
                  {/* <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", width: "100%"}}>
                    <Pressable style={{padding: 10, backgroundColor: "#546FDB", borderRadius: 10, marginRight: 10}} onPress={isThereWorkout==="yes" ?  () => openWorkout(continuedWorkout) : isThereWorkout==="rest" ? rotateNext : () => router.push('/dashboard/workout') }>
                      <Text style={{fontSize: 14, color: "white"}}>{isThereWorkout==="yes" ?  "Open workout" : isThereWorkout==="rest" ? "Next" : "Go to workouts"}</Text>
                    </Pressable>
                    {isThereWorkout==="yes" && (
                      <Pressable onPress={rotateNext} style={{padding: 5, backgroundColor: "#656565", borderRadius: 10}}>
                        <Text style={{fontSize: 12, color: "white"}}>Skip</Text>
                      </Pressable>
                    )}
                    
                  </View> */}
                </LinearGradient>
              </Animated.View>)}
            

          </Pressable>
          
            

          <ThemedText style={{fontSize: 10, paddingVertical: 20, textAlign: 'center'}}>or</ThemedText>
          <BlueButton onPress={() => startEmptyWorkout()} title={"Start an empty workout"} icon={playCircle}/>

          <Spacer />
          <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10}}>Activity</ThemedText>

          <NotificationCard header={"3 min ago"} title={"User2 started a workout"} subtitle={"Chest and shoulders"} />
          

        </ScrollView>

      </SafeAreaView>


      {/* <Modal
        visible={modalVisible}
        animationType='slide'
        presentationStyle='pageSheet'
        onRequestClose={() => {
          setModalVisible(false)
        }}
      >
        {selectedWorkout !== null ? (
        <StartWorkout workout={selectedWorkout} setModalVisible={setModalVisible}  openExercise={(e) => openTheExerciseFromWorkout(e, selectedWorkout)} />
        ) : null}
      </Modal> */}
      {Platform.OS === 'ios' ? (
            <Modal
              visible={modalVisible}
              animationType='slide'
              presentationStyle='pageSheet'
              onRequestClose={() => {
                setModalVisible(false)
              }}
            >
              {selectedWorkout !== null ? (
              <StartWorkout workout={selectedWorkout} setModalVisible={setModalVisible} openExercise={(e) => openTheExerciseFromWorkout(e, selectedWorkout)} setExerciseOpen={setExerciseOpen} />
              ) : null}
            </Modal>
          ) : ( modalVisible === true ? (
            <Portal>
              <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={{position: "absolute", top: 0, left: 0, height: screenHeight, width: "100%", zIndex: 5, elevation: 5}}>
                    {selectedWorkout !== null ? (
                      <StartWorkout workout={selectedWorkout} setModalVisible={setModalVisible} openExercise={(e) => openTheExerciseFromWorkout(e, selectedWorkout)} setExerciseOpen={setExerciseOpen} openSheetForAndroid={openSheetForAndroid} />
                    ) : null}
                </Animated.View>
            </Portal>
              

              
          ) : null)}


    </ThemedView>
  )
}

export default IndexHome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeCont: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButtonCont: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  gradientView: {
    width: '100%',
    height: QUICK_START_CARD_HEIGHT,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: Colors.primaryBlue,
    borderWidth: 2,

  },
  animateQuickCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: QUICK_START_CARD_HEIGHT,
    
  },
  quickStartTexts: {
    width: "80%",
    height: "100%",
    justifyContent: "center",
    paddingBottom: 5,
  }
  
})