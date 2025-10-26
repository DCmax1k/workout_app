import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Animated, { LinearTransition } from 'react-native-reanimated'
import whiteX from '../../assets/icons/whiteX.png'
import BlueButton from '../BlueButton'
import { Colors } from '../../constants/Colors'
import Spacer from '../Spacer'
import { icons } from '../../constants/icons'
import { useUserStore } from '../../stores/useUserStore'
import ProgressRing from '../ProgressRing'
import PlateItem from './PlateItem'
import PieChart from 'react-native-pie-chart'

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const MealPreview = ({style, meal, setMealPreviewOpen, addMealToPlate, editMeal, ...props}) => {
    const user = useUserStore(state => state.user);

    const calorieCount = meal.totalNutrition.calories;
    const calorieGoal = user.tracking.nutrition["calories"].extraData.goal;
    const proteinCount = meal.totalNutrition.protein;
    const proteinGoal = user.tracking.nutrition["protein"].extraData.goal;
    const carbCount = meal.totalNutrition.carbs;
    const carbGoal = user.tracking.nutrition["carbs"].extraData.goal;
    const fatCount = meal.totalNutrition.fat;
    const fatGoal = user.tracking.nutrition["fat"].extraData.goal;

    // const pieChartLabelStyle = {fontWeight: "bold", fill: "white", fontSize: 15, stroke: 3};

    // const pieChartSeries = [
    //     {value: calorieCount, color: Colors.calories, label: {text: calorieCount+"", ...pieChartLabelStyle }},
    //     {value: proteinCount, color: Colors.protein, label: {text: proteinCount+"g", ...pieChartLabelStyle }},
    //     {value: carbCount, color: "#1BB14C", label: {text: carbCount+"g", ...pieChartLabelStyle }},
    //     {value: fatCount, color: Colors.fat, label: {text: fatCount+"g", ...pieChartLabelStyle }},
    // ]
    const rawSeries = [
        { key: "calories", value: calorieCount, color: Colors.calories, label: `${parseInt(calorieCount*10)/10}` },
        { key: "protein", value: proteinCount, color: Colors.protein, label: `${parseInt(proteinCount*10)/10}g` },
        { key: "carbs", value: carbCount, color: "#1BB14C", label: `${parseInt(carbCount*10)/10}g` },
        { key: "fat", value: fatCount, color: Colors.fat, label: `${parseInt(fatCount*10)/10}g` },
    ];

    const total = rawSeries.reduce((sum, item) => sum + item.value, 0);
    const minPercent = 0.20;

    let adjustedSeries = rawSeries.map(item => {
        const percent = item.value / total;
        return {
            ...item,
            adjustedValue: Math.max(percent, minPercent),
        };
    });

    const adjustedTotal = adjustedSeries.reduce((sum, item) => sum + item.adjustedValue, 0);
        adjustedSeries = adjustedSeries.map(item => ({
        ...item,
        value: (item.adjustedValue / adjustedTotal) * total,
    }));

    const pieChartLabelStyle = { fontWeight: "bold", fill: "white", fontSize: 15, stroke: 3 };

    const pieChartSeries = adjustedSeries.map(item => ({
        value: item.value,
        color: item.color,
        label: { text: item.label, ...pieChartLabelStyle },
    }));

  return (
    <Animated.View layout={LinearTransition.springify().damping(90)} style={[styles.cont, style]} {...props}>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
            <Pressable onPress={() => setMealPreviewOpen(false)}>
                <Image source={whiteX} style={{ height: 30, width: 30, marginRight: 5}} />
            </Pressable>
            
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, }}>
                <Text adjustsFontSizeToFit style={[styles.screenText,]}>{meal.name}</Text>
            </View>
            

            <BlueButton color={Colors.primaryOrange} onPress={() => editMeal(meal)} title={"Edit"} style={{width: 80}} />
        </View>

        <Spacer height={20} />

        <BlueButton onPress={() => addMealToPlate(meal)} title={"Add Foods to Plate"} />

        <Spacer height={20} />

        {/* Macros */}
        {/* <View style={[styles.widgetCont, { paddingVertical: 20, paddingHorizontal: 10}]}>
            <View style={{width: "100%", flexDirection: "row", justifyContent: "space-around"}}>
                
                <View style={{alignItems: "center"}}>
                    <Text style={{color: Colors.primaryBlue, fontSize: 10, marginBottom: 10}}>Protein</Text>
                    <ProgressRing value={calorieCount} target={calorieGoal} size={((screenWidth-60)/2)/3} strokeWidth={5} progressColor={Colors.primaryBlue} delay={0} >
                        <View style={{alignItems: "center"}}>
                            <Text style={{fontSize: 12, fontWeight: "800", color: "white"}}>{Math.round(calorieCount)}g</Text>
                        </View>
                    </ProgressRing>
                    
                    
                </View>
                
                <View style={{alignItems: "center"}}>
                    <Text style={{color: Colors.protein, fontSize: 10, marginBottom: 10}}>Protein</Text>
                    <ProgressRing value={proteinCount} target={proteinGoal} size={((screenWidth-60)/2)/3} strokeWidth={5} progressColor={Colors.protein} delay={200} >
                        <View style={{alignItems: "center"}}>
                            <Text style={{fontSize: 12, fontWeight: "800", color: "white"}}>{Math.round(proteinCount)}g</Text>
                        </View>
                    </ProgressRing>
                    
                    
                </View>
                
                <View style={{alignItems: "center"}}>
                    <Text style={{color: Colors.carbs, fontSize: 10, marginBottom: 10}}>Carbs</Text>
                    <ProgressRing value={carbCount} target={carbGoal} size={((screenWidth-60)/2)/3} strokeWidth={5} progressColor={Colors.carbs} delay={400} >
                        <View style={{alignItems: "center"}}>
                            <Text style={{fontSize: 12, fontWeight: "800", color: "white"}}>{Math.round(carbCount)}g</Text>
                        </View>
                    </ProgressRing>
                    
                </View>
                    
                <View style={{alignItems: "center"}}>
                    <Text style={{color: Colors.fat, fontSize: 10, marginBottom: 10}}>Fat</Text>
                    <ProgressRing value={fatCount} target={fatGoal} size={((screenWidth-60)/2)/3} strokeWidth={5} progressColor={Colors.fat} delay={600} >
                        <View style={{alignItems: "center"}}>
                            <Text style={{fontSize: 12, fontWeight: "800", color: "white"}}>{Math.round(fatCount)}g</Text>
                        </View>
                    </ProgressRing>
                    
                </View>
            </View>
        </View> */}

        {/* Pie chart */}
        <View style={[styles.widgetCont, {flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10}]}>
            <View style={{height: 180, width: 80, padding: 10, flexDirection: "column", justifyContent: "space-between"}}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <View style={{height: 10, width: 10, borderRadius: 10, backgroundColor: Colors.calories, marginRight: 6}}></View>
                    <Text style={{color: "white", fontSize: 15}}>Calories</Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <View style={{height: 10, width: 10, borderRadius: 10, backgroundColor: Colors.protein, marginRight: 6}}></View>
                    <Text style={{color: "white", fontSize: 15}}>Protein</Text>
                </View>
            </View> 
            <View style={{backgroundColor: "#3D3D3D", padding: 10, borderRadius: 150, marginHorizontal: -20}}>
                <PieChart series={pieChartSeries} widthAndHeight={150} cover={0.1} padAngle={0.04} />
            </View>
            <View style={{height: 180, width: 80, padding: 10, flexDirection: "column", justifyContent: "space-between"}}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <View style={{height: 10, width: 10, borderRadius: 10, backgroundColor: Colors.carbs, marginRight: 6}}></View>
                    <Text style={{color: "white", fontSize: 15}}>Carbs</Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <View style={{height: 10, width: 10, borderRadius: 10, backgroundColor: Colors.fat, marginRight: 6}}></View>
                    <Text style={{color: "white", fontSize: 15}}>Fat</Text>
                </View>
            </View> 
            
        </View>

        

        <ScrollView style={{maxHeight: screenHeight - 450}} contentContainerStyle={{paddingTop: 20, paddingBottom: 20, alignItems: "center"}}>
            {meal.fullMeal.foods.map(food => {
                return (
                    <View key={food.id} style={{marginBottom: 5}}>
                        <PlateItem food={food} edit={false} width={screenWidth-40} style={{backgroundColor: "transparent"}} />
                    </View>
                )
            })}
        </ScrollView>


    </Animated.View>
  )
}

export default MealPreview

const styles = StyleSheet.create({
    cont: {
        backgroundColor: "#282828",
         borderRadius: 20,
         padding: 10,
         paddingBottom: 0,
         minHeight: 100,
        //  maxHeight: screenHeight,
         overflow: 'hidden',
    },
    screenText: {
        color: "white", 
        fontSize: 16, 
        textAlign: 'center',
    },
    widgetCont: {
        backgroundColor: '#202020',
        borderRadius: 20,
    }
})