import { Dimensions, Image, Modal, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import Spacer from '../../../components/Spacer'
import BlueButton from '../../../components/BlueButton'
import { useUserStore } from '../../../stores/useUserStore'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import StartWorkout from '../../../components/workout/StartWorkout'
import rightArrow from '../../../assets/icons/rightArrow.png'
import { generateUniqueId } from '../../../util/uniqueId'
import WorkoutDescription from '../../../components/workout/WorkoutDescription'
import TitleWithBack from '../../../components/TitleWithBack'
import plus from '../../../assets/icons/plus.png'
import SwipeToDelete from '../../../components/SwipeToDelete'
import ConfirmMenu from '../../../components/ConfirmMenu'
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown, LinearTransition } from 'react-native-reanimated'
import { Portal } from 'react-native-paper'
import OpenExercise from '../../../components/workout/OpenExercise'

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const IndexWorkout = () => {
    const user = useUserStore((state) => state.user);
    const updateUser = useUserStore((state) => state.updateUser);
    const [searchValue, setSearchValue] = useState("");
    const workouts = user.savedWorkouts;
    const filteredWorkouts = workouts.filter(workout => {
        if (searchValue.length === 0) return true;
        const name = workout.name.toLowerCase() || '';  
        const search = searchValue.toLowerCase().trim();
        if (search.length > 1 && search[search.length - 1] === "s") {
            return name.includes(search.slice(0, -1));
        }
        return name.includes(search);
    });
    const workoutsInRotation = user.schedule.rotation.filter(id => id !== "0").length;

    let workoutToComeBackTo = null;

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [openExercise, setOpenExercise] = useState(false);
    const [exerciseOpen, setExerciseOpen] = useState({});

    const swipeRefs = useRef([]);
    

    const openSchedule = () => {
        // Open schedule view
        router.push('/dashboard/workout/schedule');
    }

    const openWorkout = (workout) => {
      setSelectedWorkout(workout);
      setModalVisible(true);
    }

    const createNewWorkout = () => {
      const newWorkoutData = {name: "New workout", id: generateUniqueId(), exercises: [] };
      updateUser({editActiveWorkout: newWorkoutData});
      router.push("/editworkout");
    }

    

    const requestDeleteWorkoutConfirmation = (workoutID) => {
      deleteWorkout(workoutID);
    }

    // COPIED TO editworkout
      const removeFromRotation = (workoutId) => {
        let schedule = user.schedule;
        const newRotation = user.schedule.rotation.filter(id => id !== workoutId);
        schedule = {...schedule, rotation: newRotation}
        schedule = {...schedule, currentIndex: 0}
        updateUser({schedule});
      }
      const deleteWorkout = (workoutID) => {
        const userWorkouts = user.savedWorkouts;
        const workoutToDeleteIndex = userWorkouts.findIndex(w => w.id === workoutID);
        if (workoutToDeleteIndex >= 0) {
          // Delete workout from saved workouts, and from rotation if in rotation
          userWorkouts.splice(workoutToDeleteIndex, 1);
          removeFromRotation(workoutID);
        }
        //router.back();
      } // end copied

    const truncate = (text, maxLength) =>
      text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

    const openTheExerciseFromWorkout = (exercise, workout) => {
      //console.log(workout);
      workoutToComeBackTo = workout;
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


  return (
    <ThemedView  style={styles.container}>



      {openExercise && (
        <Portal >
          <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", width: screenWidth, height: screenHeight, zIndex: 2}} >



              <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={{position: "absolute", width: screenWidth-20, top: 50, left: 10, zIndex: 2}}>
                <OpenExercise exercise={exerciseOpen} setOpenExercise={setOpenExerciseExtra} />
              </Animated.View>

            

          </Animated.View>
        </Portal>
        
      )}

      <SafeAreaView style={{ flex: 1 }}>
        <TitleWithBack style={{marginHorizontal: 0}} backBtn={false} title={"Workout"} actionBtn={{active: true, image: require("../../../assets/icons/history.png"), action: () => router.push("/dashboard/workout/workouthistory")}} />
        <Spacer height={20} />
        <Animated.ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* <ThemedText style={{fontSize: 20, fontWeight: 700, marginTop: 20,  textAlign: 'center'}}>Workout</ThemedText> */}
          
          <View style={{padding: 20}}>

            <BlueButton title={"Schedule Rotation"} showRight={true} subtitle={`${workoutsInRotation} workout${workoutsInRotation === 1 ? '':"s"} in rotation`} onPress={openSchedule} style={{marginBottom: 40}} />

            <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10}}>Saved Workouts</ThemedText>

            <TextInput style={[styles.search, {flex: 1}]} placeholder='Search workouts' placeholderTextColor={"#A6A6A6"} value={searchValue} onChangeText={(e) => setSearchValue(e)} />

            <Spacer height={20} />

            <BlueButton title={"Create a new workout"} onPress={createNewWorkout} icon={plus} />
            
          </View>
            
            <View style={{width: "100%", alignItems: "center",}}>
              {filteredWorkouts.map((workout, i) => {
                if (!swipeRefs.current[i]) swipeRefs.current[i] = React.createRef();

                return(
                  <Animated.View key={workout.id+""+i} layout={LinearTransition} style={{width: "100%"}}>
                    <SwipeToDelete ref={swipeRefs.current[i]}  showConfirmation={true} confirmationData={{
                    title: "Delete workout?",
                    subTitle: "Are you sure you would like to delete this workout?",
                    subTitle2: "This action cannot be undone.",
                    option1: "Delete workout",
                    option1color: "#DB5454",
                    option2: "Go back",
                    confirm: () => requestDeleteWorkoutConfirmation(workout.id),
                }}>
                    <Pressable onPress={() => {
                      setTimeout(() => {
                        if (swipeRefs.current[i].current?.getIsOpen()) return;
                        openWorkout(workout);
                      }, 100);
                      
                      }}>
                      <View style={[styles.selectWorkout, styles.boxShadow]} >
                        <View style={styles.linearGradient}>
                          <View style={{width: "80%"}}>
                            <ThemedText style={{fontSize: 17, fontWeight: 700}} title={true}>{truncate(workout.name, 25)}</ThemedText>
                            <WorkoutDescription workout={workout} />
                          </View>

                          <View style={[styles.boxShadow, {shadowRadius: 5, backgroundColor: "#546FDB", height: 40, width: 40, borderRadius: 99999, justifyContent: "center", alignItems: "center"}]}>
                            <View style={{backgroundColor: "#3D52A6", height: 35, width: 35, borderRadius: 99999, justifyContent: "center", alignItems: "center"}}>
                              <Image style={{height: 20, width: 20}} source={rightArrow}/>
                            </View>
                          </View>
                          
                        </View>
                      </View>
                    </Pressable>
                    
                  </SwipeToDelete>
                  </Animated.View>
                  
                
                
              )})}
            </View>
            

            {workouts.length === 0 ? (
              <ThemedText style={{textAlign: "center"}}>
                No workouts
              </ThemedText>
            ) : (null)}
            

        </Animated.ScrollView>
      </SafeAreaView>


    <Modal
        visible={modalVisible}
        animationType='slide'
        presentationStyle='pageSheet'
        onRequestClose={() => {
          setModalVisible(false)
        }}
      >
        {selectedWorkout !== null ? (
        <StartWorkout workout={selectedWorkout} setModalVisible={setModalVisible} openExercise={(e) => openTheExerciseFromWorkout(e, selectedWorkout)} />
        ) : null}
      </Modal>

      
    </ThemedView>
  )
}

export default IndexWorkout

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // padding: 20,
    },
    selectWorkout: {
      marginHorizontal: 20,
    },
    linearGradient: {
      flex: 1,
      height: 80,
      borderRadius: 15,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      backgroundColor: "#2A2A2A",
    },
    boxShadow: {
      shadowColor: "black",
      shadowOffset: {
        width: -5,
        height: 5,
      },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 10,

    },
    search: {
        height: 50,
        fontSize: 20,
        color: "white",
        backgroundColor: "#1C1C1C",
        borderRadius: 99999,
        paddingLeft: 20,
        paddingRight: 10,
    }
  })