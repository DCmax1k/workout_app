import { Alert, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import BlueButton from '../../../components/BlueButton'
import { router } from 'expo-router'
import PreviewData from '../../../components/PreviewData'
import { useUserStore } from '../../../stores/useUserStore'


const screenWidth = Dimensions.get('window').width;

const IndexProgress = () => {
  const user = useUserStore((state) => state.user);
  const weightData = user.analytics.weight.map((item) => item.amount);
  const expData = user.analytics.expenditure.map((item) => item.amount);
  const sleepData = user.analytics.sleep.map((item) => item.amount);
  const hydrationData = user.analytics.hydration.map((item) => item.amount);

  const openProgressExpanded = () => {
    // Open progress expanded view
    router.push('/dashboard/progress/progressExpanded')
  }


  return (
    <ThemedView  style={styles.container}>
        <SafeAreaView style={{flex: 1}}>
          <ScrollView contentContainerStyle={{paddingBottom: 120}} showsVerticalScrollIndicator={false}>
            {/* <ThemedText>Progress</ThemedText>
            <BlueButton title="View Progress" onPress={openProgressExpanded} /> */}

            <ThemedText style={[styles.header, {marginTop: 20, fontSize: 20,  textAlign: 'center'}]}>Progress</ThemedText>

            <ThemedText style={[styles.header, {marginTop: 20, fontSize: 15}]} >Insights</ThemedText>
            <ScrollView style={styles.widgets} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{alignItems: "flex-start", paddingHorizontal: 20}}>
              <PreviewData data={weightData} title={"Weight"} unit={"lbs"} timeframe={"7 days"} color={"#546FDB"} onPress={() => {Alert.alert("Coming soon")}} />
              <PreviewData data={expData} title={"Expenditure"} unit={"kcal"} timeframe={"7 days"} color={"#DB8854"} />
            </ScrollView>

            <ThemedText style={[styles.header, {marginTop: 40, fontSize: 15}]} >Rest</ThemedText>
            <ScrollView style={styles.widgets} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{alignItems: "flex-start", paddingHorizontal: 20}}>
              <PreviewData data={sleepData} title={"Sleep amount"} unit={"hrs"} timeframe={"7 days"} color={"#54DB78"} />
            </ScrollView>

            <ThemedText style={[styles.header, {marginTop: 40, fontSize: 15}]}>Hydration</ThemedText>
            <ScrollView style={styles.widgets} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{alignItems: "flex-start", paddingHorizontal: 20}}>
              <PreviewData data={hydrationData} title={"Water"} unit={"liters"} timeframe={"7 days"} color={"#DB54B2"} />
            </ScrollView>

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
      marginTop: 20,
      paddingHorizontal: 20,
    },
    widgets: {
      flexDirection: 'row',
      marginTop: 20,
      width: screenWidth,
    }
  
    
  })