import { Alert, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import BlueButton from '../../../components/BlueButton'
import { router } from 'expo-router'
import { useUserStore } from '../../../stores/useUserStore'
import { SafeAreaView } from 'react-native-safe-area-context'
import GraphWidget from '../../../components/GraphWidget'
import Spacer from '../../../components/Spacer'
import plusIcon from '../../../assets/icons/plus.png'
import { Colors } from '../../../constants/Colors'


const screenWidth = Dimensions.get('window').width;

const IndexProgress = () => {
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  if (!user.tracking) {
    updateUser({progress: {sections: []}});
  }

  const openProgressExpanded = () => {
    // Open progress expanded view
    router.push('/dashboard/progress/progressExpanded')
  }

  console.log(user.tracking);


  return (
    <ThemedView style={styles.container}>

        {/* <View style={{position: "absolute", top: 200, left: "50%", transform: [{translateX: "-50%"}], paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "rgb(20, 20, 20)", zIndex: 10, borderRadius: 20}}>
          <Text style={{color: "white", fontSize: 20, fontWeight: 600}}>Coming soon!</Text>
        </View> */}

        <SafeAreaView style={{flex: 1}}>
          <ScrollView contentContainerStyle={{paddingBottom: 120}} showsVerticalScrollIndicator={false}>

            <ThemedText style={[styles.header, {marginTop: 20, fontSize: 20,  textAlign: 'center'}]}>Progress</ThemedText>
            <Spacer height={20} />
            <ThemedText style={[styles.header, {marginTop: 20, fontSize: 15}]} >Insights</ThemedText>

            <ScrollView style={styles.widgets} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{alignItems: "flex-start", paddingHorizontal: 20}}>
              {Object.keys(user.tracking.insights).map((key, index) => (
                // Make the widget const and simplify code like below
                user.tracking.insights[key].active === true ? (
                  <GraphWidget
                    key={index}
                    data={user.tracking.insights[key].data.map((item) => item.amount)}
                    dates={user.tracking.insights[key].data.map((item) => item.date)}
                    title={key.charAt(0).toUpperCase() + key.slice(1)}
                    unit={user.tracking.insights[key].unit || "units"}
                    color={user.tracking.insights[key].color || "#546FDB"}
                    
                  />
                ) : null
              ))}
            </ScrollView>

            <Spacer />

            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", marginRight: 20}}>
              <ThemedText style={[styles.header, {fontSize: 15}]} >Logging & Tracking</ThemedText>
              <Pressable style={{flexDirection: 'row', alignItems: 'center', padding: 5, backgroundColor: Colors.primaryBlue, borderRadius: 50, height: 30, paddingHorizontal: 10}} >
                <View style={{height: 20, width: 20, justifyContent: "center", alignItems: "center", marginRight: 10}}>
                  <Image style={{height: 20, width: 20, objectFit: 'contain'}} source={plusIcon} />
                </View>
                <Text style={{fontSize: 15, color: "white", fontWeight: 600}}>Add widget</Text>
              </Pressable>
            </View>

            <Spacer height={20} />

            <View style={{paddingHorizontal: 20}}>
              {Object.keys(user.tracking.logging).map((key, index) => {
                const widget = user.tracking.logging[key];
                return widget.active ? (
                  <GraphWidget
                    fillWidth={true}
                    key={index}
                    data={widget.data.map((item) => item.amount)}
                    dates={widget.data.map((item) => item.date)}
                    title={key.charAt(0).toUpperCase() + key.slice(1)}
                    unit={widget.unit || "units"}
                    color={widget.color || "#546FDB"}
                  />
                ) : null;
              })}
            </View>
              


            

          </ScrollView>
        </SafeAreaView>
    </ThemedView>
  )
}

export default IndexProgress

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // padding: 20,
    },
    header: {
      fontSize: 20,
      fontWeight: 700,
      paddingHorizontal: 20,
    },
    widgets: {
      flexDirection: 'row',
      marginTop: 20,
      width: screenWidth,
    }
  
    
  })