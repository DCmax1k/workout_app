import { Alert, Image, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useImperativeHandle, useState } from 'react'

import whiteX from '../../assets/icons/whiteX.png'
import lock from '../../assets/icons/lock.png'

// const  whiteX = require("../../assets/icons/whiteX.png");
// const lock = require("../../assets/icons/lock.png");

// import { icons } from "../../constants/icons";
// const { whiteX, lock } = icons;

import BlueButton from '../BlueButton'
import Spacer from '../Spacer'
import Dropdown from '../Dropdown'

import MultiSelectDropdown from '../MultiSelectDropdown'
import { generateUniqueId } from '../../util/uniqueId'
import { useUserStore } from '../../stores/useUserStore'

const CreateExercise = React.forwardRef(({setCreateExercise, callback = () => {}, editData, setEditModeActive, editMode, locked = false, editBackgroundColor = "#282828", ...props}, ref) => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const muscleGroupData = [{id: "0", title: "Chest"}, {id: "1", title: "Abs"}, {id: "2", title: 'Back'}, {id: "3", title: "Bicep"}, {id: "4", title: "Tricep"}, {id: "5", title: "Forearm"}, {id: "6", title: "Shoulder"}, {id: "7", title: "Leg"}, {id: "8", title: "Other"}];
    const categoryData = [{id: "0", title: "Strength - [Weight and reps]"}, {id: "1", title: "Cardio - [Time and distance]"}, {id: "2", title: 'Distance only'}, {id: "3", title: "Reps only"}];
    const categoryDataTracking = [['weight', 'reps'], ['mile', 'time'], ['mile'], ['reps']];

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [muscleGroupIds, setMuscleGroupIds] = useState([]);
    const [categoryIdSelected, setCategoryIdSelected] = useState("0");

    useEffect(() => {
      if (editMode && editData) {
        editData = JSON.parse(JSON.stringify(editData)); // Deep copy to avoid mutating original data
        setName(editData.name);
        setDescription(editData.description);
        const muscleGroupIdsToFill = muscleGroupData.map((d =>  {
          if (editData.muscleGroups.map(e => e.toLowerCase()).includes(d.title.toLowerCase())) {
            return d.id;
          } else {
            return null;
          }
        } ))?.filter(e => e !== null );
        setMuscleGroupIds(muscleGroupIdsToFill);

        const categoryToFillIndex = editMode ? categoryDataTracking.findIndex(d => {
          if ((d.length === editData.tracks.length) && (d[0] === editData.tracks[0])) {
            return true;
          }
        }  ) : null;
        const categoryToFill = categoryToFillIndex !== -1 ? JSON.stringify(categoryToFillIndex) : null;
          setCategoryIdSelected(categoryToFill);
        }
    }, []);
      
    
      

    // const [name, setName] = useState( editMode ? editData.name : "");
    // const [description, setDescription] = useState( editMode ? editData.description : "");

    // const muscleGroupIdsToFill = muscleGroupData.map((d =>  {
    //   if (editData.muscleGroups.map(e => e.toLowerCase()).includes(d.title.toLowerCase())) {
    //     return d.id;
    //   } else {
    //     return null;
    //   }
    // } ))?.filter(e => e !== null );
    // const [muscleGroupIds, setMuscleGroupIds] = useState(editMode ? (muscleGroupIdsToFill) : []);

    // const categoryToFillIndex = editMode ? categoryDataTracking.findIndex(d => {
    //   if ((d.length === editData.tracks.length) && (d[0] === editData.tracks[0])) {
    //     return true;
    //   }
    // }  ) : null;
    // const categoryToFill = categoryToFillIndex > 0 ? JSON.stringify(categoryToFillIndex) : null;
    // const [categoryIdSelected, setCategoryIdSelected] = useState(categoryToFill !== null ? categoryToFill : "0");

    const saveExercise = () => {
        const tracks = categoryDataTracking[categoryData.findIndex(d => d.id === categoryIdSelected)];
        const muscleGroups = muscleGroupIds.map(id => muscleGroupData.find(d => d.id === id)?.title).filter(e => e !== undefined);

        if (name.length < 1) return Alert.alert("Please add a name");
        //if (muscleGroupIds.length < 1) return Alert.alert("Please choose at least 1 muscle group");

        const exercise = {
            group: "created",
            name,
            tracks,
            description,
            muscleGroups,
            id: generateUniqueId(),
        }

        const createdExercises = user.createdExercises;
        createdExercises.unshift(exercise);
        updateUser({createdExercises});
        
        setName( "");
        setDescription("");
        setMuscleGroupIds([]);
        setCategoryIdSelected("0");
        callback(exercise.id);

        setCreateExercise(false);

        

    }

    const getData = () => {
        return {
            name,
            description,
            muscleGroupIds: muscleGroupIds,
            categoryIdSelected,
        }
    }


    useImperativeHandle(ref, () => ({
        getData: getData,
    }));

  return (
    
    <View style={{flex: 1, backgroundColor: editMode ? "transparent" : "#4C4C4C", borderRadius: 20, padding: 10,}} {...props}>
      
      {!editMode && <View style={{flexDirection: "row", alignItems: "center"}}>
        <Pressable onPress={() => setCreateExercise(false)}>
            <Image source={whiteX} style={{ height: 30, width: 30, marginRight: 5,}} />
        </Pressable>
        
        <Text style={[styles.screenText, {flex: 1}]}>Create an exercise</Text>
        <BlueButton onPress={saveExercise} title={"Save"} />
      </View>}

      {!editMode &&<Spacer height={10} />}

      <Text style={styles.screenText}>Name</Text>
      
      <View style={{position: "relative"}}>
        {locked === true && (
          <View style={[styles.lockedInput, {backgroundColor: editBackgroundColor}]}>
            <View style={{height: "100%", width: 30, paddingTop: 20, alignItems: "center"}}>
              <Image source={lock} style={{height: 20, objectFit: "contain"}} />
            </View>
          </View>
        )}
        <TextInput style={[styles.input]} value={name} onChangeText={(e) => setName(e)} placeholder='ex. Bench press' placeholderTextColor={"#A6A6A6"} />
      </View>

      <Spacer height={10} />

      <Text style={styles.screenText}>Description (optional)</Text>

      <View style={{position: "relative"}}>
        {locked === true && (
            <View style={[styles.lockedInput, {backgroundColor: editBackgroundColor}]}>
              <View style={{height: "100%", width: 30, paddingTop: 20, alignItems: "center"}}>
                <Image source={lock} style={{height: 20, objectFit: "contain"}} />
              </View>
            </View>
          )}
        <TextInput style={styles.input} value={description} onChangeText={(e) => setDescription(e)} placeholder="ex. It's an exercise for building upper body..." placeholderTextColor={"#A6A6A6"} />
      </View>
      <Spacer height={10} />

      <Text style={styles.screenText}>Category</Text>
      <View style={{position: "relative"}}>
        {locked === true && (
          <View style={[styles.lockedInput, {backgroundColor: editBackgroundColor}]}>
            <View style={{height: "100%", width: 30, paddingTop: 20, alignItems: "center"}}>
              <Image source={lock} style={{height: 20, objectFit: "contain"}} />
            </View>
          </View>
        )}
        <Dropdown locked={locked} style={{marginTop: 5}} selectedId={categoryIdSelected} setSelectedId={setCategoryIdSelected} data={categoryData} />
      </View>
      <Spacer height={10} />

      <Text style={styles.screenText}>Muscle group</Text>
      <View style={{position: "relative"}}>
        {locked === true && (
          <View style={[styles.lockedInput, {backgroundColor: editBackgroundColor}]}>
            <View style={{height: "100%", width: 30, paddingTop: 20, alignItems: "center"}}>
              <Image source={lock} style={{height: 20, objectFit: "contain"}} />
            </View>
          </View>
        )}
        <MultiSelectDropdown locked={locked} style={{marginTop: 5}} selectedIds={muscleGroupIds} setSelectedIds={setMuscleGroupIds} data={muscleGroupData} />
      </View>

    </View>
  )
});

export default CreateExercise

const styles = StyleSheet.create({
    screenText: {
        color: "white", 
        fontSize: 16, 
    },
    input: {
        fontSize: 18,
        color: "white",
        paddingVertical: 13,
        paddingLeft: 10, 
        paddingRight: 5,
        backgroundColor: "#3D3D3D",
        borderRadius: 10,
        marginTop: 5,
    },
    lockedInput: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
      borderRadius: 10,
      zIndex: 1,
      opacity: 0.8,
      alignItems: "flex-end",
      paddingRight: 10,
    }
})