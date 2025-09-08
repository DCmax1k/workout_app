import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import threeEllipses from '../../assets/icons/threeEllipses.png'
import greyX from '../../assets/icons/greyX.png'
import ActionMenu from '../ActionMenu'
import fileIcon from '../../assets/icons/file.png'
import trashIcon from '../../assets/icons/trash.png'
import plusIcon from '../../assets/icons/plus.png'
import pencilIcon from '../../assets/icons/pencil.png'
import check from '../../assets/icons/check.png'
import lightBulb from '../../assets/icons/lightBulb.png'
import doubleCheck from '../../assets/icons/doubleCheck.png'
import dumbellIcon from '../../assets/icons/weight.png'
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated'
import { useUserStore } from '../../stores/useUserStore'
import { ScrollView } from 'react-native-gesture-handler'

const firstCapital = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const EditExercise = ({exercise, updateExercise, index, removeExercise, activeWorkoutStyle, ...props}) => {
    const user = useUserStore((state) => state.user);

    const exerciseNameRef = useRef(null);
    const noteRef = useRef(null);
    const [showNote, setShowNote] = useState(false);

    const [suggesstion, setSuggesstion] = useState("");

    const removeSet = (setIndex) => {
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
    const addSet = (amount = 3) => {
        const sets = exercise.sets;
        
        if (amount === 0) { // Remove all sets
            const newExercise = {...exercise, sets: []};
            updateExercise(index, newExercise);
            return;
        } else {
            for (let i = 0; i < amount; i++) {
                const set = {};
                exercise.tracks.forEach(track => {
                    set[track] = sets.length < 1 ? "0" : sets[sets.length-1][track] === "0" ? "" : sets[sets.length-1][track];
                });
                sets.push(set);
            }
        }
        const newExercise = {...exercise, sets};
        updateExercise(index, newExercise);
    }

    const checkAllSets = () => {
        let sets = exercise.sets;
        const allChecked = !exercise.sets.map(s => s.complete || false).includes(false);
        if (allChecked) {
            // Uncheck all
            sets = sets.map(s => {
                s.complete = false;
                return s;
            });
        } else {
            // Check all
            sets = sets.map(s => {
                s.complete = true;
                return s;
            });
        }
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

    const metricTag = exercise.tracks.includes("weight") ? "kgs" : "km";
    const imperialTag = exercise.tracks.includes("weight") ? "lbs" : "miles";

    const getTrackingTag = (track) => {
        if (track === "weight" || track === "weightPlus" || track === "mile") return exercise.unit === "metric" ? metricTag : imperialTag;
        if (track === "weightPlus") return exercise.unit === "metric" ? (metricTag + "+") : (imperialTag + "+");
        
        return track;
    }

    const dismissSuggesstion = () => {
        setSuggesstion("");
    }

    // Find rules for suggesstions; Rules order matters, and each suggesstion is first come first serve
    useEffect(() => {
        if (activeWorkoutStyle) {
                const eachCompletedExercise = user.completedExercises[exercise.id] || [];
                //console.log("Current exercise: ", exercise);
                //console.log("Completed: ", eachCompletedExercise);

                // Rules that require:
                // Is a weight, has at least 2 completed exercises, and at least 1 set in current exercise
                if (exercise.tracks.includes("weight") &&  eachCompletedExercise.length >= 2 && exercise.sets.length > 0) {
                    // RULE 1: If a user does 3 sets of 10 reps or more and the weight was the exact same for both completed exercises and the current set, add 5 lbs.
                    const everyWeightCompleted = [];
                    const everyRepCompleted = [];
                    eachCompletedExercise.forEach((ex, i) => {
                        if (i < eachCompletedExercise.length-2) return;
                        ex.sets.forEach(s => {
                            everyWeightCompleted.push(parseFloat(s["weight"]));
                            everyRepCompleted.push(parseFloat(s["reps"]));
                        })
                    });
                    const minWeight = Math.min(...everyWeightCompleted);
                    const maxWeight = Math.max(...everyWeightCompleted);
                    const minRep = Math.min(...everyRepCompleted);
                    const maxRep = Math.min(...everyRepCompleted);
                    const sameCurrentWeightCheck = parseFloat(exercise.sets[exercise.sets.length - 1]["weight"]) === everyWeightCompleted[0];
                    const everyWeightIsSameCheck = minWeight === maxWeight;
                    const everyRepIsOver = minRep >= 9 && maxRep >= 9;
                    if (everyRepCompleted.length < 1 || everyWeightCompleted.length < 1) return;
                    if (sameCurrentWeightCheck === true && everyWeightIsSameCheck === true && everyRepIsOver === true) {
                        if (suggesstion === "") {
                            setSuggesstion(`Try ${everyWeightCompleted[0]+5} lbs`);
                        }
                    }
                }   
                
        }
    }, [user.completedExercises])

    return (
    <Animated.View layout={LinearTransition.springify().mass(0.5).damping(10)} entering={FadeIn} exiting={FadeOut} style={{backgroundColor: activeWorkoutStyle ? "":"#1C1C1C", padding: 10, borderRadius: 15, marginBottom: 10}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: "center"}}>
            <TextInput ref={exerciseNameRef} value={exercise.name} onChangeText={changeExerciseName} style={{fontSize: 15, flex: 1, fontWeight: 500, color: activeWorkoutStyle?"white":"#DB8854", }} />
            <ActionMenu offset={activeWorkoutStyle} backgroundColor={activeWorkoutStyle?"transparent":"#DB8854"} data={[
                {title: "Add note", icon: fileIcon, onPress: openNoteAndFocus, },
                {title: "Rename exercise", icon: pencilIcon, onPress: () => exerciseNameRef.current?.focus()},
                {title: exercise.unit === "metric" ? ("Imperial unit (" + imperialTag + ")") : ("Metric unit (" + metricTag + ")"), icon: dumbellIcon, onPress: switchUnit},
                {title: "Delete exercise", icon: trashIcon, onPress: removeExercise}]} />
        </View>

        {(showNote || exercise.note) ? (<Animated.View layout={LinearTransition} entering={FadeIn} exiting={FadeOut}>
            <TextInput style={{color: activeWorkoutStyle ? "#A4A4A4" : "white", fontSize: 16, paddingVertical: 10, paddingHorizontal: 0}} multiline={true} ref={noteRef} value={exercise.note} onChangeText={updateNote} onEndEditing={() => exercise.note ? null : setShowNote(false)} />
        </Animated.View>) : null}
        
        <Animated.View layout={LinearTransition} entering={FadeIn} exiting={FadeOut}>
            {/* Top row, labels */}
            <View style={styles.row}>
                    <Text style={[styles.column, styles.column1]}>Set</Text>
                <>
                    {exercise.tracks.map(track => ( <Text key={track} style={styles.column}>{ firstCapital(getTrackingTag(track)) }</Text> ))}
                </>
                {activeWorkoutStyle && (
                    <Pressable onPress={checkAllSets} style={[styles.columnForComplete, styles.completeButton, {backgroundColor: exercise.sets.length > 0 ? exercise.sets.map(s => s.complete || false).includes(false)  ? "#1D1D1D" : "#21863C" : "#1D1D1D" }]}>
                        <Image style={{height: 15, width: 15}} source={doubleCheck}  />
                    </Pressable>
                )}
                <View style={styles.columnForComplete}></View>
            </View>
            {/* Each set */}
            {exercise?.sets.map((set, setIndex) => (
                <Animated.View key={setIndex} style={[styles.row, {backgroundColor: set.complete ? "rgba(33, 134, 60, 0.14)":"transparent"}]} layout={LinearTransition} entering={FadeIn} exiting={FadeOut}>
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
                        {(<Image style={{height: 20, width: 20, tintColor: "#673434"}} source={greyX}  />)}
                    </Pressable>
                </Animated.View>
            ))}
            {/* Suggestions */}
            {activeWorkoutStyle && suggesstion.length > 0 ? (<Animated.View style={styles.row} layout={LinearTransition} entering={FadeIn} exiting={FadeOut}>
                <View style={{flex: 1, height: 25, backgroundColor: "#222222", borderRadius: 5, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    {/* Left side */}
                    <View style={{flexDirection: "row", height: "100%", alignItems: "center"}}>
                        <Image source={lightBulb} style={{height: 15, width: 15, objectFit: "contain", marginRight: 5}} />

                        <Text style={{color: "#d3d3d3ff", fontSize: 13,}}>{suggesstion}</Text>
                    </View>
                    {/* Right side */}
                    <View style={{flexDirection: "row", height: "100%", alignItems: "center"}}>
                        <Pressable onPress={dismissSuggesstion} style={{}}>
                            <Image style={{height: 20, width: 20}} source={greyX}  />
                        </Pressable>
                    </View>
                </View>
            </Animated.View>) : null}
            {/* Add set */}
            <Animated.View layout={LinearTransition} style={{flex: 1}}>
                <Pressable onPress={() => {addSet(1)}} style={{paddingVertical: 5, paddingHorizontal: 35, backgroundColor: "#2D2D2D", alignSelf: 'center', marginTop: 10, marginBottom: 5, borderRadius: 10}}>
                    <Text style={{color: "white", fontSize: 15, fontWeight: 500}}>Add Set</Text>
                </Pressable>
                {/* <View style={{position: "absolute", height: "100%", right: 0, top: 0, justifyContent: "center"}}>
                    <ActionMenu offset={activeWorkoutStyle} backgroundColor={"transparent"} data={[
                        {title: "Add 1 set", icon: plusIcon, onPress: () => {addSet(1)}, },
                        {title: "Add 2 sets", icon: plusIcon, onPress: () => {addSet(2)}},
                        {title: "Remove all sets", icon: trashIcon, onPress: () => {addSet(0)}},
                        ]} />
                </View> */}
            </Animated.View>
            
            
        </Animated.View>

    </Animated.View>
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