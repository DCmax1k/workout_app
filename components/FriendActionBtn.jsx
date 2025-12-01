import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useUserStore } from '../stores/useUserStore'
import sendData from '../util/server/sendData';
import { useBottomSheet } from '../context/BottomSheetContext';
import { socket } from '../util/server/socket';
import addUserIcon from '../assets/icons/addUser.png'
import greyX from '../assets/icons/greyX.png'
import checkIcon from '../assets/icons/check.png'
import ImageContain from './ImageContain';
import { Colors } from '../constants/Colors';
import ConfirmMenu from './ConfirmMenu';

const FriendActionBtn = ({style, friend, fontSize=15, ...props}) => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
        const [confirmMenuData, setConfirmMenuData] = useState({});

    const {showAlert} = useBottomSheet();

    const userFriendIds = user.friends.map(p => p._id);
    const userFriendRequestIds = user.friendRequests.map(p => p._id);
    const userFriendsAdded = user.friendsAdded.map(p => p._id);

    let friendStatus = 'notadded'; // notadded, friend, added, request
    if (userFriendIds.includes(friend._id)) {
        friendStatus = 'friend';
    } else if (userFriendRequestIds.includes(friend._id)) {
        friendStatus = 'request';
    } else if (userFriendsAdded.includes(friend._id)) {
        friendStatus = 'added'
    }

    const handleUserBtn = (friendStatus, person) => {
        switch (friendStatus) {
            case "notadded":
                requestAddUser(person);
                break;
            case "friend":
                requestRemoveUser(person);
                break;
            case "added":
                requestUnaddUser(person);
                break;
            case "request":
                requestAcceptUser(person);
                break;
        }
    }

    const requestAddUser = async (person) => {
        console.log("Add user");
        // Client side
        updateUser({friendsAdded: [...user.friendsAdded, person]});
        // send server request
        const response = await sendData("/dashboard/adduser", {jsonWebToken: user.jsonWebToken, person});
        if (response.status !== "success") return showAlert(response.message, false);
        // Send socket
        socket.emit("send_add_user", {jsonWebToken: user.jsonWebToken, person, userInfo: response.freshUserInfo});
        //showAlert("Friend request sent.", true);
    }
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
    const requestUnaddUser = async (person) => {
        console.log("Add user");
        // Client side
        updateUser({friendsAdded: user.friendsAdded.filter(f => f._id !== person._id)});
        // send server request
        const response = await sendData("/dashboard/unadduser", {jsonWebToken: user.jsonWebToken, person});
        if (response.status !== "success") return showAlert(response.message, false);
        // Send socket
        socket.emit("send_unadd_user", {jsonWebToken: user.jsonWebToken, person, userInfo: response.freshUserInfo});
        //showAlert("User unadded.", true);
    }
    const requestAcceptUser = async (person) => {
        console.log("accept user");
        // Client side
        updateUser({friends: [...user.friends, person], friendRequests: user.friendRequests.filter(p => p._id !== person._id)});
        // send server request
        const response = await sendData("/dashboard/adduser", {jsonWebToken: user.jsonWebToken, person});
        if (response.status !== "success") return showAlert(response.message, false);
        // Send socket
        socket.emit("send_add_user", {jsonWebToken: user.jsonWebToken, person, userInfo: response.freshUserInfo});
        //showAlert("Friend added", true);
    }

  return (
    <>
        {/* confirmation menu */}
        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />

        <Pressable onPress={() => handleUserBtn(friendStatus, friend)} style={[{borderRadius: 9999, padding: 8, paddingHorizontal: 12, backgroundColor: friendStatus === "friend" ? Colors.protein : Colors.primaryBlue, marginLeft: "auto"}, style]} {...props}>
            {friendStatus === "notadded" && (<View style={{flexDirection: "row", alignItems: "center"}} >
                <ImageContain source={addUserIcon} size={20} style={{marginRight: 5}} />
                <Text style={{fontSize, color: "white", fontWeight: "400"}}>Add</Text>
            </View>)}
            {friendStatus === "friend" && (<View style={{flexDirection: "row", alignItems: "center"}} >
                <ImageContain source={greyX} imgStyle={{tintColor: "white"}} size={20} style={{marginRight: 5}} />
                <Text style={{fontSize, color: "white", fontWeight: "400"}}>Remove</Text>
            </View>)}
            {friendStatus === "added" && (<View style={{flexDirection: "row", alignItems: "center"}} >
                <Text style={{fontSize, color: "white", fontWeight: "400"}}>Added</Text>
                <ImageContain source={checkIcon} imgStyle={{tintColor: "white", height: "80%"}} size={20} style={{marginLeft: 5}} />
            </View>)}
            {friendStatus === "request" && (<View style={{flexDirection: "row", alignItems: "center"}} >
                <ImageContain source={addUserIcon} size={20} style={{marginRight: 5}} />
                <Text style={{fontSize, color: "white", fontWeight: "400"}}>Accept</Text>
            </View>)}
            
        </Pressable>
    </>
    
  )
}

export default FriendActionBtn

const styles = StyleSheet.create({})