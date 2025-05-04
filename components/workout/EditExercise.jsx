import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import threeEllipses from '../../assets/icons/threeEllipses.png'
import greyX from '../../assets/icons/greyX.png'

const EditExercise = ({exercise, updateExercise, index, ...props}) => {

    const requestRemoveSet = (setIndex) => {
        Alert.alert(
            "Delete set " + (setIndex + 1) + "?",
            "",
            [
                {text: "Cancel", style: "cancel"},
                {text: "Remove", onPress: () => {removeSet(setIndex)}}
            ]
        );
    }
    const removeSet = (setIndex) => {
        if (setIndex === 0) return;
        const sets = exercise.sets;
        sets.splice(setIndex, 1);
        const newExercise = {...exercise, sets};
        updateExercise(index, newExercise);
    }
    const addSet = () => {
        const sets = exercise.sets;
        const set = {};
        exercise.tracks.forEach(track => {
            set[track] = sets.length < 1 ? "0" : sets[sets.length-1][track];
        });
        sets.push(set);
        const newExercise = {...exercise, sets};
        updateExercise(index, newExercise);
    }
    const updateValue = (setIndex, track, value) => {

        const sets = exercise.sets;
        const set = sets[setIndex];
        set[track] = value !== "" ? JSON.stringify(parseInt(value)) : "";
        const newExercise = {...exercise, sets};
        updateExercise(index, newExercise);
    }

  return (
    <View style={{backgroundColor: "#1C1C1C", padding: 10, borderRadius: 15, marginBottom: 10}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: "center"}}>
            <Text style={{fontSize: 20, fontWeight: 500, color: "#DB8854", }}>{exercise.name}</Text>
            <View style={{paddingVertical: 5, paddingHorizontal: 10, backgroundColor: "#DB8854", borderRadius: 10}}>
                <Image style={{width: 20, objectFit: "contain"}} source={threeEllipses} />
            </View>
        </View>

        <View>
            <View style={styles.row}>
                <Text style={[styles.column, styles.column1]}>Sets</Text>
                <>
                {exercise.tracks.map(track => ( <Text key={track} style={styles.column}>{track}</Text> ))}
                </>
                <View style={styles.column1}></View>
            </View>
            {exercise.sets.map((set, setIndex) => (
            <View key={setIndex} style={styles.row}>
                <Text style={[styles.column, styles.column1]}>{setIndex+1}</Text>
                <>
                {exercise.tracks.map(track => (
                    <TextInput keyboardType='numeric' key={setIndex+""+track} style={[styles.column, styles.valueInput]} value={set[track]} onChangeText={(value) => {updateValue(setIndex, track, value)}} />
                ))}
                </>
                <Pressable onPress={() => {requestRemoveSet(setIndex)}} style={styles.column1}>
                    {setIndex !== 0 && (<Image style={{height: 20, width: 20}} source={greyX}  />)}
                    
                </Pressable>
            </View>
            ))}
            <Pressable onPress={addSet} style={{paddingVertical: 5, paddingHorizontal: 35, backgroundColor: "#2D2D2D", alignSelf: 'center', marginTop: 10, marginBottom: 5, borderRadius: 10}}>
                <Text style={{color: "white", fontSize: 15, fontWeight: 500}}>Add set</Text>
            </Pressable>
            
        </View>

    </View>
  )
}

export default EditExercise

const styles = StyleSheet.create({
    column: {
        width: 100,
        textAlign: 'center',
        color: "white",
        fontSize: 13,
    },
    column1: {
        width: 50,
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        height: 30,
        alignItems: "center",
    },
    valueInput: {
        fontWeight: 700,
        fontSize: 15,
    }
})