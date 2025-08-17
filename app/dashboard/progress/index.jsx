import { Alert, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import BlueButton from '../../../components/BlueButton'
import { router } from 'expo-router'
import PreviewData from '../../../components/PreviewData'
import { useUserStore } from '../../../stores/useUserStore'
import { SafeAreaView } from 'react-native-safe-area-context'
import GraphWidget from '../../../components/GraphWidget'


const screenWidth = Dimensions.get('window').width;

const IndexProgress = () => {
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  if (!user.progress) {
    updateUser({progress: {sections: []}});
  }

  const openProgressExpanded = () => {
    // Open progress expanded view
    router.push('/dashboard/progress/progressExpanded')
  }


  return (
    <ThemedView style={styles.container}>

        {/* <View style={{position: "absolute", top: 200, left: "50%", transform: [{translateX: "-50%"}], paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "rgb(20, 20, 20)", zIndex: 10, borderRadius: 20}}>
          <Text style={{color: "white", fontSize: 20, fontWeight: 600}}>Coming soon!</Text>
        </View> */}

        <SafeAreaView style={{flex: 1}}>
          <ScrollView contentContainerStyle={{paddingBottom: 120}} showsVerticalScrollIndicator={false}>


            <ThemedText style={[styles.header, {marginTop: 20, fontSize: 20,  textAlign: 'center'}]}>Progress</ThemedText>

            {user.progress !== undefined ? user.progress.sections.map((section, i) => {
              return (
              <View key={i}>
                <ThemedText style={[styles.header, {marginTop: 20, fontSize: 15}]} >{section.title}</ThemedText>
                <ScrollView style={styles.widgets} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{alignItems: "flex-start", paddingHorizontal: 20}}>
                  {Object.keys(section.widgets).map((key, index) => {
                    const widget = section.widgets[key];
                    return widget.active ? (
                      <GraphWidget


                        key={index}
                        data={widget.data.map((item) => item.amount)}
                        dates={widget.data.map((item) => item.date)}
                        title={key.charAt(0).toUpperCase() + key.slice(1)}
                        unit={widget.unit || "units"}
                        timeframe={widget.timeframe || "7 days"}
                        color={widget.color || "#546FDB"}
                      />

                    ) : null;
                  })}

                </ScrollView>
              </View>
              
            )}) : null}

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