import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import threeEllipses from '../../assets/icons/threeEllipses.png'
import greyX from '../../assets/icons/greyX.png'
import ActionMenu from '../ActionMenu'
import fileIcon from '../../assets/icons/file.png'
import trashIcon from '../../assets/icons/trash.png'
import pencilIcon from '../../assets/icons/pencil.png'
import check from '../../assets/icons/check.png'
import dumbellIcon from '../../assets/icons/weight.png'
import Animated, { LinearTransition } from 'react-native-reanimated'

const EditExercise = ({exercise, updateExercise, index, removeExercise, activeWorkoutStyle, ...props}) => {

    const exerciseNameRef = useRef(null);
    const noteRef = useRef(null);
    const [showNote, setShowNote] = useState(false);

    const removeSet = (setIndex) => {
        if (setIndex === 0) return;
        const sets = exercise.sets;
        sets.splice(setIndex, 1);
        const newExercise = {...exercise, sets};
        updateExercise(index, newExercise);
    }
    const completedSet = (setIndex) => {
        exercise.tracks.forEach(track => {
            if (!exercise.sets[setIndex][track]) {
                exercise.sets[setIndex][track] = getSetValueBefore(setIndex, track);
            }
        })
        exercise.sets[setIndex].complete = exercise.sets[setIndex].complete ? false : true;
        const newExercise = {...exercise, sets: exercise.sets};
        updateExercise(index, newExercise);
    }
    const addSet = () => {
        const sets = exercise.sets;
        const set = {};
        exercise.tracks.forEach(track => {
            set[track] = sets.length < 1 ? "0" : sets[sets.length-1][track] === "0" ? "" : sets[sets.length-1][track];
        });
        sets.push(set);
        const newExercise = {...exercise, sets};
        updateExercise(index, newExercise);
    }
    const updateValue = (setIndex, track, value) => {
        if (value.length > 7) value = value.split("").splice(0, 7).join('');
        const sets = exercise.sets;
        const set = sets[setIndex];
        set[track] = value !== "" ? (value[value.length-1] !== "." && value[value.length-1] !== "0") ? JSON.stringify(parseFloat(value)) : value : "";
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

    const getSetValueBefore = (setIndex, track) => {
        if (setIndex === 0) return exercise.sets[setIndex][track] || "0";
        for (let i = setIndex-1; i >= 0; i--) {
            const value = exercise.sets[i][track];
            if (value) return value;
            if (i===0) return "0";
        }
    }

    const switchUnit = () => {
        const newUnit = exercise.unit === "metric" ? "imperial" : "metric";
        const newExercise = {...exercise, unit: newUnit,};
        updateExercise(index, newExercise);
    }

    const metricTag = exercise.tracks.includes("weight") === "weight" ? "kgs" : "km";
    const imperialTag = exercise.tracks.includes("weight") === "weight" ? "lbs" : "mile";

    const getTrackingTag = (track) => {
        if (track === "weight" || track === "weightPlus" || track === "mile") return exercise.unit === "metric" ? metricTag : imperialTag;
        if (track === "weightPlus") return exercise.unit === "metric" ? (metricTag + "+") : (imperialTag + "+");
        return track;
    }

  return (
    <View style={{backgroundColor: activeWorkoutStyle ? "":"#1C1C1C", padding: 10, borderRadius: 15, marginBottom: 10}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: "center"}}>
            <TextInput ref={exerciseNameRef} value={exercise.name} onChangeText={changeExerciseName} style={{fontSize: 15, fontWeight: 500, color: activeWorkoutStyle?"white":"#DB8854", }} />
            <ActionMenu offset={activeWorkoutStyle} backgroundColor={activeWorkoutStyle?"transparent":"#DB8854"} data={[
                {title: "Add note", icon: fileIcon, onPress: openNoteAndFocus, },
                {title: "Rename exercise", icon: pencilIcon, onPress: () => exerciseNameRef.current?.focus()},
                {title: exercise.unit === "metric" ? ("Imperial unit (" + imperialTag + ")") : ("Metric unit (" + metricTag + ")"), icon: dumbellIcon, onPress: switchUnit},
                {title: "Delete exercise", icon: trashIcon, onPress: removeExercise}]} />
        </View>

        {(showNote || exercise.note) && <View>
            <TextInput style={{color: activeWorkoutStyle ? "#A4A4A4" : "white", fontSize: 16, paddingVertical: 10, paddingHorizontal: 0}} multiline={true} ref={noteRef} value={exercise.note} onChangeText={updateNote} onEndEditing={() => exercise.note ? null : setShowNote(false)} />
        </View>}
        
        <View>
            {/* Top row, labels */}
            <View style={styles.row}>
                    <Text style={[styles.column, styles.column1]}>Sets</Text>
                <>
                    {exercise.tracks.map(track => ( <Text key={track} style={styles.column}>{getTrackingTag(track)}</Text> ))}
                </>
                {activeWorkoutStyle && (
                    <View style={[styles.columnForComplete, styles.completeButton]}>
                        <Image style={{height: 15, width: 15}} source={check}  />
                    </View>
                )}
                <View style={styles.columnForComplete}></View>
            </View>
            {/* Each set */}
            {exercise.sets.map((set, setIndex) => (
                <Animated.View key={setIndex} style={[styles.row, {backgroundColor: set.complete ? "rgba(33, 134, 60, 0.14)":"transparent"}]} layout={LinearTransition}>
                    <Text style={[styles.column, styles.column1]}>{setIndex+1}</Text>
                    <>
                        {exercise.tracks.map(track => {
                            const placeholderValue = setIndex === 0 ? "0" : getSetValueBefore(setIndex, track);
                            return (<TextInput selectTextOnFocus keyboardType='numeric' key={setIndex+""+track+""+placeholderValue} style={[styles.column, styles.valueInput]} value={set[track]} onChangeText={(value) => {updateValue(setIndex, track, value)}} placeholder={placeholderValue} placeholderTextColor={"#797979"} />)
                        })}
                    </>
                    {activeWorkoutStyle && (
                        <Pressable onPress={() => {completedSet(setIndex)}} style={[styles.columnForComplete, styles.completeButton, {backgroundColor: set.complete ? "#21863C" : "#1D1D1D",}]}>
                            <Image style={{height: 15, width: 15, objectFit: "contain"}} source={check}  />
                        </Pressable>
                    )}
                    <Pressable onPress={() => {removeSet(setIndex)}} style={styles.columnForComplete}>
                        {setIndex !== 0 && (<Image style={{height: 20, width: 20}} source={greyX}  />)}
                    </Pressable>
                </Animated.View>
            ))}
            {/* Add set */}
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
    columnForComplete: {
        width: 30,
    },
    completeButton: {
        marginHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        height: 30,
        borderRadius: 5,
        alignItems: "center",
    
    },
    valueInput: {
        fontWeight: 700,
        fontSize: 15,
        height: 30,
        paddingTop: 0,
        paddingBottom: 0,
    }
})