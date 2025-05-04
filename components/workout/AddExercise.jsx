import { FlatList, Image, Pressable, ScrollView, SectionList, StyleSheet, Text, View } from 'react-native'
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

const AddExercise = ({setExerciseModal, addExercises, ...props}) => {
    const user = useUserStore((state) => state.user);
    //const allExercises = [...user.createdExercises, ...Exercises];

    const [exercisesToAdd, setExercisesToAdd] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    const createdExercisesFiltered = user.createdExercises.filter(ex => searchValue ? ex.name.includes(searchValue.toLowerCase()) : true);
    const dbExercisesFiltered = Exercises.filter(ex => searchValue ? ex.name.includes(searchValue.toLowerCase()) : true);
    const sectionalData = [
        {
          title: 'Modified',
          data: createdExercisesFiltered,
        },
        {
          title: 'Exercises',
          data: dbExercisesFiltered,
        },
      ];

    //const allExercisesFiltered = allExercises.filter(ex => searchValue ? ex.name.includes(searchValue.toLowerCase()) : true);

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

        <Spacer height={20} />

        {/* <FlatList
            data={allExercisesFiltered}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (<Exercise exercise={item} />)}
        /> */}
        <SectionList
            sections={sectionalData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (<Exercise exercise={item} onPress={() => selectExercise(item.id)} selected={exercisesToAdd.includes(item.id)} />)}
            renderSectionHeader={({ section: { title } }) => (
                <ThemedText style={styles.header}>{title}</ThemedText>
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
    }
})