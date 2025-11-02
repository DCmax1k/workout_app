import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import ThemedView from './ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'
import ThemedText from './ThemedText'
import ImageContain from './ImageContain'
import loaderIcon from '../assets/icons/loader.png'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

const Loading = ({style, text="Loading...", ...props}) => {

    const rotation = useSharedValue(0);

    useEffect(() => {

        rotation.value = withRepeat( withTiming(360, { duration: 1000, easing: Easing.linear }), -1, false );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

  return (
    <ThemedView style={[{flex: 1}, style]} {...props}>
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>

                <Animated.View style={[{ marginRight: 10 }, animatedStyle]}>
                    <ImageContain size={20} source={loaderIcon} />
                </Animated.View>
                <ThemedText>{text}</ThemedText>

            </View>
            
        </SafeAreaView>
    </ThemedView>
  )
}

export default Loading

const styles = StyleSheet.create({})