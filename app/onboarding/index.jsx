import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import ThemedView from '../../components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import Spacer from '../../components/Spacer';
import figureOneWeight from "../../assets/onboarding/figureOneWeight.png";
import googleIcon from "../../assets/onboarding/googleIcon.png";
import appleIconWhite from "../../assets/onboarding/appleIconWhite.png";
import { useUserStore } from '../../stores/useUserStore';
import { Redirect, useRouter } from 'expo-router';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const OnboardingIndex = () => {

    const users = useUserStore((state) => state.users);
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state => state.setUser));
    const router = useRouter();
    // Login automatically
    useEffect(() => {
        const timoutId = setTimeout(() => {

            // RESET USER
            //setUser(JSON.parse(JSON.stringify(USER)));


            // ReLogin user
            // if (Object.keys(users).length > 0) {
            //   setUser(JSON.parse(JSON.stringify(users[Object.keys(users)[0]])));
            // } 
            

        }, 1000);

        return () => clearTimeout(timoutId);
    }, []);

    

    const goToLogin = () => {
        router.push("/onboarding/loginPage");
    }
    const goToSignUp = () => {
        router.push("/onboarding/signUpPage");
    }

    return user ? (
            <Redirect href={"/dashboard"} />
        )
        : (
            <ThemedView style={{flex: 1, height: screenHeight, width: screenWidth}}>
                <SafeAreaView style={{flex: 1}}>
                    <ScrollView style={{flex: 1, padding: 30,}}>
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

                            <View style={{backgroundColor: "white", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 999999}}>
                                <Image style={{height: 30, width: 30, marginRight: 15, objectFit: "contain"}} source={googleIcon} />
                                <Text style={{fontSize: 17}}>Sign in with Google</Text>
                            </View>

                            <Spacer />

                            <View style={{backgroundColor: "black", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 999999, borderColor: "white", borderWidth: 1}}>
                                <Image style={{height: 30, width: 30, marginRight: 15, objectFit: "contain"}} source={appleIconWhite} />
                                <Text style={{fontSize: 17, color: "white"}}>Sign in with Apple </Text>
                            </View>

                            </View>

                            <Spacer />

                            <View style={{alignItems: "center",}}>

                            <Text style={{color: "white", fontSize: 13}}>or continue with email</Text>
                            
                            <Spacer />

                            <Pressable onPress={goToSignUp} style={{height: 80, backgroundColor: "#6684FF", width: "100%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                <Text style={{color: "white", fontSize: 30, fontFamily: "Bals-Bold"}}>Sign up</Text>
                            </Pressable>

                            </View>

                            <Spacer height={20} />

                            <View style={{flexDirection: "row"}}>
                                <Text style={{color: "white", fontSize: 13}}>You already have an account?</Text>
                                <Pressable style={{marginLeft: 5}} onPress={goToLogin}>
                                    <Text style={{color: "#8FA6FF", fontSize: 13}}>Login</Text>
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