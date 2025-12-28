import { Dimensions, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ThemedView from '../../components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import Spacer from '../../components/Spacer';
import figureOneWeight from "../../assets/onboarding/figureOneWeight.png";
import googleIcon from "../../assets/onboarding/googleIcon.png";
import appleIconWhite from "../../assets/onboarding/appleIconWhite.png";
import { useUserStore } from '../../stores/useUserStore';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { TestUsers } from "../../constants/TestUsers";
import ThemedTextInput from '../../components/ThemedTextInput';
import sendData from '../../util/server/sendData';
import auth from '../../util/server/auth';
import AlertNotification from '../../components/AlertNotification';
import { generateUniqueId } from '../../util/uniqueId';
import Constants from "expo-constants";

const isExpoGo = Constants.executionEnvironment === "storeClient";

let GoogleSignin = null;

if (!isExpoGo) {
  ({
    GoogleSignin,
  } = require("@react-native-google-signin/google-signin"));
}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const CreateUsernamePage = () => {

    const users = useUserStore((state) => state.users);
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state => state.setUser));
    const updateOptions = useUserStore((state) => state.updateOptions);
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const alertRef = useRef(null);

    const params = useLocalSearchParams();
    const data = JSON.parse(params.data);
    const { partyType, idToken, name, email, photo } = data;

    const goBack = () => {
        // Potentially have to log out of the google/apple account here
        router.back();
    }

    const checkUsername = async () => {
        const check = await sendData("/login/checkusername", {username});
        return check.status === "success";
    }

    const signup = async () => {
        if (username.length === 0) return;
        const check = await checkUsername();
        if (!check) return alertRef.current.showAlert("Username taken", false);
        setLoading(true);
        const response = await sendData('/login/createaccount', 
            {
                partyType,
                idToken,
                email,
                username,
            }
        );
        if (response.status !== "success") {
            setLoading(false);
            console.log("Error:'", response.message);
            alertRef.current.showAlert(response.message, false);
            return;
        } 
        const userInfo = response.userInfo;
        const newUser = {
            _id: generateUniqueId(),
            username: userInfo.username,
            email: userInfo.email,
            dbId: userInfo.dbId,
            jsonWebToken: userInfo.jsonWebToken,
        }
        if (partyType==='google') {
            newUser.googleId = idToken;
        } else if (partyType === "apple") {
            newUser.appleId = idToken;
        }
        setUser(newUser);
        updateOptions({animateDashboard: true});
        router.replace("/dashboard")

        
        
    }

    // Not using yet but may be moved to profile to actually sign out google user
    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
            // setUser(null);
        } catch (error) {
            console.error(error);
        }
    };

    

  return (
    <ThemedView style={{flex: 1, height: screenHeight, width: screenWidth}}>
        <AlertNotification ref={alertRef} />
        <SafeAreaView style={{flex: 1, marginBottom: -50}}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? "padding" : "height"} >
            <ScrollView style={{flex: 1, padding: 30,}} contentContainerStyle={{paddingBottom: 150}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                <View style={{flexDirection: "column",}}>
                    <Spacer height={20} />

                    <Text style={{color: "#6684FF", fontSize: 30,  fontFamily: "Bals-Bold"}}>3rd party sign in</Text>
                    <Spacer height={10} />
                    <Text style={{color: "white", fontSize: 17, fontFamily: "Exo2-ExtraLight"}}>Please create a username to start.</Text>

                    <Spacer height={20} />

                    <View style={{alignItems: "center",}}>

                        {/* Inputs */}
                        <View style={{width: screenWidth, flexDirection: "column", alignItems: "center"}}>
                            <ThemedTextInput placeholder='Username' value={username} onChange={(value) => setUsername(value)} />
                        </View>

                        <Spacer />

                        {/* Big blue button */}
                        <Pressable onPress={signup} style={{height: 80, backgroundColor: "#6684FF", width: "100%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{color: "white", fontSize: 30, fontFamily: "Bals-Bold"}}>{loading ? "Loading...":"Create"}</Text>
                        </Pressable>

                    </View>

                    <Spacer height={20} />

                    {/* go back */}
                    <View style={{flexDirection: "row"}}>
                        <Pressable style={{marginLeft: 5}} onPress={goBack}>
                            <Text style={{color: "#8FA6FF", fontSize: 13, fontFamily: "DoppioOne-Regular"}}>Leave</Text>
                        </Pressable>
                    </View>
                    
                    
                    

                </View>
            </ScrollView>
            </KeyboardAvoidingView>

            

        </SafeAreaView>
    </ThemedView>
  )
}

export default CreateUsernamePage

const styles = StyleSheet.create({})