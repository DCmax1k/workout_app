import { Dimensions, Image, Pressable, SectionList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

import whiteX from '../../assets/icons/whiteX.png';
import BlueButton from '../BlueButton';
import { Colors } from '../../constants/Colors';
import SectionSelect from '../SectionSelect';
import Spacer from '../Spacer';
import noimage from '../../assets/icons/noimage.png';
import GlowImage from '../GlowImage';
import WorkoutDescription from './WorkoutDescription';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useUserStore } from '../../stores/useUserStore';
import PastWorkoutCard from './PastWorkoutCard';
import ThemedView from '../ThemedView';
import ThemedText from '../ThemedText';
import CreateExercise from './CreateExercise';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function formatMonthYear(date) {
  const month = date.toLocaleString('default', { month: 'long' }).toUpperCase(); // "MAY"
  const year = date.getFullYear(); // 2025
  return `${month} ${year}`; // "MAY 2025"
}

const ExerciseHistory = ({style, exercise, forceCloseOpenExercise = () => {}, ...props}) => {
  const user = useUserStore(state => state.user);
  
  const pastWorkouts = user.pastWorkouts || [];
  const pastWorkoutsWithExercise = pastWorkouts.filter(workout => workout.exercises.some(ex => ex.id === exercise.id)).reduce((acc, workout) => {
    const dateObj = new Date(workout.time);
    //const dateKeyTemp = dateObj.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const dateKey = formatMonthYear(dateObj);

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(workout);
    return acc;
  }, {});

  const sectionalData = Object.entries(pastWorkoutsWithExercise)
    .map(([date, workouts]) => ({
      title: date,
      data: workouts
    }));
  return (
    <View style={[{flex: 1,}, style]} {...props}>
      {sectionalData.length < 1 && (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <Spacer height={10} />
          <Text style={{color: "#B1B1B1", fontSize: 16, textAlign: "center"}}>No past workouts with this exercise.</Text>
          <Spacer height={30} />
        </View>

      )}
      {sectionalData.length > 0 && (<View style={{maxHeight: screenHeight-320}}><SectionList
              
          sections={sectionalData}
          keyExtractor={(item, i) => i}
          renderItem={({ item }) => {
            return (
                <PastWorkoutCard
                  data={item}
                  style={{backgroundColor: "#353535"}}
                  onPress={() => {
                    forceCloseOpenExercise();
                  }}
                  />
            )}}
          renderSectionHeader={({ section: { title } }) => (
              <ThemedView style={{backgroundColor: "#282828"}}>
                  <ThemedText style={styles.header}>{title}</ThemedText>
              </ThemedView>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          
      /></View>)}
    </View>
      
  )
}


const OpenExercise = ({style, exercise, setOpenExercise, forceCloseOpenExercise, ...props}) => {

    const [section, setSection] = useState("About"); // About, Progress, History

    const [editModeActive, setEditModeActive] = useState(false);

    const editExercise = () => {
        if (editModeActive) {
            // Save changes
            setEditModeActive(false);
        } else {
            // Enter edit mode
            setEditModeActive(true);
        }
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const isImage = exercise.image ? true : false;
    
  return (
    <Animated.View layout={LinearTransition.springify().mass(0.5).damping(10)} style={[styles.cont, style]} {...props}>
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <Pressable onPress={() => setOpenExercise(false)}>
            <Image source={whiteX} style={{ height: 30, width: 30, marginRight: 5}} />
        </Pressable>
        
        <Text adjustsFontSizeToFit style={[styles.screenText, {flex: 1,}]}>{exercise.name}</Text>

        <BlueButton color={editModeActive ? Colors.primaryBlue : Colors.primaryOrange} onPress={editExercise} title={editModeActive ? "Save" : "Edit"} style={{width: 80}} />
      </View>

      <Spacer height={20} />

      {!editModeActive && <Animated.View entering={FadeIn} exiting={FadeOut}><SectionSelect section={section} setSection={setSection} sections={["About", "Progress", "History"]} /></Animated.View>}

      {!editModeActive &&<Spacer height={20} />}
      
      {/* SCREENS DIFFER HERE */}
      {!editModeActive && section === "About" &&(
      <Animated.View entering={FadeIn} exiting={FadeOut}>

        {/* Big image */}
        <View style={styles.imageContCont}>
          <View style={styles.imageCont}>
            <GlowImage disable={true} style={[styles.image, isImage ? {} : {width: 30, height: 30, margin: "auto"}]} source={exercise.image || noimage} id={exercise.id} />
          </View>
        </View>

        <Spacer height={10} />

        {/* Muscle groups */}
        <View style={{flexDirection: 'row', marginTop: 5, flexWrap: 'wrap', justifyContent: "center"}}>
            {exercise.muscleGroups.map(muscle => (
                <Text style={{backgroundColor: "#353535", paddingVertical: 2, paddingHorizontal: 10, fontSize: 12, color: "#B1B1B1", borderRadius: 5000, marginRight: 5, marginBottom: 5}} key={muscle}>{capitalizeFirstLetter(muscle)}</Text>
            ))}
        </View>

        <Spacer height={5} />
          
        {/* Description */}
        <Text style={{color: "white", fontSize: 14, fontWeight: 300, padding: 10, textAlign: "center"}}>{exercise.description || ''}</Text>
          
      </Animated.View>)}

      {/* Progress screen - Charts and graphs */}
      {!editModeActive && section === "Progress" && <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1}}>
          <Text>Progress</Text>
      </Animated.View>}

      {/* History screen - Past workouts with exercise */}
      {!editModeActive && section === "History" && <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1}}>
          <ExerciseHistory exercise={exercise} forceCloseOpenExercise={forceCloseOpenExercise} />
      </Animated.View>}

      {/* EDIT EXERCISE WITH CREATE EXERCISE */}
      {editModeActive && <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1}}>
        <CreateExercise editMode={true} editData={exercise} locked={true} />

        <Spacer />

        <BlueButton title={"Archive exercise"} color={"#651B1B"} style={{marginHorizontal: 50}} />
        <Spacer height={20} />
      </Animated.View>}

    </Animated.View>
  )
}

export default OpenExercise

const styles = StyleSheet.create({
    cont: {
        backgroundColor: "#282828",
         borderRadius: 20,
         padding: 10,
         paddingBottom: 0,
         minHeight: 100,
        //  maxHeight: screenHeight,
         overflow: 'hidden',
    },
    screenText: {
        color: "white", 
        fontSize: 16, 
        textAlign: 'center',
    },
    imageContCont: {
      alignItems: "center",
      
    },  

    imageCont: {
        width: screenWidth-200,
        height: screenWidth-200,
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        maxWidth: screenWidth-200,
        maxHeight: screenWidth-200,
        objectFit: 'cover',
    },
    header: {
      marginTop: 10,
      marginBottom: 10,
      fontSize: 15,
      fontWeight: '600',
      color: '#606060',
      textAlign: "center",
    }
})