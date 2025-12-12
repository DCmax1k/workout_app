import { Dimensions, Image, KeyboardAvoidingView, Platform, Pressable,ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import TitleWithBack from '../../../components/TitleWithBack'
import { useUserStore } from '../../../stores/useUserStore'
import BlueButton from '../../../components/BlueButton'
import Spacer from '../../../components/Spacer'
import { SafeAreaView } from 'react-native-safe-area-context'
import pencilIcon from '../../../assets/icons/pencil.png'
import gearIcon from '../../../assets/icons/gear.png'
import maleIcon from '../../../assets/icons/male.png'
import femaleIcon from '../../../assets/icons/female.png'
import otherGenderIcon from '../../../assets/icons/userHollow.png'
import ConfirmMenu from '../../../components/ConfirmMenu'
import { router } from 'expo-router'
import emitter from '../../../util/eventBus'
import PopupSheet from '../../../components/PopupSheet'
import Calender from '../../../components/Calender'
import ScrollPicker from '../../../components/ScrollPicker'
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutRight } from 'react-native-reanimated'
import { Colors } from '../../../constants/Colors'
import ProfileImg from '../../../components/ProfileImg'
import sendData from '../../../util/server/sendData'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { useIsFocused } from '@react-navigation/native'
import ThemedTextInput from '../../../components/ThemedTextInput'
import Loading from '../../../components/Loading'
// import * as HealthConnect from 'expo-health-connect';
import Constants from "expo-constants";

const isExpoGo = Constants.executionEnvironment === "storeClient";

let GoogleSignin = null;

if (!isExpoGo) {
  ({
    GoogleSignin,
  } = require("@react-native-google-signin/google-signin"));
}


const firstCapital = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function cmToFeetInches(cm) {

  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12); // remainder inches

  return { feet, inches };
}
function feetInchesToCm(feet, inches) {
  if (!feet) feet = 0;
  if (!inches) inches = 0;
  const totalInches = feet * 12 + inches;
  const cm = parseFloat(parseInt(totalInches * 2.54 *100)/100);
  return cm;
}

const screenWidth = Dimensions.get("screen").width;

const Profile = () => {
    const {showAlert} = useBottomSheet();

    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const updateUser = useUserStore((state) => state.updateUser);

    const { feet: heightFeet, inches: heightInches } = user.settings.height ? cmToFeetInches(user.settings.height) : {heightFeet: 0, heightInches: 0} ;
    

    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState();

    const [popupMenuActive, setPopupMenuActive] = useState(false);
    
    const [currentPopupContent, setCurrentPopupContent] = useState("") // birthday, height, gender

    const [awaitEditProfile, setAwaitEditProfile] = useState(false);
    useEffect(() => {
        const sub = emitter.addListener("editProfileFromViewProfile", () => {
            setAwaitEditProfile(true);
        });
        return () => sub.remove();
    }, [emitter]);
    const isFocused = useIsFocused();
    useEffect(() => {
      if (awaitEditProfile && isFocused) {
        setAwaitEditProfile(false);
        setTimeout(() => {
          router.push("/dashboard/home/editProfile");
        }, 450);
        
      }
    }, [awaitEditProfile, isFocused])

    const pushLoggingWeightLayoutServer = async (category, obj) => {
        const response = await sendData("/dashboard/pushloggingweightlayout", {category, obj, jsonWebToken: user.jsonWebToken});
        if (response.status !== "success") {
          showAlert(response.message, false);
          return;
        }
      }

    useEffect(() => {
        const sub = emitter.addListener("done", (data) => {
          console.log("Got data back:", data);
            if (data.target === "weight") {
              const nData = user.tracking.logging["weight"].data;
              const obj = {date: Date.now(), amount: data.value};
              const cData = [...nData, obj];
              const updated = {tracking: {logging: {weight: {data: cData}}}};
              updateUser(updated);
              pushLoggingWeightLayoutServer("weight", obj);
              //console.log("updated ", updated);
            }  else {
              console.log("Tried changing value with emit but value not found");
            }
            
        });
        return () => sub.remove();
      }, [emitter, updateUser, user.tracking.logging["weight"]]);

      // useEffect(() => {
      //   (async () => {
      //     // Check availability
      //     const isAvailable = await HealthConnect.isAvailableAsync();
      //     console.log("Health Connect available:", isAvailable);

      //     if (!isAvailable) return;

          

          
      //   })();
      // })

    const signOut = async () => {
      try {
        setUser(null);
        if (GoogleSignin) {
          const isSignedIn = await GoogleSignin.isSignedIn();
          if (isSignedIn) {
            await GoogleSignin.signOut();
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    const showComingSoon = () => {
      console.log("Showing...");
      setConfirmMenuData({
            title: "Coming soon!",
            subTitle: "",
            subTitle2: "",
            option1: "Okay",
            option1color: "#546FDB",
            confirm: () => setConfirmMenuActive(false),
        });
        setConfirmMenuActive(true);
    }

    const clickAppleHealth = () => {
      showComingSoon();
    }
    const clickGoogleHealth = async () => {
      showComingSoon();
      // console.log("Requesting access for google");
      // // Request permissions
      // const granted = await HealthConnect.requestPermissionsAsync([
      //   { accessType: "read", recordType: "Steps" },
      // ]);

      // console.log("Permissions granted:", granted);

      // // Read step count
      // const now = new Date();
      // const yesterday = new Date(now);
      // yesterday.setDate(now.getDate() - 1);

      // const steps = await HealthConnect.readRecordsAsync("Steps", {
      //   timeRangeFilter: {
      //     operator: "between",
      //     startTime: yesterday.toISOString(),
      //     endTime: now.toISOString(),
      //   },
      // });

      // console.log("Steps:", steps);
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
    const showPlatformHealthTooltip = () => {
      setConfirmMenuData({
            title: "Why do we need this?",
            subTitle: "Metrics like your daily step count are used to accurately provide insights about your daily expenditure.",
            subTitle2: "",
            option1: "Okay",
            option1color: "#546FDB",
            confirm: () => setConfirmMenuActive(false),
        });
        setConfirmMenuActive(true);
    }

    const setBirthday = (d) => {
      if (currentPopupContent !== "birthday") return;
      const birthday = new Date(d).getTime();
      updateUser({settings: {birthday}});
      updateServerSettings("birthday", birthday);
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
    const clickGender = () => {
      setCurrentPopupContent("gender");
      setPopupMenuActive(true);
      
    }

    const clickHeight = () => {
      setCurrentPopupContent("height");
      setPopupMenuActive(true);
    }

    const setFeet = (feet) => {
      const newCmValue = feetInchesToCm(feet, heightInches);
      updateUser({settings: {height: newCmValue}});
      updateServerSettings("height", newCmValue);
    }
    const setInches = (inches) => {
      const newCmValue = feetInchesToCm(heightFeet, inches);
      updateUser({settings: {height: newCmValue}});
      updateServerSettings("height", newCmValue);
    }
    const setCm = (cm) => {
      updateUser({settings: {height: cm}});
      updateServerSettings("height", cm);
    }

    const displayUserHeight = (height) => {
      if (user.settings.preferences.heightUnit === "feet") {
        const {feet, inches} = cmToFeetInches(height);
        return `${feet}'${inches}"`;
      } else if (user.settings.preferences.heightUnit === "cm") {
        return height ? parseInt(height) : "- -"
      } else {
        return null;
      }
      
    }
    const openAccountRecovery =() => {
      router.push('/dashboard/home/accountRecovery');
    }

    const openSettings = () => {

    }

    const actionMenuOptions = [
      {title: "Edit Profile", icon: pencilIcon, onPress: () => router.push("/dashboard/home/editProfile"),},
      {title: "Sign Out",  onPress: signOut,},
    ];

    const updateServerSettings = async (key, value) => {
      const response = await sendData("/dashboard/updatesettings", {key, value, jsonWebToken: user.jsonWebToken});
      if (response.status !== "success") {
        showAlert(response.message, false);
        return;
      }
    }

    const viewPublicProfile = () => {
      const profile = {_id: user.dbId, username: user.username, profileImg: user.profileImg, premium: user.premium, usernameDecoration: user.usernameDecoration}
      router.push({
          pathname: "/viewProfile",
          params: {
            profile: JSON.stringify(profile),
          }
        })
    }
    
    

    return (
      <ThemedView style={styles.container}>
          <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
          <PopupSheet active={popupMenuActive} setActive={setPopupMenuActive}>
            {currentPopupContent === "birthday" && (
              <Calender initialDate={user.settings.birthday ? new Date(user.settings.birthday) : new Date()} set={setBirthday} />
            )}
            {currentPopupContent === "gender" && (
              <View>
                <Pressable onPress={() => {updateUser({settings: {gender: "male"}}); updateServerSettings("gender", "male")}} style={{height: 60, backgroundColor: user.settings.gender === "male" ? "#546FDB" : "#595959", borderRadius: 15, justifyContent: 'center', alignItems: "center", position: "relative"}}>
                  <View style={{position: "absolute", height: 60, width: 40, left: 10, justifyContent: "center"}}>
                    <Image source={maleIcon} style={{height: "60%", width: "100%", objectFit: "contain"}} />
                  </View>
                  <Text style={{color: "white", fontSize: 20, fontWeight: "700", }}>Male</Text>
                </Pressable>
                <Spacer height={10} />
                <Pressable onPress={() => {updateUser({settings: {gender: "female"}}); updateServerSettings("gender", "female")}} style={{height: 60, backgroundColor: user.settings.gender === "female" ? "#546FDB" : "#595959", borderRadius: 15, justifyContent: 'center', alignItems: "center", position: "relative"}}>
                  <View style={{position: "absolute", height: 60, width: 40, left: 10, justifyContent: "center"}}>
                    <Image source={femaleIcon} style={{height: "60%", width: "100%", objectFit: "contain"}} />
                  </View>
                  <Text style={{color: "white", fontSize: 20, fontWeight: "700", }}>Female</Text>
                </Pressable>
                <Spacer height={10} />
                <Pressable onPress={() => {updateUser({settings: {gender: "other"}}); updateServerSettings("gender", "other")}} style={{height: 60, backgroundColor: user.settings.gender === "other" ? "#546FDB" : "#595959", borderRadius: 15, justifyContent: 'center', alignItems: "center", position: "relative"}}>
                  <View style={{position: "absolute", height: 60, width: 40, left: 10, justifyContent: "center", alignItems: "center"}}>
                    <Image source={otherGenderIcon} style={{height: "40%", width: "100%", objectFit: "contain"}} />
                  </View>
                  <Text style={{color: "white", fontSize: 20, fontWeight: "700", }}>Other</Text>
                </Pressable>
                
              </View>
            )}
            {currentPopupContent === "height" && (

              
              <View >
                {/* Both sides */}
                {user.settings.preferences.heightUnit === "feet" && (
                  <Animated.View entering={FadeIn} exiting={FadeOut} style={{flexDirection: "row", justifyContent: "center"}}>
                    <View style={{alignItems: "center"}}>
                      <ThemedText title={true} style={{fontSize: 20, fontWeight: "800"}}>Feet</ThemedText>
                      <Spacer height={10} />
                      <ScrollPicker
                        width={120}
                        range={[0, 20]}
                        increment={1}
                        padWithZero={false}
                        initialValue={heightFeet}
                        onValueChange={(val) => setFeet(val)}
                      />
                    </View>
                    <View style={{alignItems: "center"}}>
                      <ThemedText title={true} style={{fontSize: 20, fontWeight: "800"}}>Inches</ThemedText>
                      <Spacer height={10} />
                      <ScrollPicker
                        width={120}
                        range={[0, 11]}
                        increment={1}
                        padWithZero={true}
                        initialValue={heightInches}
                        onValueChange={(val) => setInches(val)}
                      />
                    </View>

                    
                  </Animated.View>
                )}
                {user.settings.preferences.heightUnit === "cm" && (
                  <Animated.View entering={FadeIn} exiting={FadeOut}>
                    <View style={{alignItems: "center"}}>
                        <ThemedText title={true} style={{fontSize: 20, fontWeight: "800"}}>Centimeters</ThemedText>
                        <Spacer height={10} />
                        <ScrollPicker
                          width={120}
                          range={[0, 600]}
                          increment={1}
                          padWithZero={true}
                          initialValue={parseInt(user.settings.height)}
                          onValueChange={(val) => setCm(val)}
                        />
                      </View>
                  </Animated.View>
                )}
                
                <Spacer height={20} />
                {/* Feet or centimeters options */}
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                  <Pressable onPress={() => updateUser({settings: {preferences: {heightUnit: "feet"}}})} style={{flex: 1, marginRight: 5,  height: 60, backgroundColor: user.settings.preferences.heightUnit === "feet" ? "#546FDB" : "#595959", borderRadius: 15, justifyContent: 'center', alignItems: "center", position: "relative"}}>
                    <Text style={{color: "white", fontSize: 20, fontWeight: "700", }}>ft / in</Text>
                  </Pressable>
                  <Pressable onPress={() => updateUser({settings: {preferences: {heightUnit: "cm"}}})} style={{flex: 1, marginLeft: 5, height: 60, backgroundColor: user.settings.preferences.heightUnit === "cm" ? "#546FDB" : "#595959", borderRadius: 15, justifyContent: 'center', alignItems: "center", position: "relative"}}>
                    <Text style={{color: "white", fontSize: 20, fontWeight: "700", }}>cm</Text>
                  </Pressable>
                </View>

                <Spacer height={0} />
              </View>
              

            )}
            
          </PopupSheet>
          <SafeAreaView style={{flex: 1}} >
            <TitleWithBack title={"Profile"} style={{marginHorizontal: 0}} actionBtn={{actionMenu: true, image: require("../../../assets/icons/threeEllipses.png"), options: actionMenuOptions,}} />
            <Spacer height={20} />
            
            <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1,}} contentContainerStyle={{padding: 20, paddingBottom: 120}}  keyboardShouldPersistTaps='handled'>
              

              <View style={{justifyContent: "center", alignItems: "center"}}>
                <Pressable onPress={viewPublicProfile} style={{alignItems: "center"}}>
                  <ProfileImg size={80} profileImg={user.profileImg} />
                  <Spacer height={10} />
                  <View  style={{backgroundColor: "#686868ff", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5}} >
                    <Text style={{fontSize: 15, color: "white",}} >View Profile</Text>
                  </View>
                </Pressable>
                
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

                <Pressable onPress={clickGender}>
                  <View style={{height: 100, width: (screenWidth-70)/4, backgroundColor: "#3A3A3A", borderRadius: 10, flexDirection: "column", alignItems: "center", paddingHorizontal: 10}}>
                    <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 16, marginTop: 10, textAlign: "center"}}>Gender</ThemedText>
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 10}}>
                      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", height: 20,}}>
                        <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 20, height: 20, textAlign: "center", color: "white", fontWeight: '800'}}>{user.settings.gender ? firstCapital(user.settings.gender)  : "- -"}</ThemedText>
                      </View>
                    </View>
                  </View>
                </Pressable>

                <Pressable onPress={clickHeight}>
                  <View style={{height: 100, width: (screenWidth-70)/4, backgroundColor: "#3A3A3A", borderRadius: 10, flexDirection: "column", alignItems: "center", paddingHorizontal: 10}}>
                    <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 16, marginTop: 10, textAlign: "center"}}>Height</ThemedText>
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 10}}>
                      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", height: 20,}}>
                        <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 20, height: 20, textAlign: "center", color: "white", fontWeight: '800'}}>{displayUserHeight(user.settings.height)}</ThemedText>
                        {user.settings.preferences.heightUnit==="cm" && (<ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 10, height: 20, textAlign: "center", marginTop: 12, color: "#979797", fontWeight: '800'}}>cm</ThemedText>)}
                      </View>
                    </View>
                  </View>
                </Pressable>

                <Pressable onPress={clickWeight}>
                  <View style={{height: 100, width: (screenWidth-70)/4, backgroundColor: "#3A3A3A", borderRadius: 10, flexDirection: "column", alignItems: "center", paddingHorizontal: 10}}>
                    <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 16, marginTop: 10, textAlign: "center"}}>Weight</ThemedText>
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 10}}>
                      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", height: 20,}}>
                        <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 20, height: 20, textAlign: "center", color: "white", fontWeight: '800'}}>{user.tracking.logging["weight"].data.length > 0 ? user.tracking.logging["weight"].data[user.tracking.logging["weight"].data.length-1].amount : "- -"}</ThemedText>
                        <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 10, height: 20, textAlign: "center", marginTop: 12, color: "#979797", fontWeight: '800'}}>{user.tracking.logging["weight"].unit}</ThemedText>
                      </View>
                    </View>
                  </View>
                </Pressable>

              </View>
              <Spacer height={20} />
              {/* Connect Android/Ios Google Health / Apple HealthKit */}
              <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <ThemedText style={[{ fontSize: 15}]} >{Platform.OS === "ios" ? "Apple Health" : "Google Health"}</ThemedText>
                  <Pressable onPress={showPlatformHealthTooltip} style={{height: 20, width: 20, borderColor: '#585858', borderWidth: 2, borderRadius: 99999 , marginLeft: 10, alignItems: "center", justifyContent: "center"}}>
                    <Text style={{color: "#585858", fontSize: 15, marginTop: -1 }}>?</Text>
                  </Pressable>
                </View>
                
                <Pressable onPress={Platform.OS === "ios" ? clickAppleHealth : clickGoogleHealth} style={{backgroundColor: Colors.primaryBlue, borderRadius: 5, paddingVertical: 10, paddingHorizontal: 15}}>
                  <ThemedText style={[{ fontSize: 13, color: "white", fontWeight: 800}]} >{Platform.OS === "ios" ? "Connect Apple HealthKit" : "Connect Google Health"}</ThemedText>
                </Pressable>
              </View>
              
              <Spacer height={40} />
              
              <Spacer height={100} />
              

              {/* <BlueButton onPress={signOut} title={"Sign out"} /> */}
              {/* <Spacer /> */}
              <BlueButton onPress={openAccountRecovery} title={"Account Recovery"} color={Colors.primaryOrange} />

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