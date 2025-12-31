import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import ThemedView from '../../../components/ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'
import TitleWithBack from '../../../components/TitleWithBack'
import ThemedText from '../../../components/ThemedText'
import Spacer from '../../../components/Spacer'
import SectionSelect from '../../../components/SectionSelect'
import { Colors } from '../../../constants/Colors'
import { useUserStore } from '../../../stores/useUserStore'
import Animated, { Easing, interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics';
import sendData from '../../../util/server/sendData'
import { useBottomSheet } from '../../../context/BottomSheetContext'

const MultiOption = ({options=[{label: "one", onPress: ()=>{}}, {label: "two", onPress: ()=>{}}, {label: "three", onPress: ()=>{}}], activeIndex}) => {
    return (
        <View style={{flexDirection: "row", alignItems: "center", borderColor: Colors.primaryBlue, borderWidth: 1, borderRadius: 10, overflow: "hidden"}}>
            {options.map((item, i) => {
                return (
                    <Pressable key={i} onPress={() => {Haptics.selectionAsync(); item.onPress();}} style={{backgroundColor: activeIndex===i ? Colors.primaryBlue : "transparent", }}>
                        <ThemedText style={{paddingHorizontal: 20, fontWeight: "800", paddingVertical: 10, fontSize: 15, borderLeftColor: Colors.primaryBlue, borderLeftWidth: i === 0 ? 0 : 1 }}>{item.label}</ThemedText>
                    </Pressable>
                    
                )
            })}

          
        </View>
    )
}

const ToggleSwitch = ({handleToggle, isActive}) => {
    const progress = useSharedValue(isActive ? 1 : 0);

    useEffect(() => {
        progress.value = withTiming(isActive ? 1 : 0, { 
            duration: 150, // Reduced for snappiness
            easing: Easing.out(Easing.quad), // Fast start, smooth finish
        });
    }, [isActive]);

    const animatedContainerStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            ["#6D6969", Colors.primaryBlue]
        );
        return { backgroundColor };
    });

    const animatedCircleStyle = useAnimatedStyle(() => {
        return {
            left: 3 + (progress.value * 30),
        };
    });

    const preHandleToggle = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        handleToggle();
    }

    return (
        <Pressable onPress={preHandleToggle}>
            <Animated.View 
                style={[
                    {
                        position: "relative", 
                        height: 40, 
                        width: 70, 
                        borderRadius: 9999,
                        justifyContent: 'center'
                    }, 
                    animatedContainerStyle
                ]}
            >
                <Animated.View 
                    style={[
                        {
                            position: "absolute", 
                            height: 34, 
                            width: 34, 
                            top: 3, 
                            backgroundColor: "white", 
                            borderRadius: 9999,
                            // Adding a subtle shadow makes the snap look more tactile
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.15,
                            shadowRadius: 2.5,
                            elevation: 2,
                        }, 
                        animatedCircleStyle
                    ]} 
                />
            </Animated.View>
        </Pressable>
    );
};

const PreferencesPage = () => {
    const {showAlert} = useBottomSheet();
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);
    const prefs = user.extraDetails.preferences;

    const restTimerAmount = prefs.restTimerAmount;
    const restTimerIndexActive = restTimerAmount < 0 ? 0 : restTimerAmount === 0 ? 1 : 2;

    const weightLiftIndex = prefs.liftUnit === "imperial" ? 0 : 1;
    const heightIndex = prefs.heightUnit === "imperial" ? 0 : 1;
    const distanceIndex = prefs.distanceUnit === "imperial" ? 0 : 1;


    const setPref = async (key, value) => {
        updateUser({extraDetails: {preferences: {[key]: value}}});
        // Update in db
        const response = await sendData('/dashboard/setpreference', {key, value, jsonWebToken: user.jsonWebToken});
        if (response.status !== "success") {
            return showAlert(response.message, false);
        }
    }

  return (
    <ThemedView style={{flex: 1}}>
      <SafeAreaView>
        <TitleWithBack title={"Preferences"} />
        <Spacer height={20} />
        {/* Weight/distance/height */}
        <Spacer height={20} bar={true} width='90%' />
        <View style={{paddingHorizontal: 20, gap: 10, paddingTop: 10}}>
            <ThemedText title={true} style={{fontSize: 17, fontWeight: 700,}}>Units</ThemedText>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",}}>
                <ThemedText style={{fontSize: 17, fontWeight: 400, }}>Weight Lift</ThemedText>
                <MultiOption
                    options={[
                        {label: "lb", onPress: ()=>{setPref("liftUnit", "imperial")}},
                        {label: "kg", onPress: ()=>{setPref("liftUnit", "metric")}},
                    ]}
                    activeIndex={weightLiftIndex}
                />
            </View>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",}}>
                <ThemedText style={{fontSize: 17, fontWeight: 400, }}>Distance</ThemedText>
                <MultiOption
                    options={[
                        {label: "mi", onPress: ()=>{setPref("distanceUnit", "imperial")}},
                        {label: "km", onPress: ()=>{setPref("distanceUnit", "metric")}},
                    ]}
                    activeIndex={distanceIndex}
                />
            </View>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",}}>
                <ThemedText style={{fontSize: 17, fontWeight: 400, }}>Height</ThemedText>
                <MultiOption
                    options={[
                        {label: "in", onPress: ()=>{setPref("heightUnit", "imperial")}},
                        {label: "cm", onPress: ()=>{setPref("heightUnit", "metric")}},
                    ]}
                    activeIndex={heightIndex}
                />
            </View>
            <Spacer height={20} bar={true} width='100%' />    
            {/* Workouts */}
            <ThemedText title={true} style={{fontSize: 17, fontWeight: 700,}}>Workouts</ThemedText>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",}}>
                <ThemedText style={{fontSize: 17, fontWeight: 400, }}>Rest Timer</ThemedText>
                <MultiOption
                    options={[
                        {label: "Off", onPress: ()=>{setPref("restTimerAmount", -1)}},
                        {label: "Up", onPress: ()=>{setPref("restTimerAmount", 0)}},
                        {label: 120 + "s", onPress: ()=>{setPref("restTimerAmount", 120)}},
                    ]}
                    activeIndex={restTimerIndexActive}
                />
            </View>
            <Spacer height={20} bar={true} width='100%' /> 
            {/* Sharing */}
            <ThemedText title={true} style={{fontSize: 17, fontWeight: 700,}}>Sharing</ThemedText>
            <View style={{flexDirection: "row", justifyContent: "flex-start", gap: 10, alignItems: "center",}}>
                <ToggleSwitch isActive={prefs.workouts} handleToggle={() => setPref("workouts", !prefs.workouts)} />
                <ThemedText style={{fontSize: 17, fontWeight: 400, }}>Workouts</ThemedText>
            </View>






        </View>
        

      </SafeAreaView>
    </ThemedView>
  )
}

export default PreferencesPage

const styles = StyleSheet.create({})