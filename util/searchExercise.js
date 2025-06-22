export default function searchExerciseFilter(exercises, searchValue) {
    if (!searchValue) return exercises;
    return exercises.filter(exercise => {
        const name = exercise.name.toLowerCase() || '';
        const muscles = exercise.muscleGroups.join(" ") || '';
        const group = exercise.group || '';
        let s = searchValue.toLowerCase().trim();
        if (s.length>1 && s[s.length-1]==="s") s = s.split('').splice(0, s.length-1).join('');
        return name.includes(s) || muscles.includes(s) || group.includes(s);
    });
}