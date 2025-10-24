import { Alert, Dimensions, Image, Pressable, SectionList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

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
import GraphWidget from '../GraphWidget';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function formatMonthYear(date) {
  const month = date.toLocaleString('default', { month: 'long' }).toUpperCase(); // "MAY"
  const year = date.getFullYear(); // 2025
  return `${month} ${year}`; // "MAY 2025"
}


const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function kmToMiles(km) {
  // miles = kilometers * 0.621371
  const miles = km * 0.621371;
  return Math.round(miles * 100) / 100;
}

function kgToLbs(kg) {
  // pounds = kilograms * 2.20462
  const pounds = kg * 2.20462;
  return Math.round(pounds * 100) / 100;
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
                  reopenExercise={exercise}
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
  const user = useUserStore(state => state.user);
  const updateUser = useUserStore(state => state.updateUser);
  const archivedExercises = user.archivedExercises || [];
  const createExerciseRef = React.useRef(null);
    const [section, setSection] = useState("About"); // About, Progress, History
    const [editModeActive, setEditModeActive] = useState(false);

    const muscleGroupData = [{id: "0", title: "Chest"}, {id: "1", title: "Abs"}, {id: "2", title: 'Back'}, {id: "3", title: "Bicep"}, {id: "4", title: "Tricep"}, {id: "5", title: "Forearm"}, {id: "6", title: "Shoulder"}, {id: "7", title: "Leg"}, {id: "8", title: "Other"}];
    const categoryData = [{id: "0", title: "Strength - [Weight and reps]"}, {id: "1", title: "Cardio - [Time and distance]"}, {id: "2", title: 'Distance only'}, {id: "3", title: "Reps only"}];
    const categoryDataTracking = [['weight', 'reps'], ['mile', 'time'], ['mile'], ['reps']];

    const saveExerciseFromEdit = () => {
      //console.log(exercise);
      if (exercise.group !== "created") return setEditModeActive(false);
      const {name, description, muscleGroupIds, categoryIdSelected} = createExerciseRef.current?.getData();
        if (name.length < 1) return Alert.alert("Please add a name");
        //if (muscleGroupIds.length < 1) return Alert.alert("Please choose at least 1 muscle group");

        const tracks = categoryDataTracking[categoryData.findIndex(d => d.id === categoryIdSelected)];
        const muscleGroups = muscleGroupIds.map(id => muscleGroupData.find(d => d.id === id)?.title).filter(e => e !== undefined);

        const newExercise = {
            ...exercise,
            name,
            tracks,
            description,
            muscleGroups,
        }
        
        const newCreatedExercises = user.createdExercises.map(ex => {
          if (ex.id === exercise.id) {
            return newExercise;
          }
          return ex;
        });
        updateUser({createdExercises: newCreatedExercises});
        //console.log("Updated exercise: ", newExercise);
        
        // setName( "");
        // setDescription("");
        // setMuscleGroupIds([]);
        // setCategoryIdSelected("0");
        //callback(exercise.id);

        setEditModeActive(false);
    }

    
    const editExercise = () => {
        if (editModeActive) {
            // Save changes
            saveExerciseFromEdit();
            //setEditModeActive(false);
        } else {
            // Enter edit mode
            setEditModeActive(true);
            //createExerciseRef.current?.fillData(exercise);
        }
    }


    const isImage = exercise.image ? true : false;

    const archiveExercise = () => {
      if (archivedExercises && archivedExercises[exercise.id]) return Alert.alert("This exercise is already archived.");
      Alert.alert("Archive Exercise", "The exercise will be removed from your exercises. It can always be added back from Profile > Settings > Archived", [
        { text: "Cancel", style: "cancel" },
        { text: "Archive", onPress: () => {
          archivedExercises[exercise.id] = true;
          updateUser({ archivedExercises });
          setOpenExercise(false);
        }, style: "destructive" }
      ]);
    }

    const completedExercises = user.completedExercises[exercise.id] || [];
    const bestData =  completedExercises.map((exer, ind) => {
      let highestAmount = 0;
      let highestAmountIndex = 0;
      exer.sets.forEach((s, i) => {
          const group = exer.tracks.includes("weight") ? "strength" : exer.tracks.includes("weightPlus") ? "strengthPlus" : (exer.tracks.includes("mile") && exer.tracks.includes("time")) ? "cardio" : exer.tracks.includes("mile") ? "distance" : exer.tracks.includes("reps") ? "repsOnly" : null;
          const track = group === "strength" ? "weight" : group==="strengthPlus" ? "weightPlus" : group==="cardio" ? "mile" : group==="distance" ? "mile" : group==="repsOnly" ? "reps" : null;
          const value = track ? parseFloat(s[track]) : 0;
          if (value > highestAmount) {
              highestAmountIndex = i;
              highestAmount = value;
          }
      });
      const bestSet = exer.sets[highestAmountIndex];
      let returnValue = "";
      if (exer.tracks.includes("mile")) returnValue = `${highestAmount} miles`;
      else if (exer.tracks.includes("weight") || exer.tracks.includes("weightPlus")) returnValue = `${highestAmount} lbs`;
      if (exer.tracks.includes("reps")) returnValue += ` x${bestSet["reps"]}`;
      return {date: exer.date, amount: highestAmount, unit: exer.unit}
      
    });

    const weightOrDistance = (exercise.tracks.includes("weight") || exercise.tracks.includes("weightPlus"));

    


    const visibleExerciseWidgetIds = user.tracking.visibleWidgets.map(w => {
      if (w.length >= 3 && w.slice(0, 3) === "ex_") {
        return w.slice(3, w.length);
      } else return null;
    }).filter(o => o !== null);

    const selectAddExerciseWidget = (ex) => {
      if (visibleExerciseWidgetIds.includes(ex.id)) return;
      const updated = ["ex_" + ex.id, ...user.tracking.visibleWidgets];
      updateUser({tracking: { visibleWidgets: updated}});
    }

    const hideWidget = (exercise) => {
        const wid = "ex_" + exercise.id;
        const visibleWidgets = user.tracking.visibleWidgets;
        const ind = visibleWidgets.indexOf(wid)
        if (ind < 0) return router.back();
        
        visibleWidgets.splice(ind, 1);
        
        updateUser({tracking: { visibleWidgets: visibleWidgets}});
      }

    const addWidgetToProgress = () => {
      if (visibleExerciseWidgetIds.includes(exercise.id)) {
        // Remove
        hideWidget(exercise);
      } else {
        // Add
        selectAddExerciseWidget(exercise);
      }
      
    }
    
  return (
    <Animated.View layout={LinearTransition.springify().damping(90)} style={[styles.cont, style]} {...props}>
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <Pressable onPress={() => setOpenExercise(false)}>
            <Image source={whiteX} style={{ height: 30, width: 30, marginRight: 5}} />
        </Pressable>
        
        <Text adjustsFontSizeToFit style={[styles.screenText, {flex: 1,}]}>{exercise.name}</Text>

        <BlueButton color={editModeActive ? Colors.primaryBlue : Colors.primaryOrange} onPress={editExercise} title={editModeActive ? "Save" : "Edit"} style={{width: 80}} />
      </View>

      <Spacer height={20} />

      {!editModeActive && <Animated.View entering={FadeIn} exiting={FadeOut}>
        <SectionSelect section={section} setSection={setSection} sections={["About", "Progress", "History"]} />
      </Animated.View>}

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
              <View key={muscle} style={{backgroundColor: "#353535", borderRadius: 5000,justifyContent: "center", alignItems: "center",marginRight: 5, marginBottom: 5,paddingVertical: 2, paddingHorizontal: 10,}}>
                <Text style={{  fontSize: 12, color: "#B1B1B1",  }} key={muscle}>{capitalizeFirstLetter(muscle)}</Text>
              </View>
                
            ))}
        </View>

        <Spacer height={5} />
          
        {/* Description */}
        <Text style={{color: "white", fontSize: 14, fontWeight: 300, padding: 10, textAlign: "center"}}>{exercise.description || ''}</Text>
          
      </Animated.View>)}

      {/* Progress screen - Charts and graphs */}
      {!editModeActive && section === "Progress" &&
      (<Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1}}>

          {completedExercises.length < 1 === true ? (
            // No completed exercises
            <GraphWidget


                        data={[0]}
                        dates={[Date.now(), Date.now()]}
                        title={"No data yet"}
                        subtitle={"Lift amount"}
                        unit={""}
                        color={"#546FDB"}
                        fullWidget={true}
                      />
          ) : (
            // Show completed exercise widgets
            
            <GraphWidget


                        data={bestData.map((item) => {
                          if (item.unit === 'metric') {
                            return weightOrDistance ? kgToLbs(item.amount) : kmToMiles(item.amount);
                          } else {
                            return item.amount
                          }
                          
                        })}
                        dates={bestData.map((item) => item.date)}
                        title={"Best set"}
                        subtitle={weightOrDistance ? "Lift amount" : "Distance" }
                        unit={weightOrDistance ? "lbs" : "miles"}
                        color={"#546FDB"}
                        fullWidget={true}
                      />
          )}

          <Spacer height={20} />
          

          <BlueButton
          title={visibleExerciseWidgetIds.includes(exercise.id) ? "Hide widget from progress tab" : "Add widget to progress tab"}
          onPress={addWidgetToProgress}
          color={visibleExerciseWidgetIds.includes(exercise.id) ? Colors.protein : Colors.primaryBlue}
          />

          <Spacer height={20} />

      </Animated.View>)}

      {/* History screen - Past workouts with exercise */}
      {!editModeActive && section === "History" && <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1}}>
          <ExerciseHistory exercise={exercise} forceCloseOpenExercise={forceCloseOpenExercise} />
      </Animated.View>}

      {/* EDIT EXERCISE WITH CREATE EXERCISE */}
      {editModeActive && <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1}}>
          
        {exercise.group !== "created" && (
          <Text style={{textAlign: "center", color: "grey", textDecorationColor: "grey", textDecorationLine: "underline"}}>Only custom exercises are editable.</Text>
        )}

        <CreateExercise ref={createExerciseRef} editMode={true} setEditModeActive={setEditModeActive} editData={exercise} locked={exercise.group !== "created"} />

        <Spacer />

        <BlueButton title={"Archive exercise"} color={"#651B1B"} style={{marginHorizontal: 50}} onPress={archiveExercise} />
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