import { Dimensions, Pressable, SectionList, StyleSheet, Text, TextInput, View } from 'react-native'
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
import { PaperProvider, Portal, Provider } from 'react-native-paper';
import SwipeToDelete from '../../../components/SwipeToDelete';
import { SafeAreaView } from 'react-native-safe-area-context';
import getAllExercises from '../../../util/getAllExercises';
import { router, useLocalSearchParams, } from 'expo-router';
import OpenExercise from '../../../components/workout/OpenExercise';
import { useIsFocused } from '@react-navigation/native';

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

function groupExercisesByLetter(exercises) {
    const grouped = {};
  
    exercises.forEach(ex => {
      if (!grouped[ex.name.charAt(0).toUpperCase()]) {
        grouped[ex.name.charAt(0).toUpperCase()] = [];
      }
      grouped[ex.name.charAt(0).toUpperCase()].push(ex);
    });
  
    return Object.keys(grouped).map(groupName => ({
      title: groupName,
      data: grouped[groupName]
    })).sort((a, b) => a.title.localeCompare(b.title));
}

const ExercisesIndex = () => {
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  const [searchValue, setSearchValue] = useState("");
  const [createExercise, setCreateExercise] = useState(false);
  const [openExercise, setOpenExercise] = useState(false);
  const [exerciseOpen, setExerciseOpen] = useState({});

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


  

  const sectionalData = groupExercisesByLetter(searchExercise(getAllExercises(user), searchValue));


  const allExercises = getAllExercises(user);
  const filteredExercises = searchExercise(allExercises, searchValue).map(ex => {
    return {
      time: Date.now(),
      value: ex.name,
      key: ex.id,
      ...ex,
    };
  });


  const openCreateExercise = () => {
    setCreateExercise(true);
  }

  const scrollToExerciseByKey = (keyToFind) => {

    const index = filteredExercises.findIndex(item => item.key === keyToFind);
    if (index !== -1 && listRef.current) {
      listRef.current.scrollToIndex({ index, animated: true });
    } else {
      console.warn("Exercise not found or listRef is not ready.");
    }
  };

  


  return (
    // <PaperProvider>
    <ThemedView style={styles.container}>
        <SafeAreaView style={{flex: 1,}} >

            {createExercise && (
              <Portal>
                <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", width: screenWidth, height: screenHeight, zIndex: 2}}>

                  <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={{position: "absolute", width: screenWidth-20, top: 50, left: 10, zIndex: 2}}>
                    <CreateExercise setCreateExercise={setCreateExercise} />
                  </Animated.View>

              </Animated.View>
              </Portal>
              
            )}

            {openExercise && (
            <Portal >
              <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", width: screenWidth, height: screenHeight, zIndex: 2}} >



                  <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={{position: "absolute", width: screenWidth-20, top: 50, left: 10, zIndex: 2}}>
                    <OpenExercise exercise={exerciseOpen} setOpenExercise={setOpenExercise} forceCloseOpenExercise={() => setOpenExercise(false)} />
                  </Animated.View>

                

              </Animated.View>
            </Portal>
            
          )}

            
              

            <TitleWithBack title={"Exercises"} backBtn={false} actionBtn={{active: true, image: require("../../../assets/icons/plus.png"), action: () => openCreateExercise()}}/>

            <Spacer height={20} />

            <Search value={searchValue} style={{marginHorizontal: 20}} onChangeText={(e) => setSearchValue(e)} />
            

            <Spacer height={20} />

            <View style={{flex: 1,}}>
              {/* <AlphabetList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}

                data={filteredExercises}
                
                getItemHeight={() => 120}
                indexLetterColor='white'
                indexLetterSize={12}
                renderItem={(item) => (

                    <Exercise exercise={item} style={styles.exercise} />

                )}
                sectionHeaderHeight={30}
                renderSectionHeader={(section) => (
                  <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
                  </View>
                )}
              /> */}
              {/* TRYING REGULAR LIST INCASE THE ALPHABET ONE DOESNT UPDATE EXERCISES */}
              <SectionList
                keyboardDismissMode={"on-drag"}
                sections={sectionalData}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                  <Exercise exercise={item} style={styles.exercise} />
                )}
                showsVerticalScrollIndicator={false}
                renderSectionHeader={({section: {title}}) => (
                  <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionHeaderLabel}>{title}</Text>
                  </View>
                )}
                contentContainerStyle={{ paddingBottom: 50 }}
              />
            </View>
            
            
        </SafeAreaView>
    </ThemedView>
    // </PaperProvider>
  )
}

export default ExercisesIndex

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 50,
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
