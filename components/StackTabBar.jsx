import { View, Platform, StyleSheet, Image, useColorScheme, Pressable, Text } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ThemedView from './ThemedView';
import ThemedText from './ThemedText';
import { Colors } from '../constants/Colors';
// import multiple images from assets/tabBarIcons
import Home from '../assets/tabBarIcons/home.png';
import Progress from '../assets/tabBarIcons/progress.png';
// import Workout from '../assets/tabBarIcons/workoutCircle.png';
import Workout from '../assets/tabBarIcons/dumbbell.png';
// import Exercises from '../assets/tabBarIcons/exercises.png';
// import Exercises from '../assets/tabBarIcons/hamburger.png';
import Exercises from '../assets/icons/list.png';
import Friends from '../assets/tabBarIcons/friends.png';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useState } from 'react';
import { useUserStore } from '../stores/useUserStore';

const firstCapital = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function StackTabBar({animatedTabbarPosition, currentRoute, setCurrentRoute}) {
  const user = useUserStore(state => state.user);


  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  const colorScheme = useColorScheme()
  const lightTheme = colorScheme === 'light'
  const theme = Colors[colorScheme] ?? Colors.dark

  const routes = [{name: "home", icon: Home,},{name: "friends", icon: Friends,},{name: "Workouts", route: "workout", icon: Workout,},{name: "exercises", icon: Exercises,},{name: "progress", icon: Progress,},];
  

  return (
    <Animated.View style={[styles.tabbar, { backgroundColor: theme.tabBar.background,}, animatedTabbarPosition]}>
      {routes.map((route, index) => {
        const label = route.name;

        const isFocused = currentRoute === index;

        const isMiddleTab = index === 2; // Check if the current tab is the middle tab
        const isSecondTab = index === 1; // Check if the current tab is the second

        const bellNotificationAmount = user.friendRequests.filter(u => u.read === false).length;

        const onPress = () => {
          if (!isFocused) {
            setCurrentRoute(index);
            // console.log("Going to", "/dashboard/" + (route.route || route.name));
            router.replace("/dashboard/" + (route.route || route.name) );
          }
        };


        return (
          <Pressable
            key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={[styles.tabbarItem, , isMiddleTab ? styles.middleTab : null, { opacity: 1}]}
          >
            <Image style={[styles.tabBarIcon, isMiddleTab ? styles.middleTabIcon : null, {tintColor: isFocused ? theme.title : "grey"}]} source={route.icon} />


                {/* {!isMiddleTab && (
                    <ThemedText style={[styles.tabBarText, { color: isFocused ? theme.tabBar.textActive : theme.tabBar.text }]}>
                        {label}
                    </ThemedText>
                )} */}

                <ThemedText style={[styles.tabBarText, { color: isFocused ? theme.tabBar.textActive : theme.tabBar.text }, ]}>
                    {firstCapital(label)}
                </ThemedText>

                {isSecondTab &&  bellNotificationAmount > 0 &&  (
                  <Animated.View entering={FadeIn} exiting={FadeOut} style={{position: "absolute", left: 0, top: 0, width: "100%", alignItems: "flex-end", paddingHorizontal: 15, paddingVertical: 8 }}>
                      <View style={{zIndex: 1, minWidth: 14, height: 14, paddingHorizontal: 3, justifyContent: "center", alignItems: "center", backgroundColor: Colors.protein, borderRadius: 9999,}}>
                        <Text style={{color: "white", fontSize: 10, fontWeight: "600"}}>{bellNotificationAmount}</Text>
                    </View>
                  </Animated.View>
                
            )}
            
          </Pressable>
        );
      })}
    </Animated.View>
  );
}

export default StackTabBar

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1,
    },
    tabBarText: {
        marginTop: -5,
    },  
    tabbarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 20,
        marginBottom: 30,
    }, 
    tabBarIcon: {
        width: 40,
        height: 40,
        marginBottom: 5,
        
        
    },
    middleTabIcon: {
        height: 40,
        width: 40,
    },
});