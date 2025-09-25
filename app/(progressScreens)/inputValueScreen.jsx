import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import ThemedView from '../../components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import TitleWithBack from '../../components/TitleWithBack';
import Spacer from '../../components/Spacer';
import HorizontalScrollInput from '../../components/HorizontalScrollInput';
import { Colors } from '../../constants/Colors';
import emitter from '../../util/eventBus';

const screenHeight = Dimensions.get('screen').height;

const round1 = num => Math.round(num * 10) / 10;

const firstCapital = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const InputValueScreen = () => {

    const params = useLocalSearchParams();
    const data = JSON.parse(params.data);

    //const [value, setValue] = useState(round1(data.value));
    const [value, setValue] = useState(parseFloat(`${round1(data.value)}`));

    const saveValue = () => {
        emitter.emit("done", { ...data, value });
        router.back();
    }

    // Example data
    // const data = {
    //     title: "Title",
    //     value: 180,
    //     increment: 1,
    //     range: [0, 1000],
    //     unit: 'lbs',
    // }

  return (
    <ThemedView style={{flex: 1, height: screenHeight, position: "relative"}}>
        <SafeAreaView style={{flex: 1}}>
            <TitleWithBack title={firstCapital(data.title || "")} />
            <Spacer />
            <HorizontalScrollInput initialValue={data.value} value={value} setValue={setValue} increment={data.increment} range={data.range} unit={data.unit} scrollItemWidth={data.scrollItemWidth || 10} />

            <View style={{position: "absolute", bottom: 30, left: 0, right: 0, height: 80, backgroundColor: Colors.primaryBlue,}}>
                <Pressable onPress={saveValue} style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: 18, fontWeight: '600', color: "white"}}>Save</Text>
                </Pressable>    
            </View>
        </SafeAreaView> 
    </ThemedView>
  )
}

export default InputValueScreen

const styles = StyleSheet.create({})