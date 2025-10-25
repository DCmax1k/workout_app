import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '../../components/ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUserStore } from '../../stores/useUserStore'
import ConsumedMealCard from '../../components/nutrition/ConsumedMealCard'
import getDateKey from '../../util/getDateKey'
import TitleWithBack from '../../components/TitleWithBack'
import ActionMenu from '../../components/ActionMenu'
import plusIcon from '../../assets/icons/plus.png'
import checkIcon from '../../assets/icons/check.png'
import trashIcon from '../../assets/icons/trash.png'
import { Colors } from '../../constants/Colors'
import Search from '../../components/Search'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ConfirmMenu from '../../components/ConfirmMenu'
import { generateUniqueId } from '../../util/uniqueId'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import ImageContain from '../../components/ImageContain'

const searchMeals = (meals, searchValue) => {
    if (!searchValue) return meals;
    return meals.filter(meal => {
        const name = meal.name.toLowerCase() || '';
        let s = searchValue.toLowerCase().trim();
        return name.includes(s);
    });
}

const SavedMeals = () => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const savedMeals = user.savedMeals;

    const [searchValue, setSearchValue] = useState(null);
    const filteredMeals = searchMeals(savedMeals, searchValue);

    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState();

    const [mealPreview, setMealPreview] = useState(null); // {...food}
    const [mealPreviewOpen, setMealPreviewOpen] = useState(false);

    const [activeCardConfirmationMealId, setActiveCardConfirmationMealId] = useState(null);

    const removeMeal = (meal) => {
        const savedMeals = user.savedMeals;
        const newSavedMeals = savedMeals.filter(m => m.id !== meal.id);
        updateUser({savedMeals: newSavedMeals});
    }

    useEffect(() => {
        if (activeCardConfirmationMealId) {
            const hideAddMealConfirmation = setTimeout(() => {
                setActiveCardConfirmationMealId(null);
            }, 1000);

            return () => clearTimeout(hideAddMealConfirmation);
        }
    }, [activeCardConfirmationMealId])

    const requestRemoveMeal = (meal) => {
        setConfirmMenuData({
            title: "Delete Meal?",
            subTitle: "This meal will be no longer saved.",
            option1: "Delete Meal",
            option1color: Colors.protein,
            option2: "Go Back",
            confirm: () => removeMeal(meal),
        });
        setConfirmMenuActive(true);
    }
    const addMealToPlate = (meal) => {
        const foodsInMeal = meal.fullMeal.foods;
        const editActivePlate = user.editActivePlate;
        if (editActivePlate) {
            const filterFoods = foodsInMeal.filter(fim => !editActivePlate.foods.map(f => f.id).includes(fim.id));
            const newFoods = [...editActivePlate.foods, ...filterFoods];
            const newPlate = {...editActivePlate, foods: newFoods};
            updateUser({editActivePlate: newPlate});
        } else {
            const newPlateData = {name: meal.name, id: generateUniqueId(), foods: foodsInMeal };
            updateUser({editActivePlate: newPlateData});
        }
        setActiveCardConfirmationMealId(meal.id);
    }

  return (
    <ThemedView style={{flex: 1}}>
        {/* Food Preview */}
        {mealPreviewOpen && (
            <Portal >
                <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", width: screenWidth, height: screenHeight, zIndex: 2}} >

                    <Pressable onPress={() => setMealPreviewOpen(false)} style={{height: "100%", width: "100%", zIndex: 0}}></Pressable>

                    <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={{position: "absolute", width: screenWidth-20, top: 50, left: 10, zIndex: 2}}>
                        <MealPreview meal={mealPreview} setMealPreviewOpen={setMealPreviewOpen} />
                    </Animated.View>

                

                </Animated.View>    
            </Portal>
            
            )}

        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
        <SafeAreaView style={{flex: 1}}>


            <TitleWithBack title={"Saved Meals"}  />
            <Spacer height={20} />

            
            <Search value={searchValue} onChangeText={setSearchValue} style={{marginHorizontal: 20}} />

            <Spacer height={10} />

            <ScrollView style={{flex: 1, }} contentContainerStyle={{paddingBottom: 120, paddingTop: 20, paddingHorizontal: 20}}>
                {filteredMeals.length === 0 && (
                    <ThemedText style={{paddingHorizontal: 50, paddingVertical: 20, textAlign: "center"}}>Find meals you save here!</ThemedText>
                )}
                {filteredMeals.map(meal => {
                    return (
                        <ActionMenu key={meal.id} data={[
                            {title: "Add Foods to Plate", icon: plusIcon, onPress: () => addMealToPlate(meal),},
                            {title: "Delete Meal", icon: trashIcon, onPress: () => requestRemoveMeal(meal), color: Colors.redText },
                        ]} >
                            <View style={{marginBottom: 10}}>
                                <ConsumedMealCard meal={meal} key={meal.id} />
                                {/* Show added to plate confirmation */}
                                {activeCardConfirmationMealId === meal.id && (
                                    <Animated.View entering={FadeIn} exiting={FadeOut} style={[StyleSheet.absoluteFill, {backgroundColor: "#2A5230", zIndex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius: 10, padding: 20, paddingLeft: 10 }]}>
                                        <Text style={{color: "white", fontWeight: "600", }}>Successfully added meal to plate</Text>
                                        <ImageContain source={checkIcon} style={{marginTop: -5, marginLeft: 10}} />
                                    </Animated.View>
                                )}
                            </View>
                            

                        </ActionMenu>
                    )
                })}
            </ScrollView>
        </SafeAreaView>
    </ThemedView>
  )
}

export default SavedMeals

const styles = StyleSheet.create({})