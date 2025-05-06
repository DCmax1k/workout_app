import { FlatList, Image, Pressable, ScrollView, SectionList, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../ThemedView'
import ThemedText from '../ThemedText'
import { Exercises } from '../../constants/Exercises'
import { useUserStore } from '../../stores/useUserStore'
import greyX from '../../assets/icons/greyX.png'
import { Colors } from '../../constants/Colors'
import plus from '../../assets/icons/plus.png'
import Exercise from './Exercise'
import Spacer from '../Spacer'

function groupExercisesBySection(exercises) {
    const grouped = {};
  
    exercises.forEach(ex => {
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

function shouldShowExerciseForFilter(exercise, searchValue) {
    const name = exercise.name.toLowerCase();
    const muscles = exercise.muscleGroups.join(" ");
    const group = exercise.group;
    let s = searchValue.toLowerCase().trim();
    if (s.length>1 && s[s.length-1]==="s") s = s.split('').splice(0, s.length-1).join('');
    return name.includes(s) || muscles.includes(s) || group.includes(s);
}

const AddExercise = ({setExerciseModal, addExercises, ...props}) => {
    const user = useUserStore((state) => state.user);

    const [exercisesToAdd, setExercisesToAdd] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    const createdExercisesFiltered = searchValue ? user.createdExercises.filter(ex => {
        return shouldShowExerciseForFilter(ex, searchValue);
    }) : user.createdExercises;
    const dbExercisesFiltered = searchValue ? Exercises.filter(ex => {
        return shouldShowExerciseForFilter(ex, searchValue);

    }) : Exercises;

    const dbExercisesFilteredOrganized = groupExercisesBySection(dbExercisesFiltered);

    const sectionalData = createdExercisesFiltered.length === 0 ? dbExercisesFilteredOrganized :
    [
        {
            title: 'Modified',
            data: createdExercisesFiltered,
        },
        ...dbExercisesFilteredOrganized,
    ];

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
    }
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
  return (
    <ThemedView style={{flex: 1, padding: 20}}>
        <View style={styles.actionButtons}>
            <View>
                <Pressable onPress={() => setExerciseModal(false)}>
                    <Image style={{height: 50, width: 50}} source={greyX} />
                </Pressable>
            </View>
            <View style={{zIndex: 1}}>
                <Pressable onPress={requestAddExercises} style={{paddingHorizontal: 10, paddingVertical: 10, backgroundColor: exercisesToAdd.length < 1 ? "grey":Colors.primaryBlue, borderRadius: 10, flexDirection: 'row', alignItems: 'center'}}>
                    <Image style={{height: 20, width: 20, marginRight: 5}} source={plus} />
                    <Text style={{fontSize: 20, color: "white", fontWeight: 700}}>{exercisesToAdd.length}</Text>
                </Pressable>
            </View>
        </View>
        <View style={[styles.header]}>
            <ThemedText title={true} style={{fontSize: 23, fontWeight: 700, textAlign: "center"}}>Add exercise</ThemedText>
        </View>

        <Spacer height={10} />

        <TextInput style={styles.search} placeholder='Search' value={searchValue} onChangeText={(e) => setSearchValue(e)} />

        <Spacer height={10} />

        <SectionList
            sections={sectionalData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (<Exercise exercise={item} onPress={() => selectExercise(item.id)} selected={exercisesToAdd.includes(item.id)} />)}
            renderSectionHeader={({ section: { title } }) => (
                <ThemedText style={styles.header}>{capitalizeFirstLetter(customTitle(title))}</ThemedText>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}
            
        />

    </ThemedView>
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
        marginTop: 10,
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
    }
})