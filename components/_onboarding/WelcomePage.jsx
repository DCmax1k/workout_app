import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'
import Spacer from '../Spacer'
import figureOneWeight from "../../assets/onboarding/figureOneWeight.png"
import googleIcon from "../../assets/onboarding/googleIcon.png"
import appleIconWhite from "../../assets/onboarding/appleIconWhite.png"


const WelcomePage = () => {

  const login = () => {
    // ReLogin user
    if (Object.keys(users).length > 0) {
      setUser(JSON.parse(JSON.stringify(users[Object.keys(users)[0]])));
    } else {
      setUser(JSON.parse(JSON.stringify(USER)));
    }
  }

  return (
    <ThemedView style={{flex: 1, padding: 30}}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <View style={{flexDirection: "column",}}>
            <Spacer height={20} />

            <Text style={{color: "#6684FF", fontSize: 30,  fontFamily: "Bals-Bold"}}>WRONG</Text>
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

              <Text style={{color: "white", fontSize: 13}}>or login with email</Text>
              
              <Spacer />

              <View style={{height: 80, backgroundColor: "#6684FF", width: "100%", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                <Text style={{color: "white", fontSize: 30, fontFamily: "Bals-Bold"}}>Sign up</Text>
              </View>

            </View>

            <Spacer height={20} />

            <View style={{flexDirection: "row"}}>
              <Text style={{color: "white", fontSize: 13}}>You already have an account?</Text>
              <Pressable style={{marginLeft: 5}} onPress={login}>
                <Text style={{color: "#8FA6FF", fontSize: 13}}>Login</Text>
              </Pressable>
            </View>
            
            
            

          </View>
        </ScrollView>
        

        

      </SafeAreaView>
    </ThemedView>
  )
}

export default WelcomePage

const styles = StyleSheet.create({})