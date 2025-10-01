import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'
import greyX from '../../assets/icons/greyX.png'
import { Colors } from '../../constants/Colors'
import plus from '../../assets/icons/plus.png'
import ThemedText from '../ThemedText'

const AddFood = ({setFoodModal, foodModal, addFood}) => {

    const [foodToAdd, setFoodToAdd] = useState([]); // food ids

    const tabs = ["Scan", "Library", "AI"];
    const [tab, setTab] = useState(tabs[1]);

    const requestAddFood = () => {
        if (foodToAdd.length < 1) return;
        //addFood(foodToAdd);
        setFoodModal(false);
        setFoodToAdd([]);
    }

  return (
    <ThemedView style={{flex: 1, padding: 20}}>
        <SafeAreaView>

            <View style={[styles.actionButtons]}>
                <View>
                    <Pressable onPress={() => setFoodModal(false)}>
                        <Image style={{height: 50, width: 50}} source={greyX} />
                    </Pressable>
                </View>
                <View style={{zIndex: 1}}>
                    <Pressable onPress={requestAddFood} style={{paddingHorizontal: 10, paddingVertical: 10, backgroundColor: foodToAdd.length < 1 ? "grey":Colors.primaryBlue, borderRadius: 10, flexDirection: 'row', alignItems: 'center'}}>
                        <Image style={{height: 20, width: 20, marginRight: 5}} source={plus} />
                        <Text style={{fontSize: 20, color: "white", fontWeight: 700}}>{foodToAdd.length}</Text>
                    </Pressable>
                </View>
            </View>

            <View style={[styles.header]}>
                <ThemedText title={true} style={{fontSize: 23, fontWeight: 700, textAlign: "center"}}>Add Food</ThemedText>
            </View>



        </SafeAreaView>

    </ThemedView>
  )
}

export default AddFood

const styles = StyleSheet.create({
    actionButtons: {
        height: 50,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    header: {
        marginBottom: 10,
        fontSize: 15,
        fontWeight: 600
    },
})