const types = {
    strength: ['lbs', 'reps'],
    strengthPlus: ['+lbs', 'reps'],
    distance: ['mile'],
    repsOnly: ['reps'],

}

export const Exercises = [
    {
        name: "Bench Press",
        tracks: types.strength,
        description: "A compound exercise that targets the chest, shoulders, and triceps.",
        image: require("../assets/exercises/benchPress.png"),
        muscleGroups: ["chest", "shoulders", "triceps"],
        difficulty: "intermediate",
        id: "1",
    },
    {
        name: "Squats",
        tracks: types.strength,
        description: "A compound exercise that targets the quadriceps, hamstrings, and glutes.",
        // image: require("../assets/exercises/squats.png"),
        muscleGroups: ["legs", "glutes"],
        difficulty: "intermediate",
        id: "2",
    },
    {
        name: "Deadlifts",
        tracks: types.strength,
        description: "A compound exercise that targets the back, glutes, and hamstrings.",
        // image: require("../assets/exercises/deadlifts.png"),
        muscleGroups: ["back", "legs", "glutes"],
        difficulty: "advanced",
        id: "3",
    },
    {
        name: "Overhead Press",
        tracks: types.strength,
        description: "A compound movement targeting the shoulders and triceps.",
        // image: require("../assets/exercises/overhead-press.png"),
        muscleGroups: ["shoulders", "triceps"],
        difficulty: "intermediate",
        id: "4",
    },
];