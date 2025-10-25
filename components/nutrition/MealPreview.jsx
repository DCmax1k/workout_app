import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Animated, { LinearTransition } from 'react-native-reanimated'
import whiteX from '../../assets/icons/whiteX.png'
import BlueButton from '../BlueButton'
import { Colors } from '../../constants/Colors'
import Spacer from '../Spacer'
import { icons } from '../../constants/icons'
import { useUserStore } from '../../stores/useUserStore'
import ProgressRing from '../ProgressRing'

const screenWidth = Dimensions.get('screen').width;

const MealPreview = ({style, meal, setMealPreviewOpen, editFood, ...props}) => {
    const user = useUserStore(state => state.user);

    const calorieCount = meal.totalNutrition.calories;
    const calorieGoal = user.tracking.nutrition["calories"].extraData.goal;
    const proteinCount = meal.totalNutrition.protein;
    const proteinGoal = user.tracking.nutrition["protein"].extraData.goal;
    const carbCount = meal.totalNutrition.carbs;
    const carbGoal = user.tracking.nutrition["carbs"].extraData.goal;
    const fatCount = meal.totalNutrition.fat;
    const fatGoal = user.tracking.nutrition["fat"].extraData.goal;

    

  return (
    <Animated.View layout={LinearTransition.springify().damping(90)} style={[styles.cont, style]} {...props}>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
            <Pressable onPress={() => setMealPreviewOpen(false)}>
                <Image source={whiteX} style={{ height: 30, width: 30, marginRight: 5}} />
            </Pressable>
            
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, }}>
                <Image source={meal.icon ? icons[meal.icon] : icons["fooddoodles303"]} style={{height: 30, width: 30, objectFit: "contain", tintColor: "white"}} />
                <Text adjustsFontSizeToFit style={[styles.screenText,]}>{meal.name}</Text>
            </View>
            

            <BlueButton color={Colors.primaryOrange} onPress={() => editFood(food)} title={"Edit"} style={{width: 80}} />
        </View>

        <Spacer height={20} />

        {/* Macros */}
        <View style={[styles.widgetCont, { paddingVertical: 20, paddingHorizontal: 10}]}>
            <View style={{width: "100%", flexDirection: "row", justifyContent: "space-around"}}>
                {/* Caloie ring */}
                <View style={{alignItems: "center"}}>
                    <Text style={{color: Colors.primaryBlue, fontSize: 10, marginBottom: 10}}>Protein</Text>
                    <ProgressRing value={calorieCount} target={calorieGoal} size={((screenWidth-60)/2)/3} strokeWidth={5} progressColor={Colors.primaryBlue} delay={0} >
                        <View style={{alignItems: "center"}}>
                            <Text style={{fontSize: 12, fontWeight: "800", color: "white"}}>{Math.round(calorieCount)}g</Text>
                        </View>
                    </ProgressRing>
                    
                    
                </View>
                {/* Protein ring */}
                <View style={{alignItems: "center"}}>
                    <Text style={{color: Colors.protein, fontSize: 10, marginBottom: 10}}>Protein</Text>
                    <ProgressRing value={proteinCount} target={proteinGoal} size={((screenWidth-60)/2)/3} strokeWidth={5} progressColor={Colors.protein} delay={200} >
                        <View style={{alignItems: "center"}}>
                            <Text style={{fontSize: 12, fontWeight: "800", color: "white"}}>{Math.round(proteinCount)}g</Text>
                        </View>
                    </ProgressRing>
                    
                    
                </View>
                
                {/* Carbs ring */}
                <View style={{alignItems: "center"}}>
                    <Text style={{color: Colors.carbs, fontSize: 10, marginBottom: 10}}>Carbs</Text>
                    <ProgressRing value={carbCount} target={carbGoal} size={((screenWidth-60)/2)/3} strokeWidth={5} progressColor={Colors.carbs} delay={400} >
                        <View style={{alignItems: "center"}}>
                            <Text style={{fontSize: 12, fontWeight: "800", color: "white"}}>{Math.round(carbCount)}g</Text>
                        </View>
                    </ProgressRing>
                    
                </View>
                    
                {/* Fat ring */}
                <View style={{alignItems: "center"}}>
                    <Text style={{color: Colors.fat, fontSize: 10, marginBottom: 10}}>Fat</Text>
                    <ProgressRing value={fatCount} target={fatGoal} size={((screenWidth-60)/2)/3} strokeWidth={5} progressColor={Colors.fat} delay={600} >
                        <View style={{alignItems: "center"}}>
                            <Text style={{fontSize: 12, fontWeight: "800", color: "white"}}>{Math.round(fatCount)}g</Text>
                        </View>
                    </ProgressRing>
                    
                </View>
            </View>
        </View>

        <Spacer height={20} />


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