import { Dimensions, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { AlphabetList } from "react-native-section-alphabet-list";
import AlphabetList from "react-native-flatlist-alphabet";
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import TitleWithBack from '../../../components/TitleWithBack'
import { useUserStore } from '../../../stores/useUserStore';
import { Exercises } from '../../../constants/Exercises';

import Spacer from '../../../components/Spacer';
import Search from '../../../components/Search';
import searchExercise from '../../../util/searchExercise';
import Exercise from '../../../components/workout/Exercise';
import { Colors } from '../../../constants/Colors';
import CreateExercise from '../../../components/workout/CreateExercise';
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown } from 'react-native-reanimated';
import { filter } from 'd3';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const ExercisesIndex = () => {
  const user = useUserStore((state) => state.user);

  const [searchValue, setSearchValue] = useState("");
  const [createExercise, setCreateExercise] = useState(false);


  const allExercises = [...user.createdExercises, ...Exercises ];
  const filteredExercises = searchExercise(allExercises, searchValue).map(ex => {
    return {
      value: ex.name,
      key: ex.id,
      name: ex.name,
      id: ex.id,
      group: ex.group,
      muscleGroups: ex.muscleGroups,
      description: ex.description,
      equipment: ex.equipment,
      image: ex.image,
    };
  });


  const selectExercise = (id) => {
    // Navigate to the exercise details page
    // For example, using React Navigation:
    // navigation.navigate('ExerciseDetails', { exerciseId: id });
    console.log("Selected Exercise ID:", id);
  }

  const openCreateExercise = () => {
    setCreateExercise(true);
  }

  const scrollToExerciseByKey = (keyToFind) => {
    console.log("Looking for key: ", keyToFind);
    console.log("Filtered Exercises: ", filteredExercises.map(e => e.key));
    const index = filteredExercises.findIndex(item => item.key === keyToFind);
    if (index !== -1 && listRef.current) {
      listRef.current.scrollToIndex({ index, animated: true });
    } else {
      console.warn("Exercise not found or listRef is not ready.");
    }
  };

  return (
    <ThemedView style={styles.container}>
        <SafeAreaView style={{flex: 1,}} >

            {createExercise && (
              <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", width: screenWidth, height: screenHeight, zIndex: 2}}>

                  <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={{position: "absolute", width: screenWidth-20, top: 50, left: 10, zIndex: 2}}>
                    <CreateExercise setCreateExercise={setCreateExercise} />
                  </Animated.View>

              </Animated.View>
            )}
              

            <TitleWithBack style={{marginHorizontal: 20}} title={"Exercises"} backBtn={false} actionBtn={{active: true, image: require("../../../assets/icons/plus.png"), action: () => openCreateExercise()}}/>

            <Spacer height={20} />

            <Search value={searchValue} style={{marginHorizontal: 20}} onChangeText={(e) => setSearchValue(e)} />
            

            <Spacer height={20} />

            <View style={{flex: 1,}}>
              <AlphabetList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}

                data={filteredExercises}
                getItemHeight={() => 120}
                indexLetterColor='white'
                indexLetterSize={12}
                renderItem={(item) => (
                  <Exercise exercise={item} onPress={() => selectExercise(item.id)} style={styles.exercise} />
                )}
                sectionHeaderHeight={30}
                renderSectionHeader={(section) => (
                  <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
                  </View>
                )}
              />
            </View>
            
            
        </SafeAreaView>
    </ThemedView>
  )
}

export default ExercisesIndex

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 115,
    },

    search: {
        height: 50,
        fontSize: 20,
        color: "white",
        backgroundColor: "#1C1C1C",
        borderRadius: 99999,
        paddingLeft: 20,
        paddingRight: 10,
    },

    sectionHeaderContainer: {
      borderBottomColor: "#383838",
      borderBottomWidth: 1,
      backgroundColor: Colors.dark.background,
      height: 30,
    },
    sectionHeaderLabel: {
      color: 'white',
      paddingLeft: 25,
    },

    listItemContainer: {
      paddingLeft: 20,
    },
    listItemLabel: {
      color: 'white',
    },
    exercise: {
      backgroundColor: "transparent",
      borderBottomColor: "#383838",
      borderBottomWidth: 1,
      paddingRight: 20
    },
    
  })
