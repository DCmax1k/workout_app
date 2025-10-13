import { Image, Pressable, StyleSheet, Text, View, TextInput, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import ThemedView from '../../components/ThemedView'
import ConfirmMenu from '../../components/ConfirmMenu'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import { useUserStore } from '../../stores/useUserStore'
import { BottomSheetHandle, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import Animated, { FadeInUp, LinearTransition, SlideInDown, SlideOutDown } from 'react-native-reanimated'
import { truncate } from '../../util/truncate'
import doubleCarrot from '../../assets/icons/doubleCarrot.png'
import pencil from '../../assets/icons/pencil.png'
import trashIcon from '../../assets/icons/trash.png'
import { Colors } from '../../constants/Colors'
import ActionMenu from '../../components/ActionMenu'
import BlueButton from '../../components/BlueButton'
import AddFood from '../../components/nutrition/AddFood'
import { Portal } from 'react-native-paper'
import getAllFood from '../../util/getAllFood'
import getDateKey from '../../util/getDateKey'
import { generateUniqueId } from '../../util/uniqueId'
import PlateItem from '../../components/nutrition/PlateItem'
import SwipeToDelete from '../../components/SwipeToDelete'

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

const EditPlate = ({closeSheet, animatedHeaderOpacity, animatedButtonsOpacity, animatedLeftButtonTransform, animatedRightButtonTransform, handleSnapPress, bottomSheetPosition}) => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);
    const allFoods = getAllFood(user);

    const plate = user.editActivePlate ?? {name: "New Plate", id: 0, foods: [] };

    const [foodModal, setFoodModal] = useState(false);

    const plateNameInputRef = useRef(null);

    const updatePlate = (updates) => {
        updateUser({editActivePlate: {...plate, ...updates}});
    }

    const updatePlateName = (value) => {
        updatePlate({name: value});
    }
    const handleEndEditting = () => {
        if (!plate.name) updatePlateName("New Plate");
    }

    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState({
            title: "The title",
            subTitle: "The description for the confirmation",
            subTitle2: "Another one here",
            option1: "Update",
            
            option2: "Cancel",
            confirm: () => {},
        });

        const requestDiscardPlate = () => {
            setConfirmMenuData({
                title: "Discard Plate?",
                subTitle: "Any items added to your plate",
                subTitle2: "will not be saved.",
                option1: "Confirm Discard",
                option1color: "#DB5454",
                option2: "Go back",
                confirm: discardPlate,
            });
            setConfirmMenuActive(true);
        }
        const discardPlate = () => {
            closeSheet();
            setTimeout(() => {
                updateUser({editActivePlate: null})
            }, 100)
            
        }

        const addFood = (foodIds) => {
            if (!foodIds || foodIds.length < 1) return;
            const newFoodIds = [...new Set([...plate.foods.map(f => f.id), ...foodIds])];
            // Get food objects and add the quantity key
            const foodsToAdd = newFoodIds.map(id => allFoods.find(f => f.id === id)).filter(e => e !== undefined);
            const nextFoodsToAdd = foodsToAdd.map(f => ({...f, quantity: 1}));
            updatePlate({foods: nextFoodsToAdd});
        }

        const saveAsMeal = () => {
            setConfirmMenuData({
                title: "Coming soon!",
                subTitle: "",

                option1: "Okay",
                option1color: Colors.primaryBlue,
                confirm: () => {},
            });
            setConfirmMenuActive(true);
        }

        // CURRENTLY TESTING
        const logFoods = () => {
            
            const dateKey = getDateKey(new Date());
            const meal = {
                name: plate.name,
                id: generateUniqueId(),
                fullMeal: plate,
            };
            const consumedMeals = user.consumedMeals;
            const todaysMeals = consumedMeals[dateKey] ?? [];
            const newMeals = [meal, ...todaysMeals];
            const newConsumedMeals = {...consumedMeals, [dateKey]: newMeals};
            updateUser({consumedMeals: newConsumedMeals});
            closeSheet();
            setTimeout(() => {
                updateUser({editActivePlate: null});

                console.log(user.consumedMeals)
            }, 100)
        }

        const requestLogFoods = () => {
            if (!plate.foods || plate.foods.length < 1) {
                setConfirmMenuData({
                    title: "No plate items",
                    subTitle: "Please add at least one food item",
                    subTitle2: "to your plate before logging.",
                    option1: "Okay",
                    option1color: Colors.primaryBlue,
                    confirm: () => {},
                });
                setConfirmMenuActive(true);
                return;
            }
            setConfirmMenuData({
                title: "Log Foods?",
                subTitle: "You are about to log the foods in this plate.",
                subTitle2: "Would you like to proceed?",
                option1: "Log Foods",
                option1color: Colors.protein,
                option2: "Go back",
                confirm: logFoods,
            });
            setConfirmMenuActive(true);
        }

        const removeFoodItem = (food) => {
            const newFoods = plate.foods.filter(f => f.id !== food.id);
            updatePlate({foods: newFoods});
        }

    return (
        <ThemedView style={{flex: 1, backgroundColor: "#313131"}}>
            <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
            
            <BottomSheetHandle indicatorStyle={{backgroundColor: "transparent"}} style={{height: 120,}}>
                {/* Buttons if sheet is open */}
                <Animated.View style={[{flexDirection: "row", justifyContent: "space-between", position: "absolute", left: 0, top: 0, right: 0, paddingHorizontal: 10, zIndex: 1, elevation: 1, pointerEvents: bottomSheetPosition===1?"auto":"none"}, animatedButtonsOpacity ]}>
                    <Animated.View style={animatedLeftButtonTransform}>
                        <Pressable onPress={saveAsMeal} style={{backgroundColor: "#5A5A5A", paddingVertical: 15, paddingHorizontal: 20, borderRadius: 10}}>
                            <Text style={styles.text}>Save as meal</Text>
                        </Pressable>
                    </Animated.View>
                    
                    <Animated.View style={animatedRightButtonTransform}>
                        <Pressable onPress={requestLogFoods} style={{backgroundColor: "#DB5456", paddingVertical: 15, paddingHorizontal: 20, borderRadius: 10}}>
                            <Text style={styles.text}>Log Foods</Text>
                        </Pressable>
                    </Animated.View>
                    
                </Animated.View>
                {/* Header if sheet lowered */}
                <Animated.View style={[{position: "absolute", left: 0, top: 0, right: 0, paddingHorizontal: 20, marginTop: 10, flexDirection: "row", justifyContent: "space-between",  }, animatedHeaderOpacity]}>
                    <View style={{height: "100%", justifyContent: "center"}}>
                        <Text style={[styles.text, {color: "#FF7072"}]}>{truncate(plate.name, 30)}</Text>
                        <Text style={{fontSize: 14, color: "#939393"}}>{plate.foods.length} item{plate.foods.length === 1 ? "":"s"} added</Text>
                    </View>
                    <View style={{height: "100%", justifyContent: "center"}}>
                        <Pressable onPress={() => handleSnapPress(1)} style={{flexDirection: "row", paddingVertical: 10,}}>
                            <Image source={doubleCarrot} style={{height: 20, width: 20, objectFit: "contain", marginRight: 10, marginBottom: -3}} />
                            <Text style={[styles.text, {fontWeight: "300"}]}>Add more</Text>
                        </Pressable>
                        
                    </View>

                </Animated.View>
            </BottomSheetHandle>

            {/* This makes everything fade in */}
            <Animated.View style={[{flex: 1}, animatedButtonsOpacity]}>
                <BottomSheetScrollView style={{flex: 1}} contentContainerStyle={{ paddingBottom: 50}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20}}>
                        <Pressable style={{ height: 40, width: 40, justifyContent: "center", alignItems: "center"}} onPress={() => {if (plateNameInputRef.current) {plateNameInputRef.current.focus()}}}>
                            <Image style={{height: 15, width: 15, marginRight: 10}} source={pencil} />
                        </Pressable>
                        
                        <TextInput selectTextOnFocus ref={plateNameInputRef} onChangeText={updatePlateName} onEndEditing={handleEndEditting} value={plate.name} style={styles.plateNameInput} />
                        <ActionMenu data={[{title: "Discard Plate", icon: trashIcon, onPress: requestDiscardPlate, color: "#FF6C6C"}]} />
                    </View>

                    <Spacer height={10} />
                    <BlueButton title={"Add Food"} onPress={() => setFoodModal(true)} style={{marginHorizontal: 20}} />
                    <Spacer height={20} />

                    <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10, marginLeft: 20}}>Plate Items</ThemedText>

                    <Animated.View layout={LinearTransition}>
                        {plate.foods.map((food, i) => {
                            return (
                                <Animated.View key={food.id} style={{width: screenWidth}} entering={FadeInUp} exiting={SlideOutDown} layout={LinearTransition}>

                                    <SwipeToDelete style={{width: screenWidth}} openedRight={() => removeFoodItem(food)} >
                                        <View style={{marginBottom: 5, paddingHorizontal: 10}} >
                                            <PlateItem food={food} />
                                        </View>
                                    </SwipeToDelete>

                                </Animated.View>
                                
                            )
                        })}

                    </Animated.View>
                    

                </BottomSheetScrollView>
            </Animated.View>
            
            <Portal>
                {(foodModal === true ? (
                    <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={{position: "absolute", top: 0, left: 0, height: screenHeight, width: screenWidth, zIndex: 5, elevation: 5}}>
                        <AddFood setFoodModal={setFoodModal} addFood={addFood} />
                    </Animated.View>
                ) : null)}
            </Portal>
            

        </ThemedView>
    )
}

export default EditPlate

const styles = StyleSheet.create({
    text: {
        color: "white",
        fontSize: 15,
        fontWeight: 600,
    },
    plateNameInput: {
        fontSize: 23,
        color: "white",
        flex: 1,
        fontWeight: 700
    }
})