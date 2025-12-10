import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '../../components/ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUserStore } from '../../stores/useUserStore'
import ConsumedMealCard from '../../components/nutrition/ConsumedMealCard'
import getDateKey from '../../util/getDateKey'
import TitleWithBack from '../../components/TitleWithBack'
import ActionMenu from '../../components/ActionMenu'
import plusIcon from '../../assets/icons/plus.png'
import eyeIcon from '../../assets/icons/eye.png'
import checkIcon from '../../assets/icons/check.png'
import trashIcon from '../../assets/icons/trash.png'
import { Colors } from '../../constants/Colors'
import Search from '../../components/Search'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ConfirmMenu from '../../components/ConfirmMenu'
import { generateUniqueId } from '../../util/uniqueId'
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut, FadeOutDown, LinearTransition, SlideOutDown } from 'react-native-reanimated'
import ImageContain from '../../components/ImageContain'
import MealPreview from '../../components/nutrition/MealPreview'
import { Portal } from 'react-native-paper'
import emitter from '../../util/eventBus'
import { router } from 'expo-router'
import { useBottomSheet } from '../../context/BottomSheetContext'
import sendData from '../../util/server/sendData'
import SwipeToDelete from '../../components/SwipeToDelete'

const searchMeals = (meals, searchValue) => {
    if (!searchValue) return meals;
    return meals.filter(meal => {
        const name = meal.name.toLowerCase() || '';
        let s = searchValue.toLowerCase().trim();
        return name.includes(s);
    });
}

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const SavedMeals = () => {
    const {showAlert} = useBottomSheet();
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

    const removeMealServer = async (meal) => {
        const response = await sendData("/dashboard/removemeal", {meal, jsonWebToken: user.jsonWebToken});
        if (response.status !== "success") {
            showAlert(response.message, false);
            return;
        }
    }
    const removeMeal = (meal) => {
        removeMealServer(meal);
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

    const addMealToPlate = (meal) => {
        if (mealPreviewOpen) setMealPreviewOpen(false);
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
        emitter.emit("addedToPlate", true); // Opens plate from 
        setActiveCardConfirmationMealId(meal.id);
    }

    const openMeal = (meal) => {
        setMealPreview(meal);
        setMealPreviewOpen(true);
    }

    const editMeal = (meal, newMeal = false) => {
        if (mealPreviewOpen) setMealPreviewOpen(false);
        router.push({
            pathname: '/editMeal',
            params: {
                meal: JSON.stringify(meal),
                openedFrom: "savedMeals" + (newMeal ? "New" : ""),
            }
        })
    }

    const formatNewMeal = () => {
        const plate = {name: "New Meal", id: generateUniqueId(), foods: [] };
        const dateToday = new Date();
        const totalNutrition =  {
            "calories": 0,
            "protein": 0,
            "carbs": 0,
            "fat": 0
        };
        const meal = {
            name: plate.name,
            id: plate.id,
            totalNutrition,
            date: dateToday,
            fullMeal: plate,
        };
        return meal;
    }

    const createNewMeal = () => {
        const newMeal = formatNewMeal();
        editMeal(newMeal, true);
    }

  return (
    <ThemedView style={{flex: 1}}>
        {/* Meal Preview */}
        {mealPreviewOpen && (
            <Portal >
                <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", width: screenWidth, height: screenHeight, zIndex: 2}} >

                    <Pressable onPress={() => setMealPreviewOpen(false)} style={{height: "100%", width: "100%", zIndex: 0}}></Pressable>

                    <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={{position: "absolute", width: screenWidth-20, top: 50, left: 10, zIndex: 2}}>
                        <MealPreview meal={mealPreview} addMealToPlate={addMealToPlate} setMealPreviewOpen={setMealPreviewOpen} editMeal={editMeal} />
                    </Animated.View>

                

                </Animated.View>    
            </Portal>
            
            )}

        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
        <SafeAreaView style={{flex: 1}}>


            <TitleWithBack title={"Saved Meals"} actionBtn={{active: true, image: plusIcon, action: createNewMeal}} />
            <Spacer height={20} />

            
            <Search value={searchValue} setValue={setSearchValue} onChangeText={setSearchValue} style={{marginHorizontal: 20}} />

            <Spacer height={10} />

            <ScrollView style={{flex: 1, }} contentContainerStyle={{paddingBottom: 120, paddingTop: 20,}}>
                {filteredMeals.length === 0 && (
                    <ThemedText style={{paddingHorizontal: 50, paddingVertical: 20, textAlign: "center"}}>Find meals you save here!</ThemedText>
                )}
                {filteredMeals.map(meal => {
                    return (
                        <Animated.View layout={LinearTransition.springify().damping(90) } entering={FadeInUp} exiting={SlideOutDown} key={meal.id}>
                            <SwipeToDelete style={{width: screenWidth}} showConfirmation={true} confirmationData={{
                                title: "Delete Meal?",
                                subTitle: "This meal will be no longer saved.",
                                option1: "Delete Meal",
                                option1color: Colors.protein,
                                option2: "Go Back",
                                confirm: () => removeMeal(meal),
                            }}>
                                <Pressable onPress={() => openMeal(meal)} style={{marginBottom: 10, marginHorizontal: 20}}>
                                       
                                    <ConsumedMealCard meal={meal} key={meal.id} actionMenuData={[
                                        {title: "Add Foods to Plate", icon: plusIcon, onPress: () => addMealToPlate(meal),},
                                        {title: "Open Meal", icon: eyeIcon, onPress: () => openMeal(meal),},
                                        {title: "Delete Meal", icon: trashIcon, onPress: () => requestRemoveMeal(meal), color: Colors.redText },
                                    ]} />
                                        
                                    {/* Show added to plate confirmation */}
                                    {activeCardConfirmationMealId === meal.id && (
                                        <Animated.View entering={FadeIn} exiting={FadeOut} style={[StyleSheet.absoluteFill, {backgroundColor: "#2A5230", zIndex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius: 10, padding: 20, paddingLeft: 10 }]}>
                                            <Text style={{color: "white", fontWeight: "600", }}>Successfully added meal to plate</Text>
                                            <ImageContain source={checkIcon} style={{marginTop: -5, marginLeft: 10}} />
                                        </Animated.View>
                                    )}
                                </Pressable>
                            </SwipeToDelete>
                        </Animated.View>
                            
                    )
                })}
            </ScrollView>
        </SafeAreaView>
    </ThemedView>
  )
}

export default SavedMeals

const styles = StyleSheet.create({})