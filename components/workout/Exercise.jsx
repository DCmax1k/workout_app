import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { truncate } from '../../util/truncate';
import noimage from '../../assets/icons/noimage.png';
import GlowImage from '../GlowImage';
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown } from 'react-native-reanimated';
import OpenExercise from './OpenExercise';
import { Portal } from 'react-native-paper';

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const Exercise = ({style, exercise, selected = false, disablePress = false, onPress = false, ...props}) => {


  const [openExercise, setOpenExercise] = useState(false);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const isImage = exercise.image ? true : false;
  return (
    <View>

      {openExercise && (
        <Portal >
          <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", width: screenWidth, height: screenHeight, zIndex: 2}} >



              <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={{position: "absolute", width: screenWidth-20, top: 50, left: 10, zIndex: 2}}>
                <OpenExercise exercise={exercise} setOpenExercise={setOpenExercise} forceCloseOpenExercise={() => setOpenExercise(false)} />
              </Animated.View>

            

          </Animated.View>
        </Portal>
        
      )}

    <Pressable onPress={() => disablePress ? (onPress ? onPress() : null) : setOpenExercise(true)} style={[styles.cont, {backgroundColor: selected ? "#283878" : "#1C1C1C"}, style]} {...props}>
      <View style={styles.imageCont}>
        <Image style={[styles.image, isImage ? {} : {width: 30, height: 30, margin: "auto"}]} source={exercise.image || noimage} id={exercise.id} />
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
    </View>
    
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
        justifyContent: "center",
        alignItems: "center",
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