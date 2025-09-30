import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../../components/ThemedView'
import ConfirmMenu from '../../components/ConfirmMenu'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import { useUserStore } from '../../stores/useUserStore'
import { BottomSheetHandle } from '@gorhom/bottom-sheet'
import Animated from 'react-native-reanimated'
import { truncate } from '../../util/truncate'
import doubleCarrot from '../../assets/icons/doubleCarrot.png'
import { Colors } from '../../constants/Colors'

const EditPlate = ({closeSheet, animatedHeaderOpacity, animatedButtonsOpacity, animatedLeftButtonTransform, animatedRightButtonTransform, handleSnapPress}) => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const plate = user.editActivePlate ?? {name: "New Plate", id: 0, foodIds: [] };

    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState({
            title: "The title",
            subTitle: "The description for the confirmation",
            subTitle2: "Another one here",
            option1: "Update",
            
            option2: "Cancel",
            confirm: () => {},
        });

        const requestDiscardPlate = () => {
            setConfirmMenuData({
                title: "Discard Plate?",
                subTitle: "Any items added to your plate",
                subTitle2: "will not be saved.",
                option1: "Confirm Discard",
                option1color: "#DB5454",
                option2: "Go back",
                confirm: discardPlate,
            });
            setConfirmMenuActive(true);
        }
        const discardPlate = () => {
            closeSheet();
            setTimeout(() => {
                updateUser({editActivePlate: null})
            }, 100)
            
        }

    return (
        <ThemedView style={{flex: 1, backgroundColor: "#313131"}}>
            <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
            
            <BottomSheetHandle indicatorStyle={{backgroundColor: "transparent"}} style={{height: 120,}}>
                {/* Buttons if sheet is open */}
                <Animated.View style={[{flexDirection: "row", justifyContent: "space-between", position: "absolute", left: 0, top: 0, right: 0, paddingHorizontal: 10, zIndex: 1, elevation: 1}, animatedButtonsOpacity ]}>
                    <Animated.View style={animatedLeftButtonTransform}>
                        <Pressable onPress={() => {}} style={{backgroundColor: "#5A5A5A", paddingVertical: 15, paddingHorizontal: 20, borderRadius: 10}}>
                            <Text style={styles.text}>Save as meal</Text>
                        </Pressable>
                    </Animated.View>
                    
                    <Animated.View style={animatedRightButtonTransform}>
                        <Pressable onPress={() => {}} style={{backgroundColor: "#DB5456", paddingVertical: 15, paddingHorizontal: 20, borderRadius: 10}}>
                            <Text style={styles.text}>Log Foods</Text>
                        </Pressable>
                    </Animated.View>
                    
                </Animated.View>
                {/* Header if sheet lowered */}
                <Animated.View style={[{position: "absolute", left: 0, top: 0, right: 0, paddingHorizontal: 20, marginTop: 10, flexDirection: "row", justifyContent: "space-between",  }, animatedHeaderOpacity]}>
                    <View style={{height: "100%", justifyContent: "center"}}>
                        <Text style={[styles.text, {color: "#FF7072"}]}>{truncate(plate.name, 30)}</Text>
                        <Text style={{fontSize: 14, color: "#939393"}}>{plate.foodIds.length} item{plate.foodIds.length === 1 ? "":"s"} added</Text>
                    </View>
                    <View style={{height: "100%", justifyContent: "center"}}>
                        <Pressable onPress={() => handleSnapPress(1)} style={{flexDirection: "row"}}>
                            <Image source={doubleCarrot} style={{height: 20, width: 20, objectFit: "contain", marginRight: 10, marginBottom: -3}} />
                            <Text style={[styles.text, {fontWeight: "300"}]}>Add more</Text>
                        </Pressable>
                        
                    </View>

                </Animated.View>
            </BottomSheetHandle>

            <Animated.View style={[{alignItems: "center"}, animatedButtonsOpacity]}>
                <Pressable onPress={requestDiscardPlate} style={{padding: 20, backgroundColor: Colors.primaryBlue, borderRadius: 10}}>
                    <ThemedText>Discard</ThemedText>
                </Pressable>
            </Animated.View>
            

        </ThemedView>
    )
}

export default EditPlate

const styles = StyleSheet.create({
    text: {
        color: "white",
        fontSize: 15,
        fontWeight: 600,
    },
})