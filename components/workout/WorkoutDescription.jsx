import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedText from '../ThemedText';
import { Exercises } from '../../constants/Exercises';
import { useUserStore } from '../../stores/useUserStore';
import getAllExercises from '../../util/getAllExercises';
import { Colors } from '../../constants/Colors';

const WorkoutDescription = ({workout, style, truncateAmount = 50, ...props}) => {
    const user = useUserStore((state) => state.user);
    const allExercises = getAllExercises(user);
    const exercises = workout.exercises.filter(ex => !user.archivedExercises?.[ex.id]);

    const truncate = (text, maxLength) =>
        text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

    if (!workout) return (<ThemedText>None</ThemedText>);
      if (!exercises) return  (<ThemedText>None</ThemedText>);
    const length = exercises.length;
    let exercisesString = "";
    exercises.forEach((ex, i) => {
        const foundExercise = allExercises.find(e => e.id===ex.id);
        if (!foundExercise) return;
        return exercisesString+=`${exercisesString.length!==0?", ":""}${ex.name || foundExercise.name}`
    });

  return length === 0 ? (
    <ThemedText style={style}>Add workouts!</ThemedText>
  ) : (
    <ThemedText style={style}>{length} exercise{length===1 ? '':'s'} - <Text style={{color: Colors.primaryOrange}}>{truncate(exercisesString, truncateAmount)}</Text></ThemedText>
  )
}

export default WorkoutDescription

const styles = StyleSheet.create({})