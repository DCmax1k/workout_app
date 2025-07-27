import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

import whiteX from '../../assets/icons/whiteX.png';
import BlueButton from '../BlueButton';
import { Colors } from '../../constants/Colors';
import SectionSelect from '../SectionSelect';
import Spacer from '../Spacer';
import noimage from '../../assets/icons/noimage.png';
import GlowImage from '../GlowImage';
import WorkoutDescription from './WorkoutDescription';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const OpenExercise = ({style, exercise, setOpenExercise, ...props}) => {

    const [section, setSection] = useState("About"); // About, Progress, History

    const editExercise = () => {
        console.log(exercise);
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const isImage = exercise.image ? true : false;
    
  return (
    <View style={[styles.cont, style]} {...props}>
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <Pressable onPress={() => setOpenExercise(false)}>
            <Image source={whiteX} style={{ height: 30, width: 30, marginRight: 5}} />
        </Pressable>
        
        <Text adjustsFontSizeToFit style={[styles.screenText, {flex: 1,}]}>{exercise.name}</Text>

        <BlueButton color={Colors.primaryOrange} onPress={editExercise} title={"Edit"} />
      </View>

      <Spacer height={20} />

      <SectionSelect section={section} setSection={setSection} sections={["About", "Progress", "History"]} />

      <Spacer height={20} />
      
      {/* Screens differ here */}
      {section === "About" && <Animated.View entering={FadeIn} exiting={FadeOut}>

        {/* IMAGE */}
        <View style={styles.imageContCont}>
          <View style={styles.imageCont}>
            <GlowImage disable={true} style={[styles.image, isImage ? {} : {width: 30, height: 30, margin: "auto"}]} source={exercise.image || noimage} id={exercise.id} />
          </View>
        </View>

        <Spacer height={10} />

        {/* Muscle groups */}
        <View style={{flexDirection: 'row', marginTop: 5, flexWrap: 'wrap', justifyContent: "center"}}>
            {exercise.muscleGroups.map(muscle => (
                <Text style={{backgroundColor: "#353535", paddingVertical: 2, paddingHorizontal: 10, fontSize: 12, color: "#B1B1B1", borderRadius: 5000, marginRight: 5, marginBottom: 5}} key={muscle}>{capitalizeFirstLetter(muscle)}</Text>
            ))}
        </View>

        <Spacer height={5} />
          
        {/* Description */}
        <Text style={{color: "white", fontSize: 14, fontWeight: 300, padding: 10, textAlign: "center"}}>{exercise.description || ''}</Text>
          
      </Animated.View>}

      {/* Progress screen - Charts and graphs */}
      {section === "Progress" && <Animated.View entering={FadeIn} exiting={FadeOut}>
          <Text>Progress</Text>
      </Animated.View>}

      {/* History screen - Past workouts with exercise */}
      {section === "History" && <Animated.View entering={FadeIn} exiting={FadeOut}>
          <Text>History</Text>
      </Animated.View>}

      
      

    </View>
  )
}

export default OpenExercise

const styles = StyleSheet.create({
    cont: {
        backgroundColor: "#282828",
         borderRadius: 20,
         padding: 10,
         height: screenHeight-200,
    },
    screenText: {
        color: "white", 
        fontSize: 16, 
        textAlign: 'center',
    },
    imageContCont: {
      alignItems: "center",
      
    },  

    imageCont: {
        width: screenWidth-200,
        height: screenWidth-200,
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        maxWidth: screenWidth-200,
        maxHeight: screenWidth-200,
        objectFit: 'cover',
    },
})