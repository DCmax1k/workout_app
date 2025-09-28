import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../../components/ThemedView'
import ConfirmMenu from '../../components/ConfirmMenu'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import { useUserStore } from '../../stores/useUserStore'

const EditPlate = () => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState({
            title: "The title",
            subTitle: "The description for the confirmation",
            subTitle2: "Another one here",
            option1: "Update",
            
            option2: "Cancel",
            confirm: () => {},
        });

    return (
        <ThemedView style={{flex: 1, padding: 20}}>
            <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
            <SafeAreaView style={{flex: 1, marginBottom: -50}}>
                <Pressable onPress={() => router.back()}>
                    <ThemedText>Save and go back</ThemedText>
                </Pressable>
                <Spacer />
                <Pressable onPress={() =>{updateUser({editActivePlate: null}); router.back()}}>
                    <ThemedText>Delete</ThemedText>
                </Pressable>
            </SafeAreaView>
        </ThemedView>
    )
}

export default EditPlate

const styles = StyleSheet.create({})