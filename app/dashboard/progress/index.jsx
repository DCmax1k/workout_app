import { Alert, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
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
import ConfirmMenu from '../../../components/ConfirmMenu'

const firstCapital = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const screenWidth = Dimensions.get('window').width;

const IndexProgress = () => {
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  const [confirmMenuActive, setConfirmMenuActive] = useState(false);
  const [confirmMenuData, setConfirmMenuData] = useState();

  const showComingSoonMessage = (data) => {
        setConfirmMenuData({
            title: "Coming soon!",
            subTitle: "This feature is not yet available but will be coming in a future update.",
            subTitle2: "",
            option1: "Awesome!",
            option1color: "#546FDB",
            confirm: () => setConfirmMenuActive(false),
        });
        setConfirmMenuActive(true);
    }

  if (!user.tracking) {
    updateUser({progress: {sections: []}});
  }

  const openProgressExpanded = (category, categoryData) => {
    // Open progress expanded view
    const data = {
      category,
      ...categoryData
    }

    router.push({
      pathname: "/progressExpanded",
      params: {
        data: JSON.stringify(data),
      },
    });
  }




  return (
    <ThemedView style={styles.container}>
        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
        <SafeAreaView style={{flex: 1}}>
          <ScrollView contentContainerStyle={{paddingBottom: 120}} showsVerticalScrollIndicator={false}>

            <ThemedText style={[styles.header, {marginTop: 20, fontSize: 20,  textAlign: 'center'}]}>Progress</ThemedText>
            <Spacer height={20} />
            <ThemedText style={[styles.header, {marginTop: 20, fontSize: 15}]} >Insights</ThemedText>

            {/* INSIGHTS */}
            <ScrollView style={styles.widgets} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{alignItems: "flex-start", paddingHorizontal: 20}}>
              {Object.keys(user.tracking.insights).map((key, index) => {
                const widget = user.tracking.insights[key];
                return widget.active ? (
                  <GraphWidget
                    key={index}
                    data={widget.data.map((item) => item.amount)}
                    dates={widget.data.map((item) => item.date)}
                    title={firstCapital(key)}
                    unit={widget.unit}
                    color={widget.color || "#546FDB"}
                    onPress={() => openProgressExpanded(key, widget)}
                    
                  />
                ) : null
              })}
            </ScrollView>

            <Spacer />

              {/* Add widget button*/}
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", marginRight: 20}}>
              <ThemedText style={[styles.header, {fontSize: 15}]} >Logging & Tracking</ThemedText>
              <Pressable onPress={showComingSoonMessage} style={{flexDirection: 'row', alignItems: 'center', padding: 5, backgroundColor: Colors.primaryBlue, borderRadius: 50, height: 30, paddingHorizontal: 10}} >
                <View style={{height: 20, width: 20, justifyContent: "center", alignItems: "center", marginRight: 10}}>
                  <Image style={{height: 20, width: 20, objectFit: 'contain'}} source={plusIcon} />
                </View>
                <Text style={{fontSize: 15, color: "white", fontWeight: 600}}>Add widget</Text>
              </Pressable>
            </View>

            <Spacer height={20} />

            {/* LOGGING and TRACKING */}
            <View style={{paddingHorizontal: 20}}>
              {Object.keys(user.tracking.logging).map((key, index) => {
                const widget = user.tracking.logging[key];
                return widget.active ? (
                  <GraphWidget
                    fillWidth={true}
                    key={index}
                    data={widget.data.map((item) => item.amount)}
                    dates={widget.data.map((item) => item.date)}
                    title={firstCapital(key)}
                    unit={widget.unit}
                    color={widget.color || "#546FDB"}
                    style={{marginBottom: 20}}
                    onPress={() => openProgressExpanded(key, widget)}
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