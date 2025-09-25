import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import noEye from '../../assets/icons/noEye.png'
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

const screenWidth = Dimensions.get("screen").width;

const Nutrition = () => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState();

    const params = useLocalSearchParams();
    useEffect(() => {
        if (params.data === "straighToLogFood") {
            // May want a setTimeout because it goes instant
            //showComingSoonMessage();
        }
    }, [])

    const pageSwiperRef = useRef(null);

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

    const calorieData = [3454, 3453, 1345, 2346, 4442, 3654, 1346, 2345, 5234, 1160];
    const calorieDates = [Date.now(), Date.now(), Date.now(), Date.now(), Date.now(), Date.now(), Date.now(), Date.now(), Date.now(), Date.now(),];
    const colorieGoal = user.tracking.nutrition["calories"].extraData.goal;

    const proteinCount = 124;
    const proteinGoal = user.tracking.nutrition["protein"].extraData.goal;
    const carbCount = 134;
    const carbGoal = user.tracking.nutrition["carbs"].extraData.goal;
    const fatCount = 34;
    const fatGoal = user.tracking.nutrition["fat"].extraData.goal;

    const todaysConsumptionHistory = [];

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

    return (
        <ThemedView style={styles.container}>
            <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
            <SafeAreaView style={{flex: 1, width: "100%",  marginBottom: -50, position: "relative"}}>
                <TitleWithBack title={"Nutrition"} actionBtn={{actionMenu: false, image: require("../../assets/icons/threeEllipses.png"), options: menuOptions}} />
                <Spacer height={20} />

                {/* Floating footer button */}
                <View style={{position: "absolute", left: 0, bottom: 80, width: screenWidth, alignItems: "center"}}>
                    <Pressable onPress={showComingSoonMessage} style={{paddingVertical: 20, paddingHorizontal: 40, backgroundColor: Colors.protein, borderRadius: 9999999, zIndex: 1, elevation: 1}}>
                        <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>Log food for today</Text>
                    </Pressable>
                </View>

                <ScrollView contentContainerStyle={{paddingBottom: 120}}  showsVerticalScrollIndicator={false}>
                    <View style={{paddingHorizontal: 20}}>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-end"}}>
                            <Text style={{color: "#B4B4B4", fontSize: 15, marginRight: 20}}>Calorie Target</Text>
                            <Pressable onPress={() => {pressTarget("calories")}} style={{backgroundColor: "#353535", borderRadius: 10, flexDirection: "row", padding: 10}}>
                                <Text style={{color: "white", fontSize: 13, fontWeight: "800"}}>{colorieGoal}</Text>
                            </Pressable>
                        
                        </View>
                    </View>

                    
                    <Spacer height={10} />
                    <PageSwiper ref={pageSwiperRef} width={screenWidth} height={215} >
                        <View style={{height: 185, width: pageSwipeWidth}}>
                            <GraphWidget
                                fillWidth={true}
                                data={calorieData}
                                dates={calorieDates}
                                title={"Energy Intake"}
                                subtitle={"Last 30 days"}
                                unit={"/" + colorieGoal + " calories"}
                                color={"#546FDB"}
                                disablePress={true}
                                style={[styles.widgetCont, { height: 185}]}
                                titleStyles={{fontWeight: "800", color: "white", fontSize: 16, marginBottom: -3}}
                                hideFooter={true}
                                animationDuration={1000}
                            />
                        </View>
                        <View style={{height: 185, width: pageSwipeWidth}}>
                            <ThemedText style={{flex: 1, textAlign: "center", padding: 10}}>oh hey there... this is awkward, nothing here yet</ThemedText>
                            <Spacer height={10} />
                            <ThemedText style={{flex: 1, textAlign: "center", padding: 10}}>how about lets pretend you see the energy balance graph here</ThemedText>
                        </View>
                        
                    </PageSwiper>
                    <Spacer height={20} />
                    
                    <View style={{paddingHorizontal: 20}}>
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
                        <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                            <ThemedText style={ [{fontSize: 15, fontWeight: "700"}]} >Todays Consumption</ThemedText>
                            <Pressable onPress={showComingSoonMessage} style={{}}>
                                <ThemedText style={{textAlign: "center", textDecorationLine: "underline"}}>View history</ThemedText>
                            </Pressable>
                        </View> 
                        
                        {todaysConsumptionHistory.length === 0 && (
                            <ThemedText style={{paddingHorizontal: 50, paddingVertical: 20, textAlign: "center"}}>Find meals you eat today here!</ThemedText>
                        )}

                        


                    </View>
                    

                </ScrollView>
                


            </SafeAreaView>
        </ThemedView>
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