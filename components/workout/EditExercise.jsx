import { Alert, Dimensions, Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import threeEllipses from '../../assets/icons/threeEllipses.png'
import greyX from '../../assets/icons/greyX.png'
import ActionMenu from '../ActionMenu'
import fileIcon from '../../assets/icons/file.png'
import trashIcon from '../../assets/icons/trash.png'
import eyeIcon from '../../assets/icons/eye.png'
import gripDots from '../../assets/icons/gripDots.png'
import pencilIcon from '../../assets/icons/pencil.png'
import check from '../../assets/icons/check.png'
import lightBulb from '../../assets/icons/lightBulb.png'
import doubleCheck from '../../assets/icons/doubleCheck.png'
import rotateIcon from '../../assets/icons/rotate.png'
import dumbellIcon from '../../assets/icons/weight.png'
import Animated, { FadeIn, FadeInDown, FadeInRight, FadeOut, FadeOutDown, FadeOutRight, LinearTransition,  } from 'react-native-reanimated'
import { useUserStore } from '../../stores/useUserStore'
import { ScrollView } from 'react-native-gesture-handler'
import ThemedText from '../ThemedText'
import OpenExercise from './OpenExercise'
import { Portal } from 'react-native-paper'
import { Colors } from '../../constants/Colors'
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'
import { generateUniqueId } from '../../util/uniqueId'
import PopupSheet from '../PopupSheet'
import Spacer from '../Spacer'
import ScrollPicker from '../ScrollPicker'
import minutesToHMS from '../../util/minutesToHMS'
import formatExerciseTime from '../../util/formatExerciseTime'

const firstCapital = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

const EditExercise = ({exercise, updateExercise, index, removeExercise, activeWorkoutStyle, swapExercise=()=>{}, drag=()=>{}, dragActive=false, ...props}) => {
    const user = useUserStore((state) => state.user);

    const [focusedInput, setFocusedInput] = useState({ setIndex: null, track: null });

    const exerciseNameRef = useRef(null);
    const noteRef = useRef(null);
    const [showNote, setShowNote] = useState(false);

    const [openExercise, setOpenExercise] = useState(false); // Is open or not
    const [exerciseOpen, setExerciseOpen] = useState({}); // The exercise thats open

    const [timeKeyboardVisible, setTimeKeyboardVisible] = useState(false);

    const [suggesstion, setSuggesstion] = useState("");

    const [showHamHint, setShowHamHint] = useState(false);
    useEffect(() => {
        let timer;
        if (showHamHint) {
            timer = setTimeout(() => {
            setShowHamHint(false);
            }, 3000);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
        }, [showHamHint]);

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
                const set = {uniqueId: generateUniqueId()};
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
            sets.forEach((s, i) => {
                if (!s.complete) completedSet(i);
            });
            return; // Return because the function updates already
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
    const endEditing = (setIndex, track, value) => {
        const sets = exercise.sets;
        const set = sets[setIndex];
        if (!value || isNaN(value)) set[track] = getSetValueBefore(setIndex, track);
        else {
            set[track] = JSON.stringify(parseFloat(value));
        }
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
        let returnValue = track;
        const defaultUnit = user.settings.preferences.liftUnit;
        if (track === "weight" || track === "weightPlus" || track === "mile") {
            if (exercise.unit) {
                returnValue = exercise.unit === "metric" ? metricTag : imperialTag;
            } else {
                returnValue = defaultUnit === "kgs" ? metricTag : imperialTag;
            }

            
        }
        if (track === "weightPlus") {
            if (exercise.unit) {
                returnValue = exercise.unit === "metric" ? (metricTag + "+") : (imperialTag + "+");
            } else {
                returnValue = defaultUnit === "kgs" ? (metricTag + "+") : (imperialTag + "+");
            }

        }
        
        return returnValue;
    }

    const dismissSuggesstion = () => {
        setSuggesstion("");
    }

    const viewOpenExercise = (exercise) => {
        const clone = JSON.parse(JSON.stringify(exercise));
        setExerciseOpen(clone);
        setOpenExercise(true);
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

    const requestSwapExercise = () => {
        swapExercise(exercise);
    }

    let actionMenuData = [
                {title: "Open Exercise", icon: eyeIcon, onPress: () => viewOpenExercise(exercise)},
                {title: "Add Note", icon: fileIcon, onPress: openNoteAndFocus, },
                {title: "Rename Exercise", icon: pencilIcon, onPress: () => exerciseNameRef.current?.focus()},
                {title: exercise.unit === "metric" ? ("Imperial Unit (" + imperialTag + ")") : ("Metric Unit (" + metricTag + ")"), icon: dumbellIcon, onPress: switchUnit},
                {title: "Delete Exercise", icon: trashIcon, onPress: removeExercise, color: "#FF6C6C"},
            ];
    if (exercise.tracks.length === 1 && exercise.tracks[0] === "time") actionMenuData.splice(3, 1);
    if (activeWorkoutStyle) {
        actionMenuData.splice(actionMenuData.length - 1, 0, {title: "Swap for Today", icon: rotateIcon, onPress: () => requestSwapExercise(), });
    }

    const setExerciseSets = (data) => {
        const newSets = [...data];
        updateExercise({sets: newSets});
    }

    const formatExerciseTimePlaceholder = (value) => {
        const {hours, minutes, seconds} = minutesToHMS(value);
        let str = "";
        if (hours > 0) {
            str += `${hours}h`
        }
        if (minutes > 0) {
            str += `${str.length > 0 ? " ":""}${minutes}m`
        }
        if (seconds > 0) {
            str += `${str.length > 0 ? " ":""}${seconds}s`
        }
        return str ? str : "0";
    }

    const updateTimeValue = (unit="seconds", value) => {
        const { setIndex, track } = focusedInput;
        console.log(setIndex);
        const {hours, minutes, seconds} = minutesToHMS(exercise.sets[setIndex][track]);
        let totalMinutes;
        switch (unit) {
            case "hours":
                totalMinutes = (value*60) + minutes + (seconds/60);
                break;
            case "minutes":
                totalMinutes = (hours*60) + value + (seconds/60);
                break;
            case "seconds":
                totalMinutes = (hours*60) + minutes + (value/60);
                break;
            default:
                totalMinutes = 0;
        }
        updateValue(setIndex, track, totalMinutes);
    }

    const { setIndex: sI, track: trk } = focusedInput;
    const {hours: initialPopupHourValue, minutes: initialPopupMinuteValue, seconds: initialPopupSecondValue,} = minutesToHMS(sI === null ? 0 : exercise.sets[sI][trk]);

    return (
    <View layout={LinearTransition.springify().damping(90)} entering={FadeIn} exiting={FadeOut} style={[{backgroundColor: activeWorkoutStyle ? "#2A2A2A":"#1C1C1C", padding: 10, borderRadius: 15, marginBottom: 10,}, false && {height: 40}]} {...props}>
        {openExercise && (
                <Portal >
                    <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", width: screenWidth, height: screenHeight, zIndex: 2}} >
    
                        <Pressable onPress={() => setOpenExercise(false)} style={{height: "100%", width: "100%", zIndex: 0}}></Pressable>
    
                        <View entering={FadeInDown} exiting={FadeOutDown} style={{position: "absolute", width: screenWidth-20, top: 50, left: 10, zIndex: 2}}>
                            <OpenExercise exercise={exerciseOpen} setOpenExercise={setOpenExercise} forceCloseOpenExercise={() => setOpenExercise(false)} />
                        </View>
    
                    
    
                    </Animated.View>
                </Portal>
                
                )}

        <PopupSheet active={timeKeyboardVisible} setActive={(val) =>  {setTimeKeyboardVisible(val); setFocusedInput({ setIndex: null, track: null })}}>
            <View style={{flexDirection: "row", justifyContent: "center"}}>
                <View style={{alignItems: "center"}}>
                    <ThemedText title={true} style={{fontSize: 20, fontWeight: "800"}}>Hours</ThemedText>
                    <Spacer height={10} />
                    <ScrollPicker
                    width={120}
                    range={[0, 20]}
                    increment={1}
                    padWithZero={false}
                    initialValue={initialPopupHourValue ?? 0}
                    onValueChange={(val) => updateTimeValue("hours", val) }
                    />
                </View>
                <View style={{alignItems: "center"}}>
                    <ThemedText title={true} style={{fontSize: 20, fontWeight: "800"}}>Minutes</ThemedText>
                    <Spacer height={10} />
                    <ScrollPicker
                    width={120}
                    range={[0, 59]}
                    increment={1}
                    padWithZero={true}
                    initialValue={initialPopupMinuteValue ?? 0}
                    onValueChange={(val) => updateTimeValue("minutes", val)}
                    />
                </View>
                <View style={{alignItems: "center"}}>
                    <ThemedText title={true} style={{fontSize: 20, fontWeight: "800"}}>Seconds</ThemedText>
                    <Spacer height={10} />
                    <ScrollPicker
                    width={120}
                    range={[0, 59]}
                    increment={1}
                    padWithZero={true}
                    initialValue={initialPopupSecondValue ?? 0}
                    onValueChange={(val) => updateTimeValue("seconds", val)}
                    />
                </View>
                

            
            </View>
            <Spacer />
        </PopupSheet>
        {/* Header that covers the exercise name. Single press to select title. LongPress for drag. zIndex 1 but actionMenu is zIndez 2 */}
        {/* <Pressable onPress={() => exerciseNameRef.current?.focus()} onLongPress={drag} style={{zIndex: 1, width: "100%", height: 35, position: "absolute", }}>

        </Pressable> */}
        

        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: "center"}}>
            <Pressable onPressIn={drag} style={{height: 30, width: 30, marginVertical: -10, zIndex: 2, justifyContent: "center", alignItems: "center",}}>
                <Image source={gripDots} style={{objectFit: "contain", height: 10, width: 30, tintColor: "#6d6d6dff", }} />
            </Pressable>

            <TextInput ref={exerciseNameRef} value={exercise.name} onChangeText={changeExerciseName} style={{fontSize: 15, flex: 1, fontWeight: 500, color: activeWorkoutStyle?"white":"#DB8854", }} />

            <ActionMenu key={exercise.unit} style={{zIndex: 2}} offset={activeWorkoutStyle} backgroundColor={activeWorkoutStyle?"transparent":"#DB8854"} data={actionMenuData}
                />
                
        </View>

        {/* All content minus the header to fade out for sorting */}
        {true && (<View> 
            {(showNote || exercise.note) ? (<View layout={LinearTransition} entering={FadeIn} exiting={FadeOut}>
                <TextInput style={{color: activeWorkoutStyle ? "#A4A4A4" : "white", fontSize: 16, paddingVertical: 10, paddingHorizontal: 0}} multiline={true} ref={noteRef} value={exercise.note} onChangeText={updateNote} onEndEditing={() => exercise.note ? null : setShowNote(false)} />
            </View>) : null}
            
            <View layout={LinearTransition} entering={FadeIn} exiting={FadeOut}>
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
                    <View key={setIndex} style={[styles.row, {backgroundColor: (set.complete && activeWorkoutStyle) ? "rgba(33, 134, 60, 0.14)":"transparent"}, {borderRadius: 999}]} layout={LinearTransition} entering={FadeIn} exiting={FadeOut}>
                        <View style={[styles.column, styles.column1, ]}>
                            <View style={[{backgroundColor: "#444444ff", borderRadius: 999, width: 25, height: 25, justifyContent: "center", alignItems: "center", margin: "auto"}, (set.complete && activeWorkoutStyle) && {backgroundColor: "rgba(33, 134, 60, 0.14)"}]}>
                                <Text style={{ color: "white", fontSize: 13, }} >{setIndex+1}</Text>
                            </View>
                            
                        </View>
                        
                        <>
                            {exercise.tracks.map(track => {
                                const placeholderValue = setIndex === 0 ? "0" : getSetValueBefore(setIndex, track);
                                // CUSTOM TIME INPUT
                                if (track === "time") return (
                                    <TextInput
                                        showSoftInputOnFocus={false}
                                        caretHidden={Platform.OS === 'android'}
                                        key={setIndex+""+track+""+placeholderValue}
                                        style={[
                                            styles.column, styles.valueInput,
                                            (focusedInput.setIndex === setIndex && focusedInput.track === track) ? styles.focusedInput : null]}
                                        value={formatExerciseTime(set[track])}
                                        placeholder={formatExerciseTimePlaceholder(parseFloat(placeholderValue))}
                                        placeholderTextColor={"#797979"}
                                        onPress={() => {setFocusedInput({ setIndex, track }); setTimeKeyboardVisible(true);}}
                                        />
                                );
                                //  INPUT FOR EVERYTHING ELSE
                                return (
                                <TextInput
                                caretHidden={Platform.OS === 'android'}
                                selectTextOnFocus keyboardType='numeric'
                                key={setIndex+""+track+""+placeholderValue}
                                style={[
                                    styles.column, styles.valueInput,
                                    (focusedInput.setIndex === setIndex && focusedInput.track === track) ? styles.focusedInput : null]}
                                value={set[track]}
                                onChangeText={(value) => {updateValue(setIndex, track, value)}}
                                onEndEditing={(e) => {endEditing(setIndex, track, e.nativeEvent.text)}}
                                placeholder={placeholderValue}
                                placeholderTextColor={"#797979"}
                                onFocus={() => setFocusedInput({ setIndex, track })}
                                onBlur={() => setFocusedInput({ setIndex: null, track: null })}
                                />)
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
                    </View>
                ))}
                {/* Suggestions */}
                {activeWorkoutStyle && suggesstion.length > 0 ? (<View style={styles.row} layout={LinearTransition} entering={FadeIn} exiting={FadeOut}>
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
                </View>) : null}
                {/* Add set */}
                <View layout={LinearTransition} style={{flex: 1}}>
                    <Pressable onPress={() => {addSet(1)}} style={{paddingVertical: 5, paddingHorizontal: 25, backgroundColor: activeWorkoutStyle?Colors.primaryBlue:"#2D2D2D", alignSelf: 'center', marginTop: 10, marginBottom: 5, borderRadius: 999999}}>
                        <Text style={{color: "white", fontSize: 15, fontWeight: 500}}>Add Set</Text>
                    </Pressable>
                    {/* <View style={{position: "absolute", height: "100%", right: 0, top: 0, justifyContent: "center"}}>
                        <ActionMenu offset={activeWorkoutStyle} backgroundColor={"transparent"} data={[
                            {title: "Add 1 set", icon: plusIcon, onPress: () => {addSet(1)}, },
                            {title: "Add 2 sets", icon: plusIcon, onPress: () => {addSet(2)}},
                            {title: "Remove all sets", icon: trashIcon, onPress: () => {addSet(0)}},
                            ]} />
                    </View> */}
                </View>
                
                
            </View>
        </View>)}

        

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
        overflow: "hidden",
        marginTop: 1,
        marginBottom: 1,
    },
    valueInput: {
        fontWeight: 700,
        fontSize: 15,
        height: 30,
        paddingTop: 0,
        paddingBottom: 0,
    },
    focusedInput: {
        borderWidth: 1,
        borderColor: Colors.primaryBlue, 
        borderRadius: 10,
    }
})