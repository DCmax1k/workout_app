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

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const screenWidth = Dimensions.get('screen').width;

const FoodPreview = ({style, food, setFoodPreviewOpen, editFood, ...props}) => {
    const user = useUserStore(state => state.user);

    const calorieCount = food.nutrition.calories;
    const calorieGoal = user.tracking.nutrition["calories"].extraData.goal;
    const proteinCount = food.nutrition.protein;
    const proteinGoal = user.tracking.nutrition["protein"].extraData.goal;
    const carbCount = food.nutrition.carbs;
    const carbGoal = user.tracking.nutrition["carbs"].extraData.goal;
    const fatCount = food.nutrition.fat;
    const fatGoal = user.tracking.nutrition["fat"].extraData.goal;

    

  return (
    <Animated.View layout={LinearTransition.springify().damping(90)} style={[styles.cont, style]} {...props}>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
            <Pressable onPress={() => setFoodPreviewOpen(false)}>
                <Image source={whiteX} style={{ height: 30, width: 30, marginRight: 5}} />
            </Pressable>
            
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, }}>
                <Image source={food.icon ? icons[food.icon] : icons["fooddoodles303"]} style={{height: 30, width: 30, objectFit: "contain", tintColor: "white"}} />
                <Text adjustsFontSizeToFit style={[styles.screenText,]}>{food.name}</Text>
            </View>
            

            <BlueButton color={Colors.primaryOrange} onPress={() => editFood(food)} title={"Edit"} style={{width: 80}} />
        </View>

        <Spacer height={20} />

        {/* Food categories */}
        <View style={{flexDirection: 'row', marginTop: 5, flexWrap: 'wrap', justifyContent: "center"}}>
            {food.categories.map(c => (
                <View key={c} style={{backgroundColor: "#353535", borderRadius: 5000,justifyContent: "center", alignItems: "center",marginRight: 5, marginBottom: 5,paddingVertical: 2, paddingHorizontal: 10,}}>
                    <Text style={{  fontSize: 12, color: "#B1B1B1",  }} key={c}>{capitalizeFirstLetter(c)}</Text>
                </View>
                
            ))}
        </View>
        <Spacer height={10} />

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

        {/* Description */}
        {food.description && (
            <View>
                <Text style={{color: "white", fontSize: 14, fontWeight: 300, padding: 10, textAlign: "center"}}>{food.description}</Text>
                <Spacer height={20} />
            </View>
            
            )}


    </Animated.View>
  )
}

export default FoodPreview

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