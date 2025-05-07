import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { truncate } from '../../util/truncate';



const Exercise = ({exercise, selected = false, onPress = () => {}, ...props}) => {


    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
  return (
    <Pressable onPress={onPress} style={[styles.cont, {backgroundColor: selected ? "#283878" : "#1C1C1C"}]} {...props}>
      <View style={styles.imageCont}>
        <Image style={styles.image} source={exercise.image} />
      </View>
      <View style={styles.rightCont}>
        <Text style={{color: "white", fontSize: 15, fontWeight: 700}}>{exercise.name}</Text>
        <Text style={{color: "white", fontSize: 12, fontWeight: 300}}>{truncate(exercise.description || '', 100)}</Text>
          <View style={{flexDirection: 'row', marginTop: 5, flexWrap: 'wrap'}}>
            {exercise.muscleGroups.map(muscle => (
                <Text style={{backgroundColor: selected ? "#34437F": "#262626", paddingVertical: 2, paddingHorizontal: 10, fontSize: 12, color: "#B1B1B1", borderRadius: 5000, marginRight: 5, marginBottom: 5}} key={muscle}>{capitalizeFirstLetter(muscle)}</Text>
            ))}
        </View>
        
      </View>
    </Pressable>
  )
}

export default Exercise

const styles = StyleSheet.create({
    cont: {
        flex: 1,
        height: 120,
        borderRadius: 20,
        flexDirection: 'row',
        padding: 10,
        alignItems: "center",
        marginBottom: 10,
    },
    imageCont: {
        height: 60,
        width: 60,
        backgroundColor: "#82AF8C",
        borderRadius: 10,
        overflow: 'hidden',
    },
    image: {
        height: 60,
        width: 60,
        objectFit: 'cover'

    },
    rightCont: {
        flex: 1,
        marginLeft: 10,
    }
})