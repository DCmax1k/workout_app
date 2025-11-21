import { Dimensions, FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, SectionList, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../ThemedView'
import ThemedText from '../ThemedText'
import { Exercises } from '../../constants/Exercises'
import { useUserStore } from '../../stores/useUserStore'
import greyX from '../../assets/icons/greyX.png'
import { Colors } from '../../constants/Colors'
import plus from '../../assets/icons/plus.png'
import rotateIcon from '../../assets/icons/rotate.png'
import Exercise from './Exercise'
import Spacer from '../Spacer'
import ActionMenu from '../ActionMenu'
import { Portal } from 'react-native-paper'
import CreateExercise from './CreateExercise'

import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown, SlideInDown, SlideOutDown } from 'react-native-reanimated'
import Search from '../Search'
import searchExercise from '../../util/searchExercise'
import keyboardIcon from '../../assets/icons/keyboard.png';
import { SafeAreaView } from 'react-native-safe-area-context'
import getAllExercises from '../../util/getAllExercises'
import { BottomSheetSectionList } from '@gorhom/bottom-sheet'
import FilterAndSearch from '../FilterAndSearch'


const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const filterByCategories = (exercises, categories) => {
    if (categories.length === 0) {
        return exercises;
    } else {
        return exercises.filter(ex => {
            for (let i = 0; i < ex.muscleGroups.length; i++) {  

                if (categories.map(str => str.toLowerCase()).includes(ex.muscleGroups[i].toLowerCase())) {
                    return true;
                }
            }
            return false;
        });
    }

}

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


function groupExercisesBySection(exercises) {
    const grouped = {};
    exercises.forEach(ex => {
        if (ex.group === 'custom') ex.group = 'created';
      if (!grouped[ex.group]) {
        grouped[ex.group] = [];
      }
      grouped[ex.group].push(ex);
    });
  
    return Object.keys(grouped).map(groupName => ({
      title: groupName,
      data: grouped[groupName]
    }));
}

function customTitle(title) {
    return title === 'leg' ? "legs" : title === 'shoulder' ? "shoulders" : title === 'forearm' ? "forearms" : title === 'bicep' ? "biceps" : title === 'tricep' ? "triceps" : title;
}


const AddExercise = ({setExerciseModal, addExercises, notModal=false, bottomSheet=false, swapIsLive=false, setSwapIsLive=()=>{}, ...props}) => {
    const user = useUserStore((state) => state.user);

    const [exercisesToAdd, setExercisesToAdd] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [createExercise, setCreateExercise] = useState(false);

    const [filterSelected, setFilterSelected] = useState([]);


    // Using optimized search function
    // const sectionalData = groupExercisesBySection(searchExercise(getAllExercises(user), searchValue));
    // New way for filtering by categories
    const filteredData = filterByCategories(searchExercise(getAllExercises(user), searchValue), filterSelected);
    const sectionalData = filterSelected.length > 0 ? [{title: "Filtered", data: filteredData}] : groupExercisesByLetter(filteredData);

    // Old way for reference
    // const createdExercisesFiltered = searchExercise(user.createdExercises, searchValue);
    // const dbExercisesFiltered = searchExercise(Exercises, searchValue);

    // const dbExercisesFilteredOrganized = groupExercisesBySection(dbExercisesFiltered);

    // const sectionalData = createdExercisesFiltered.length === 0 ? dbExercisesFilteredOrganized :
    // [
    //     {
    //         title: 'Created',
    //         data: createdExercisesFiltered,
    //     },
    //     ...dbExercisesFilteredOrganized,
    // ];

    const selectExercise = (exerciseId) => {
        if (exercisesToAdd.includes(exerciseId)) {
            return setExercisesToAdd(exercisesToAdd.filter(id => id !== exerciseId));
        }
        setExercisesToAdd([...exercisesToAdd, exerciseId]);
    }

    const requestAddExercises = () => {
        if (exercisesToAdd.length < 1) return;
        addExercises(exercisesToAdd);
        setExerciseModal(false);
        setExercisesToAdd([]);
    }
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const isIos = Platform.OS === 'ios';
  return (
    // <Portal.Host>
        <ThemedView style={[{flex: 1, padding: 20}, bottomSheet && {paddingTop: 0}]}>
            {createExercise && (
            <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", left: 0, top: 0, width: screenWidth, height: screenHeight, zIndex: 2}}>

                    <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={{position: "absolute", width: screenWidth-20, top: bottomSheet ? 10 : 50, left: 10, zIndex: 2}}>
                        <CreateExercise setCreateExercise={setCreateExercise} callback={(exerciseID) => selectExercise(exerciseID) } />
                    </Animated.View>

            </Animated.View>
            )}
            
            {/* Add exercises floating button */}
            {exercisesToAdd.length > 0 && (
            <Animated.View entering={SlideInDown.springify().damping(90)} exiting={SlideOutDown.springify().damping(90)} style={{position: 'absolute', bottom: isIos ? 50 : 50, left: 20, right: 20, zIndex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Pressable onPress={requestAddExercises} style={{paddingHorizontal: 20, paddingVertical: 20, backgroundColor: exercisesToAdd.length < 1 ? "grey":Colors.primaryBlue, borderRadius: 9999, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{height: 20, width: 20, marginRight: 10}} source={swapIsLive ? rotateIcon : plus} />
                    <Text style={{fontSize: 20, color: "white", fontWeight: 400}}>{swapIsLive ? "Swap for " : "Add "}<Text style={{fontWeight: 700}}>{exercisesToAdd.length}</Text> exercise{exercisesToAdd.length===1?"":"s"}</Text>
                </Pressable>
            </Animated.View> )}


            <SafeAreaView>
            <View style={[styles.actionButtons]}>
                <View>
                    <Pressable onPress={() => {setExerciseModal(false); setSwapIsLive(null)}}>
                        <Image style={{height: 50, width: 50}} source={greyX} />
                    </Pressable>
                </View>
                <View style={{zIndex: 1}}>
                    {/* <Pressable onPress={requestAddExercises} style={{paddingHorizontal: 10, paddingVertical: 10, backgroundColor: exercisesToAdd.length < 1 ? "grey":Colors.primaryBlue, borderRadius: 10, flexDirection: 'row', alignItems: 'center'}}>
                        <Image style={{height: 20, width: 20, marginRight: 5}} source={plus} />
                        <Text style={{fontSize: 20, color: "white", fontWeight: 700}}>{exercisesToAdd.length}</Text>
                    </Pressable> */}

                    <Pressable onPress={() => setCreateExercise(true)} style={{paddingHorizontal: 10, paddingVertical: 10, flexDirection: 'row', alignItems: 'center',}}>
                        {/* <Image style={{height: 20, width: 20, marginRight: 5}} source={plus} /> */}
                        <Text style={{fontSize: 15, color: "#FFA46B", fontWeight: 400}}>New</Text>
                    </Pressable>

                </View>
            </View>

            <View style={[styles.header]}>
                <ThemedText title={true} style={{fontSize: 23, fontWeight: 700, textAlign: "center"}}>{swapIsLive ? "Swap":"Add"} Exercise</ThemedText>
                {swapIsLive && <ThemedText style={{fontSize: 14, fontWeight: 400, textAlign: "center"}}>A temperary swap for this active workout only.</ThemedText>}
            </View>

            <Spacer height={10} />

            {/* <Search dismissKeyboard={false} value={searchValue} onChangeText={(e) => setSearchValue(e)} actionMenuData={[ {title: "Create new exercise", icon: plus, onPress: () => setCreateExercise(true)}]} /> */}
            <FilterAndSearch setValue={(v) => setSearchValue(v)} value ={searchValue} onChangeText={(e) => setSearchValue(e)} selected={filterSelected} setSelected={setFilterSelected} style={{marginHorizontal: -20}} padding={15} />
            

            <Spacer height={10} />

            
            {/* AFTER SDK 54 BOTTOMSHEETSECTIONLIST THROWS ERRORS */}
            {/* {bottomSheet ? (
               <BottomSheetSectionList 
               keyboardDismissMode={"on-drag"}
               sections={sectionalData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (<Exercise disablePress={true} exercise={item} onPress={() => selectExercise(item.id)} selected={exercisesToAdd.includes(item.id)} />)}
                renderSectionHeader={({ section: { title } }) => (
                    <ThemedView>
                        <ThemedText style={styles.header}>{capitalizeFirstLetter(customTitle(title))}</ThemedText>
                    </ThemedView>
                    
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 200 }}
               />
            ) : ( */}
                <SectionList
                keyboardDismissMode={"on-drag"}
                sections={sectionalData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (<Exercise disablePress={true} exercise={item} onPress={() => selectExercise(item.id)} selected={exercisesToAdd.includes(item.id)} />)}
                renderSectionHeader={({ section: { title } }) => (
                    <ThemedView>
                        <ThemedText style={styles.header}>{capitalizeFirstLetter(customTitle(title === "created" ? "Custom" : title))}</ThemedText>
                    </ThemedView>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 200 }}
                
            />
            {/* )} */}

            
            </SafeAreaView>

            
            



        </ThemedView>
    // </Portal.Host>
    
  )
}

export default AddExercise

const styles = StyleSheet.create({
    actionButtons: {
        height: 50,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        marginBottom: 10,
        fontSize: 15,
        fontWeight: 600
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
        //  KeyboardAvoidingView styles
    cont:{
      paddingVertical: 5,
      paddingHorizontal: 10,
      backgroundColor: Colors.primaryOrange,
      borderRadius: 10,
      borderColor: Colors.dark.backgroundColor,
      borderWidth: 2,
      marginBottom: 50,
  }
})