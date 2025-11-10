import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ThemedView from '../../../components/ThemedView'
import TitleWithBack from '../../../components/TitleWithBack'
import { SafeAreaView } from 'react-native-safe-area-context'
import Search from '../../../components/Search'
import Spacer from '../../../components/Spacer'
import ImageContain from '../../../components/ImageContain'
import addUserIcon from '../../../assets/icons/addUser.png'
import greyX from '../../../assets/icons/greyX.png'
import checkIcon from '../../../assets/icons/check.png'
import sendData from '../../../util/server/sendData'
import { useUserStore } from '../../../stores/useUserStore'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import ThemedText from '../../../components/ThemedText'
import DisplayName from '../../../components/DisplayName'
import ProfileImg from '../../../components/ProfileImg'
import { Colors } from '../../../constants/Colors'
import SectionSelect from '../../../components/SectionSelect'
import { socket } from '../../../util/server/socket'


const filterSearchUsers = (users, s) => {
    console.log("From filter, users: ", users);
    if (!s) return users;
    const search = s.trim().toLowerCase();
    return users.filter(u => {
        if (u.username.toLowerCase().includes(search)) return true;
        return false;
    });
}

const SearchFriends = () => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const [section, setSection] = useState("Friends"); // Friends, All Users

    const {showAlert} = useBottomSheet();

    const cacheUsersFromSearch = useRef({
    // "c": [
    //     {
    //     "_id": "690295af9feed1676b9c407f",
    //     "premium": true,
    //     "profileImg": {
    //         "public_id": "",
    //         "url": "https://png.pngtree.com/png-vector/20231127/ourmid/pngtree-test-red-flat-icon-isolated-product-png-image_10722512.png"
    //     },
    //     "username": "CachedUser",
    //     "usernameDecoration": {
    //         "prefix": "test",
    //         "prefixColor": "red"
    //     }
    //     }
    // ]
    }); 

    const [search, setSearch] = useState("");

    const [results, setResults] = useState({}); // filteredSearch(cacheUsersFromSearch["first search term"]);



    const handleInput = async (e) => {
        console.log("Cache: ", cacheUsersFromSearch.current);
        setSearch(e);
        if (e.length === 0) return;
        if (e.length > 0 && !cacheUsersFromSearch[e.charAt(0).toLowerCase()]) {
            const key = e.charAt(0).toLowerCase();
            // Check for cache, if not then search db
            if (cacheUsersFromSearch.current[key]) {
                console.log("Found cache");
                setResults(cacheUsersFromSearch.current[key]);
            } else {
                console.log("Search db for " + key);
                const response = await sendData('/dashboard/searchusers', {search: e, username: user.username, jsonWebToken: user.jsonWebToken});
                console.log(response);
                if (response.status !== "success") {
                    showAlert(response.message, false);
                    cacheUsersFromSearch.current[key] = [];
                    return;
                }
                const {users} = response;
                setResults(users);
                cacheUsersFromSearch.current[key] = users;
            }
        } else {
            setResults(filterSearchUsers(cacheUsersFromSearch.current[e.charAt(0).toLocaleLowerCase()], e));
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

    const userFriendIds = user.friends.map(p => p._id);
    const userFriendRequestIds = user.friendRequests.map(p => p._id);
    const userFriendsAdded = user.friendsAdded.map(p => p._id);

  return (
    <ThemedView style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
            <TitleWithBack title={"Search"} />
            <Spacer height={20} />
            <View style={{paddingHorizontal: 20}}>
                <Search value={search} placeholder='Username' onChangeText={handleInput} setValue={(v) => handleInput(v)} />
            </View>
            <Spacer height={5} />
            <SectionSelect section={section} setSection={setSection} sections={["Friends", "All Users"]} style={{marginHorizontal: 20}} />
            <Spacer height={5} />
            {user.friends.length === 0 && section === "Friends" && (
            <View style={{width: "100%"}}>
                <ThemedText style={{textAlign: "center", marginTop: 20}}>Add new friends from the All Users tab.</ThemedText>
            </View>
            )}
            <FlatList
                contentContainerStyle={{paddingBottom: 120, paddingTop: 15, flex: 1}}
                keyExtractor={(item) => item._id}
                data={section === "Friends" ? filterSearchUsers(user.friends, search) : results}
                renderItem={({item}) => {
                    
                    let friendStatus = 'notadded'; // notadded, friend, added, request
                    if (userFriendIds.includes(item._id)) {
                        friendStatus = 'friend';
                    } else if (userFriendRequestIds.includes(item._id)) {
                        friendStatus = 'request';
                    } else if (userFriendsAdded.includes(item._id)) {
                        friendStatus = 'added'
                    }


                    return (
                        <Pressable key={item._id} style={{flexDirection: "row", marginHorizontal: 20, marginBottom: 10, alignItems: "center"}} onPress={() => {console.log("Click user: ", item)}}>
                            <ProfileImg size={50} profileImg={item.profileImg} style={{marginRight: 10}}  />
                            <View style={{justifyContent: "center", }}>
                                <DisplayName name={item.username} usernameDecoration={item.usernameDecoration} premium={item.premium} fontSize={18} />
                                {friendStatus === "friend" && <Text style={{fontSize: 15, color: "#666666", fontWeight: "400"}}>Friends</Text>}
                                {friendStatus === "request" && <Text style={{fontSize: 15, color: "#666666", fontWeight: "400"}}>Friend Request</Text>}
                            </View>
                            <Pressable onPress={() => handleUserBtn(friendStatus, item)} style={{borderRadius: 9999, padding: 8, paddingHorizontal: 12, backgroundColor: friendStatus === "friend" ? Colors.protein : Colors.primaryBlue, marginLeft: "auto"}}>
                                {friendStatus === "notadded" && (<View style={{flexDirection: "row", alignItems: "center"}} >
                                    <ImageContain source={addUserIcon} size={20} style={{marginRight: 5}} />
                                    <Text style={{fontSize: 15, color: "white", fontWeight: "400"}}>Add</Text>
                                </View>)}
                                {friendStatus === "friend" && (<View style={{flexDirection: "row", alignItems: "center"}} >
                                    <ImageContain source={greyX} imgStyle={{tintColor: "white"}} size={20} style={{marginRight: 5}} />
                                    <Text style={{fontSize: 15, color: "white", fontWeight: "400"}}>Remove</Text>
                                </View>)}
                                {friendStatus === "added" && (<View style={{flexDirection: "row", alignItems: "center"}} >
                                    <Text style={{fontSize: 15, color: "white", fontWeight: "400"}}>Added</Text>
                                    <ImageContain source={checkIcon} imgStyle={{tintColor: "white", height: "80%"}} size={20} style={{marginLeft: 5}} />
                                </View>)}
                                {friendStatus === "request" && (<View style={{flexDirection: "row", alignItems: "center"}} >
                                    <ImageContain source={addUserIcon} size={20} style={{marginRight: 5}} />
                                    <Text style={{fontSize: 15, color: "white", fontWeight: "400"}}>Accept</Text>
                                </View>)}
                                
                            </Pressable>
                            
                        </Pressable>
                    )
                }}
            />


        </SafeAreaView>
    </ThemedView>
  )
}

export default SearchFriends

const styles = StyleSheet.create({})