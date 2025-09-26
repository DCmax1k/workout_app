const getSetValueBefore = (exercise, setIndex, track) => {
  for (let i = setIndex; i >= 0; i--) {
      const value = exercise.sets[i][track];
      if (value) return value;
      if (i===0) return "0";
  }
}

export const workoutToSimple = (w) => {
    // Last minute changes to workout before save
    if (!w.name) w.name = "New workout";
    const newExercises = w.exercises.map(ex => {
      const sets = ex.sets.map((s, setIndex) => {
        const {complete, ...rest} = s;
        const tracks = ex.tracks;
        tracks.forEach(track => {
          const value = ex.sets[setIndex][track];
          if (!value) rest[track] = getSetValueBefore(ex, setIndex, track);
        });
        return rest;
      });
      // Set exercises back to simple data
      const exData = {
        id: ex.id,
        sets,
        name: ex.name,
      }
      ex.note ? exData.note = ex.note : null;
      ex.unit ? exData.unit = ex.unit : null;
      ex.tracks ? exData.tracks = ex.tracks : null;
      ex.group ? exData.group = ex.group : null;
      ex.uniqueId ? exData.uniqueId = ex.uniqueId : null;
      return exData;
    });
    w.exercises = newExercises;
    return {
      exercises: w.exercises,
      id: w.id,
      name: w.name,
    };
  }