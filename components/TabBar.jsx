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

function TabBar({animatedTabbarPosition, state, descriptors, navigation }) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  const colorScheme = useColorScheme()
  const lightTheme = colorScheme === 'light'
  const theme = Colors[colorScheme] ?? Colors.dark

  return (
    <Animated.View style={[styles.tabbar, { backgroundColor: theme.tabBar.background,}, animatedTabbarPosition]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const isMiddleTab = index === 2; // Check if the current tab is the middle tab

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.name}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabbarItem, , isMiddleTab ? styles.middleTab : null, { opacity: 1}]}
          >
            <Image style={[styles.tabBarIcon, isMiddleTab ? styles.middleTabIcon : null, {tintColor: isFocused ? theme.title : "grey"}]} source={(route.name === 'home' ? Home : route.name === 'workout' ? Workout : route.name === 'exercises' ? Exercises : route.name === 'friends' ? Friends : Progress)} />


            {/* {!isMiddleTab && (
                <ThemedText style={[styles.tabBarText, { color: isFocused ? theme.tabBar.textActive : theme.tabBar.text }]}>
                    {label}
                </ThemedText>
            )} */}

                <ThemedText style={[styles.tabBarText, { color: isFocused ? theme.tabBar.textActive : theme.tabBar.text }, ]}>
                    {label === "Workout" ? "Workouts" : label}
                </ThemedText>
            
          </Pressable>
        );
      })}
    </Animated.View>
  );
}

export default TabBar

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