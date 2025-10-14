import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ActionMenu from '../ActionMenu'
import trashIcon from '../../assets/icons/trash.png'
import { truncate } from '../../util/truncate'
import MacrosRow from './MacrosRow'
import ThemedText from '../ThemedText'
import formatDate from '../../util/formatDate'
import { useUserStore } from '../../stores/useUserStore'
import getDateKey from '../../util/getDateKey'
import { Colors } from '../../constants/Colors'

const ConsumedMealCard = ({style, meal, setConfirmMenuData, setConfirmMenuActive, ...props}) => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const getFoodsDescription = () => {
        const foods = meal.fullMeal.foods;
        let desc = " - ";
        if (foods.length === 1) return desc+foods[0].name;
        foods.forEach((food, i) => {
            const lastItem = i===foods.length-1;
            let str = food.name;
            if (!lastItem) str+=", ";
            desc+=str;
        });
        return desc;
    }

    const requestRemoveMeal = () => {
        setConfirmMenuData({
            title: "Delete Consumed Meal?",
            subTitle: "All nutritional data from this meal will be deleted.",
            option1: "Delete Meal",
            option1color: Colors.protein,
            option2: "Go Back",
            confirm: removeMeal,
        });
        setConfirmMenuActive(true);
    }
    const removeMeal = () => {
        const dateKey = getDateKey();
        const consumedMeals = user.consumedMeals;
        const todaysMeals = consumedMeals[dateKey] ?? [];
        const newMeals = todaysMeals.filter(m => m.id !== meal.id);
        const newConsumedMeals = {...consumedMeals, [dateKey]: newMeals};
        updateUser({consumedMeals: newConsumedMeals});
    }

    const mealNutrition = meal.totalNutrition;

  return (
    <View {...props} style={[{width: "100%", backgroundColor: "#202020", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10, justifyContent: "center", alignItems: "center", marginTop: 10}, style]}>
        <View style={{width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start"}}>
            <View style={{flexDirection: "row"}}>
                <Text style={{color: "white", fontSize: 14, fontWeight: "600"}}>{meal.name}</Text>
                <Text  style={{color: "#BCBCBC", fontSize: 14, fontWeight: "300"}}>{truncate(getFoodsDescription(), 20)}</Text>
            </View>
            <ActionMenu data={[
                            {title: "Delete Meal", icon: trashIcon, onPress: requestRemoveMeal, color: Colors.redText },
            ]} />
        </View>
        <View style={{width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <ThemedText style={{fontSize: 13}}>{formatDate(Date.now())}</ThemedText>
            <MacrosRow nutrition={mealNutrition} />
        </View>
    </View>
  )
}

export default ConsumedMealCard

const styles = StyleSheet.create({})