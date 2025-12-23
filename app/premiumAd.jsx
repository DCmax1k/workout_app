import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ImageContain from '../components/ImageContain';
import { Image } from 'expo-image';
import premiumBadge from '../assets/icons/premiumBadge.png'
import whiteX from '../assets/icons/whiteX.png'
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import Spacer from '../components/Spacer';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import PopupSheet from '../components/PopupSheet';
import BlueButton from '../components/BlueButton';
import * as WebBrowser from 'expo-web-browser';
import { useUserStore } from '../stores/useUserStore';

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const RadialBackground = () => {
    return (
        <Svg height="100%" width="100%" style={{ position: 'absolute',}}>
            <Defs>
            <RadialGradient
                id="grad"
                cx="50%"    
                cy="0%"     // Keeps the origin at the top
                rx="100%"   // Widens the ellipse to cover the edges
                ry="100%"   // <--- INCREASE THIS (e.g., 100% to 150%) to push color down
                fx="50%"    
                fy="0%"     
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset="0%" stopColor="#2F3E7C" stopOpacity="1" />
                <Stop offset="100%" stopColor="#2b2b2b" stopOpacity="0.95" />
            </RadialGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
        </Svg>
    )
}

const FeatureCard = ({card, ...props}) => {
    return (
        <View style={[ {height: 100, borderRadius: 15, paddingVertical: 5,}]}>
                <View style={{height: "100%", width: "100%", backgroundColor: "#3b487cff", borderRadius: 10, flexDirection: "row", alignItems: 'center', justifyContent: "space-between", paddingHorizontal: 10,}}>
                <ImageContain source={card.icon} imgStyle={card.tintColor ? {tintColor: card.tintColor} : null} size={40} />
                <View style={{flex: 1, marginLeft: 10,}}>
                    <Text style={{color: "white", fontSize: 20, fontWeight: "800", marginBottom: -3 }} >{card.title}</Text>
                    <Text style={{ color: "#CDCDCD", fontSize: 13, fontWeight: "400", paddingRight: 20, }} >{card.desc}</Text>
                </View>
                </View>
        </View>
    )
}

const PremiumAdPage = () => {
    const user = useUserStore(state => state.user);

    const [popupMenuActive, setPopupMenuActive] = useState(false);

    const cards = [
        {
            title: "AI Tools",
            desc: "Scan meals, generate instant workouts, and get real-time coaching with AI.",
            icon: require("../assets/icons/aiSparkle.png"),
            tintColor: "#FF77F1",
        },
        {
            title: "Performance Analytics",
            desc: "Visualize your gains with deep-dive charts of your volume, strength, and pace.",
            icon: require("../assets/emojis/bicep.png"),
            tintColor: null,
        },
        {
            title: "Extended Graphs",
            desc: "Track your progress beyond the week—view monthly, yearly, and lifetime stats.",
            icon: require("../assets/emojis/progress.png"),
            tintColor: null,
        },
        {
            title: "Exclusive Reactions",
            desc: "React to friends activity in more ways!",
            icon: require("../assets/emojis/gem.png"),
            tintColor: null,
        },
    ]

    const handleOpenBrowser = async () => {
        console.log("Attempting to open browser...");
        try {
            let result = await WebBrowser.openBrowserAsync("https://pumpedup.digitalcaldwell.com/login", { presentationStyle: WebBrowser.WebBrowserPresentationStyle.OVER_FULL_SCREEN });
            console.log("Browser closed, result:", result);
        } catch (error) {
            console.error("Failed to open browser:", error);
        }
    };


  return (
    <View style={{flex: 1,  }}>
        <RadialBackground />
        <PopupSheet active={popupMenuActive} setActive={setPopupMenuActive}>
            <BlueButton onClick={() => {handleOpenBrowser()}} title={"Continue to Checkout"} />
        </PopupSheet>
        <SafeAreaView style={[{width: "100%", alignItems: "center", }]}>
            <Pressable onPress={() => router.back()} style={{position: "absolute", top: 50, right: 20, height: 30, width: 30, justifyContent: "center", alignItems: "center", opacity: 0.3, backgroundColor: "#ffffff83", borderRadius: 10, zIndex: 5 }}>
                <ImageContain source={whiteX} size={25} />
            </Pressable>
            <ScrollView style={{width: "100%", marginTop: -100, paddingTop: 100 }} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100, alignItems: "center",}}>

                <Spacer height={20} />
                <ImageContain source={premiumBadge} size={100} />
                <Spacer height={20} />
                <Text style={{fontSize: 28, color: "white", fontWeight: "800", textAlign: "center"}}>Pumped Up Premium</Text>
                <Text style={{fontSize: 15, color: "#BDBDBD", fontWeight: "400", textAlign: "center", marginHorizontal: 10}}>Tools for making hitting your goals easier.</Text>
                <Spacer />
                <View style={{width: "100%", paddingHorizontal: 20 }}>
                    {cards.map((card, i) => {
                        return (
                            <FeatureCard key={i} card={card} />
                        )
                    })}

                    <Spacer height={20} />
                    <Text style={{fontSize: 15, color: "#BDBDBD", fontWeight: "400", textAlign: "center", marginHorizontal: 10, marginBottom: 5}}>Get instant access to all Premium tools and every future update. Cancel anytime.</Text>
                    <Pressable onPress={() => handleOpenBrowser()} style={{width: "100%"}}>
                        <LinearGradient
                            style={[ {height: 60, width: "100%", borderRadius: 15, padding: 5, alignItems: "center", justifyContent: "center"}]}
                            colors={["#6C89FF", "#C030B2"]}
                            start={{ x: 0, y: 0 }} 
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={{color: "white", fontSize: 20, fontWeight: "600"}}>{user.premium ? "Manage Billing" : "Get Premium Now"}</Text>
                            
                        </LinearGradient>
                    </Pressable>
                    
                </View>

                

            </ScrollView>
            
            

        </SafeAreaView>
        
        
    </View>
  )
}

export default PremiumAdPage

const styles = StyleSheet.create({})