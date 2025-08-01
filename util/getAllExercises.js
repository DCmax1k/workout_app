import { Exercises } from "../constants/Exercises";

export default function getAllExercises(user, sort = "group") { // group, name
    const userCreatedExercises = user.createdExercises.map(ex => {
        if (!ex.group) {
            ex.group = "created";
        }
        return ex;
    });
    const allExercises = [...userCreatedExercises, ...Exercises ];

    const filteredExercises = allExercises.filter(ex => !user.archivedExercises?.[ex.id]);

    if (sort === "name") {
        return filteredExercises.sort((a, b) => a.name.localeCompare(b.name));
    }
    return filteredExercises;//.sort((a, b) => a.group.localeCompare(b.group));
}