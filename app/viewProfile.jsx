import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../components/ThemedView'
import ThemedText from '../components/ThemedText'
import { useLocalSearchParams } from 'expo-router'
import { useUserStore } from '../stores/useUserStore'
import { SafeAreaView } from 'react-native-safe-area-context'
import TitleWithBack from '../components/TitleWithBack'
import Spacer from '../components/Spacer'
import ProfileImg from '../components/ProfileImg'
import DisplayName from '../components/DisplayName'
import FriendActionBtn from '../components/FriendActionBtn'
import { Colors } from '../constants/Colors'
import trashIcon from '../assets/icons/trash.png'
import ConfirmMenu from '../components/ConfirmMenu'
import sendData from '../util/server/sendData'
import { useBottomSheet } from '../context/BottomSheetContext'
import { socket } from '../util/server/socket'
import getAchievementBadge from '../util/getAchievementBadge'
import { Image } from 'expo-image'

const firstCapital = (string) => {
  const strToArr = string.split(' ');
  const newArr = strToArr.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  return newArr.join(' ');
}

const ViewProfile = () => {
    const {showAlert} = useBottomSheet();
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const params = useLocalSearchParams();
    const prof = JSON.parse(params.profile);

    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState({});

    const checkFriendIdx = user.friends.findIndex(f => f._id === prof._id)
    const isFriend = checkFriendIdx > -1;

    let profile = prof;
    if (isFriend) profile = user.friends[checkFriendIdx]; 
    const isSelf = profile._id === user.dbId;
    if (isSelf) profile.pastWorkoutsLength = user.pastWorkouts.length;

    const requestRemoveUser = async (person) => {
        setConfirmMenuData({
            title: "Remove Friend?",
            subTitle: "Remove " + person.username + " from your friends list?",
            subTitle2: "",
            option1: "Remove Friend",
            option1color: Colors.protein,
            option2: "Cancel",
            confirm: () => removeUser(person),
        });
        setConfirmMenuActive(true);
    }

    const removeUser = async (person) => {
        console.log("remove user");
        // Client side
        updateUser({friends: user.friends.filter(f => f._id !== person._id)});
        // send server request
        const response = await sendData("/dashboard/unadduser", {jsonWebToken: user.jsonWebToken, person});
        if (response.status !== "success") return showAlert(response.message, false);
        // Send socket
        socket.emit("send_unadd_user", {jsonWebToken: user.jsonWebToken, person, userInfo: response.freshUserInfo});
        //showAlert("Friend removed.", true);
    }

    const actionMenuOptions = [
      // {title: "Settings", icon: gearIcon, onPress: openSettings,},
      {title: "Remove Friend", icon: trashIcon, color: Colors.redText, onPress: () => requestRemoveUser(profile),},
    ];

    const achievement = getAchievementBadge(profile.pastWorkoutsLength);
    console.log(profile);

  return (
    <ThemedView style={{flex: 1, }}>
        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
        <SafeAreaView>
            <TitleWithBack actionBtn={{actionMenu: isFriend ? true : false, image: require("../assets/icons/threeEllipses.png"), options: actionMenuOptions,}} />
            <Spacer height={20} />
            <View style={{width: "100%", justifyContent: "center", alignItems: "center"}}>
                <ProfileImg profileImg={profile.profileImg} size={80} />
                <Spacer height={10} />
                <DisplayName name={profile.username} premium={profile.premium} usernameDecoration={profile.usernameDecoration}  />
                <Spacer height={5} />
                <ThemedText style={{fontSize: 12, fontWeight: "600", color: "#777777ff"}}>{isSelf ? "YOU" : isFriend ? "Friend" : "User"}</ThemedText>
                <Spacer height={20} />
                {profile.usernameDecoration.description && <ThemedText style={{fontSize: 15, fontWeight: "400", color: "#dfdfdfff"}}>{profile.usernameDecoration.description ?? ""}</ThemedText>}
                <Spacer height={40} />
                {!isFriend && !isSelf && (
                    <View>
                        <FriendActionBtn friend={profile} fontSize={25} style={{paddingHorizontal: 20}} />
                    </View>
                    
                )}
                
                {(isFriend || isSelf) &&
                <View style={{width: "100%", justifyContent: "center", alignItems: "center"}}>
                    <View style={{height: 1, width: "90%", backgroundColor: "#696969ff", borderRadius: 999 }} />
                    <Spacer height={20} />

                    {/* Workout completed */}
                    <View style={{width: "100%", paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <ThemedText style={{color: "white", fontSize: 20}}>Workouts Completed</ThemedText>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <ThemedText style={{color: "white", fontSize: 20}}>{profile.pastWorkoutsLength}</ThemedText>
                            {achievement && <Image source={achievement.icon} style={{height: 40, width: 40}} contentFit='contain' />}
                        </View>
                    </View>
                    <Spacer height={10} />
                    
                    {/* Current Achievement */}
                    {achievement && (
                        <View style={{width: "100%", paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                            <ThemedText style={{color: "white", fontSize: 20}}>Current Achievement</ThemedText>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <ThemedText style={{color: "white", fontSize: 20}}>{firstCapital(achievement.key)}</ThemedText>
                            </View>
                        </View>
                    )}
                </View>}

                
                
            </View>


            
        </SafeAreaView>
        
    </ThemedView>
  )
}

export default ViewProfile

const styles = StyleSheet.create({})

