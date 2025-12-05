import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ThemedView from '../../../components/ThemedView'
import TitleWithBack from '../../../components/TitleWithBack'
import { SafeAreaView } from 'react-native-safe-area-context'
import Search from '../../../components/Search'
import Spacer from '../../../components/Spacer'

import sendData from '../../../util/server/sendData'
import { useUserStore } from '../../../stores/useUserStore'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import ThemedText from '../../../components/ThemedText'
import DisplayName from '../../../components/DisplayName'
import ProfileImg from '../../../components/ProfileImg'
import { Colors } from '../../../constants/Colors'
import SectionSelect from '../../../components/SectionSelect'
import { socket } from '../../../util/server/socket'
import FriendActionBtn from '../../../components/FriendActionBtn'
import { router } from 'expo-router'


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
    
    const viewProfile = (profile) => {
        router.push({
          pathname: "/viewProfile",
          params: {
            profile: JSON.stringify(profile),
          }
        })
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
                        <Pressable key={item._id} style={{flexDirection: "row", marginHorizontal: 20, marginBottom: 10, alignItems: "center"}} onPress={() => viewProfile(item)}>
                            <ProfileImg size={50} profileImg={item.profileImg} style={{marginRight: 10}}  />
                            <View style={{justifyContent: "center", }}>
                                <DisplayName name={item.username} usernameDecoration={item.usernameDecoration} premium={item.premium} fontSize={18} />
                                {friendStatus === "friend" && <Text style={{fontSize: 15, color: "#666666", fontWeight: "400"}}>Friends</Text>}
                                {friendStatus === "request" && <Text style={{fontSize: 15, color: "#666666", fontWeight: "400"}}>Friend Request</Text>}
                            </View>
                            <FriendActionBtn friend={item} fontSize={15} />
                            
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