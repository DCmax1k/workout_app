import { Alert, Image, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import whiteX from '../../assets/icons/whiteX.png'
import BlueButton from '../BlueButton'
import Spacer from '../Spacer'
import Dropdown from '../Dropdown'
import MultiSelectDropdown from '../MultiSelectDropdown'
import { generateUniqueId } from '../../util/uniqueId'
import { useUserStore } from '../../stores/useUserStore'

const CreateExercise = ({setCreateExercise, callback = () => {}, ...props}) => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const muscleGroupData = [{id: "0", title: "Chest"}, {id: 1, title: "Abs"}, {id: "2", title: 'Back'}, {id: "3", title: "Bicep"}, {id: "4", title: "Tricep"}, {id: "5", title: "Forearm"}, {id: "6", title: "Shoulder"}, {id: "7", title: "Leg"}, {id: "8", title: "Other"}];
    const categoryData = [{id: "0", title: "Strength - [Weight and reps]"}, {id: "1", title: "Cardio - [Time and distance]"}, {id: "2", title: 'Distance only'}, {id: "3", title: "Reps only"}];
    const categoryDataTracking = [['weight', 'reps'], ['time', 'mile'], ['mile'], ['reps']];

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [muscleGroupIds, setMuscleGroupIds] = useState([]);
    const [categoryIdSelected, setCategoryIdSelected] = useState("0");

    const saveExercise = () => {
        const tracks = categoryDataTracking[categoryData.findIndex(d => d.id === categoryIdSelected)];
        const muscleGroups = muscleGroupIds.map(id => muscleGroupData.find(d => d.id === id).title);

        if (name.length < 1) return Alert.alert("Please add a name");
        if (muscleGroupIds.length < 1) return Alert.alert("Please choose at least 1 muscle group");

        const exercise = {
            name,
            tracks,
            description,
            muscleGroups,
            id: generateUniqueId(),
        }

        const createdExercises = user.createdExercises;
        createdExercises.unshift(exercise);
        updateUser({createdExercises});

        setName("");
        setDescription("");
        setMuscleGroupIds([]);
        setCategoryIdSelected("0");
        callback(exercise.id);

        setCreateExercise(false);

    }

  return (
    
    <View style={{flex: 1, backgroundColor: "#4C4C4C", borderRadius: 20, padding: 10,}} {...props}>
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <Pressable onPress={() => setCreateExercise(false)}>
            <Image source={whiteX} style={{ height: 30, width: 30, marginRight: 5}} />
        </Pressable>
        
        <Text style={[styles.screenText, {flex: 1}]}>Create an exercise</Text>
        <BlueButton onPress={saveExercise} title={"Save"} />
      </View>

      <Spacer height={10} />

      <Text style={styles.screenText}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={(e) => setName(e)} placeholder='ex. Bench press' placeholderTextColor={"#A6A6A6"} />

      <Spacer height={10} />

      <Text style={styles.screenText}>Description of exercise - optional</Text>
      <TextInput style={styles.input} value={description} onChangeText={(e) => setDescription(e)} placeholder="ex. It's an exercise for building upper body..." placeholderTextColor={"#A6A6A6"} />
      
      <Spacer height={10} />

      <Text style={styles.screenText}>Category</Text>
      <Dropdown style={{marginTop: 5}} selectedId={categoryIdSelected} setSelectedId={setCategoryIdSelected} data={categoryData} />

      <Spacer height={10} />

      <Text style={styles.screenText}>Muscle group</Text>
      <MultiSelectDropdown style={{marginTop: 5}} selectedIds={muscleGroupIds} setSelectedIds={setMuscleGroupIds} data={muscleGroupData} />
      

    </View>
  )
}

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
    }
})