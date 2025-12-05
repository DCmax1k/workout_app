import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'

import { Stack } from 'expo-router'
import { useUserStore } from '../../stores/useUserStore'
import Animated, { SlideOutUp } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import Spacer from '../../components/Spacer';
import { useRef, useState } from 'react';
import rightArrow from '../../assets/icons/rightArrow.png'
import TouchableScale from '../../components/TouchableScale'

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get('screen').width;

const OnboardingLayout = () => {

  const options = useUserStore(state => state.options);
  const updateOptions = useUserStore(state => state.updateOptions);

  const flatListRef = useRef(null);

  const showOnboardingPresentation = options.showOnboarding;
  const slidesData = [
    {
      id: '1',
      title: 'Crush your workouts',
      description: 'Log strength training, cardio, nutrition and more — stay on top of your progress.',
      image: require("../../assets/onboarding/figureHoldingBarbell.svg"),
    },
    {
      id: '2',
      title: 'Learn new exercises',
      description: 'Discover exercises to add to your routine.',
      image: require("../../assets/onboarding/figureOnPhoneDark.svg"),
    },
    {
      id: '3',
      title: 'Track your gains over time',
      description: 'Detailed stats, personal records, and health trends that keep you motivated.',
      image: require("../../assets/onboarding/figureRaceStart.svg"),
    },
    {
      id: '4',
      title: 'Fitness is better together',
      description: 'Train with friends, share workouts, and stay accountable.',
      image: require("../../assets/onboarding/figuresHighFive.svg"),
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0);

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index);
      }
    }).current;

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged }
  ]).current;



  const goToNextSlide = () => {
    console.log("Clicking");
    if (currentIndex < slidesData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // final slide close onboarding
      console.log("Close onboarding");
      updateOptions({showOnboarding: false});
    }
  };

  return (
    <View style={{flex: 1}}>
      <Stack screenOptions={{ headerShown: false,}} />

      {showOnboardingPresentation && (
        <Animated.View exiting={SlideOutUp} style={[StyleSheet.absoluteFill, {backgroundColor: Colors['dark'].background}]}>
          <SafeAreaView style={{flex: 1}}>
            {/* Dots */}
            <View style={[styles.dotsWrapper, {zIndex: 5}]}>
              {slidesData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    { opacity: currentIndex === index ? 1 : 0.3, width: currentIndex === index ? 16 : 8 }
                  ]}
                />
              ))}
            </View>
            {/* Floating button */}
            <View style={{position: 'absolute', width: screenWidth, bottom: screenHeight/6, zIndex: 6}}>
              <TouchableScale friction={3} activeScale={1.1} onPress={goToNextSlide} style={{marginHorizontal: "auto", height: 80, width: 80, backgroundColor: Colors.primaryBlue, borderRadius: 999999, justifyContent: "center", alignItems: "center"}}>
                <Image source={rightArrow} style={{height: 25, width: 25, }} contentFit='contain' />
              </TouchableScale>
            </View>

            <FlatList
            ref={flatListRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={slidesData}
            pagingEnabled
            bounces={false}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            renderItem={({item}) => {
              return (
                <View style={{width: screenWidth, height: screenHeight, alignItems: "center"}}>
                  <Spacer />
                  <Image source={item.image} style={{width: "100%", height: screenHeight/3}} contentFit='contain' />
                  <Spacer height={10} />
                  <View style={{paddingHorizontal: 20}}>
                    <Text style={{textAlign: "center", color: "white", fontSize: 20, fontWeight: "800"}}>{item.title}</Text>
                    <Text style={{textAlign: "center", color: "white", fontSize: 18, fontWeight: "300"}}>{item.description}</Text>
                  </View>




                </View>
              )
            }}
            // onViewableItemsChanged={onViewableItemsChanged}
            // viewabilityConfig={viewabilityConfig}
            viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
            />
          </SafeAreaView>
          
        </Animated.View>
      )}
    </View>
    
    
  )
}

export default OnboardingLayout
const styles = StyleSheet.create({
  dotsWrapper: {
    position: "absolute",
    bottom: screenHeight/2.8,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
    transition: "width 200ms",
  },
});