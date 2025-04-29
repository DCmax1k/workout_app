import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
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

  const openProgressExpanded = () => {
    // Open progress expanded view
    router.push('/dashboard/progress/progressExpanded')
  }


  return (
    <ThemedView  style={styles.container}>
        <SafeAreaView style={{flex: 1}}>
            {/* <ThemedText>Progress</ThemedText>
            <BlueButton title="View Progress" onPress={openProgressExpanded} /> */}
            <ThemedText style={{fontSize: 20, fontWeight: 700, marginTop: 20}}>Analytics</ThemedText>
            <ScrollView style={styles.widgets} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{alignItems: "flex-start", paddingHorizontal: 20}}>
              <PreviewData data={weightData} title={"Weight"} unit={"lbs"} timeframe={"7 days"} color={"#546FDB"} />
              <PreviewData data={expData} title={"Expenditure"} unit={"kcal"} timeframe={"7 days"} color={"#DB8854"} />
            </ScrollView>
            
        </SafeAreaView>
    </ThemedView>
  )
}

export default IndexProgress

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    widgets: {
      flexDirection: 'row',
      marginTop: 20,
      marginHorizontal: -20,
      width: screenWidth,
    }
  
    
  })