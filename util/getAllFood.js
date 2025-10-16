import { foods } from "../constants/Foods";

function getAllFood(user) {
    const userCreatedFood = user.customFoods ?? {};
    const userCreatedFoodArray = Object.values(userCreatedFood).sort((a, b) => (a?.timeCreated ?? 0) - (b?.timeCreated ?? 0));
    const foodsMinusCustom = foods.filter(f => !(f.id in userCreatedFood));
    const allFoods = [...userCreatedFoodArray, ...foodsMinusCustom ];

    const filteredFood = allFoods.filter(ex => !user.archivedFoods?.[ex.id]).sort((a, b) => a.name.localeCompare(b.name));

    return filteredFood;
}

export default getAllFood;