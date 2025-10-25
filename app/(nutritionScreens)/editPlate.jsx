import { Image, Pressable, StyleSheet, Text, View, TextInput, Dimensions } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import ThemedView from '../../components/ThemedView'
import ConfirmMenu from '../../components/ConfirmMenu'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import { useUserStore } from '../../stores/useUserStore'
import { BottomSheetHandle, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut, FadeOutDown, LinearTransition, SlideInDown, SlideOutDown } from 'react-native-reanimated'
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
import emitter from '../../util/eventBus'
import TouchableScale from '../../components/TouchableScale'
import FoodPreview from '../../components/nutrition/FoodPreview'

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

const EditPlate = forwardRef(({closeSheet, closeKeyboardIfOpen, animatedHeaderOpacity, animatedButtonsOpacity, animatedLeftButtonTransform, animatedRightButtonTransform, handleSnapPress, bottomSheetPosition}, ref) => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const plate = user.editActivePlate ?? {name: "New Plate", id: 0, foods: [] };

    const [foodPreview, setFoodPreview] = useState(null); // {...food}
    const [foodPreviewOpen, setFoodPreviewOpen] = useState(false);

    const openEditFood = (food) => {
        if (foodPreviewOpen) setFoodPreviewOpen(false);
        router.push({
            pathname: '/editFood',
            params: {
                food: JSON.stringify(food),
                openedFromPlate: true,
            }
        })
            
    }

    //const [foodModal, setFoodModal] = useState(false);
    useEffect(() => {
        const sub = emitter.addListener("addFood", ({foodToAdd}) => {
            //console.log("Got data back:", foodToAdd);
            addFood(foodToAdd);
            
        });
        const sub2 = emitter.addListener("done", (data) => {
            if (data?.target === "changeFoodQuantity") {
                const quantity = data.value;
                const foods = JSON.parse(JSON.stringify(plate.foods));
                const foodIdx = foods.findIndex(f => f.id === data.food.id);
                foods[foodIdx] = {...data.food, quantity};
                updatePlate({foods});
            }
        })
        return () => {
            sub.remove();
            sub2.remove();
        }
    }, [emitter, plate]);

    const plateNameInputRef = useRef(null);

    const selectPlateName = () => {
        plateNameInputRef.current?.focus();
    }
    useImperativeHandle(ref, () => ({
        selectPlateName
    }))

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
            closeKeyboardIfOpen();
            closeSheet();
            setTimeout(() => {
                updateUser({editActivePlate: null})
            }, 100)
            
        }

        const addFood = (foods) => {
            if (!foods || foods.length < 1) return; 
            const foodsWithQuantity = foods.map(f => ({...f, quantity: 1}));

            const plateFoodIds = plate.foods.map(f=>f.id);
            const filterFoods = foodsWithQuantity.map(f => plateFoodIds.includes(f.id) ? null : f).filter(e => e !== null);

            const foodsToAdd = [...plate.foods, ...filterFoods];
            
            updatePlate({foods: foodsToAdd});
        }

        

        const getTotalNutrition = (meal) => {
            const mealNutrition = {
                "calories": 0,
                "protein": 0,
                "carbs": 0,
                "fat": 0
            };
            meal.foods.forEach(f => {
                new Array(4).fill(null).map((_, i) => {
                    const nutritionKey = ["calories", "protein", "carbs", "fat"][i];
                    mealNutrition[nutritionKey] += f.nutrition[nutritionKey]*f.quantity;
                });
            });
            return mealNutrition;
        }

        const formatCompletedMeal = () => {
            const dateToday = new Date();
            const totalNutrition =  getTotalNutrition(plate);
            const meal = {
                name: plate.name,
                id: generateUniqueId(),
                totalNutrition,
                date: dateToday,
                fullMeal: plate,
            };
            return meal;
        }

        const logFoods = () => {
            const meal = formatCompletedMeal();
            const dateKey = getDateKey(meal.date);
            const consumedMeals = user.consumedMeals;
            const todaysMeals = consumedMeals[dateKey] ?? [];
            const newMeals = [meal, ...todaysMeals];
            const newConsumedMeals = {...consumedMeals, [dateKey]: newMeals};
            closeKeyboardIfOpen();
            updateUser({consumedMeals: newConsumedMeals});
            closeSheet();
            setTimeout(() => {
                updateUser({editActivePlate: null});
            }, 100)
        }

        const saveAsMeal = () => {
            const meal = formatCompletedMeal();
            const savedMeals = user.savedMeals;
            const newSavedMeals = [meal, ...savedMeals];
            updateUser({savedMeals: newSavedMeals});
        }

        const logAndSaveMeal = () => {
            saveAsMeal();
            setTimeout(() => {
                logFoods();
            }, 500);
            
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
            // setConfirmMenuData({
            //     title: "Log Foods?",
            //     subTitle: "You are about to log the foods in this plate.",
            //     subTitle2: "Would you like to proceed?",
            //     option1: "Log Foods",
            //     option1color: Colors.protein,
            //     option2: "Go back",
            //     confirm: logFoods,
            // });
            setConfirmMenuData({
                title: "Log Foods and Save as Meal?",
                subTitle: "You are about to log the foods in this plate.",
                subTitle2: "Would you also like to save this meal for future use?",
                option1: "Log Foods",
                option1color: Colors.protein,
                option3: "Log and Save Meal",
                option3onPress: logAndSaveMeal,
                option2: "Go back",
                confirm: logFoods,
            });
            setConfirmMenuActive(true);
        }

        const removeFoodItem = (food) => {
            const newFoods = plate.foods.filter(f => f.id !== food.id);
            updatePlate({foods: newFoods});
        }

        const openAddFood = () => {
            //setFoodModal(true);

            router.push({
                        pathname: "/addFood",
                    });
        }

        const clickChangeQuantity = (food) => {
            const info = {
                title: food.name + " Quantity",
                target: 'changeFoodQuantity',
                value: food.quantity,
                unit: food.unit,
                increment: 0.1,
                range: [0, 100],
                scrollItemWidth: 10,
                defaultValue: 1,

                food,
            }
            router.push({
                pathname: "/inputValueScreen",
                params: {
                    data: JSON.stringify(info),
                },
            });
        }

    const openFoodPreview = (f) => {
        setFoodPreview(f);
        setFoodPreviewOpen(true);
    }

    return (
        <ThemedView style={{flex: 1, backgroundColor: "#313131"}}>
            <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />

            {/* Food Preview */}
            {foodPreviewOpen && (
                <Portal >
                    <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", width: screenWidth, height: screenHeight, zIndex: 2}} >

                        <Pressable onPress={() => setFoodPreviewOpen(false)} style={{height: "100%", width: "100%", zIndex: 0}}></Pressable>

                        <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={{position: "absolute", width: screenWidth-20, top: 50, left: 10, zIndex: 2}}>
                            <FoodPreview food={foodPreview} setFoodPreviewOpen={setFoodPreviewOpen} editFood={openEditFood} />
                        </Animated.View>

                    

                    </Animated.View>    
                </Portal>
                
                )}
            
            <BottomSheetHandle indicatorStyle={{backgroundColor: "transparent"}} style={{height: 120,}}>
                {/* Buttons if sheet is open */}
                <Animated.View style={[{flexDirection: "row", justifyContent: "space-between", position: "absolute", left: 0, top: 0, right: 0, paddingHorizontal: 10, zIndex: 1, elevation: 1, pointerEvents: bottomSheetPosition===1?"auto":"none"}, animatedButtonsOpacity ]}>
                    <Animated.View style={animatedLeftButtonTransform}>
                        <Pressable onPress={requestDiscardPlate} style={{backgroundColor: "#5A5A5A", paddingVertical: 15, paddingHorizontal: 20, borderRadius: 10}}>
                            <Text style={styles.text}>Discard Plate</Text>
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
                        <ActionMenu data={[{title: "Discard Plate", icon: trashIcon, onPress: requestDiscardPlate, color: Colors.redText}]} />
                    </View>

                    <Spacer height={10} />
                    <BlueButton title={"Add Food"} onPress={openAddFood} style={{marginHorizontal: 20}} />
                    <Spacer height={20} />

                    <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10, marginLeft: 20}}>Plate Items</ThemedText>

                    <Animated.View layout={LinearTransition}>
                        {plate.foods.map((food, i) => {
                            return (
                                <Animated.View key={food.id} style={{width: screenWidth}} entering={FadeInUp} exiting={SlideOutDown} layout={LinearTransition}>

                                    <SwipeToDelete style={{width: screenWidth}} openedRight={() => removeFoodItem(food)} >
                                        <TouchableScale onPress={() => openFoodPreview(food)} style={{marginBottom: 5, paddingHorizontal: 10}} >
                                            <PlateItem food={food} clickChangeQuantity={clickChangeQuantity} />
                                        </TouchableScale>
                                    </SwipeToDelete>

                                </Animated.View>
                                
                            )
                        })}

                    </Animated.View>
                    

                </BottomSheetScrollView>
            </Animated.View>
            
            {/* <Portal>
                {(foodModal === true ? (
                    <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={{position: "absolute", top: 0, left: 0, height: screenHeight, width: screenWidth, zIndex: 5, elevation: 5}}>
                        <AddFood setFoodModal={setFoodModal} addFood={addFood} />
                    </Animated.View>
                ) : null)}
            </Portal> */}
            

        </ThemedView>
    )
});

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