import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../../components/ThemedView'
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import TitleWithBack from '../../components/TitleWithBack';
import Calender from '../../components/Calender';
import Spacer from '../../components/Spacer';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import ConfirmMenu from '../../components/ConfirmMenu';
import rotate from '../../assets/icons/rotate.png'
import trash from '../../assets/icons/trash.png'
import { useUserStore } from '../../stores/useUserStore';
import formatTime from '../../util/formatTime';
import ActionMenu from '../../components/ActionMenu';

const firstCapital = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const EditPastData = () => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const params = useLocalSearchParams();
    const data = JSON.parse(params.data);

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState();

    const requestResetData = () => {
        setConfirmMenuData({
            title: "Reset data?",
            subTitle: "All data from the category \"" + firstCapital(data.widget.category) + "\" will be erased!",
            subTitle2: "",
            option1: "Confirm reset",
            option1color: "#DB5454",
            option2: "Go back",
            confirm: () => restData(),
        });
        setConfirmMenuActive(true);
    }

    const restData = () => {
        updateUser({tracking: {logging: {[data.widget.category]: {data: []}}}});
    }

    const deleteData = (timeOfData) => {
        const dataa = user.tracking.logging[data.widget.category].data;
        const ind = dataa.findIndex(d => d.date === timeOfData);
        const newData = JSON.parse(JSON.stringify(dataa));
        newData.splice(ind, 1);
        updateUser({tracking: {logging: {[data.widget.category]: {data: newData}}}});
    }

    const w = user.tracking.logging[data.widget.category] || null;
    if (!w) return null;

    const dataEntriesOnDate = w.data.filter(k => new Date(k.date).toDateString() === selectedDate.toDateString());

  return (
    <ThemedView style={[styles.container, ]}>
        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
        <SafeAreaView style={{flex: 1, marginBottom: -50}}>
            <TitleWithBack title={"Edit " + data.title} style={{marginHorizontal: -20}} actionBtn={{actionMenu: true, image: require("../../assets/icons/threeEllipses.png"), options: [ {title: "Reset data", icon: rotate, onPress: () => requestResetData(),}]}} />

            <Spacer height={20} />

            
            <Calender datesWithData={w.data.map((item) => item.date)} set={setSelectedDate} />

            <Spacer height={20} />
            <View style={{width: "50%", height: 2, borderRadius: 999, backgroundColor: "#AAAAAA", marginHorizontal: "auto"}}></View>
            <ScrollView  layout={LinearTransition.springify().damping(90)} contentContainerStyle={{paddingBottom: 120, paddingTop: 30, alignItems: "center"}} showsVerticalScrollIndicator={false}>
                <Spacer height={20} />

                
                {dataEntriesOnDate.map((entry, i) => {
                    return (
                    <Animated.View layout={LinearTransition.springify().damping(90)} entering={FadeIn} exiting={FadeOut} key={i} style={{flexDirection: "row", alignItems: "center", padding: 5, width: "100%", backgroundColor: "#5C5C5C", borderRadius: 10, marginBottom: 10}}>
                        <View style={{paddingHorizontal: 10, paddingVertical: 15, backgroundColor: "#546FDB", borderRadius: 10, marginRight: 10}}>
                            <Text style={{color: "white", fontSize: 18, fontWeight: "800"}}>{entry.amount}</Text>
                        </View>
                        <Text style={{color: "white", fontSize: 14, fontWeight: "800"}}>{formatTime(entry.date)}</Text>
                        <View style={{flex: 1}}></View>
                        <ActionMenu data={[
                            {title: "Delete data point", icon: trash, onPress: () => deleteData(entry.date), },
                            ]} />
                    </Animated.View>)
                })}




            </ScrollView>
        </SafeAreaView>
        
    </ThemedView>
  )
}

export default EditPastData

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
})