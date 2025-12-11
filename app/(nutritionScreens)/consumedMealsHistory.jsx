import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '../../components/ThemedView'
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import TitleWithBack from '../../components/TitleWithBack';
import Calender from '../../components/Calender';
import Spacer from '../../components/Spacer';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut, FadeOutDown, LinearTransition, SlideOutDown } from 'react-native-reanimated';
import ConfirmMenu from '../../components/ConfirmMenu';
import rotate from '../../assets/icons/rotate.png'
import trashIcon from '../../assets/icons/trash.png'
import eyeIcon from '../../assets/icons/eye.png'
import plusIcon from '../../assets/icons/plus.png'
import { useUserStore } from '../../stores/useUserStore';
import formatTime from '../../util/formatTime';
import ActionMenu from '../../components/ActionMenu';
import SwipeToDelete from '../../components/SwipeToDelete';
import { Colors } from '../../constants/Colors';
import BlueButton from '../../components/BlueButton';
import emitter from '../../util/eventBus';
import findInsertIndex from '../../util/findInsertIndex';
import getDateKey from '../../util/getDateKey';
import ConsumedMealCard from '../../components/nutrition/ConsumedMealCard';
import { Portal } from 'react-native-paper';
import MealPreview from '../../components/nutrition/MealPreview';
import parseDateKey from '../../util/parseDateKey';
import PopupSheet from '../../components/PopupSheet';
import { generateUniqueId } from '../../util/uniqueId'
import sendData from '../../util/server/sendData';
import { useBottomSheet } from '../../context/BottomSheetContext';

const firstCapital = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;
const SCREEN_WIDTH = screenWidth;

const ConsumedMealHistory = () => {
    const {showAlert} = useBottomSheet();
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const [popupMenuActive, setPopupMenuActive] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState();

    const [mealPreview, setMealPreview] = useState(null); // {...food}
    const [mealPreviewOpen, setMealPreviewOpen] = useState(false);

    
    const restData = () => {
        updateUser({consumedMeals: {}});
    }

    const requestResetData = () => {
        setConfirmMenuData({
            title: "Reset data?",
            subTitle: "All consumed meals in your history will be erased!",
            subTitle2: "This action cannot be undone.",
            option1: "Confirm reset",
            option1color: "#DB5454",
            option2: "Go back",
            confirm: () => restData(),
        });
        setConfirmMenuActive(true);
    }

    const addDataPoint = () => {
        setPopupMenuActive(true);
        
    }
    const addMealToServer = async (meal, date, id) => {
        const response = await sendData("/dashboard/addmealtoconsumptionday", {meal, date, id, jsonWebToken: user.jsonWebToken});
        if (response.status !== "success") {
            console.log("error");
            return showAlert(response.message, false);
        }
    }
    const addMealToDay = (meal) => {
        const date = new Date(selectedDate);
        const dateKey = getDateKey(date);
        const consumedMeals = user.consumedMeals;
        const daysMeals = consumedMeals[dateKey] ?? [];
        const id = generateUniqueId()
        const newDaysMeals = [{...meal, id, date: date}, ...daysMeals];
        const newConsumedMeals = {...consumedMeals, [dateKey]: newDaysMeals};
        updateUser({consumedMeals: newConsumedMeals});
        // Server request
        addMealToServer(meal, date, id);
    }

    const openMeal = (meal) => {
        setMealPreview(meal);
        setMealPreviewOpen(true);
    }

    const removeLogConsumptionServer = async (meal) => {
        const response = await sendData("/dashboard/removeconsumption", {meal, jsonWebToken: user.jsonWebToken});
        if (response.status !== "success") {
            showAlert(response.message, false);
            return;
        }
    }
    const removeMeal = (meal) => {
        removeLogConsumptionServer(meal);
        const dateKey = getDateKey(selectedDate);
        const consumedMeals = user.consumedMeals;
        const todaysMeals = consumedMeals[dateKey] ?? [];
        const newMeals = todaysMeals.filter(m => m.id !== meal.id);
        const newConsumedMeals = {...consumedMeals, [dateKey]: newMeals};
        updateUser({consumedMeals: newConsumedMeals});
    }

    const requestRemoveMeal = (meal) => {
        setConfirmMenuData({
            title: "Delete Consumed Meal?",
            subTitle: "All nutritional data from this meal will be deleted.",
            option1: "Delete Meal",
            option1color: Colors.protein,
            option2: "Go Back",
            confirm: () => removeMeal(meal),
        });
        setConfirmMenuActive(true);
    }

    const editMeal = (meal, newMeal = false) => {
          if (mealPreviewOpen) setMealPreviewOpen(false);
          router.push({
              pathname: '/editMeal',
              params: {
                  meal: JSON.stringify(meal),
                  openedFrom: "consumption",
              }
          })
      }

    const dataEntriesOnDate = user.consumedMeals[getDateKey(selectedDate)] ?? [];
    const datesWithData = Object.keys(user.consumedMeals).filter(d => user.consumedMeals[d].length > 0).map(d => parseDateKey(d));

    const savedMeals = user.savedMeals;
    const filteredMeals = savedMeals

  return (
    <ThemedView style={[styles.container, ]}>
        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
        {/* Meal Preview */}
        {mealPreviewOpen && (
        <Portal >
            <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", width: screenWidth, height: screenHeight, zIndex: 2}} >

                <Pressable onPress={() => setMealPreviewOpen(false)} style={{height: "100%", width: "100%", zIndex: 0}}></Pressable>

                <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={{position: "absolute", width: screenWidth-20, top: 50, left: 10, zIndex: 2}}>
                    <MealPreview meal={mealPreview} addMealToPlate={null} setMealPreviewOpen={setMealPreviewOpen} editMeal={editMeal} />
                </Animated.View>

            

            </Animated.View>    
        </Portal>
        
        )}
        <PopupSheet active={popupMenuActive} setActive={setPopupMenuActive}>
            <ScrollView style={{flex: 1, maxHeight: 500 }} contentContainerStyle={{paddingBottom: 20, paddingTop: 20,}}>
                {filteredMeals.length === 0 && (
                    <ThemedText style={{paddingHorizontal: 50, paddingVertical: 20, textAlign: "center"}}>Find meals you save here!</ThemedText>
                )}
                {filteredMeals.map(meal => {
                    return (
                        <Animated.View layout={LinearTransition.springify().damping(90) } entering={FadeInUp} exiting={SlideOutDown} key={meal.id}>
                            
                                <Pressable onPress={() => addMealToDay(meal)} style={{marginBottom: 10, marginHorizontal: 20}}>
                                       
                                    <ConsumedMealCard meal={meal} key={meal.id} style={{backgroundColor: "#464646ff"}} actionMenuData={null} />
                                </Pressable>
                        </Animated.View>
                            
                    )
                })}




            </ScrollView>
        </PopupSheet>
        <SafeAreaView style={{flex: 1, marginBottom: -50}}>
            <TitleWithBack title={"Consumed Meals History"} style={{marginHorizontal: -20}} actionBtn={{actionMenu: true, image: require("../../assets/icons/threeEllipses.png"), options: [ {title: "Reset data", icon: rotate, onPress: () => requestResetData(), color: Colors.redText}]}} />

            <Spacer height={20} />

            
            <Calender datesWithData={datesWithData} set={setSelectedDate} />

            <Spacer height={10} />
            <View style={{width: "50%", height: 2, borderRadius: 999, backgroundColor: "#AAAAAA", marginHorizontal: "auto"}}></View>
            <Spacer height={10} />

            {/* Fill Daily Data fixed this problem */}
            {/* Only show if the selectedDate is today or earlier */}
            {/* {(selectedDate.getTime() < new Date().getTime() || selectedDate.toLocaleDateString() === new Date().toLocaleDateString()) && ( */}
                <BlueButton title={"Add meal"} icon={plusIcon} onPress={addDataPoint} />
            {/* )} */}
           

            <Spacer height={10} />
            <ScrollView layout={LinearTransition.springify().damping(90)} style={{width: SCREEN_WIDTH, marginHorizontal: -20}} contentContainerStyle={{paddingBottom: 120, paddingTop: 10, alignItems: "center"}} showsVerticalScrollIndicator={false}>
                <Spacer height={10} />
                
                
                {dataEntriesOnDate.map((meal, i) => {

                  const actionMenuData = [
                    //   {title: "Add Foods to Plate", icon: plusIcon, onPress: () => addMealToPlate(meal), },
                      {title: "Open Meal", icon: eyeIcon, onPress: () => openMeal(meal), },
                      {title: "Remove Meal from Consumed", icon: trashIcon, onPress: () => requestRemoveMeal(meal), color: Colors.redText },
                  ];

                    return (
                        <Animated.View style={{width: SCREEN_WIDTH}} key={meal.date + "" + meal.id} layout={LinearTransition.springify().damping(90)} entering={FadeIn} exiting={FadeOut} >
                            <SwipeToDelete style={{width: "100%"}} showConfirmation={true} confirmationData={{
                                title: "Delete Consumed Meal?",
                                subTitle: "All nutritional data from this meal will be deleted.",
                                option1: "Delete Meal",
                                option1color: Colors.protein,
                                option2: "Go Back",
                                confirm: () => removeMeal(meal),
                            }}>
                                <Pressable onPress={() => openMeal(meal)} key={meal.date + "" + meal.id} style={{marginTop: 10, width: screenWidth, alignItems: "center"}} >
                                  <ConsumedMealCard style={{width: screenWidth-40}} actionMenuData={actionMenuData} meal={meal} />
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

export default ConsumedMealHistory

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
})