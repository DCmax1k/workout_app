import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ProgressRing from '../ProgressRing'
import Spacer from '../Spacer'
import { Colors } from '../../constants/Colors';
import RightArrow from '../../assets/icons/rightArrow.png'
import { useUserStore } from '../../stores/useUserStore';
import { router } from 'expo-router';

const screenWidth = Dimensions.get("screen").width;

const NutritionWidget = ({style}) => {
    const user = useUserStore(state => state.user);

    const calorieCount = 1160;
    const calorieGoal = user.tracking.nutrition["calories"].extraData.goal;;
    const proteinCount = 124;
    const proteinGoal = user.tracking.nutrition["protein"].extraData.goal;;
    const carbCount = 134;
    const carbGoal = user.tracking.nutrition["carbs"].extraData.goal;;
    const fatCount = 34;
    const fatGoal = user.tracking.nutrition["fat"].extraData.goal;;
    const todaysPlateCount = 1;


    const straightToLogFood = () => {
        router.push({
            pathname: "/nutrition",
            params: {
                data: "straighToLogFood",
            }
        });
    }
    

  return (
    <View style={[styles.container, {flex: 1, width: "100%", height: (screenWidth-40)/2, justifyContent: "center", },  style]} >

        <View style={{flexDirection: "row"}}>
            <ProgressRing value={calorieCount} target={calorieGoal} size={(screenWidth-120)/2} strokeWidth={8} >
                <View style={{marginBottom: 10, alignItems: "center"}}>
                    <Text style={{fontSize: 17, color: "#D0D0D0"}}>Calories</Text>
                    <Spacer height={5} />
                    <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                        <Text style={{fontSize: 18, fontWeight: "800", color: "white"}}>{Math.round(calorieCount)}</Text>
                        <Text style={{fontSize: 13, fontWeight: "300", color: "#888888", marginLeft: 5, marginBottom: 2}}>/ {calorieGoal}</Text>
                    </View>
                </View>
            </ProgressRing>

            <View style={{flex: 1, flexDirection: "column", alignItems: "center"}}>
                <View style={{width: "100%", flexDirection: "row", justifyContent: "space-around"}}>
                    {/* Protein ring */}
                    <View style={{alignItems: "center"}}>
                        <ProgressRing value={proteinCount} target={proteinGoal} size={((screenWidth-60)/2)/3} strokeWidth={5} progressColor={Colors.protein} delay={200} >
                            <View style={{alignItems: "center"}}>
                                <Text style={{fontSize: 12, fontWeight: "800", color: "white"}}>{Math.round(proteinCount)}g</Text>
                                <Text style={{fontSize: 10, fontWeight: "300", color: "#888888", marginLeft: 5, marginBottom: 2}}>/ {proteinGoal}</Text>
                            </View>
                        </ProgressRing>
                        <Text style={{color: "#848484", fontSize: 10, marginTop: 3}}>Protein</Text>
                    </View>
                    
                    {/* Carbs ring */}
                    <View style={{alignItems: "center"}}>
                        <ProgressRing value={carbCount} target={carbGoal} size={((screenWidth-60)/2)/3} strokeWidth={5} progressColor={Colors.carbs} delay={400} >
                            <View style={{alignItems: "center"}}>
                                <Text style={{fontSize: 12, fontWeight: "800", color: "white"}}>{Math.round(carbCount)}g</Text>
                                <Text style={{fontSize: 10, fontWeight: "300", color: "#888888", marginLeft: 5, marginBottom: 2}}>/ {carbGoal}</Text>
                            </View>
                        </ProgressRing>
                        <Text style={{color: "#848484", fontSize: 10, marginTop: 3}}>Carbs</Text>
                    </View>
                        
                    {/* Fat ring */}
                    <View style={{alignItems: "center"}}>
                        <ProgressRing value={fatCount} target={fatGoal} size={((screenWidth-60)/2)/3} strokeWidth={5} progressColor={Colors.fat} delay={600} >
                            <View style={{alignItems: "center"}}>
                                <Text style={{fontSize: 12, fontWeight: "800", color: "white"}}>{Math.round(fatCount)}g</Text>
                                <Text style={{fontSize: 10, fontWeight: "300", color: "#888888", marginLeft: 5, marginBottom: 2}}>/ {fatGoal}</Text>
                            </View>
                        </ProgressRing>
                        <Text style={{color: "#848484", fontSize: 10, marginTop: 3}}>Fat</Text>
                    </View>
                    
                </View>
                <Spacer height={15} />
                <Text style={{fontSize: 10, color: "#D0D0D0"}}>Fueled up with {todaysPlateCount} plate{todaysPlateCount===1?"":"s"} today</Text>
                <Spacer height={3} />
                <Pressable onPress={straightToLogFood} style={{ width: "100%", justifyContent: "center", alignItems: "center"}}>
                    <View style={{backgroundColor: Colors.protein, height: 35, width: "90%", borderRadius: 99999, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: 14, color: "white"}}>Log food for today</Text>
                    </View>
                    
                </Pressable>
            </View>
        </View>

        <View style={{height: 20, alignItems: "flex-end", justifyContent: "flex-end"}}>
            <Image style={{width: 10, height: 10,}} source={RightArrow} />
        </View>


    </View>
  )
}

export default NutritionWidget

const styles = StyleSheet.create({
    container: {

        padding: 10,
        backgroundColor: "#202020",
        borderRadius: 10,
        marginRight: 20,
    },
})