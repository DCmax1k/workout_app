import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import threeEllipses from '../../assets/icons/threeEllipses.png'
import greyX from '../../assets/icons/greyX.png'
import ActionMenu from '../ActionMenu'
import fileIcon from '../../assets/icons/file.png'
import trashIcon from '../../assets/icons/trash.png'
import pencilIcon from '../../assets/icons/pencil.png'

const EditExercise = ({exercise, updateExercise, index, removeExercise, ...props}) => {

    const exerciseNameRef = useRef(null);
    const noteRef = useRef(null);
    const [showNote, setShowNote] = useState(false);

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
        if (value.length > 5) value = value.split("").splice(0, 5).join('');
        const sets = exercise.sets;
        const set = sets[setIndex];
        set[track] = value !== "" ? JSON.stringify(parseInt(value)) : "";
        const newExercise = {...exercise, sets};
        updateExercise(index, newExercise);
    }
    const changeExerciseName = (value) => {
        updateExercise(index, {...exercise, name: value});
    }
    const updateNote = (value) => {
        updateExercise(index, {...exercise, note: value});
    }
    const openNoteAndFocus = () => {
        setShowNote(true);
    }
    useEffect(() => {
        if (showNote && noteRef.current) {
            noteRef.current.focus();
        }
    }, [showNote]);

  return (
    <View style={{backgroundColor: "#1C1C1C", padding: 10, borderRadius: 15, marginBottom: 10}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: "center"}}>
            <TextInput ref={exerciseNameRef} value={exercise.name} onChangeText={changeExerciseName} style={{fontSize: 15, fontWeight: 500, color: "#DB8854", }} />
            <ActionMenu backgroundColor={"#DB8854"} data={[{title: "Add note", icon: fileIcon, onPress: openNoteAndFocus, }, {title: "Rename exercise", icon: pencilIcon, onPress: () => exerciseNameRef.current?.focus()}, {title: "Delete exercise", icon: trashIcon, onPress: () => removeExercise(exercise.id)}]} />
        </View>

        {(showNote || exercise.note) && <View>
            <TextInput style={{color: "white", fontSize: 16, paddingVertical: 10, paddingHorizontal: 0}} multiline={true} ref={noteRef} value={exercise.note} onChangeText={updateNote} onEndEditing={() => exercise.note ? null : setShowNote(false)} />
        </View>}

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
                    <TextInput selectTextOnFocus keyboardType='numeric' key={setIndex+""+track} style={[styles.column, styles.valueInput]} value={set[track]} onChangeText={(value) => {updateValue(setIndex, track, value)}} />
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