import { View, Platform, StyleSheet, Image, useColorScheme, Pressable } from 'react-native';
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
import Animated from 'react-native-reanimated';
import { router } from 'expo-router';
import { useState } from 'react';

const firstCapital = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function StackTabBar({animatedTabbarPosition }) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();
  const [currentRoute, setCurrentRoute] = useState(0); // route index

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