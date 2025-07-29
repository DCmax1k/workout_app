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
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useUserStore } from '../../stores/useUserStore';
import PastWorkoutCard from './PastWorkoutCard';
import ThemedView from '../ThemedView';
import ThemedText from '../ThemedText';

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
      <SectionList
              
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
          
      />
    </View>
      
  )
}


const OpenExercise = ({style, exercise, setOpenExercise, forceCloseOpenExercise, ...props}) => {

    const [section, setSection] = useState("About"); // About, Progress, History

    const editExercise = () => {
        console.log(exercise);
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const isImage = exercise.image ? true : false;
    
  return (
    <View style={[styles.cont, style]} {...props}>
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <Pressable onPress={() => setOpenExercise(false)}>
            <Image source={whiteX} style={{ height: 30, width: 30, marginRight: 5}} />
        </Pressable>
        
        <Text adjustsFontSizeToFit style={[styles.screenText, {flex: 1,}]}>{exercise.name}</Text>

        <BlueButton color={Colors.primaryOrange} onPress={editExercise} title={"Edit"} />
      </View>

      <Spacer height={20} />

      <SectionSelect section={section} setSection={setSection} sections={["About", "Progress", "History"]} />

      <Spacer height={20} />
      
      {/* Screens differ here */}
      {section === "About" && <Animated.View entering={FadeIn} exiting={FadeOut}>

        {/* IMAGE */}
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
          
      </Animated.View>}

      {/* Progress screen - Charts and graphs */}
      {section === "Progress" && <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1}}>
          <Text>Progress</Text>
      </Animated.View>}

      {/* History screen - Past workouts with exercise */}
      {section === "History" && <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1}}>
          <ExerciseHistory exercise={exercise} forceCloseOpenExercise={forceCloseOpenExercise} />
      </Animated.View>}

      
      

    </View>
  )
}

export default OpenExercise

const styles = StyleSheet.create({
    cont: {
        backgroundColor: "#282828",
         borderRadius: 20,
         padding: 10,
         paddingBottom: 0,
         height: screenHeight-200,
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