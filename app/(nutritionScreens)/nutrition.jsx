import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
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

const screenWidth = Dimensions.get("screen").width;

const Nutrition = () => {
    const user = useUserStore(state => state.user);

    const menuOptions = [{title: "Hide widget", icon: noEye, onPress: () => console.log(""),}]

    const calorieData = [34, 3, 2345, 2346, 2, 26, 2346, 2345, 5234, 5];
    const calorieDates = [Date.now(), Date.now(), Date.now(), Date.now(), Date.now(), Date.now(), Date.now(), Date.now(), Date.now(), Date.now(),];
    const colorieGoal = user.tracking.nutrition["calories"].extraData.goal;

    const proteinCount = 124;
    const proteinGoal = 234;
    const carbCount = 134;
    const carbGoal = 300;
    const fatCount = 34;
    const fatGoal = 78;

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={{flex: 1,  marginBottom: -50}}>
                <TitleWithBack title={"Nutrition"} style={{marginLeft: -20}} actionBtn={{actionMenu: false, image: require("../../assets/icons/threeEllipses.png"), options: menuOptions}} />
                <Spacer height={20} />
                <ScrollView contentContainerStyle={{paddingBottom: 120}}  showsVerticalScrollIndicator={false}>

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

                    <Spacer />
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
                                <Pressable style={{backgroundColor: "#353535", borderRadius: 10, flexDirection: "row", padding: 10}}>
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
                                <Pressable style={{backgroundColor: "#353535", borderRadius: 10, flexDirection: "row", padding: 10}}>
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
                                <Pressable style={{backgroundColor: "#353535", borderRadius: 10, flexDirection: "row", padding: 10}}>
                                    <Text style={{color: "white", fontSize: 13, fontWeight: "800"}}>{fatGoal}</Text>
                                    <Text style={{color: "#6B6B6B", fontSize: 12, marginLeft: 3}}>{"g"}</Text>
                                </Pressable>
                                <Spacer height={5} />
                                <Text style={{color: "#B4B4B4", fontSize: 10, marginBottom: 10}}>Target</Text>
                            </View>
                            
                        </View>
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
        paddingHorizontal: 20,
    },

    widgetCont: {
        backgroundColor: '#202020',
        borderRadius: 20,
    }
})