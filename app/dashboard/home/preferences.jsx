import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../../../components/ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'
import TitleWithBack from '../../../components/TitleWithBack'
import ThemedText from '../../../components/ThemedText'
import Spacer from '../../../components/Spacer'
import SectionSelect from '../../../components/SectionSelect'
import { Colors } from '../../../constants/Colors'
import { useUserStore } from '../../../stores/useUserStore'

const MultiOption = ({options=[{label: "one", onPress: ()=>{}}, {label: "two", onPress: ()=>{}}, {label: "three", onPress: ()=>{}}], activeIndex}) => {
    return (
        <View style={{flexDirection: "row", alignItems: "center", borderColor: Colors.primaryBlue, borderWidth: 1, borderRadius: 10, overflow: "hidden"}}>
            {options.map((item, i) => {
                return (
                    <Pressable key={i} onPress={item.onPress} style={{backgroundColor: activeIndex===i ? Colors.primaryBlue : "transparent", }}>
                        <ThemedText style={{paddingHorizontal: 20, fontWeight: "800", paddingVertical: 10, fontSize: 15, borderLeftColor: Colors.primaryBlue, borderLeftWidth: i === 0 ? 0 : 1 }}>{item.label}</ThemedText>
                    </Pressable>
                    
                )
            })}

          
        </View>
    )
}

const ToggleSwitch = (onToggle) => {
    return (
        <View>

        </View>
    )
}

const PreferencesPage = () => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const restTimerAmount = user.extraDetails.preferences.restTimerAmount;
    const restTimerIndexActive = restTimerAmount < 0 ? 0 : restTimerAmount === 0 ? 1 : 2;

  return (
    <ThemedView style={{flex: 1}}>
      <SafeAreaView>
        <TitleWithBack title={"Preferences"} />
        <Spacer />
        <View style={{paddingHorizontal: 20, gap: 10}}>
            <ThemedText title={true} style={{fontSize: 17, fontWeight: 700,}}>Workouts</ThemedText>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",}}>
                <ThemedText style={{fontSize: 17, fontWeight: 700, }}>Rest Timer</ThemedText>
                <MultiOption
                    options={[
                        {label: "Off", onPress: ()=>{updateUser({extraDetails: {preferences: {restTimerAmount: -1}}})}},
                        {label: "Up", onPress: ()=>{updateUser({extraDetails: {preferences: {restTimerAmount: 0}}})}},
                        {label: 120 + "s", onPress: ()=>{updateUser({extraDetails: {preferences: {restTimerAmount: 120}}})}},
                    ]}
                    activeIndex={restTimerIndexActive}
                />
            </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  )
}

export default PreferencesPage

const styles = StyleSheet.create({})