import { Dimensions, Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import noEye from '../../assets/icons/noEye.png'
import trashIcon from '../../assets/icons/trash.png'
import plusIcon from '../../assets/icons/plus.png'
import eyeIcon from '../../assets/icons/eye.png'
import silverwareIcon from '../../assets/icons/silverware.png'
import ThemedView from '../../components/ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'
import TitleWithBack from '../../components/TitleWithBack'
import Spacer from '../../components/Spacer'
import GraphWidget from '../../components/GraphWidget'
import ThemedText from '../../components/ThemedText'
import { useUserStore } from '../../stores/useUserStore'
import ProgressRing from '../../components/ProgressRing'
import { Colors } from '../../constants/Colors'
import getDateKey from '../../util/getDateKey'
import emitter from '../../util/eventBus'
import { router, useLocalSearchParams } from 'expo-router'
import PageSwiper from '../../components/PageSwiper'
import ConfirmMenu from '../../components/ConfirmMenu'
import PopupButtons from '../../components/PopupButtons'
import Animated, { Extrapolation, FadeIn, FadeInDown, FadeOut, FadeOutDown, interpolate, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated'
import { generateUniqueId } from '../../util/uniqueId'
import BottomSheet from '@gorhom/bottom-sheet'
import EditPlate from './editPlate'
import ConsumedMealCard from '../../components/nutrition/ConsumedMealCard'
import calculateCalories from '../../util/calculateNutrition/calculateCalories'
import calculateProtein from '../../util/calculateNutrition/calculateProtein'
import calculateCarbs from '../../util/calculateNutrition/calculateCarbs'
import calculateFat from '../../util/calculateNutrition/calculateFat'
import ActionMenu from '../../components/ActionMenu'
import { useIsFocused } from '@react-navigation/native'
import { Portal } from 'react-native-paper'
import MealPreview from '../../components/nutrition/MealPreview'
import { Platform } from 'react-native'
import EnergyBalanceGraph from '../../components/nutrition/EnergyBalanceGraph'
import calculateExpenditure from '../../util/calculateExpenditure'

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const Nutrition = () => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const [mealPreview, setMealPreview] = useState(null); // {...food}
    const [mealPreviewOpen, setMealPreviewOpen] = useState(false);

    // Stop calorie widget from animating if past initial open
    const [widgetAnimationDuration, setWidgetAnimationDuration] = useState(1000);
    useEffect(() => {
        setTimeout(() => {
            setWidgetAnimationDuration(0);
        }, 1005);
    }, [])

    // Track if keyboard open
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

     const [bottomSheetPosition, setBottomSheetPosition] = useState(0);
    

    // Bottom sheet
    const sheetRef = useRef(null);
    const editPlateRef = useRef(null);

    const tabBarHeight = 120;
    const firstSnap = tabBarHeight;
    const snapPoints = [firstSnap, 0.95*screenHeight];
    const animatedPosition = useSharedValue(0);
    const [sheetShouldStartOpen, setSheetShouldStartOpen] = useState(false);
    useEffect(() => {
        if (user) {
            const tm = setTimeout(() => {
                setSheetShouldStartOpen(user.editActivePlate !== null);
            }, 100)
            
            return () => clearTimeout(tm);
        }
    }, []); 

    const [resumeAndOpenSheet, setResumeAndOpenSheet] = useState(false); // If true, on focused sheet should open
    useEffect(() => {
        const sub3 = emitter.addListener("addedToPlate", (boolHere) => {
            if (boolHere) {
                // Open if not opened
                setResumeAndOpenSheet(true);
            }
            
        });
        return () => {
            sub3.remove();
        }
    });
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused && resumeAndOpenSheet) {
            setResumeAndOpenSheet(false);
            sheetRef.current?.snapToIndex(1);
        } else if (isFocused && user.editActivePlate && bottomSheetPosition < 0) {
            sheetRef.current?.snapToIndex(0);
        }
    }, [isFocused])
    //   useEffect(() => {
    //     console.log(animatedPosition.value, keyboardVisible, screenHeight);
    //     if (keyboardVisible && animatedPosition.value < screenHeight - 200) {
    //         Keyboard.dismiss();
    //     }
    // }, [keyboardVisible, animatedPosition]);

    const closeKeyboardIfOpen = () => {
        if (keyboardVisible) {
            Keyboard.dismiss();
        }
    }
    const closeKeyboardIfBottomSheetBelow = () => {
        if (animatedPosition.value > 200) {
            closeKeyboardIfOpen();
        }
    }

      
    const handleSnapPress = useCallback((index) => {
        sheetRef.current?.snapToIndex(index);
    }, []);
    const handleCloseSheet = useCallback(() => {
        sheetRef.current?.close();
    }, []);

    const animatedHeaderOpacity = useAnimatedStyle(() => {
        const opacity = interpolate(
            animatedPosition.value,
            [screenHeight-firstSnap, screenHeight-0.8 * screenHeight],
            [1, 0],
            Extrapolation.CLAMP );
        return {opacity};
    });
    const animatedButtonsOpacity = useAnimatedStyle(() => {
        const opacity = interpolate(
            animatedPosition.value,
            [screenHeight-0.3 * screenHeight, screenHeight-0.95*screenHeight],
            [0, 1],
            Extrapolation.CLAMP );
        return {opacity};
    });
    const animatedLeftButtonTransform = useAnimatedStyle(() => {
        const translateX = interpolate(
            animatedPosition.value,
            [screenHeight-0.5 * screenHeight, screenHeight-0.95*screenHeight],
            [-screenWidth/2, 0],
            Extrapolation.CLAMP );
        return {transform: [{translateX}]};
    });
    const animatedRightButtonTransform = useAnimatedStyle(() => {
        const translateX = interpolate(
            animatedPosition.value,
            [screenHeight-0.5 * screenHeight, screenHeight-0.95*screenHeight],
            [screenWidth/2, 0],
            Extrapolation.CLAMP );
        return {transform: [{translateX}]};
    });


    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState();

   

    const [floatingButtonActive, setFloatingButtonActive] = useState(false);
    const floatingButtonRef = useRef(null);

    const params = useLocalSearchParams();
    // useEffect(() => {
    //     if (params.data === "straightToLogFood") {
    //         // May want a setTimeout because it goes instant
    //         //showComingSoonMessage();
    //     }
    // }, [params]);

    const pageSwiperRef = useRef(null);

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
        sheetRef.current?.snapToIndex(1);
    }

    useEffect(() => {
        const sub = emitter.addListener("done", (data) => {
            //console.log("Got data back:", data);
            if (data.target === 'calories') {
                updateUser({tracking: {nutrition: {["calories"]: { extraData: {goal: data.value}}}}})
            } else if (data.target === "protein") {
                updateUser({tracking: {nutrition: {["protein"]: { extraData: {goal: data.value}}}}})
            } else if (data.target === 'carbs') {
                updateUser({tracking: {nutrition: {["carbs"]: { extraData: {goal: data.value}}}}})

            } else if  (data.target === 'fat') {
                updateUser({tracking: {nutrition: {["fat"]: { extraData: {goal: data.value}}}}})
            } else {
                console.log("Tried changing value with emit but value not found");
            }
            

        
        });
        return () => sub.remove();
    }, [emitter, updateUser]);

    const menuOptions = [{title: "Hide widget", icon: noEye, onPress: () => console.log(""),}]

    const expenditureData = calculateExpenditure(user);

    // const calorieData = [3454, 3453, 1345, 2346, 4442, 3654, 1346, 2345, 5234, 1160];
    // const calorieDates = [Date.now(), Date.now(), Date.now(), Date.now(), Date.now(), Date.now(), Date.now(), Date.now(), Date.now(), Date.now(),];
    const calorieCalculation = calculateCalories(user, 29);
    const calorieData = calorieCalculation.data;
    const calorieDates = calorieCalculation.dates;

    const colorieGoal = user.tracking.nutrition["calories"].extraData.goal;

    const proteinCount = calculateProtein(user, 0).data[0];
    const proteinGoal = user.tracking.nutrition["protein"].extraData.goal;
    const carbCount = calculateCarbs(user, 0).data[0];
    const carbGoal = user.tracking.nutrition["carbs"].extraData.goal;
    const fatCount = calculateFat(user, 0).data[0];
    const fatGoal = user.tracking.nutrition["fat"].extraData.goal;

    const todaysConsumptionHistory = user.consumedMeals[getDateKey(new Date())] || [];

    const pageSwipeWidth = screenWidth-40;

    const pressTarget = (tar) => {
        const info = {
            title: tar + " Target",
            target: tar,
            value: user.tracking.nutrition[tar].extraData.goal,
            unit:  tar === "calories" ? "calories" : "g",
            increment: tar === "calories" ? 5 : 1,
            range: [0, tar === "calories" ? 10000 : 2000],
            scrollItemWidth: 10,
            defaultValue:  tar === "calories" ? 2000 : 150,
        }
        router.push({
              pathname: "/inputValueScreen",
              params: {
                data: JSON.stringify(info),
              },
            });
    }

    const showComingSoonMessage = () => {
        setConfirmMenuData({
            title: "Coming soon!",
            subTitle: "This feature is not yet available but will be coming in a future update.",
            subTitle2: "",
            option1: "Awesome!",
            option1color: "#546FDB",
            confirm: () => setConfirmMenuActive(false),
        });
        setConfirmMenuActive(true);
    }

    const closeFloatingButton = () => {
        floatingButtonRef.current?.setActiveFalse();
        setFloatingButtonActive(false);
    }

    const startNewPlate = () => {
        const newPlateData = {name: "New Plate", id: generateUniqueId(), foods: [] };
        updateUser({editActivePlate: newPlateData});
        // router.push({
        //     pathname: "/editPlate",
           
        // });
        handleSnapPress(1);
        setTimeout(() => {
            // Auto select title
            editPlateRef.current?.selectPlateName();
        }, 600  )
    }
    const useSavedPlate = () => {
        router.push("/savedMeals")
    }
    const resumePlate = () => {
        //router.push("/editPlate");
    }

    const logFoodOptions = [
        {text: "Use saved plate", icon: require("../../assets/icons/silverware.png"), onPress: useSavedPlate},
        {text: "Start new plate", icon: require("../../assets/icons/plus.png"), onPress: startNewPlate},
    ];
    // if (user.editActivePlate !== null) {
    //     logFoodOptions.unshift(
    //         {text: "Resume editting", icon: require("../../assets/icons/playCircle.png"), onPress: resumePlate, iconSize: 25},
    //     )
    // }

    const removeMeal = (meal) => {
        const dateKey = getDateKey(meal.date);
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

    const addToSavedMeals = (meal) => {
        const savedMeals = user.savedMeals;
        const newSavedMeals = [meal, ...savedMeals];
        updateUser({savedMeals: newSavedMeals});
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
                openedFrom: "consumption",
            }
        })
    }

    const openConsumedMealHistory = () => {
        router.push({
            pathname: '/consumedMealsHistory',
        })
    }

    const caloriesGraphHeight = Platform.OS==="ios"?205:210;

    return (
        <>
        <ThemedView style={styles.container}>
            <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
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

            {floatingButtonActive && (
                <Animated.View style={[{height: screenHeight, width: screenWidth, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1}, StyleSheet.absoluteFill]} entering={FadeIn} exiting={FadeOut}>
                    <Pressable onPress={() => closeFloatingButton()} style={StyleSheet.absoluteFill} />
                </Animated.View>
            )}
            {/* Floating footer button */}
            {user.editActivePlate === null && (<View style={{position: "absolute", zIndex: 2, left: 0, bottom: 40, width: screenWidth, alignItems: "center"}}>
                <PopupButtons ref={floatingButtonRef} setParentActive={setFloatingButtonActive}
                    buttons={logFoodOptions}
                
                />
            </View>)}


            <SafeAreaView style={{flex: 1, width: "100%",  marginBottom: -50, position: "relative"}}>
                <TitleWithBack title={"Nutrition"} actionBtn={{active: true, image: silverwareIcon, action: useSavedPlate}} />
                <Spacer height={20} />



                <ScrollView contentContainerStyle={{paddingBottom: 220}}  showsVerticalScrollIndicator={false}>
                    <View style={{paddingHorizontal: 20}}>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-end"}}>
                            <Text style={{color: "#B4B4B4", fontSize: 15, marginRight: 20}}>Calorie Target</Text>
                            <Pressable onPress={() => {pressTarget("calories")}} style={{backgroundColor: "#353535", borderRadius: 10, flexDirection: "row", padding: 10}}>
                                <Text style={{color: "white", fontSize: 13, fontWeight: "800"}}>{colorieGoal}</Text>
                            </Pressable>
                        
                        </View>
                    </View>

                    
                    <Spacer height={10} />
                    <PageSwiper ref={pageSwiperRef} width={screenWidth} height={caloriesGraphHeight+30} >
                        <View style={{height: caloriesGraphHeight, width: pageSwipeWidth}}>
                            <Pressable style={{flex: 1}} onPress={showComingSoonMessage}>
                                <GraphWidget
                                    fillWidth={true}
                                    data={calorieData}
                                    dates={calorieDates}
                                    title={"Energy Intake"}
                                    subtitle={"Last 30 days"}
                                    unit={"/" + colorieGoal + " calories"}
                                    color={"#546FDB"}
                                    disablePress={true}
                                    style={[styles.widgetCont]}
                                    titleStyles={{fontWeight: "800", color: "white", fontSize: 16, marginBottom: -3}}
                                    hideFooter={false} // Used to be true
                                    initialSectionIndex={1}
                                    animationDuration={widgetAnimationDuration}
                                />
                            </Pressable>
                            
                        </View>
                        <View style={{height: caloriesGraphHeight, width: pageSwipeWidth}}>
                            <Pressable style={{flex: 1}} onPress={showComingSoonMessage}>
                                <EnergyBalanceGraph
                                    fillWidth={true}
                                    data={expenditureData.data}
                                    dates={expenditureData.dates}
                                    calorieData={calorieData}
                                    calorieDates={calorieDates}
                                    title={"Energy Balance"}
                                    subtitle={"Last 30 days"}
                                    unit={"/" + colorieGoal + " calories"}
                                    color={Colors.primaryOrange}
                                    disablePress={true}
                                    style={[styles.widgetCont]}
                                    titleStyles={{fontWeight: "800", color: "white", fontSize: 16, marginBottom: -3}}
                                    hideFooter={true}
                                    initialSectionIndex={1}
                                    animationDuration={0}
                                />
                            </Pressable>
                            
                        </View>
                        
                    </PageSwiper>
                    <Spacer height={10} />
                    

                    <View style={{paddingHorizontal: 20}}>

                        
                        {/* Macros */}
                        <ThemedText style={ [{fontSize: 15, fontWeight: "700"}]} >Macros</ThemedText>
                        <Spacer height={10} />
                        <View style={[styles.widgetCont, { paddingVertical: 20, paddingHorizontal: 10}]}>
                            <View style={{width: "100%", flexDirection: "row", justifyContent: "space-around"}}>
                                {/* Protein ring */}
                                <View style={{alignItems: "center"}}>
                                    <Text style={{color: Colors.protein, fontSize: 10, marginBottom: 10}}>Protein</Text>
                                    <ProgressRing value={proteinCount} target={proteinGoal} size={((screenWidth-60)/2)/3} strokeWidth={5} progressColor={Colors.protein} delay={200} >
                                        <View style={{alignItems: "center"}}>
                                            <Text style={{fontSize: 12, fontWeight: "800", color: "white"}}>{Math.round(proteinCount)}g</Text>
                                        </View>
                                    </ProgressRing>
                                    <Spacer height={10} />
                                    <Pressable onPress={() => {pressTarget("protein")}} style={{backgroundColor: "#353535", borderRadius: 10, flexDirection: "row", padding: 10}}>
                                        <Text style={{color: "white", fontSize: 13, fontWeight: "800"}}>{proteinGoal}</Text>
                                        <Text style={{color: "#6B6B6B", fontSize: 12, marginLeft: 3}}>{"g"}</Text>
                                    </Pressable>
                                    <Spacer height={5} />
                                    <Text style={{color: "#B4B4B4", fontSize: 10, marginBottom: 10}}>Target</Text>
                                    
                                </View>
                                
                                {/* Carbs ring */}
                                <View style={{alignItems: "center"}}>
                                    <Text style={{color: Colors.carbs, fontSize: 10, marginBottom: 10}}>Carbs</Text>
                                    <ProgressRing value={carbCount} target={carbGoal} size={((screenWidth-60)/2)/3} strokeWidth={5} progressColor={Colors.carbs} delay={400} >
                                        <View style={{alignItems: "center"}}>
                                            <Text style={{fontSize: 12, fontWeight: "800", color: "white"}}>{Math.round(carbCount)}g</Text>
                                        </View>
                                    </ProgressRing>
                                    <Spacer height={10} />
                                    <Pressable onPress={() => {pressTarget("carbs")}} style={{backgroundColor: "#353535", borderRadius: 10, flexDirection: "row", padding: 10}}>
                                        <Text style={{color: "white", fontSize: 13, fontWeight: "800"}}>{carbGoal}</Text>
                                        <Text style={{color: "#6B6B6B", fontSize: 12, marginLeft: 3}}>{"g"}</Text>
                                    </Pressable>
                                    <Spacer height={5} />
                                    <Text style={{color: "#B4B4B4", fontSize: 10, marginBottom: 10}}>Target</Text>
                                </View>
                                    
                                {/* Fat ring */}
                                <View style={{alignItems: "center"}}>
                                    <Text style={{color: Colors.fat, fontSize: 10, marginBottom: 10}}>Fat</Text>
                                    <ProgressRing value={fatCount} target={fatGoal} size={((screenWidth-60)/2)/3} strokeWidth={5} progressColor={Colors.fat} delay={600} >
                                        <View style={{alignItems: "center"}}>
                                            <Text style={{fontSize: 12, fontWeight: "800", color: "white"}}>{Math.round(fatCount)}g</Text>
                                        </View>
                                    </ProgressRing>
                                    <Spacer height={10} />
                                    <Pressable onPress={() => {pressTarget("fat")}} style={{backgroundColor: "#353535", borderRadius: 10, flexDirection: "row", padding: 10}}>
                                        <Text style={{color: "white", fontSize: 13, fontWeight: "800"}}>{fatGoal}</Text>
                                        <Text style={{color: "#6B6B6B", fontSize: 12, marginLeft: 3}}>{"g"}</Text>
                                    </Pressable>
                                    <Spacer height={5} />
                                    <Text style={{color: "#B4B4B4", fontSize: 10, marginBottom: 10}}>Target</Text>
                                </View>
                                
                            </View>
                        </View>
                        
                        <Spacer height={30} />

                        {/* Todays consumption */}
                        <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                            <ThemedText style={ [{fontSize: 15, fontWeight: "700"}]} >Todays Consumption</ThemedText>
                            <Pressable onPress={openConsumedMealHistory} style={{}}>
                                <ThemedText style={{textAlign: "center", textDecorationLine: "underline"}}>View history</ThemedText>
                            </Pressable>
                        </View> 
                        {todaysConsumptionHistory.length === 0 && (
                            <ThemedText style={{paddingHorizontal: 50, paddingVertical: 20, textAlign: "center"}}>Find meals you eat today here!</ThemedText>
                        )}

                        {/* MEALS FROM TODAY */}
                        <View>
                            {todaysConsumptionHistory.map((meal, i) => {

                                const actionMenuData = [
                                    {title: "Add Foods to Plate", icon: plusIcon, onPress: () => addMealToPlate(meal), },
                                    {title: "Open Meal", icon: eyeIcon, onPress: () => openMeal(meal), },
                                    {title: "Remove Meal from Consumed", icon: trashIcon, onPress: () => requestRemoveMeal(meal), color: Colors.redText },
                                ];

                                // If saved meals does not contain this meal, add the option to save
                                if (!user.savedMeals.map(m => m.id).includes(meal.id)) {
                                    actionMenuData.unshift({title: "Add to Saved Meals", icon: silverwareIcon, onPress: () => addToSavedMeals(meal), },);
                                }

                                return (
                                    <Pressable onPress={() => openMeal(meal)} key={meal.date + "" + meal.id} style={{marginTop: 10}} >
                                        <ConsumedMealCard actionMenuData={actionMenuData} meal={meal} />
                                    </Pressable>
                                    
                                )
                                
                            })}
                            
                        </View>

                        


                    </View>
                    

                </ScrollView>
                


            </SafeAreaView>

        </ThemedView>

        {/* Bottom sheet */}
        <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            enableDynamicSizing={false}
            backgroundStyle={{backgroundColor: "#313131"}}
            handleIndicatorStyle={{backgroundColor: "white", width: 80}}
            animatedPosition={animatedPosition}
            index={sheetShouldStartOpen ? 0 : -1}
            onChange={index => setBottomSheetPosition(index)}
            onAnimate={closeKeyboardIfBottomSheetBelow}
            
        >
        
            <EditPlate
                ref={editPlateRef}
                closeSheet={handleCloseSheet}
                animatedHeaderOpacity={animatedHeaderOpacity}
                animatedButtonsOpacity={animatedButtonsOpacity}
                animatedLeftButtonTransform={animatedLeftButtonTransform}
                animatedRightButtonTransform={animatedRightButtonTransform}
                handleSnapPress={handleSnapPress}
                bottomSheetPosition={bottomSheetPosition}
                closeKeyboardIfOpen={closeKeyboardIfOpen}
            />
            

        </BottomSheet>
        </>
    )
}

export default Nutrition

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 0,
    },

    widgetCont: {
        backgroundColor: '#202020',
        borderRadius: 20,
    }
})