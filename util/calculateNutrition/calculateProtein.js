import getDateKey from "../getDateKey";

const calculateProtein = (user, days=0) => {
    const consumedMeals = user.consumedMeals;

    const daysAgo = new Date();
    const dayOffset = days;
    daysAgo.setDate(daysAgo.getDate() - dayOffset);
    daysAgo.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = [];
    const dates = [];

    for (let day = new Date(daysAgo); day.getTime() <= today.getTime(); day.setDate(day.getDate() + 1)) {
        const dateKey = getDateKey(day);
        let dayCalories = 0;
        // Loop through meals
        const dayMeals = consumedMeals[dateKey] || [];
        dayMeals.forEach(meal => {

            // Loop through nutrition keys, adding each to dayNutrition
            dayCalories += meal.totalNutrition["protein"];
        });

        data.push(dayCalories);
        dates.push(day.getTime());
        
    }

    return {data, dates};
}

export default calculateProtein;