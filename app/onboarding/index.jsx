import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import ThemedView from '../../components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import Spacer from '../../components/Spacer';
import figureOneWeight from "../../assets/onboarding/figureOneWeight.png";
import googleIcon from "../../assets/onboarding/googleIcon.png";
import appleIconWhite from "../../assets/onboarding/appleIconWhite.png";
import { useUserStore } from '../../stores/useUserStore';
import { Redirect, useRouter } from 'expo-router';
// import { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import Constants from "expo-constants";
import auth from '../../util/server/auth';
import AlertNotification from '../../components/AlertNotification';
import sendData from '../../util/server/sendData';

const isExpoGo = Constants.executionEnvironment === "storeClient";

let GoogleSignin = null;
let isSuccessResponse = null;
let isErrorWithCode = null;
let statusCodes = null;

if (!isExpoGo) {
  ({
    GoogleSignin,
    isSuccessResponse,
    isErrorWithCode,
    statusCodes
  } = require("@react-native-google-signin/google-signin"));
}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const OnboardingIndex = () => {

    const users = useUserStore((state) => state.users);
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state => state.setUser));
    const updateOptions = useUserStore(state => state.updateOptions);
    const router = useRouter();
    // Login automatically
    useEffect(() => {
        if (isExpoGo || !GoogleSignin) return;
        GoogleSignin.configure({
            webClientId: '483624646164-7ckn41ljobh2p7cv4ig3ni4hg1s6e77o.apps.googleusercontent.com',
            iosClientId: "483624646164-htf0lctbmvq9cqm4vbi0t6vkk2v8f1rt.apps.googleusercontent.com",
            profileImageSize: 120,
        });
    }, []);

    const alertRef = useRef(null);

    const goToLogin = () => {
        router.push("/onboarding/loginPage");
    }
    const goToSignUp = () => {
        router.push("/onboarding/signUpPage");
    }


    // For testing purposes
    const handleGoogleSignIn = async () => {
        try {

            const {idToken, user} = {idToken: "test token", user: {name: "Dylan", email: "digitalcadlwell35@gmail.com", photo: null}};
            const {name, email, photo} = user;
            // Send info to create username page that will create the user if username defined
            const data = {
                partyType: "google",
                idToken,
                name,
                email,
                photo
            }
            // Check if account exists, if not send to create username page
            const checkUserExists = await sendData('/login/loginthirdparty', data);
            if (checkUserExists.status !== "success") {
                console.log("Error checking third party user.");
                alertRef.current.showAlert(checkUserExists.message, false);
                return;
            } else {
                if (checkUserExists.userFound) {
                    // Login user - below [block] is copied from loginPage.jsx
                    const { jsonWebToken } = checkUserExists;
                    //then call auth which will get userInfo to set with user
                    const authResponse = await auth(jsonWebToken);
                    if (authResponse.status !== "success") {
                        console.log("Error: ", authResponse.message);
                        alertRef.current.showAlert(authResponse.message, false);
                        return;
                    }
                    const {userInfo, fullLocalUser} = authResponse;
                    // Find user in users and set
                    const localUserIds = Object.keys(users);
                    const idx = localUserIds.findIndex(localId => users[localId].dbId === userInfo.dbId);
                    let userToSet;
                    if (idx > -1) {
                        // Local user found
                        userToSet = {...users[localUserIds[idx]], ...userInfo, jsonWebToken};
                    } else {
                        // Steal more data from db to complete user
                        const dbId = fullLocalUser._id;
                        const newLocalUser = {...fullLocalUser, _id: generateUniqueId(), dbId: dbId, jsonWebToken};
                        userToSet = newLocalUser;
                    }
                    setUser(userToSet);
                    updateOptions({animateDashboard: true});
                    router.replace("/dashboard");
                } else {
                    // Create account
                    router.push({
                        pathname: "/onboarding/createUsername",
                        params: {
                            data: JSON.stringify(data),
                        }
                    });
                }
            }

        } catch (error) {
            console.error(error);
        }
    };
    const _handleGoogleSignIn = async () => {
        if (isExpoGo || !GoogleSignin) return;
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            if (isSuccessResponse(response)) {
                const {idToken, user} = response.data;
                const {name, email, photo} = user;
                // Send info to create username page that will create the user if username defined
                const data = {
                    partyType: "google",
                    idToken,
                    name,
                    email,
                    photo
                }
                // Check if account exists, if not send to create username page
                const checkUserExists = await sendData('/login/loginthirdparty', data);
                if (checkUserExists.status !== "success") {
                    console.log("Error checking third party user.");
                    alertRef.current.showAlert(checkUserExists.message, false);
                    return;
                } else {
                    if (checkUserExists.userFound) {
                        // Login user - below [block] is copied from loginPage.jsx
                        const { jsonWebToken } = checkUserExists;
                        //then call auth which will get userInfo to set with user
                        const authResponse = await auth(jsonWebToken);
                        if (authResponse.status !== "success") {
                            console.log("Error: ", authResponse.message);
                            alertRef.current.showAlert(authResponse.message, false);
                            return;
                        }
                        const {userInfo, fullLocalUser} = authResponse;
                        // Find user in users and set
                        const localUserIds = Object.keys(users);
                        const idx = localUserIds.findIndex(localId => users[localId].dbId === userInfo.dbId);
                        let userToSet;
                        if (idx > -1) {
                            // Local user found
                            userToSet = {...users[localUserIds[idx]], ...userInfo, jsonWebToken};
                        } else {
                            // Steal more data from db to complete user
                            const dbId = fullLocalUser._id;
                            const newLocalUser = {...fullLocalUser, _id: generateUniqueId(), dbId: dbId, jsonWebToken};
                            userToSet = newLocalUser;
                        }
                        setUser(userToSet);
                        updateOptions({animateDashboard: true});
                        router.replace("/dashboard");
                    } else {
                        // Create account
                        router.push({
                            pathname: "/onboarding/createUsername",
                            params: {
                                data: JSON.stringify(data),
                            }
                        });
                    }
                }

            } else {
                // sign in was cancelled by user
                alertRef.current.showAlert("Google sign in was cancelled", false);
            }
        } catch (error) {
            if (isErrorWithCode(error)) {
            switch (error.code) {
                case statusCodes.IN_PROGRESS:
                // operation (eg. sign in) already in progress
                break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                // Android only, play services not available or outdated
                break;
                default:
                // some other error happened
            }
            } else {
            // an error that's not related to google sign in occurred
            }
        }
    };

    const handleAppleSignIn = async () => {
        
    }


    return user ? (
            <Redirect href={"/dashboard"} />
        )
        : (
            <ThemedView style={{flex: 1, height: screenHeight, width: screenWidth}}>
                <AlertNotification ref={alertRef} />
                <SafeAreaView style={{flex: 1}}>
                    <ScrollView style={{flex: 1, padding: 30,}} showsVerticalScrollIndicator={false}>
                        <View style={{flexDirection: "column",}}>
                            <Spacer height={20} />

                            <Text style={{color: "#6684FF", fontSize: 30,  fontFamily: "Bals-Bold"}}>Welcome</Text>
                            <Text style={{color: "white", fontSize: 17, fontFamily: "Exo2-ExtraLight"}}>Please login or sign up to start tracking your workouts.</Text>

                            <View style={{height: 200}}>
                                <Image style={{width: "100%", height: 200, objectFit: "contain",}} source={figureOneWeight} />
                            </View>

                            <Spacer />

                            {/* Third party logins */}
                            <View style={{alignItems: "center",}}>

                            <Pressable onPress={handleGoogleSignIn} style={{backgroundColor: "white", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 999999}}>
                                <Image style={{height: 30, width: 30, marginRight: 15, objectFit: "contain"}} source={googleIcon} />
                                <Text style={{fontSize: 17}}>Sign in with Google</Text>
                            </Pressable>

                            <Spacer />

                            {/* <Pressable onPress={handleAppleSignIn} style={{backgroundColor: "black", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 999999, borderColor: "white", borderWidth: 1}}>
                                <Image style={{height: 30, width: 30, marginRight: 15, objectFit: "contain"}} source={appleIconWhite} />
                                <Text style={{fontSize: 17, color: "white"}}>Sign in with Apple </Text>
                            </Pressable> */}

                            </View>

                            <Spacer />

                            <View style={{alignItems: "center",}}>

                            <Text style={{color: "white", fontSize: 13, fontFamily: "DoppioOne-Regular"}}>or continue with email</Text>
                            
                            <Spacer />

                            <Pressable onPress={goToSignUp} style={{height: 80, backgroundColor: "#6684FF", width: "100%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{color: "white", fontSize: 30, fontFamily: "Bals-Bold"}}>Sign up</Text>
                            </Pressable>

                            </View>

                            <Spacer height={20} />

                            <View style={{flexDirection: "row"}}>
                                <Text style={{color: "white", fontSize: 13, fontFamily: "DoppioOne-Regular"}}>You already have an account?</Text>
                                <Pressable style={{marginLeft: 5}} onPress={goToLogin}>
                                    <Text style={{color: "#8FA6FF", fontSize: 13, fontFamily: "DoppioOne-Regular"}}>Login</Text>
                                </Pressable>
                            </View>
                            
                            
                            

                        </View>
                    </ScrollView>
                    

                    

                </SafeAreaView>
            </ThemedView>
        )
}

export default OnboardingIndex

const styles = StyleSheet.create({})