import getDateKey from "../getDateKey";

const calculateCalories = (user, days=0) => {
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
            // meal.fullMeal.foods.forEach(f => {
            //     new Array(4).fill(null).map((_, i) => {
            //         const nutritionKey = ["calories", "protein", "carbs", "fat"][i];
            //         dayNutrition[nutritionKey] += f.nutrition[nutritionKey]*f.quantity;
            //     });
            // });

            // Loop through nutrition keys, adding each to dayNutrition
            dayCalories += meal.totalNutrition["calories"];
        });

        data.push(dayCalories);
        dates.push(day.getTime());
        
    }

    return {data, dates};
}

export default calculateCalories;