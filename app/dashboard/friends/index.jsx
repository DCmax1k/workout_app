import {  Dimensions, Image, Pressable, RefreshControl, ScrollView, SectionList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import TitleWithBack from '../../../components/TitleWithBack'
import { SafeAreaView } from 'react-native-safe-area-context'
import Search from '../../../components/Search'
import { useUserStore } from '../../../stores/useUserStore'
import sinceWhen from '../../../util/sinceWhen'
import { Colors } from '../../../constants/Colors'
import DisplayName from '../../../components/DisplayName'
import Spacer from '../../../components/Spacer'
import greyX from "../../../assets/icons/greyX.png"
import eye from "../../../assets/icons/eye.png"
import addReaction from "../../../assets/icons/addReaction.png"
import WorkoutDescription from '../../../components/workout/WorkoutDescription'
import { truncate } from '../../../util/truncate'
import { router } from 'expo-router'
import PastWorkoutCard from '../../../components/workout/PastWorkoutCard'
import ImageContain from '../../../components/ImageContain'
import PopupSheet from '../../../components/PopupSheet'
import { icons } from '../../../constants/icons'
import TouchableScale from '../../../components/TouchableScale'
import sendData from '../../../util/server/sendData'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import auth from '../../../util/server/auth'
import ProfileImg from '../../../components/ProfileImg'
import getAchievementBadge from '../../../util/getAchievementBadge'
import { Portal } from 'react-native-paper'
import BlueButton from '../../../components/BlueButton'
import { socket } from '../../../util/server/socket'

const firstCapital = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function groupActivityByDate(activity) {
    const grouped = {};
  
    activity.forEach(act => {
      if (!grouped[sinceWhen(act.timestamp)]) {
        grouped[sinceWhen(act.timestamp)] = [];
      }
      grouped[sinceWhen(act.timestamp)].push(act);
    });
  
    return Object.keys(grouped).map(groupName => ({
      title: groupName,
      data: grouped[groupName]
    })).sort((a, b) => b.timestamp - a.timestamp);
}

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const Activity = ({style, activity, ...props}) => {
  const user = useUserStore(state => state.user);
  const updateUser = useUserStore(state => state.updateUser);

  const reactions = activity.reactions ?? {};
  const emojis = Object.keys(reactions).filter(k => reactions[k].length > 0);

  const {showAlert} = useBottomSheet();

  const senderId = activity.userId;
  const sender = activity.peopleDetails[senderId];

  const [popupMenuActive, setPopupMenuActive] = useState(false);
      
  const [currentPopupContent, setCurrentPopupContent] = useState("") // addReaction, viewReactions
  const [emojiInView, setEmojiInView] = useState(""); // emoji

  const openAddReaction = () => {
    setCurrentPopupContent("addReaction");
    setPopupMenuActive(true);
  }
  const openViewReactions = () => {
    if (!emojiInView || !emojis.includes(emojiInView)) setEmojiInView(emojis[0] ?? "")
    setCurrentPopupContent("viewReactions");
    setPopupMenuActive(true);
  }

  const viewWorkout = (workout) => {
    router.push({
      pathname: "/previewWorkout",
      params: {
        data: JSON.stringify(workout),
        fromFriends: true,
      },
    });
  }

  const selectEmoji = async (emoji) => {
    setPopupMenuActive(false);

    const reactions = activity.reactions ?? {};
    Object.keys(reactions).forEach(e => {
        if (reactions[e].includes(user.dbId)) {
            reactions[e] = reactions[e].filter(id => id !== user.dbId)
        }
    });
    if (emoji) {
        if (reactions[emoji]) {
            reactions[emoji] = [...reactions[emoji], user.dbId];
        } else {
            reactions[emoji] = [user.dbId];
        }
    }
    const allRecentActivity = user.recentActivity;
    const idx = allRecentActivity.findIndex(a => a._id === activity._id);
    if (idx > -1) allRecentActivity[idx].reactions = reactions;
    updateUser({recentActivity: allRecentActivity});

    // Send server request
    const response = await sendData("/dashboard/activityreact", {activityId: activity._id, emoji, jsonWebToken: user.jsonWebToken});
    if (response.status !== "success") showAlert(response.message, false);
    // Send socket.io
    console.log("Sending: ", response.activity);
    socket.emit("send_activity_react", ({jsonWebToken: user.jsonWebToken, activityInfo: response.activity, emoji}))
  }

  const emojiOptions = ["cool", "laugh", "surprised", "wink", "bicep", "heart", "fire", "hundred", "goat", "gem", "money", "hole", "demon",  "trophy", "star", "nophone", "eyes", "shower", "toilet", "beer", "progress", ];
  const ITEMS_PER_COLUMN = 3;
  const ITEM_GAP = 15;
  const emojiColumns = [];
  for (let i = 0; i < emojiOptions.length; i += ITEMS_PER_COLUMN) {
      emojiColumns.push(emojiOptions.slice(i, i + ITEMS_PER_COLUMN));
  }

  
  const achievement = activity.type === "complete_workout_achievement" ? getAchievementBadge(activity.details.totalWorkouts) : null;

  return (
    <>
    <PopupSheet active={popupMenuActive} setActive={setPopupMenuActive}>
          {currentPopupContent === "addReaction" && (
            <View>
              <ThemedText style={{textAlign: "center"}}>Add Reaction</ThemedText>
              <Spacer height={20} />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{zIndex: 1, width: screenWidth, backgroundColor: "#303030", marginHorizontal: -20, }} contentContainerStyle={{paddingHorizontal: 20,  flexDirection: 'row', justifyContent: "flex-start",  gap: ITEM_GAP}}>
                {emojiColumns.map((column, colIndex) => (
                    <View key={colIndex} style={{flexDirection: "column"}}>
                    {column.map((item) => {
                      const chosen = reactions[item]?.includes(user.dbId);
                      return (
                        <TouchableScale activeScale={1.1} onPress={() => selectEmoji(chosen ? "" : item)} key={item} style={{height: 40, width: 40, backgroundColor: chosen ? "#3D52A6" : "transparent", borderRadius: 10, marginBottom: ITEM_GAP, justifyContent: "center", alignItems: "center"}}>
                            <Image style={{height: "80%", width: "80%", objectFit: "contain" ,}} source={icons[item+"Emoji"]} />
                        </TouchableScale>
                      )  
                      })}
                    </View>
                ))}
            </ScrollView>

            </View>
            
          )}
          {currentPopupContent === "viewReactions" && (
            <View>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{marginHorizontal: -20}} contentContainerStyle={{paddingHorizontal: 20, flexDirection: 'row', justifyContent: "flex-start", minWidth: "100%", alignItems: 'center', gap: 10}}>
                {emojis.map((emoji, i) => {
                    const chosen = emojiInView === emoji;
                    return (
                        <Animated.View  key={i} style={{borderRadius: 15, backgroundColor: chosen ? "#4b4b4bff" : "transparent" }}>
                            <Pressable onPress={() => setEmojiInView(emoji)} style={{flexDirection: "row", alignItems: "center",  gap: 10, padding: 15,}}>
                                <View style={{height: 30, width: 30}}>
                                    <Image style={{objectFit: "contain", height: "100%", width: '100%'}} source={icons[emoji+"Emoji"]} />
                                </View>
                            </Pressable>
                        </Animated.View>
                    )
                })}   
            </ScrollView>

            <Spacer height={20} />

            <ScrollView scrollEnabled={activity.peopleDetails.length > 7}>
                {activity.reactions[emojiInView].map(pId => {
                  const p = activity.peopleDetails[pId];
                  return (
                    <View key={p.userId} style={{marginBottom: 10}}>
                      <DisplayName name={p.username} usernameDecoration={p.usernameDecoration} premium={p.premium} profileImg={p.profileImg} />
                    </View>
                  )
                })}
            </ScrollView>
              
            </View>
          )}
          
        </PopupSheet>

        <View style={[{width: "100%", flexDirection: "column", alignItems: "flex-start", paddingHorizontal: 20, gap: 10, marginVertical: 10, }, style]} {...props}>
      {/* Top */}
        <View style={{width: "100%", flexDirection: "row", alignItems: "center", gap: 10,}}>
          <ProfileImg size={35} profileImg={sender.profileImg} />
          {achievement && <ImageContain source={achievement.icon} size={35} style={{zIndex: 1, marginLeft: -10}} />}
          <View style={{flexShrink: 1}}>
            <Text style={{flexDirection: "row", alignItems: "center", }}>
              <DisplayName name={sender.username} premium={sender.premium} usernameDecoration={sender.usernameDecoration} fontSize={18} style={{ }} makeText={true} />
              {!achievement ? (
                <Text style={{fontSize: 15, color: "white", fontWeight: 300 }} > completed a workout!</Text>
              ) : (
                <Text style={{fontSize: 15, color: "white", fontWeight: 300 }} >{" achieved"} <Text style={{fontWeight: "800"}}> {firstCapital(achievement.key)} </Text> {"for completing 200 lifetime workouts!" } </Text>
              )}
            </Text>
          </View>
        </View>
        
        {/* Data */}
        <View style={{width: "100%"}}>
          {(activity.type === "complete_workout" || activity.type === "complete_workout_achievement") && (
            <View style={{flex: 1}}>
              
              {/* Workout */}
              <Pressable onPress={()=> { viewWorkout(activity.details.workout)}} style={[styles.selectWorkout, styles.boxShadow]} >
                <PastWorkoutCard
                  disablePress={true}
                  data={activity.details.workout}
                  />
              </Pressable>
              
            </View>
          )}

          {/* Reactions */}
          <View style={{width: "100%", flexDirection: "row", flexWrap: "wrap", gap: 5, paddingRight: 50, minHeight: 40, paddingBottom: 10}}>
            {/* Add emoji */}
            <Pressable onPress={openAddReaction} style={[styles.reaction, {position: "absolute", right: 0, top: 0}]}>
              <ImageContain size={25} source={addReaction} />
            </Pressable>
            {/* View reactions and all reactions */}
            {emojis.length > 0 && (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <Pressable onPress={openViewReactions} style={[styles.reaction]}>
                  <ImageContain size={25} source={eye} />
                </Pressable>
              </Animated.View>
              
            )}
            {emojis.map(emoji => {
              const chosen = reactions[emoji]?.includes(user.dbId);
              return (
                <Animated.View key={emoji} entering={FadeIn} exiting={FadeOut}>
                  <Pressable key={emoji} onPress={() => {selectEmoji(chosen ? "" : emoji)}} style={[styles.reaction, chosen && {backgroundColor: "#3D52A6"}]}>
                    <ImageContain size={25} source={icons[emoji+"Emoji"]} />
                    <Text style={{color: "white", fontSize: 15, marginLeft: 5, fontWeight: "600"}}>{reactions[emoji].length}</Text>
                  </Pressable>
                </Animated.View>
                
              )
              
            })}



          </View>

        </View>
    </View>
    </>
    
  )
}

const FriendsIndex = () => {
  const user = useUserStore(state => state.user);
  const updateUser = useUserStore(state => state.updateUser);

  const {showAlert} = useBottomSheet();

  const recentActivity = user.recentActivity;
  const sectionalData = groupActivityByDate(recentActivity);

  const [refreshing, setRefreshing] = useState(false);
  const [showingNotifications, setShowingNotifications] = useState(false);


  const showSearch = () => {
    router.push("/dashboard/friends/searchFriends");
  }

  

  const onRefresh = async () =>  {
    setRefreshing(true);
    const authResponse = await auth(user.jsonWebToken);
    if (authResponse.status !== "success") {
      // Check if error was network issue of error auth
      if (authResponse.status === "network_error") {
        // Network error, sign in to loca account
        console.log("network error, sign into local account");
        showAlert(authResponse.message, false);
      } else {
        // Auth error, signing out
        console.log("auth error");
        showAlert(authResponse.message, false); 
      }
    } else {

      //showAlert("Successfully authenticated", true);
      const {userInfo} = authResponse;
      updateUser(userInfo);
    }
    //await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

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
  const requestDeclineAcceptUser = async (person) => { 
    console.log("Unadd user");
    // Client side
    updateUser({friendRequests: user.friendRequests.filter(f => f._id !== person._id)});
    // send server request
    const response = await sendData("/dashboard/rejectuser", {jsonWebToken: user.jsonWebToken, person});
    if (response.status !== "success") return showAlert(response.message, false);
    // Send socket
    socket.emit("send_reject_user", {jsonWebToken: user.jsonWebToken, person, userInfo: response.freshUserInfo});
    //showAlert("User rejected.", true);
  }

  let bellNotification = false;
  if (user.friendRequests.filter(u => u.read === false).length > 0) bellNotification = true;

  const showNotifications = async () => {
    setShowingNotifications(true);
    if (!bellNotification) return;
    // mark all notis read on client
    const newFriendRequests = user.friendRequests.map(fr => {
      return {...fr, read: true}
    });
    updateUser({friendRequests: newFriendRequests});
    // send to server to read all
    console.log("Sending readallnotis");
    const response = await sendData("/dashboard/readallnotis", ({jsonWebToken: user.jsonWebToken}));
    if (response.status !== "success") return showAlert(response.message, false);
  }

  return (
    <ThemedView style={styles.container}>

      {showingNotifications && (
          <Portal >
              <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", width: screenWidth, height: screenHeight, zIndex: 2}} >

                  <Pressable onPress={() => setShowingNotifications(false)} style={{height: "100%", width: "100%", zIndex: 0}}></Pressable>

                  {/* Each wiget goes here */}
                  <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={{position: "absolute", width: screenWidth-20, top: 50, left: 10, zIndex: 2}}>

                    {/* Friend requests widget */}
                    <View style={{backgroundColor: "#313131", padding: 10, borderRadius: 15}} >
                      <Text style={{color: "white", fontSize: 13}}>Friend requests</Text>
                      {user.friendRequests.length === 0 && (
                        <View style={{width: "100%"}}>
                          <Text style={{color: "#a5a5a5ff", fontSize: 13, textAlign: "center", marginTop: 10}}>No friend requests</Text>
                        </View>
                      )}

                      {user.friendRequests.map(friend => {
                        return (
                          <View key={friend._id} style={{flexDirection: "row", alignItems: "center", marginTop: 10, height: 50}}>
                            <ProfileImg profileImg={friend.profileImg} size={40} />
                            <DisplayName fontSize={15} name={friend.username} usernameDecoration={friend.usernameDecoration} premium={friend.premium} style={{marginLeft: 10}} />

                            <Pressable onPress={() => {requestAcceptUser(friend)}} style={{height: 40, paddingHorizontal: 15, borderRadius: 10, backgroundColor: Colors.primaryBlue, justifyContent: "center", alignItems: "center", marginLeft: "auto", marginRight: 10}}>
                              <Text style={{color: "white", fontWeight: "600"}}>Accept</Text>
                            </Pressable>
                            <Pressable onPress={() => {requestDeclineAcceptUser(friend)}} style={{height: 50, width: 20, justifyContent: "center", alignItems: "center"}}>
                              <ImageContain source={greyX} imgStyle={{tintColor: "#929292ff"}} size={20} />
                            </Pressable>
                          </View>
                        )
                      })}

                    </View>

                  </Animated.View>

              

              </Animated.View>
          </Portal>
          
        )}
      
        <SafeAreaView style={{flex: 1}} >
          
          <TitleWithBack
          title={"Friends"}
          backBtn={false}
          actionBtnIconStyles={{height: 25, width: 25}}
          leftActionBtn={{active: true, image: require("../../../assets/icons/notification.png"), action: showNotifications, }}
          leftActionBtnIconStyles={{height: 20, width: 20}}
          actionBtn={{active: true, image: require("../../../assets/icons/searchUser.png"), action: showSearch, }}
          leftBtnNotification={bellNotification}
          />

          <Spacer height={10} />
          
          {recentActivity.length === 0 && (
            <View style={{width: "100%", marginTop: 20 }}>
              <ThemedText style={{textAlign: "center"}}>Activity will be shown here!</ThemedText>
            </View>
          )}

          <SectionList
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"white"} />}
                refreshing={refreshing}
                keyboardDismissMode={"on-drag"}
                sections={sectionalData}
                keyExtractor={(item) => item._id}
                renderItem={({item}) => (
                  <Activity
                  key={item._id}
                  activity={item}
                  />
                )}
                showsVerticalScrollIndicator={false}
                renderSectionHeader={({section: {title}}) => (
                  <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionHeaderLabel}>{title}</Text>
                  </View>
                )}
                style={{flex: 1,}}
                contentContainerStyle={{ paddingBottom: 120, paddingTop: 20, flexGrow: 1 }}
              />

            
        </SafeAreaView>
    </ThemedView>
  )
}

export default FriendsIndex

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 0,
    },
    sectionHeaderContainer: {
      borderTopColor: "#383838",
      borderTopWidth: 1,
      backgroundColor: Colors.dark.background,
      height: 40,
      justifyContent: "center",
    },
    sectionHeaderLabel: {
      color: Colors.primaryOrange,
      paddingLeft: 25,
      fontSize: 20,
      fontWeight: "500",
    },
    selectWorkout: {
      marginHorizontal: 0,
    },
    linearGradient: {
      flex: 1,
      height: 80,
      borderRadius: 15,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      backgroundColor: "#2A2A2A",
    },
    reaction: {
      height: 30,
      borderRadius: 8,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 5,
      paddingVertical: 3,
      backgroundColor: "#484848",

    }
    
  })