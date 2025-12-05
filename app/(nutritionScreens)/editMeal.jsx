import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import getDateKey from '../../util/getDateKey';
import deepEqual from '../../util/deepEqual';
import ThemedView from '../../components/ThemedView';
import ConfirmMenu from '../../components/ConfirmMenu';
import { Colors } from '../../constants/Colors';
import { useUserStore } from '../../stores/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut, FadeOutDown, LinearTransition, SlideOutDown } from 'react-native-reanimated';
import pencil from '../../assets/icons/pencil.png'
import trashIcon from '../../assets/icons/trash.png'
import ActionMenu from '../../components/ActionMenu';
import emitter from '../../util/eventBus';
import { Portal } from 'react-native-paper';
import FoodPreview from '../../components/nutrition/FoodPreview';
import Spacer from '../../components/Spacer';
import BlueButton from '../../components/BlueButton';
import SwipeToDelete from '../../components/SwipeToDelete';
import TouchableScale from '../../components/TouchableScale';
import PlateItem from '../../components/nutrition/PlateItem';
import ThemedText from '../../components/ThemedText';
import sendData from '../../util/server/sendData';
import { useBottomSheet } from '../../context/BottomSheetContext';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const EditMeal = () => {
    const {showAlert} = useBottomSheet();

    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState({
            title: "The title",
            subTitle: "The description for the confirmation",
            subTitle2: "Another one here",
            option1: "Update",
            
            option2: "Cancel",
            confirm: () => {},
        });

    const params = useLocalSearchParams();
    const m = JSON.parse(params.meal) ?? {};
    const mealId = m.id;
    const mealBeforEdits = m.fullMeal;

    const openedFrom = params.openedFrom ?? "savedMeals"; // savedMeals, consumption
    const autoSelectName = openedFrom === "savedMealsNew";

    // Prevent swipe out nav
    const navigation = useNavigation();
    const blockNav = useRef(false);
    useEffect(() => {
        blockNav.current = true;
    }, []);
    
    useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        if (!blockNav.current) return; // allow navigation if unblocked

        // Otherwise, block it
        e.preventDefault();
    });

    return unsubscribe;
    }, [navigation]);
    const handleGoBack = () => {
        blockNav.current = false;
        //navigation.goBack(); 
        router.back();
    };

    const [meal, setMeal] = useState(JSON.parse(JSON.stringify(mealBeforEdits)));

    const [foodPreview, setFoodPreview] = useState(null); // {...food}
    const [foodPreviewOpen, setFoodPreviewOpen] = useState(false);

    const mealNameInputRef = useRef(null);

    useEffect(() => {
        if (autoSelectName && mealNameInputRef) {
            const tm = setTimeout(() => {
                mealNameInputRef.current?.focus();
            }, 510)
            

            return () => {
                clearTimeout(tm);
            }
        }
    }, [autoSelectName])

    const updateMeal = (updates) => {
        const newMeal = {...meal, ...updates};
        setMeal(newMeal);
    }

    const cancelEdit = () => {
        // Check if edits were made
        if ( deepEqual(mealBeforEdits, meal) ) {
            //router.back()
            handleGoBack();
        } else {
            setConfirmMenuData({
                title: "Leave without saving?",
                subTitle: "Any changes will be discarded.",
                subTitle2: "This action cannot be undone.",
                option1: "Don't save and leave",
                option1color: "#DB5454",
                option2: "Stay",
                confirm: handleGoBack,
            });
            setConfirmMenuActive(true);
        }
    }

    const getTotalNutrition = (theMeal) => {
        const mealNutrition = {
            "calories": 0,
            "protein": 0,
            "carbs": 0,
            "fat": 0
        };
        theMeal.foods.forEach(f => {
            new Array(4).fill(null).map((_, i) => {
                const nutritionKey = ["calories", "protein", "carbs", "fat"][i];
                mealNutrition[nutritionKey] += f.nutrition[nutritionKey]*f.quantity;
            });
        });
        return mealNutrition;
    }

    const formatCompletedMeal = () => {
        const totalNutrition =  getTotalNutrition(meal);
        const newMeal = {
            name: meal.name,
            id: mealId,
            totalNutrition,
            date: meal.date,
            fullMeal: meal,
        };
        return newMeal;
    }

    const saveMealServer = async (meal) => {
        const response = await sendData("/dashboard/savemeal", {meal, jsonWebToken: user.jsonWebToken});
        if (response.status !== "success") {
            showAlert(response.message, false);
            return;
        }
    }

    const requestSaveMeal = () => {
        const mealToSave = formatCompletedMeal();
        if (openedFrom === "consumption") {
            const dateKey = getDateKey(mealToSave.date);
            const consumedMeals = user.consumedMeals;
            const daysMeals = consumedMeals[dateKey] ?? [];
            const idx = daysMeals.findIndex(m => m.id === mealToSave.id);
            if (idx < 0) return console.log("Meal not found");
            daysMeals[idx] = mealToSave;
            const newConsumedMeals = {...consumedMeals, [dateKey]: daysMeals};
            updateUser({consumedMeals: newConsumedMeals});
        } else {
            // Opened from saved meals
            saveMealServer(mealToSave);
            const savedMeals = user.savedMeals;
            if (openedFrom==="savedMealsNew") {
                const newSavedMeals = [mealToSave, ...savedMeals];
                updateUser({savedMeals: newSavedMeals});
            } else {
                const idx = savedMeals.findIndex(m => m.id === mealToSave.id);
                if (idx < 0) return console.log("Meal not found");
                savedMeals[idx] = mealToSave;
                updateUser({savedMeals});
            }
            
        }
        //router.back();
        handleGoBack();
    }

    const openAddFood = () => {
        router.push({
            pathname: "/addFood",
        });
    }
    const addFood = (foods) => {
        if (!foods || foods.length < 1) return; 
        const foodsWithQuantity = foods.map(f => ({...f, quantity: 1}));

        const plateFoodIds = meal.foods.map(f=>f.id);
        const filterFoods = foodsWithQuantity.map(f => plateFoodIds.includes(f.id) ? null : f).filter(e => e !== null);

        const foodsToAdd = [...meal.foods, ...filterFoods];
        
        updateMeal({foods: foodsToAdd});
    }
    useEffect(() => {
        const sub = emitter.addListener("addFood", ({foodToAdd}) => {
            //console.log("Got data back:", foodToAdd);
            addFood(foodToAdd);
            
        });

        const sub2 = emitter.addListener("completeEditOnFoodForEditMeal", ({food}) => {
            const foodsInMeal = meal.foods;
            const newFoods = foodsInMeal.map(f => {
                if (f.id !== food.id) return f;
                return food;
            });
            updateMeal({foods: newFoods});
        });

        const sub3 = emitter.addListener("done", (data) => {
            if (data?.target === "changeFoodQuantityFromEditMeal") {
                const quantity = data.value;
                const foods = JSON.parse(JSON.stringify(meal.foods));
                const foodIdx = foods.findIndex(f => f.id === data.food.id);
                foods[foodIdx] = {...data.food, quantity};
                updateMeal({foods});
            }
        });
        
        return () => {
            sub.remove();
            sub2.remove();
            sub3.remove();
        }
    }, [emitter, meal]);

    const removeFoodItem = (food) => {
        const newFoods = meal.foods.filter(f => f.id !== food.id);
        updateMeal({foods: newFoods});
    }

    const openFoodPreview = (f) => {
        setFoodPreview(f);
        setFoodPreviewOpen(true);
    }

    const openEditFood = (food) => {
        if (foodPreviewOpen) setFoodPreviewOpen(false);
        router.push({
            pathname: '/editFood',
            params: {
                food: JSON.stringify(food),
                openedFrom: "editMeal",
            }
        })
            
    }

    const handleEndEditting = () => {
        if (!meal.name) updateMeal({name: "Meal Name"});
    }

    const clickChangeQuantity = (food) => {
        const info = {
            title: food.name + " Quantity",
            target: 'changeFoodQuantityFromEditMeal',
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

  return (
    <ThemedView style={{flex: 1,}}>
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
        <SafeAreaView style={{flex: 1, marginBottom: -50,}}>
            <View style={[styles.actionButtons]}>
                <View>
                    <Pressable onPress={cancelEdit} style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#4B4B4B", borderRadius: 10, }}>
                        <Text style={{fontSize: 15, color: "white",}}>Cancel</Text>
                    </Pressable>
                </View>
                <View>
                    <Pressable onPress={requestSaveMeal} style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.protein, borderRadius: 10, }}>
                        <Text style={{fontSize: 15, color: "white",}}>Save</Text>
                    </Pressable>
                </View>
            </View>

            <View style={[{flex: 1}]}>
                <ScrollView style={{flex: 1}} contentContainerStyle={{ paddingBottom: 50}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20}}>
                        <Pressable style={{ height: 40, width: 40, justifyContent: "center", alignItems: "center"}} onPress={() => {if (mealNameInputRef.current) {mealNameInputRef.current.focus()}}}>
                            <Image style={{height: 15, width: 15, marginRight: 10}} source={pencil} />
                        </Pressable>
                        
                        <TextInput selectTextOnFocus ref={mealNameInputRef} onChangeText={(e) => updateMeal({name: e})} onEndEditing={handleEndEditting} value={meal.name} style={styles.mealNameInput} />
                    </View>

                    <Spacer height={10} />
                    <BlueButton title={"Add Food"} onPress={openAddFood} style={{marginHorizontal: 20}} />
                    <Spacer height={20} />

                    <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10, marginLeft: 20}}>Meal Foods</ThemedText>

                    <Animated.View layout={LinearTransition}>
                        {meal.foods.map((food, i) => {
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
                    

                </ScrollView>
            </View>

        </SafeAreaView>
    </ThemedView>
  )
}

export default EditMeal

const styles = StyleSheet.create({
    actionButtons: {
        paddingHorizontal: 20,
        height: 50,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        zIndex: 1,
    },
    mealNameInput: {
        fontSize: 23,
        color: "white",
        flex: 1,
        fontWeight: 700
    }
})