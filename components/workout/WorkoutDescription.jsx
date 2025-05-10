import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedText from '../ThemedText';
import { Exercises } from '../../constants/Exercises';
import { useUserStore } from '../../stores/useUserStore';

const WorkoutDescription = ({workout, style, ...props}) => {
    const user = useUserStore((state) => state.user);
    const allExercises = [...user.createdExercises, ...Exercises];

    const truncate = (text, maxLength) =>
        text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

    if (!workout) return (<ThemedText>None</ThemedText>)
    const length = workout.exercises.length;
    let exercisesString = "";
    workout.exercises.forEach((ex, i) => {
        const foundExercise = allExercises.find(e => e.id===ex.id);
        return exercisesString+=`${i!==0?", ":""}${ex.name || foundExercise.name}`
    });

  return length === 0 ? (
    <ThemedText style={style}>Add workouts!</ThemedText>
  ) : (
    <ThemedText style={style}>{length} exercise{length===1 ? '':'s'} - {truncate(exercisesString, 50)}</ThemedText>
  )
}

export default WorkoutDescription

const styles = StyleSheet.create({})