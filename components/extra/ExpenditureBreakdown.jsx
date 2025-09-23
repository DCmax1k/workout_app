import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedText from '../ThemedText';
import walkerIcon from '../../assets/icons/whiteWalker.png'
import drumstickIcon from '../../assets/icons/drumstick.png'
import dumbbell from '../../assets/tabBarIcons/dumbbell.png'
import zzIcon from '../../assets/icons/zz.png'
import checkIcon from '../../assets/icons/check.png'
import rightArrow from '../../assets/icons/rightArrow.png'
import carrotArrow from '../../assets/icons/carrotArrow.png'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useUserStore } from '../../stores/useUserStore';
import Spacer from '../Spacer';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';

const screenWidth = Dimensions.get('screen').width;

const ExpenditureBreakdown = ({widget}) => {

    const [pageOpen, setPageOpen] = useState(false);
    const [page, setPage] = useState("rest"); // rest, exercise, walk, food
    const pageOffset = useSharedValue(0);
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        if (!pageOpen) {
            pageOffset.value = withSpring(0, { damping: 80 });
        
        } else {
            pageOffset.value = withSpring(-(screenWidth - 40), { damping: 80 });
        }
    }, [pageOpen]);
    
    const pageOffsetStyle = useAnimatedStyle(() => {
    return {
        transform: [{translateX: pageOffset.value}]
    }
    }, [])

    const navigateToHomeProfile = () => {
        router.back();
        router.replace("/dashboard/home");
        setTimeout(() => {
            router.push("/dashboard/home/profile");
        }, 100);
    }
    
    let calResting = false;
    let calExercising = false;
    let calWalkingSteps = false;
    let calFood = false;
    let blockExpenditure = false; 
    if (widget.category === 'expenditure') {
        calResting = widget.calResting;
        calExercising = widget.calExercising;
        calWalkingSteps = widget.calWalkingSteps;
        calFood = widget.calFood;
        blockExpenditure = widget.blockExpenditure;
    }

const calForCurrent = page === 'rest' ? calResting : page === 'exercise' ? calExercising : page === 'walk' ? calWalkingSteps : calFood;
const calTitleForCurrent = page === 'rest' ? "Resting" : page === 'exercise' ? "Exercising" : page === 'walk' ? "Walking steps" : "Digesting food";

  return (
    <View>
        <ThemedText style={{fontSize: 13, fontWeight: '600', marginTop: 20, marginBottom: 10, textAlign: "center"}}>Expenditure contribution breakdown</ThemedText>

            {/* Screen change view */}
            <View style={{width: screenWidth-40, height: 60*4, overflow: "hidden",  backgroundColor: "#3A3A3A",  borderRadius: 10,}}>
                <Animated.View style={[{width: (screenWidth-40)*2, height: 60*4, flexDirection: "row",}, pageOffsetStyle ]}>

                    {/* Main part */}
                    <View style={{width: screenWidth-40, height: 60*4, overflow: "hidden"}}>

                        <Pressable onPress={() => {setPage("rest"); setPageOpen(true)} } style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60, padding: 10}}>
                            {/* Left side */}
                            <View style={{flexDirection: "row", marginRight: 10, alignItems: "center"}}>
                            <View style={{height: 60, width: 30, marginRight: 5, justifyContent: "center", alignItems: "center"}}>
                                <Image source={zzIcon} style={{width: 20, objectFit: "contain", marginTop: -2}} />
                            </View>
                            <View style={{width: screenWidth - 35 - 60 - 40 - 20}}>
                                <Text style={{color: "white", fontSize: 17, fontWeight: '300' }}>Resting</Text>
                                <Text style={{color: "#A5A5A5", fontSize: 12, fontWeight:'300' }}>Energy your body uses just to stay alive</Text>
                            </View>
                            </View>
                            {/* Right side */}
                            <View style={{flexDirection: "row", alignItems: "center", height: "100%", width: 50, justifyContent: "space-between"}}>
                            <View style={{height: 22, width: 22, backgroundColor: calResting ? "#39B141" : "#B13939", borderRadius: 99999, justifyContent: "center", alignItems: "center"}}>
                                {calResting ? (<Image source={checkIcon} style={{height: 15, width: 15, objectFit: "contain", marginTop: -2}} />) : (<Text style={{color: "white", fontWeight: "800", fontSize: 17}}>!</Text>)} 
                            </View>
                            <View style={{height: 22, width: 22, justifyContent: "center", alignItems: "center"}}>
                                <Image source={carrotArrow} style={{height: 13, width: 13, objectFit: "contain", marginTop: -2, transform: [{rotate: "-90deg"}]}} />
                            </View>
                            </View>
                        </Pressable>

                        <Pressable onPress={() => {setPage("exercise"); setPageOpen(true)} } style={{backgroundColor: "#3A3A3A", width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60, padding: 10}}>
                            {/* Left side */}
                            <View style={{flexDirection: "row", marginRight: 10, alignItems: "center"}}>
                            <View style={{height: 60, width: 30, marginRight: 5, justifyContent: "center", alignItems: "center"}}>
                                <Image source={dumbbell} style={{width: 23, objectFit: "contain", marginTop: -2, tintColor: "white"}} />
                            </View>
                            <View style={{width: screenWidth - 35 - 60 - 40 - 20}}>
                                <Text style={{color: "white", fontSize: 17, fontWeight: '300' }}>Exercising</Text>
                                <Text style={{color: "#A5A5A5", fontSize: 12, fontWeight:'300' }}>Calories you burn from completing workouts.</Text>
                            </View>
                            </View>
                            {/* Right side */}
                            <View style={{flexDirection: "row", alignItems: "center", height: "100%", width: 50, justifyContent: "space-between"}}>
                            <View style={{height: 22, width: 22, backgroundColor: calExercising ? "#39B141" : "#B13939", borderRadius: 99999, justifyContent: "center", alignItems: "center"}}>
                                {calExercising === true ? (<Image source={checkIcon} style={{height: 15, width: 15, objectFit: "contain", marginTop: -2}} />) : (<Text style={{color: "white", fontWeight: "800", fontSize: 17}}>!</Text>)} 
                            </View>
                            <View style={{height: 22, width: 22, justifyContent: "center", alignItems: "center"}}>
                                <Image source={carrotArrow} style={{height: 13, width: 13, objectFit: "contain", marginTop: -2, transform: [{rotate: "-90deg"}]}} />
                            </View>
                            </View>
                        </Pressable>

                        <Pressable onPress={() => {setPage("walk"); setPageOpen(true)} } style={{backgroundColor: "#3A3A3A", width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60, padding: 10}}>
                            {/* Left side */}
                            <View style={{flexDirection: "row", marginRight: 10, alignItems: "center"}}>
                            <View style={{height: 60, width: 30, marginRight: 5, justifyContent: "center", alignItems: "center"}}>
                                <Image source={walkerIcon} style={{height: 25, objectFit: "contain", marginTop: -2}} />
                            </View>
                            <View style={{width: screenWidth - 35 - 60 - 40 - 20}}>
                                <Text style={{color: "white", fontSize: 17, fontWeight: '300' }}>Walking steps</Text>
                                <Text style={{color: "#A5A5A5", fontSize: 12, fontWeight:'300' }}>Calories you burn through everyday movements.</Text>
                            </View>
                            </View>
                            {/* Right side */}
                            <View style={{flexDirection: "row", alignItems: "center", height: "100%", width: 50, justifyContent: "space-between"}}>
                            <View style={{height: 22, width: 22, backgroundColor: calWalkingSteps ? "#39B141" : "#B13939", borderRadius: 99999, justifyContent: "center", alignItems: "center"}}>
                                {calWalkingSteps === true ? (<Image source={checkIcon} style={{height: 15, width: 15, objectFit: "contain", marginTop: -2}} />) : (<Text style={{color: "white", fontWeight: "800", fontSize: 17}}>!</Text>)} 
                            </View>
                            <View style={{height: 22, width: 22, justifyContent: "center", alignItems: "center"}}>
                                <Image source={carrotArrow} style={{height: 13, width: 13, objectFit: "contain", marginTop: -2, transform: [{rotate: "-90deg"}]}} />
                            </View>
                            </View>
                        </Pressable>

                        <Pressable onPress={() => {setPage("food"); setPageOpen(true)} } style={{backgroundColor: "#3A3A3A", width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60, padding: 10}}>
                            {/* Left side */}
                            <View style={{flexDirection: "row", marginRight: 10, alignItems: "center"}}>
                            <View style={{height: 60, width: 30, marginRight: 5, justifyContent: "center", alignItems: "center"}}>
                                <Image source={drumstickIcon} style={{height: 18, width: 18, objectFit: "contain", marginTop: -2}} />
                            </View>
                            <View style={{width: screenWidth - 35 - 60 - 40 - 20}}>
                                <Text style={{color: "white", fontSize: 17, fontWeight: '300' }}>Digesting food</Text>
                                <Text style={{color: "#A5A5A5", fontSize: 12, fontWeight:'300' }}>Calories your body uses to digest, absorb, and process the food you eat.</Text>
                            </View>
                            </View>
                            {/* Right side */}
                            <View style={{flexDirection: "row", alignItems: "center", height: "100%", width: 50, justifyContent: "space-between"}}>
                            <View style={{height: 22, width: 22, backgroundColor: calFood ? "#39B141" : "#B13939", borderRadius: 99999, justifyContent: "center", alignItems: "center"}}>
                                {calFood === true ? (<Image source={checkIcon} style={{height: 15, width: 15, objectFit: "contain", marginTop: -2}} />) : (<Text style={{color: "white", fontWeight: "800", fontSize: 17}}>!</Text>)} 
                            </View>
                            <View style={{height: 22, width: 22, justifyContent: "center", alignItems: "center"}}>
                                <Image source={carrotArrow} style={{height: 13, width: 13, objectFit: "contain", marginTop: -2, transform: [{rotate: "-90deg"}]}} />
                            </View>
                            </View>
                        </Pressable>

                    </View>

                    {/* Second page */}
                    <View style={{width: screenWidth-40, height: 60*4, alignItems: "center", position: "relative", padding: 20}}>
                        <Pressable style={{position: "absolute", top: 10, left: 20, width: 20}} onPress={() => setPageOpen(false)}>
                            <Image source={rightArrow} style={{width: 20, objectFit: "contain", transform: [{rotate: "180deg"}]}} />
                        </Pressable>
                        <View style={{width: "100%", flexDirection: "row", alignItems: 'center', justifyContent: "center" }}>
                            <View style={{height: 22, width: 22, backgroundColor: calForCurrent ? "#39B141" : "#B13939", borderRadius: 99999, justifyContent: "center", alignItems: "center", marginRight: 5}}>
                                {calForCurrent === true ? (<Image source={checkIcon} style={{height: 15, width: 15, objectFit: "contain", marginTop: -2}} />) : (<Text style={{color: "white", fontWeight: "800", fontSize: 17}}>!</Text>)} 
                            </View>
                            <ThemedText style={{color: "white", fontSize: 17, fontWeight: '300' }}>{calTitleForCurrent}</ThemedText>
                        </View>
                        {page === 'rest' && (
                            <View style={{padding: 20,}}>
                                {calForCurrent ? (
                                    <View>
                                        <ThemedText style={{textAlign: "center", fontSize: 13}}>
                                            Expenditure is activly calculating and contributing calories burned from your step count daily.
                                        </ThemedText>
                                    </View>
                                ) : (
                                    <View>
                                        <ThemedText style={{textAlign: "center", fontSize: 13}}>
                                            Expenditure is not currently tracking your resting energy usage. Calculations for this metric require your weight, height, gender, and age.
                                        </ThemedText>
                                        <Spacer height={20} />
                                        <Pressable onPress={navigateToHomeProfile} style={{height: 40, backgroundColor: Colors.primaryBlue, padding: 10, borderRadius: 10}}>
                                            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 15, textAlign: "center", color:  "white"}}>Go to Profile &gt; Health</Text>
                                        </Pressable>
                                    </View>
                                )}
                            </View>
                        )}
                        {page === 'exercise' && (
                            <View style={{padding: 20,}}>
                                {calForCurrent ? (
                                    <View>
                                        <ThemedText style={{textAlign: "center", fontSize: 13}}>
                                            Expenditure is activly calculating and contributing calories burned from completing workouts.
                                        </ThemedText>
                                    </View>
                                ) : (
                                    <View>
                                        <ThemedText style={{textAlign: "center", fontSize: 13}}>
                                            Expenditure is not currently tracking calories burned from workouts. Calculations for this metric require your weight.
                                        </ThemedText>
                                        <Spacer height={20} />
                                        <Pressable onPress={navigateToHomeProfile} style={{height: 40, backgroundColor: Colors.primaryBlue, padding: 10, borderRadius: 10}}>
                                            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 15, textAlign: "center", color:  "white"}}>Go to Profile &gt; Health</Text>
                                        </Pressable>
                                    </View>
                                )}
                            </View>
                        )}
                        {page === 'walk' && (
                            <View style={{padding: 20,}}>
                                {calForCurrent ? (
                                    <View>
                                        <ThemedText style={{textAlign: "center", fontSize: 13}}>
                                            Expenditure is activly calculating and contributing calories burned from your daily step count.
                                        </ThemedText>
                                    </View>
                                ) : (
                                    <View>
                                        <ThemedText style={{textAlign: "center", fontSize: 13}}>
                                            Expenditure is not currently tracking your daily step count. Calculations for this metric require your weight, and allowed access to your step count.
                                        </ThemedText>
                                        <Spacer height={20} />
                                        {/* <Pressable onPress={navigateToHomeProfile} style={{height: 40, backgroundColor: Colors.primaryBlue, padding: 10, borderRadius: 10}}>
                                            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 15, textAlign: "center", color:  "white"}}>Go to Profile &gt; Health</Text>
                                        </Pressable> */}
                                        <ThemedText style={{textAlign: "center", fontSize: 13}}>
                                            This feature is coming soon!
                                        </ThemedText>
                                    </View>
                                    
                                )}
                            </View>
                        )}
                        {page === 'food' && (
                            <View style={{padding: 20,}}>
                                {calForCurrent ? (
                                    <View>
                                        <ThemedText style={{textAlign: "center", fontSize: 13}}>
                                            Expenditure is activly calculating and contributing calories burned from your food digestion.
                                        </ThemedText>
                                    </View>
                                ) : (
                                    <View>
                                        <ThemedText style={{textAlign: "center", fontSize: 13}}>
                                            Expenditure is not currently tracking your digestion of food.
                                        </ThemedText>
                                        <Spacer height={20} />
                                        <ThemedText style={{textAlign: "center", fontSize: 13}}>
                                            This feature is coming soon!
                                        </ThemedText>
                                    </View>
                                )}
                            </View>
                        )}
                        
                        
                    </View>
                </Animated.View>
            </View>
            

            
        </View>
  )
}

export default ExpenditureBreakdown

const styles = StyleSheet.create({})