import { Alert, Button, Dimensions, FlatList, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Link, Slot, Stack, useRouter } from 'expo-router'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import { Colors } from '../../../constants/Colors'
import Spacer from '../../../components/Spacer'
import { useUserStore } from '../../../stores/useUserStore'
import BlueButton from '../../../components/BlueButton'
import NotificationCard from '../../../components/NotificationCard'
import calenderIcon from '../../../assets/icons/calender.png'
import profileIcon from '../../../assets/icons/profileIcon.png'
import search from '../../../assets/icons/search.png'
import rightArrow from '../../../assets/icons/rightArrow.png'
import dumbbellIcon from '../../../assets/tabBarIcons/dumbbell.png'
import clockIcon from '../../../assets/icons/clock.png'
import appleIcon from '../../../assets/icons/apple.svg'
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
import auth from '../../../util/server/auth'
import DisplayName from '../../../components/DisplayName'
import ProfileImg from '../../../components/ProfileImg'
import { SuggestedWorkoutImages, SuggestedWorkouts } from '../../../constants/SuggestedWorkouts'
import { Image } from 'expo-image'
import * as Haptics from 'expo-haptics';
import ImageContain from '../../../components/ImageContain'

const truncate = (text, maxLength) =>
    text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const QUICK_START_CARD_HEIGHT = 80;

const SuggestedWorkoutTemplate = ({workout, ...props}) => {
  return (
    <View >
      <View style={styles.linearGradient}>
        <View style={{width: "100%", position: "relative"}}>
          <ThemedText style={{fontSize: 17, fontWeight: 700, paddingRight: 30, }} title={true}>{truncate(workout.name, 25)}</ThemedText>
          <WorkoutDescription workout={workout} truncateAmount={-1} />

          <View style={{position: "absolute", top: 5, right: 5, height: 15, width: 15}}>
            <Image style={{height: "100%", width: "100%", transform: [{rotate: "-90deg"}]}} contentFit='contain' source={rightArrow}/>
          </View>
          
        </View>

        {/* <View style={[styles.boxShadow, {shadowRadius: 5, backgroundColor: "#546FDB", height: 40, width: 40, borderRadius: 99999, justifyContent: "center", alignItems: "center"}]}>
          <View style={{backgroundColor: "#3D52A6", height: 35, width: 35, borderRadius: 99999, justifyContent: "center", alignItems: "center"}}>
            <Image style={{height: 20, width: 20, transform: [{rotate: "0deg"}]}} source={rightArrow}/>
          </View>
        </View> */}
        
      </View>
    </View>
  )
}

const LinearGradientWorkout = ({workout, isThereWorkout}) => {
  const continuedWorkout = workout;
  return (
    <LinearGradient style={[styles.gradientView]} colors={['#262C47', '#473326']} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
      <View style={{height: 80, width: 50, justifyContent: "center", alignItems: "center"}}>
        <View style={{height: 40, width: 40, backgroundColor: "#3D52A6", borderWidth: 2, borderColor: Colors.primaryBlue, borderRadius: "50%", marginRight: 3, padding: 7}}>
          <Image source={isThereWorkout === "yes" ? rightArrow : isThereWorkout === "rest" ? hollowClock : rotate} style={[{height: "100%", width: "100%"}, isThereWorkout === "yes" ? {transform: [{rotate: "0deg"}]} : null]} />
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
  )
}

const CardFlipAnimation = forwardRef(({frontData, behindData, onPress, setFrontData}, ref) => {
  const isThereWorkoutFront = frontData.isThereWorkout;
  const isThereWorkoutBack = frontData.isThereWorkout;
  delete frontData.isThereWorkout;
  delete behindData.isThereWorkout;

  const [cardFlipAnimation, setCardFlipAnimation] = useState(false);

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

    // const newIndex = findNextScheduleIndex();

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
        setFrontData(behindData);
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
                  // updateUser({schedule: {...user.schedule, currentIndex: newIndex}});
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

  useImperativeHandle(ref, () => ({
    rotateNext,
  }))
  return (
      <Pressable style={{height: QUICK_START_CARD_HEIGHT, overflow: "visible", zIndex: 1}} onPress={onPress}>
        {/* Behind element to animate */}
          {/* cardFlipAnimation && */(<Animated.View style={[styles.animateQuickCard, {zIndex: 0, elevation: 0,}, behindCardAnimatedStyle ]}>
            <LinearGradientWorkout workout={behindData} isThereWorkout={isThereWorkoutFront} />
          </Animated.View>)}
          {/* Top element to animate */}
          {/*!cardFlipAnimation && */(<Animated.View style={[styles.animateQuickCard, {zIndex: topCardZIndex, elevation: 1,}, topCardAnimatedStyle]} >
            <LinearGradientWorkout workout={frontData} isThereWorkout={isThereWorkoutBack} />
          </Animated.View>)}
        

      </Pressable>
  )
})

const IndexHome = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const options = useUserStore(state => state.options);
  const updateOptions = useUserStore(state => state.updateOptions);
  const setUser = useUserStore((state) => state.setUser);
  const updateUser = useUserStore((state) => state.updateUser);

  const cardFlipRef = useRef(null);

  const { openSheet, setTabBarRoute } = useBottomSheet();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
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
        setContinuedWorkout(workout ?? null);
        // console.log("test");
        // console.log(workout);
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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const clonedWorkout = {
      name: "New workout",
      exercises: [],
      startTime: Date.now(),
      id: generateUniqueId(),
    };
    updateUser({activeWorkout: clonedWorkout});
    openSheet(1);
}

  

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
      setTabBarRoute(2);
      router.replace('/dashboard/workout');
      setTimeout(() => {
        router.push('/dashboard/workout/schedule');
      }, 100);
    }

  let isThereWorkout = (continuedWorkout !== null && continuedWorkout?.id && continuedWorkout.id !== "0") ? "yes" : (continuedWorkout !== null && continuedWorkout?.id && continuedWorkout.id === "0") ? "rest" : "none";
  let isThereWorkoutNext = (continuedWorkoutNext !== null && continuedWorkoutNext?.id && continuedWorkoutNext.id !== "0") ? "yes" : (continuedWorkoutNext !== null && continuedWorkoutNext?.id && continuedWorkoutNext.id === "0") ? "rest" : "none";

  // // Testing for when need to show user data on screen as text
  //   return (
  //     <ScrollView contentContainerStyle={{paddingBottom: 150, paddingTop: 100}}>
  //       <ThemedView>
  //         <ThemedText selectable={true} >
  //           {JSON.stringify(user.settings)}
  //         </ThemedText>
  //       </ThemedView>
  //     </ScrollView>
    
  // )

  const rotateNext = () => {
    cardFlipRef.current?.rotateNext();
    const newIndex = findNextScheduleIndex();
    updateUser({schedule: {...user.schedule, currentIndex: newIndex}});
  }

  const displayWorkout = isThereWorkout==="yes" ?  continuedWorkout : isThereWorkout==="rest" ? {name: "Rest Day"} : {name: "No Schedule Created Yet"}


  const calculateWorkoutTime = wkt => {
    // 16 seconds per rep average, this would include rest time default
    let seconds = 0;
    wkt.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (ex.tracks.includes('time')) {
          return seconds += (set['time']*60);
        }
        if (ex.tracks.includes('reps')) {
          return seconds += set['reps'] * (ex.setTime ?? 16);
        }
        
      })
    });
    return parseInt(seconds/60); // Returns in minutes
  }

  return (
    <ThemedView style={styles.container}> 

      {openExercise && (
        <Portal >
          <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", width: screenWidth, height: screenHeight, zIndex: 2}} >

              <Pressable onPress={() => setOpenExerciseExtra(false)} style={{height: "100%", width: "100%", zIndex: 0}}></Pressable>

              <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={{position: "absolute", width: screenWidth-20, top: 50, left: 10, zIndex: 2}}>
                <OpenExercise exercise={exerciseOpen} setOpenExercise={setOpenExerciseExtra} forceCloseOpenExercise={() => setOpenExercise(false)} />
              </Animated.View>

            

          </Animated.View>
        </Portal>
        
      )}

      <SafeAreaView style={{flex: 1,}} >
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}} contentContainerStyle={{paddingBottom: 120, paddingHorizontal: 20 }}>
          {/* <BlueButton onPress={clearUserData} title={"[BETA] RESET USER DATA"} style={{marginLeft: 20}} /> */}
          {/* <BlueButton onPress={changeUsernameTest} title={"Change username"} style={{marginLeft: 20}} /> */}
          <View style={styles.welcomeCont}>
            <View>
              <Text style={{color: Colors.primaryOrange, fontSize: 15}} >Welcome back,</Text>
              <DisplayName name={user.username} usernameDecoration={user.usernameDecoration} achievement={{show: false}} fontSize={25} premium={user.premium}  />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {/* Profile Icon */}
              {/* <Pressable style={styles.actionButtonCont} onPress={() => router.push('/dashboard/home/search')} >
                  <Image style={{width: "70%", height: "70%"}} source={search} />
              </Pressable> */}
              <Pressable style={styles.actionButtonCont} onPress={() => router.push('/dashboard/home/profile')}>
                  {/* <Image style={{width: "100%", height: "100%"}} source={profileIcon} /> */}
                  <ProfileImg size={50} profileImg={user.profileImg} />
              </Pressable>
              
            </View>
          </View>

          <Spacer />

          {/* <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
                <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10,}}>Up Next</ThemedText>

                {isThereWorkout !== "none" && (<Pressable onPress={rotateNext} style={{flexDirection: "row", alignItems: "center",  padding: 5}}>
                  <Text style={{color: "#5a5a5a"}}>Skip </Text>
                  <Image source={rightArrow} style={{height: 10, width: 10, tintColor: "#5a5a5a"}} />
                </Pressable>)}
          </View> */}
          
          {/* <CardFlipAnimation
          ref={cardFlipRef}
          onPress={isThereWorkout==="yes" ?  () => openWorkout(continuedWorkout) : isThereWorkout==="rest" ? rotateNext : navigateToSchedule}
          frontData={{isThereWorkout, ...continuedWorkout}}
          behindData={{isThereWorkoutNext, ...continuedWorkoutNext}}
          setFrontData={setContinuedWorkout}
          /> */}

          {/* <ThemedText style={{fontSize: 12, paddingVertical: 15, textAlign: 'center'}}>or</ThemedText>
          <BlueButton style={{flex: 1}} onPress={() => startEmptyWorkout()} title={"Start an Empty Workout"} icon={playCircle}/> */}

          {/* NEW HOME DESIGN */}
          <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <ThemedText style={{fontSize: 15, fontWeight: 700,}}>Up Next</ThemedText>

                <Pressable onPress={navigateToSchedule}>
                  <Text style={{color: "rgba(123, 169, 255, 1)", fontSize: 15, fontWeight: "600"}}>View Schedule</Text>
                </Pressable>
          </View>
          <View style={{borderRadius: 15, borderColor: "#ffffff27", borderWidth: 1, padding: 20, /* backgroundColor: "#6392ff31" */}}>
            <ThemedText style={{fontSize: 18, fontWeight: "600"}} title={true}>{displayWorkout.name}</ThemedText>
            {isThereWorkout==="yes" ?  (
              <View>
                <WorkoutDescription workout={displayWorkout} />
                <Spacer height={10} />
                <View style={{flexDirection:"row", alignItems: "center", marginLeft: 5}}>
                  <ImageContain size={15} imgStyle={{tintColor: "white"}} source={clockIcon} />
                  <Text style={{color: "white", marginLeft: 5, fontWeight: "800"}}>{8 * displayWorkout.exercises.length} mins</Text>
                </View>
              </View>
            ) : isThereWorkout==="rest" ? (
              <ThemedText style={{fontSize: 13}}>Click here for your next workout!</ThemedText>
            ) : (
              <ThemedText>Add or create workouts to add!</ThemedText>
            )}
            <Spacer height={20} />
            <BlueButton
            style={{flex: 1}}
            onPress={isThereWorkout==="yes" ?  () => openWorkout(displayWorkout) : isThereWorkout==="rest" ? rotateNext : navigateToSchedule}
            title={isThereWorkout==="yes" ?  "Start Workout" : isThereWorkout==="rest" ? "Next" : "Create a Schedule"}
            icon={isThereWorkout==="yes" ?  playCircle : isThereWorkout==="rest" ? null : calenderIcon}/>
          </View>
          <Spacer />

          <View style={{flex: 1, flexDirection: "row", gap: 10}}>
            <Pressable onPress={() => {startEmptyWorkout()}} style={{flex: 1,backgroundColor: Colors.primaryBlue, borderRadius: 10, padding: 10}}>
              <View style={{backgroundColor: "rgba(255, 255, 255, 0.29)000ff", borderRadius: 8, height: 40, width: 40, justifyContent: "center", alignItems: "center"}}>
                <ImageContain size={20} imgStyle={{tintColor: "white"}} source={dumbbellIcon} />
              </View>
              <Text style={{color: "white", fontWeight: "600", fontSize: 17, marginTop: 10}}>Start Empty</Text>
              <Text style={{color: "#d1d1d1ff", fontWeight: "600", fontSize: 13, marginTop: 2}}>Track workout freely</Text>
            </Pressable>
            <Pressable onPress={() => router.navigate("/nutrition")} style={{flex: 1,backgroundColor: "#db545698", borderColor: "#ff6769a4", borderWidth: 1, borderRadius: 10, padding: 10}}>
              <View style={{backgroundColor: "#db545650", borderRadius: 8, height: 40, width: 40, justifyContent: "center", alignItems: "center"}}>
                <ImageContain size={20} source={appleIcon} />
              </View>
              <Text style={{color: "white", fontWeight: "600", fontSize: 17, marginTop: 10}}>Log Food</Text>
              <Text style={{color: "#d1d1d1ff", fontWeight: "600", fontSize: 13, marginTop: 2}}>Keep streak</Text>
            </Pressable>
          </View>

          

          <Spacer />
          <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10}}>Suggested Workout Templates</ThemedText>
          
          {/* <View style={{flex: 1, justifyContent: "space-between", flexDirection: "row", gap: 15,}}>
            <View style={{gap: 15,}}>
                {SuggestedWorkouts.map((workout, i) => {
              return i%2 === 0 ? (
                  <View key={workout.id+""+i} >

                    <Pressable onPress={() => {

                        openWorkout({...workout, id: generateUniqueId()});

                      
                      }}>
                      <SuggestedWorkoutTemplate workout={workout} />
                    </Pressable>
                    
                  </View>
                  
                
                
              ) : null;
                })}
            </View>
            <View style={{gap: 15,}}>
                {SuggestedWorkouts.map((workout, i) => {
              return i%2 === 1 ? (
                  <View key={workout.id+""+i} >

                    <Pressable onPress={() => {

                        openWorkout({...workout, id: generateUniqueId()});

                      
                      }}>
                      <SuggestedWorkoutTemplate workout={workout} />
                    </Pressable>
                    
                  </View>
                  
                
                
              ) : null;
                })}
            </View>
            
          </View> */}
          {/* New suggested workouts */}
          <View style={{width: screenWidth, marginHorizontal: -20,}}>
            <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}
            data={SuggestedWorkouts}
            keyExtractor={(item) => item.id}
            renderItem={({item, index}) => {
              const image = SuggestedWorkoutImages[index];
              const topOffsets = new Array(6).fill(-120);
              topOffsets[0] = -170;
              topOffsets[4] = -170;
              topOffsets[5] = -200;
              const topOffset = topOffsets[index];
              return (
                <Pressable onPress={() => openWorkout({...item, id: generateUniqueId()})} style={{borderRadius: 20, backgroundColor: "#6392ff31", borderColor: "#ffffff27", borderWidth: 1, padding: 10 , gap: 5, marginRight: 10}}>
                  <View style={{width: 200, height: 90, borderRadius: 10, overflow: "hidden"}}>
                    <Image source={image} style={{width: "100%", height: "100%"}} contentFit='cover' contentPosition={{left: "50%", top: topOffset}} />
                  </View>
                  <ThemedText title={true} style={{fontSize: 14, fontWeight: "800"}}>{truncate(item.name, 20)}</ThemedText>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <ThemedText style={{fontSize: 14, fontWeight: "600"}}>{item.exercises.length} exercise{item.exercises.length===1?"":"s"}</ThemedText>
                    <View style={{height: 5, width: 5, backgroundColor: "#D0D0D0", borderRadius: 999, marginHorizontal: 5}} />
                    <ThemedText style={{fontSize: 14, fontWeight: "600"}}>{calculateWorkoutTime(item)} mins</ThemedText>
                  </View>
                  
                  
                </Pressable>
              )
            }}

            />
          </View>
          
          
          
          {/* <NotificationCard header={"3 min ago"} title={"{Friend} started a workout"} subtitle={"Chest and shoulders"} /> */}
          

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
    paddingVertical: 20,
    width: screenWidth,
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
    padding: 2,
    borderColor: "#8B8B8B",
    borderWidth: 2,
    borderRadius: 99999,
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
  },
  selectWorkout: {
    marginHorizontal: 0,
  },
  linearGradient: {
    flex: 1,
    minHeight: 10,
    width: (screenWidth-55)/2,
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
    backgroundColor: "#2A2A2A",
  },
  
})