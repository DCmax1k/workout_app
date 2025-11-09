import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../../../components/ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'
import ThemedText from '../../../components/ThemedText'
import { useUserStore } from '../../../stores/useUserStore'
import Spacer from '../../../components/Spacer'
import TitleWithBack from '../../../components/TitleWithBack'
import { Colors } from '../../../constants/Colors'
import ConfirmMenu from '../../../components/ConfirmMenu'
import { generateUniqueId } from '../../../util/uniqueId'
import ActionMenu from '../../../components/ActionMenu'
import trashIcon from '../../../assets/icons/trash.png'
import rotateIcon from '../../../assets/icons/rotate.png'
import BlueButton from '../../../components/BlueButton'
import uploadData from '../../../util/server/uploadData'
import { Portal } from 'react-native-paper'
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated'
import ViewDownloadedData from '../../../components/extra/ViewDownloadedData'
import { useBottomSheet } from '../../../context/BottomSheetContext'


const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const AccountRecovery = () => {
    const {showAlert} = useBottomSheet();

    const users = useUserStore(state => state.users);
    const user = useUserStore(state => state.user);
    const setUser = useUserStore(state => state.setUser);
    const hardSetUsers = useUserStore(state => state.hardSetUsers);

    const usersIds = Object.keys(users);

    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState();

    const [loadingBackup, setLoadingBackup] = useState(false);

    const [previewDownloadedData, setPreviewDownloadedData] = useState(false);

    const showSameUser = () => {
        setConfirmMenuData({
            title: "User currently logged in as",
            subTitle: "The user you selected is the current user you are signed in as.",
            subTitle2: "No action can be done.",
            option1: "Okay!",
            option1color: "#546FDB",
            confirm: () => setConfirmMenuActive(false),
        });
        setConfirmMenuActive(true);
    }

    const replaceUser = (id) => {
        const userToSet = users[id];
        // user would be the new user they hopefully created an account with from the db - Username, dbId, login info,
        const userInfoToCarryOver = {
            recentActivity: user.recentActivity,
            jsonWebToken: user.jsonWebToken,
            dbId: user.dbId,
            username: user.username,
            usernameDecoration: user.usernameDecoration,
            name: user.name,
            email: user.email,
            dateJoined: user.dateJoined,
            rank: user.rank,
            premium: user.premium,
            friendRequests: user.friendRequests,
            friendsAdded: user.friendsAdded,
            friends: user.friends,
            subscriptions: user.subscriptions,
            profileImg: user.profileImg,
            trouble: user.trouble,
            googleId: user.googleId,
            appleId: user.appleId,
            facebookId: user.facebookId,

        }
        const newUser = {...userToSet, _id: user._id, ...userInfoToCarryOver};
        setUser(newUser);
    }

    const selectUser = (id) => {
        if (id === user._id) return showSameUser(); 
        setConfirmMenuData({
            title: "Are you sure?",
            subTitle: "The user data for '" + users[id].username + "' is about to overwrite data for '" + user.username +"'!",
            subTitle2: "This action cannot be undone. Are you sure you would like to continue?",
            option1: "Overwrite",
            option1color: Colors.protein,
            option2: "Cancel",
            confirm: () => replaceUser(id),
        });
        setConfirmMenuActive(true);
    }

    const removeAccountFromDevice = (id) => {
        const newUsers = JSON.parse(JSON.stringify(users));
        delete newUsers[id];
        if (id === user._id) {
            setUser(null);
        }
        hardSetUsers(newUsers);
    }

    const requestRemoveAccountFromDevice = (id) => {
        // setConfirmMenuData({
        //     title: "Delete user data?",
        //     subTitle: "The user data for '" + users[id].username + "' is about to be deleted!",
        //     subTitle2: "This action cannot be undone. Are you sure you would like to continue?",
        //     option1: "Delete",
        //     option1color: Colors.redText,
        //     option2: "Cancel",
        //     confirm: () => removeAccountFromDevice(id),
        // });
        //setConfirmMenuActive(true);
        setConfirmMenuData({
            title: "I don't think so..",
            subTitle: "This option is currently disabled to protect beta testers.",
            subTitle2: "",
            option1: "Okay",
            option1color: Colors.primaryBlue,
            confirm: () => {setConfirmMenuActive(false);},
        });
        setConfirmMenuActive(true);
    }

    const signOut = () => {
        setUser(null);
    }

    const backupAllData = async () => {
        setLoadingBackup(true);
        const backupResponse = await uploadData(user);
        if (backupResponse.status !== "success") {
            setLoadingBackup(false);
            // setConfirmMenuData({
            //     title: "Error",
            //     subTitle: "An error occured while attempting backup.",
            //     subTitle2: "Please try again later.",
            //     option1: "Okay",
            //     option1color: Colors.primaryBlue,
            //     confirm: () => {setConfirmMenuActive(false);},
            // });
            // setConfirmMenuActive(true);
            showAlert("An error occured while attempting backup.", false);
            setTimeout(() => {
                showAlert("Please try again later.", false);
            }, 500);
            
            return;
        }
        setLoadingBackup(false);
        // setConfirmMenuData({
        //     title: "Success",
        //     subTitle: "Your data has been backed up.",
        //     subTitle2: "",
        //     option1: "Whoo-hoo!",
        //     option1color: Colors.primaryBlue,
        //     confirm: () => {setConfirmMenuActive(false);},
        // });
        // setConfirmMenuActive(true);
        showAlert("Your data has been successfully backed up.");
    }
    



  return (
    <ThemedView style={{flex: 1, paddingHorizontal: 20}}>
        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
        <SafeAreaView style={{flex: 1}}>  

            <TitleWithBack title={"Account Recovery"} style={{marginHorizontal: -20,}} />
            <Spacer />

            <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 120}}>
                <View style={{alignItems: "center",}}>
                    {user._id === "1" && (
                        <View>
                            <ThemedText style={{textAlign: "center", fontSize: 15, fontWeight: "800", color: "white"}}>!! -  You are still on a beta account.  - !!</ThemedText>
                            <Spacer height={10} />
                            <ThemedText style={{textAlign: "center", fontSize: 13, fontWeight: "300", color: "white"}}>Follow the instructions below to backup your account</ThemedText>
                            <Spacer height={40} />
                            <ThemedText style={{textAlign: "center"}}> Sign out, create a new account, then come back here to transfer your beta account data to your new account.</ThemedText>
                            <Spacer height={10} />
                            <ThemedText style={{textAlign: "center"}}> Following that, you may proceed with backing up data from the account to your created account.</ThemedText>
                            <Spacer height={10} />
                            <BlueButton onPress={signOut} title={"Sign out"} />
                        </View>
                    )}
                    {user._id !== "1" && (
                        <View>
                            <ThemedText style={{textAlign: "center"}}>All device saved users shown below.</ThemedText>
                            <ThemedText style={{textAlign: "center"}}>Select the user below you would like to transfer data from to your current user.</ThemedText>

                            <Spacer height={10} />

                            <View>
                                {usersIds.map(uId => {

                                    const u = users[uId];

                                    const actionMenuData = [
                                        {title: "Transfer data from " + u.username, icon: rotateIcon, onPress: () => selectUser(uId) },
                                        {title: "Remove Account from Device", icon: trashIcon, onPress: () => requestRemoveAccountFromDevice(uId), color: Colors.redText },
                                    ];

                                    return (
                                        <Pressable onPress={() => {selectUser(uId)}} key={uId} style={{width: screenWidth-40, marginBottom: 10, backgroundColor: uId===user._id?"#686868ff":Colors.primaryBlue, padding: 10, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                            <View>
                                                <Text style={{color: "white"}}>{u.username} {uId==="1"?"- {Beta User}":""} {uId===user._id?"- Current":""}</Text>
                                                <Text style={{color: "white"}}>{u.savedWorkouts.length} workout{u.savedWorkouts.length===1?"":"s"}</Text>
                                            </View>
                                            <ActionMenu data={actionMenuData} style={{height: 50, width: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.primaryOrange}} />
                                            
                                        </Pressable>
                                    )
                                    
                                })}
                            </View>

                            <Spacer height={20} />

                            <ThemedText style={{textAlign: "center"}}>After doing the above step, you can now backup your data.</ThemedText>
                            <Spacer height={10} />
                            <ThemedText style={{textAlign: "center"}}>All the data like your saved workouts, schedule, nutritional data, and more are not yet backed up to the server!</ThemedText>
                            <Spacer height={10} />
                            <ThemedText style={{textAlign: "center"}}>To ensure you can access your workouts after, for example, deleting the app...</ThemedText>
                            <Spacer height={10} />
                            <ThemedText style={{textAlign: "center"}}>...back them up with this button!</ThemedText>
                            <Spacer height={20} />
                            <BlueButton title={loadingBackup ? "Loading..." : "Backup all data"} onPress={backupAllData} />

                            <Spacer />
                            <ThemedText style={{textAlign: "center"}}>To verify your data has been backed up,</ThemedText>
                            <Spacer height={5} />
                            <ThemedText style={{textAlign: "center"}}>Fetch and view data that is backed up here.</ThemedText>
                            <Spacer height={10} />
                            <BlueButton title={"Download data and view"} onPress={() => {setPreviewDownloadedData(true)}} />

                        </View>
                    )}
                    
                </View>
            </ScrollView>

            
        </SafeAreaView>

        {previewDownloadedData && (
            <Portal>
                <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={{position: "absolute", top: 0, left: 0, height: screenHeight, width: "100%", zIndex: 5, elevation: 5}}>
                    
                        <ViewDownloadedData closeScreen={() => setPreviewDownloadedData(false)} />
                    
                </Animated.View>
            </Portal>
        )}
    </ThemedView>
  )
}

export default AccountRecovery

const styles = StyleSheet.create({})