import { Dimensions, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import ThemedView from '../../components/ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'
import Spacer from '../../components/Spacer'
import figureOneWeight from "../../assets/onboarding/figureOneWeight.png";
import googleIcon from "../../assets/onboarding/googleIcon.png";
import appleIconWhite from "../../assets/onboarding/appleIconWhite.png";
import { useUserStore } from '../../stores/useUserStore'
import { TestUsers } from '../../constants/TestUsers'
import { Redirect, useRouter } from 'expo-router'
import ThemedTextInput from '../../components/workout/ThemedTextInput'

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const USER = TestUsers[0]; // Default user

const SignUpPage = () => {

    const users = useUserStore((state) => state.users);
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state => state.setUser));
    const updateOptions = useUserStore((state) => state.updateOptions);
    const router = useRouter();

    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const goToSignUp = () => {
        router.navigate("/onboarding/signUpPage");
    }

    const loginToTestUser = () => {
        // ReLogin user
        if (Object.keys(users).length > 0) {
            setUser(JSON.parse(JSON.stringify(users[Object.keys(users)[0]])));
        } else {
            setUser(JSON.parse(JSON.stringify(USER)));
        }
        updateOptions({animateDashboard: true});
        router.replace("/dashboard")
    }

    const goToLogin = () => {
        router.replace("/onboarding/loginPage");
    }

    
  return (
    <ThemedView style={{flex: 1, height: screenHeight, width: screenWidth}}>
                <SafeAreaView style={{flex: 1, marginBottom: -50}}>
                    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? "padding" : "height"} >
                     <ScrollView style={{flex: 1, padding: 30,}} contentContainerStyle={{paddingBottom: 150}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                        <View style={{flexDirection: "column",}}>
                            <Spacer height={20} />

                            <Text style={{color: "#6684FF", fontSize: 30,  fontFamily: "Bals-Bold"}}>Sign Up</Text>
                            <Spacer height={10} />
                            <Text style={{color: "white", fontSize: 17, fontFamily: "Exo2-ExtraLight"}}>Create an account to start crushing your workouts!</Text>
                            <Spacer height={20} />

                            {/* Third party logins */}
                            <View style={{alignItems: "center",}}>

                                <Pressable onPress={() => router.back()} style={{backgroundColor: "white", flexDirection: "row",  alignItems: "center", height: 50, paddingRight: 20, paddingLeft: 10, borderRadius: 999999}}>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <Image style={{height: 40, width: 40, marginRight: 15, objectFit: "contain", tintColor: "black", marginRight: -3, transform: [{translateY: -2}]}} source={appleIconWhite} />
                                        <Image style={{height: 27, width: 27, marginRight: 15, objectFit: "contain"}} source={googleIcon} />
                                    </View>
                                    
                                    <Text style={{fontSize: 17}}>Use 3rd party sign in</Text>
                                </Pressable>

                                {/* <Spacer height={20} />

                                <View style={{backgroundColor: "black", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 999999, borderColor: "white", borderWidth: 1}}>
                                    <Image style={{height: 30, width: 30, marginRight: 15, objectFit: "contain"}} source={appleIconWhite} />
                                    <Text style={{fontSize: 17, color: "white"}}>Sign in with Apple </Text>
                                </View> */}

                            </View>

                            <Spacer height={20} />

                            <View style={{alignItems: "center",}}>

                                <Text style={{color: "white", fontSize: 13, fontFamily: "DoppioOne-Regular"}}>or sign up with email</Text>
                                
                                <Spacer height={20} />

                                {/* Inputs */}
                                <View style={{width: screenWidth, flexDirection: "column", alignItems: "center"}}>
                                    <ThemedTextInput placeholder='Username' value={username} onChange={(value) => setUsername(value)} />
                                    <Spacer height={20} />
                                    <ThemedTextInput placeholder='Email' value={email} onChange={(value) => setEmail(value)} />
                                    <Spacer height={20} />
                                    <ThemedTextInput placeholder='Password' value={password} onChange={(value) => setPassword(value)} type='password' />
                                </View>

                                <Spacer />

                                {/* Big blue button */}
                                <Pressable onPress={loginToTestUser} style={{height: 80, backgroundColor: "#6684FF", width: "100%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                    <Text style={{color: "white", fontSize: 30, fontFamily: "Bals-Bold"}}>Sign up</Text>
                                </Pressable>

                            </View>

                            <Spacer height={20} />

                            {/* Don't have an account? */}
                            <View style={{flexDirection: "row"}}>
                                <Text style={{color: "white", fontSize: 13, fontFamily: "DoppioOne-Regular"}}>You already have an account?</Text>
                                <Pressable style={{marginLeft: 5}} onPress={goToLogin}>
                                    <Text style={{color: "#8FA6FF", fontSize: 13, fontFamily: "DoppioOne-Regular"}}>Login</Text>
                                </Pressable>
                            </View>
                            
                            
                            

                        </View>
                    </ScrollView>
                    </KeyboardAvoidingView>

                    

                </SafeAreaView>
            </ThemedView>
  )
}

export default SignUpPage

const styles = StyleSheet.create({})