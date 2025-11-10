import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import { useLocalSearchParams } from 'expo-router'
import { useUserStore } from '../../../stores/useUserStore'
import { SafeAreaView } from 'react-native-safe-area-context'
import TitleWithBack from '../../../components/TitleWithBack'
import Spacer from '../../../components/Spacer'
import ProfileImg from '../../../components/ProfileImg'
import DisplayName from '../../../components/DisplayName'
import FriendActionBtn from '../../../components/FriendActionBtn'
import { Colors } from '../../../constants/Colors'
import trashIcon from '../../../assets/icons/trash.png'

const ViewProfile = () => {
    const user = useUserStore(state => state.user);

    const params = useLocalSearchParams();
    const prof = JSON.parse(params.profile);

    const checkFriendIdx = user.friends.findIndex(f => f._id === prof._id)
    const isFriend = checkFriendIdx > -1;

    let profile = prof;
    if (isFriend) profile = user.friends[checkFriendIdx]; 
    const isSelf = profile._id === user.dbId;

    const requestRemoveUser = async (person) => {
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

    

  return (
    <ThemedView style={{flex: 1, }}>
        <SafeAreaView>
            <TitleWithBack actionBtn={{actionMenu: true, image: require("../../../assets/icons/threeEllipses.png"), options: actionMenuOptions,}} />
            <Spacer height={20} />
            <View style={{width: "100%", justifyContent: "center", alignItems: "center"}}>
                <ProfileImg profileImg={profile.profileImg} size={80} />
                <Spacer height={10} />
                <DisplayName name={profile.username} premium={profile.premium} usernameDecoration={profile.usernameDecoration}  />
                <Spacer height={5} />
                <ThemedText style={{fontSize: 12, fontWeight: "600", color: "#777777ff"}}>{isSelf ? "YOU" : isFriend ? "Friend" : "User"}</ThemedText>
                <Spacer height={40} />
                {!isFriend && !isSelf && (
                    <View>
                        <FriendActionBtn friend={profile} fontSize={25} style={{paddingHorizontal: 20}} />
                    </View>
                    
                )}
            </View>


            
        </SafeAreaView>
        
    </ThemedView>
  )
}

export default ViewProfile

const styles = StyleSheet.create({})