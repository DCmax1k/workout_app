import { router } from "expo-router";
import { useUserStore } from "../stores/useUserStore";


const updateCreatedExercise = (exerciseId, newExercise) => {
    const created = user.createdExercises;
    const indexOfEx = created.findIndex(e => e.id === exerciseId);
    created[indexOfEx] = newExercise;
    updateUser({createdExercises: created});
}

export const saveWorkout = (w) => {
    const {user, updateUser} = useUserStore.getState();
    // Last minute changes to workout before save
    if (!w.name) w.name = "New workout";
    const newExercises = w.exercises.map(ex => {
      // Find any modified exercises, update their data in createdExercises. Create the exercise if modified id not found
      if (ex.modified) {
        const createdExerciseId = user.createdExercises.findIndex(e => e.id === ex.id);
        if (createdExerciseId < 0) {
          // Didnt find id, so make data, and change id of exercise in workout
          const modifiedExercise = {
              name: ex.name,
              group: ex.group,
              tracks: ex.tracks,
              description: ex.description,
              image: ex.image,
              muscleGroups: ex.muscleGroups,
              difficulty: ex.difficulty,
              previousId: ex.id,
              id: generateUniqueId(),
          };
          const newCreatedExercises = user.createdExercises;
          newCreatedExercises.unshift(modifiedExercise);
          updateUser({createdExercises: newCreatedExercises});

          
          const exerciseIndex = w.exercises.findIndex(of => of.id === ex.id);
          w.exercises[exerciseIndex].id = modifiedExercise.id;
        } else {
          // Finds id, so change data
          const {sets, note, ...rest} = ex;
          console.log(rest);
          updateCreatedExercise(ex.id, rest);
        }
      }
      // Set exercises back to simple data
      return {
        id: ex.id,
        sets: ex.sets,
        name: ex.name,
        note: ex.note,
      }
    });
    w.exercises = newExercises;
    // Find saved workout
    const savedWorkouts = user.savedWorkouts;
    const workoutIndex = savedWorkouts.findIndex(wk => wk.id === w.id);
    if (workoutIndex < 0) {
      // If not found, unshift workout
      savedWorkouts.unshift(w);
    } else {
      // If found, set saved workout
      savedWorkouts[workoutIndex] = w;
    }
    
    updateUser({savedWorkouts});
    router.back();
    // Contact db
  }