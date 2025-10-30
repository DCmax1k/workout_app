import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '../ThemedView'
import downloadData from '../../util/server/downloadData';
import { useUserStore } from '../../stores/useUserStore';
import ThemedText from '../ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import greyX from '../../assets/icons/greyX.png'

const ViewDownloadedData = ({style, closeScreen, ...props}) => {
    const user = useUserStore(state => state.user);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await downloadData(user);
                if (response.status !== "success") {
                    console.log("Error requesting", response.message);
                    return;
                }
                const data = response.dataToDownload;
                //console.log("Data got back:", data);
                setData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
 
        fetchData();

    }, [])

  return (
    <ThemedView style={[{flex: 1}, style]} {...props}>
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.actionButtons}>
                <View>
                    <Pressable onPress={closeScreen}>
                        <Image style={{height: 50, width: 50}} source={greyX} />
                        {/* <View style={{height: 50, width: 50, justifyContent: "center", alignItems: "center"}}>
                            <Image style={{height: 30, width: 30, tintColor: "grey", transform: [{rotate: "180deg"}]}} source={rightArrow} />
                        </View> */}
                        
                    </Pressable>
                </View>
                <View>
                    {/* <Pressable onPress={openEditWorkout} style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#DB8854", borderRadius: 10, }}>
                        <Text style={{fontSize: 15, color: "white",}}>Edit</Text>
                    </Pressable> */}
                </View>
            </View>
            <ScrollView style={{flex: 1, }} contentContainerStyle={{paddingBottom: 120}}>
                {loading && (
                    <ThemedText>Loading...</ThemedText>
                )}
                {!loading && (
                    <View>
                        {/* <ThemedText>{JSON.stringify(data)}</ThemedText> */}
                        {Object.keys(data).map(key => (
                            <View>
                                <ThemedText style={{fontSize: 18, fontWeight: "800", color: "white"}}>{key}:</ThemedText>
                                <ThemedText style={{fontSize: 12}}>{JSON.stringify(data[key])}:</ThemedText>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
        
    </ThemedView>
  )
}

export default ViewDownloadedData

const styles = StyleSheet.create({
    actionButtons: {
        height: 50,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
})