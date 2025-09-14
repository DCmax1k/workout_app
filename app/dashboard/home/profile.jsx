import { Dimensions, Image, Pressable,ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import TitleWithBack from '../../../components/TitleWithBack'
import { useUserStore } from '../../../stores/useUserStore'
import BlueButton from '../../../components/BlueButton'
import Spacer from '../../../components/Spacer'
import { SafeAreaView } from 'react-native-safe-area-context'
import profileIcon from '../../../assets/icons/profileIcon.png'
import pencilIcon from '../../../assets/icons/pencil.png'
import ConfirmMenu from '../../../components/ConfirmMenu'
import { router } from 'expo-router'
import emitter from '../../../util/eventBus'
import PopupSheet from '../../../components/PopupSheet'
import Calender from '../../../components/Calender'

const screenWidth = Dimensions.get("screen").width;

const Profile = () => {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const updateUser = useUserStore((state) => state.updateUser);

    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState();

    const [popupMenuActive, setPopupMenuActive] = useState(false);

    const [currentPopupContent, setCurrentPopupContent] = useState("") // birthday, height, gender

    useEffect(() => {
        const sub = emitter.addListener("done", (data) => {
          console.log("Got data back:", data);
            if (data.target === "weight") {
              const nData = user.tracking.logging["weight"].data;
              const cData = [...nData, {date: Date.now(), amount: data.value}];
              const updated = {tracking: {logging: {weight: {data: cData}}}};
              updateUser(updated);
              //console.log("updated ", updated);
            }  else {
              console.log("Tried changing value with emit but value not found");
            }
            
        });
        return () => sub.remove();
      }, [emitter, updateUser, user.tracking.logging["weight"]]);

    const clearUserData = () => {
      // Signout
      setUser(null);
    }

    const showHealthTooltip = () => {
        setConfirmMenuData({
            title: "Why do we need this?",
            subTitle: "Body stats like your height, weight, and age are used to accurately provide insights about your health. Gender is used to more accurately calculate your calorie expenditure.",
            subTitle2: "",
            option1: "Okay",
            option1color: "#546FDB",
            confirm: () => setConfirmMenuActive(false),
        });
        setConfirmMenuActive(true);
    }

    const setBirthday = (d) => {
      if (currentPopupContent !== "birthday") return;
      updateUser({settings: {birthday: new Date(d).getTime()}});
    }

    const clickWeight = () => {
      const info = {
        title: "Weight",
        target: "weight",
        value: user.tracking.logging["weight"].data.length > 0 ? user.tracking.logging["weight"].data[user.tracking.logging["weight"].data.length - 1].amount : 100,
        unit:  user.tracking.logging["weight"].unit || "lbs",
        increment: 0.1,
        range: [0, 2000],
        scrollItemWidth: 10,
        defaultValue: 100,
      }
      router.push({
        pathname: "/inputValueScreen",
        params: {
          data: JSON.stringify(info),
        },
      });
    }

    const clickBirthday = () => {
      setCurrentPopupContent("birthday");
      setPopupMenuActive(true);
      
    }


    return (
      <ThemedView style={styles.container}>
          <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
          <PopupSheet active={popupMenuActive} setActive={setPopupMenuActive}>
            {currentPopupContent === "birthday" && (
              <Calender initialDate={user.settings.birthday ? new Date(user.settings.birthday) : new Date()} set={setBirthday} />
            )}
            
          </PopupSheet>
          <SafeAreaView style={{flex: 1}} >
            <TitleWithBack title={"Profile"} style={{marginHorizontal: 0}} />
            <Spacer height={20} />
            <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1,}} contentContainerStyle={{padding: 20, paddingBottom: 120}}>
              

              <View style={{justifyContent: "center", alignItems: "center"}}>
                <Image style={{width: 80, height: 80}} source={profileIcon} />
              </View>

              <Spacer />

              {/* Health*/}
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <ThemedText style={[styles.header, { fontSize: 15}]} >Health</ThemedText>
                <Pressable onPress={showHealthTooltip} style={{height: 20, width: 20, borderColor: '#585858', borderWidth: 2, borderRadius: 99999 , marginLeft: 10, alignItems: "center", justifyContent: "center"}}>
                  <Text style={{color: "#585858", fontSize: 15, marginTop: -1 }}>?</Text>
                </Pressable>
              </View>
              <Spacer height={20} />
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>

                <Pressable onPress={clickWeight}>
                  <View style={{height: 100, width: (screenWidth-70)/4, backgroundColor: "#3A3A3A", borderRadius: 10, flexDirection: "column", alignItems: "center", paddingHorizontal: 10}}>
                    <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 16, marginTop: 10, textAlign: "center"}}>Weight</ThemedText>
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 10}}>
                      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", height: 20,}}>
                        <View style={{width: 10, height: 10, justifyContent: "center", alignItems: "center", marginLeft: 0}}>
                          <Image source={pencilIcon} style={{height: 8, width: 8, objectFit: "contain"}} />
                        </View>
                        <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 20, height: 20, textAlign: "center", color: "white", fontWeight: '800'}}>{user.tracking.logging["weight"].data.length > 0 ? user.tracking.logging["weight"].data[user.tracking.logging["weight"].data.length-1].amount : "- -"}</ThemedText>
                      </View>
                    </View>
                  </View>
                </Pressable>

                <Pressable onPress={clickBirthday}>
                  <View style={{height: 100, width: (screenWidth-70)/4, backgroundColor: "#3A3A3A", borderRadius: 10, flexDirection: "column", alignItems: "center", paddingHorizontal: 10}}>
                    <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 16, marginTop: 10, textAlign: "center"}}>Birthday</ThemedText>
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 10}}>
                      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", height: 20,}}>
                        <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 20, height: 20, textAlign: "center", color: "white", fontWeight: '800'}}>{user.settings.birthday ? new Date(user.settings.birthday).toLocaleDateString("en-US", {month: "numeric", day: "numeric", year: "2-digit"}) : "- -"}</ThemedText>
                      </View>
                    </View>
                  </View>
                </Pressable>

                <Pressable onPress={clickWeight}>
                  <View style={{height: 100, width: (screenWidth-70)/4, backgroundColor: "#3A3A3A", borderRadius: 10, flexDirection: "column", alignItems: "center", paddingHorizontal: 10}}>
                    <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 16, marginTop: 10, textAlign: "center"}}>Weight</ThemedText>
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 10}}>
                      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", height: 20,}}>
                        <View style={{width: 10, height: 10, justifyContent: "center", alignItems: "center", marginLeft: 0}}>
                          <Image source={pencilIcon} style={{height: 8, width: 8, objectFit: "contain"}} />
                        </View>
                        <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 20, height: 20, textAlign: "center", color: "white", fontWeight: '800'}}>{user.tracking.logging["weight"].data.length > 0 ? user.tracking.logging["weight"].data[user.tracking.logging["weight"].data.length-1].amount : "- -"}</ThemedText>
                      </View>
                    </View>
                  </View>
                </Pressable>

                <Pressable onPress={clickWeight}>
                  <View style={{height: 100, width: (screenWidth-70)/4, backgroundColor: "#3A3A3A", borderRadius: 10, flexDirection: "column", alignItems: "center", paddingHorizontal: 10}}>
                    <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 16, marginTop: 10, textAlign: "center"}}>Weight</ThemedText>
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 10}}>
                      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", height: 20,}}>
                        <View style={{width: 10, height: 10, justifyContent: "center", alignItems: "center", marginLeft: 0}}>
                          <Image source={pencilIcon} style={{height: 8, width: 8, objectFit: "contain"}} />
                        </View>
                        <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 20, height: 20, textAlign: "center", color: "white", fontWeight: '800'}}>{user.tracking.logging["weight"].data.length > 0 ? user.tracking.logging["weight"].data[user.tracking.logging["weight"].data.length-1].amount : "- -"}</ThemedText>
                      </View>
                    </View>
                  </View>
                </Pressable>

              </View>
              


              <Spacer height={20} />
              

              <BlueButton onPress={clearUserData} title={"Sign out"} />
            </ScrollView>
          </SafeAreaView>
      </ThemedView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      fontSize: 20,
      fontWeight: 700,
    },
  })