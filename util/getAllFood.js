import { foods } from "../constants/Foods";

function getAllFood(user) { // category, name
    const userCreatedFood = user.createdFoods;
    const allFoods = [...userCreatedFood, ...foods ];

    const filteredFood = allFoods.filter(ex => !user.archivedFoods?.[ex.id]);
    return filteredFood;//.sort((a, b) => a.group.localeCompare(b.group));
}

export default getAllFood;