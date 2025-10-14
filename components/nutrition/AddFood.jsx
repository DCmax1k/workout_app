import { Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ThemedView from '../ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'
import greyX from '../../assets/icons/greyX.png'
import { Colors } from '../../constants/Colors'
import plus from '../../assets/icons/plus.png'
import ThemedText from '../ThemedText'
import SectionSelect from '../SectionSelect'
import scanIcon from '../../assets/icons/scan.png'
import searchIcon from '../../assets/icons/searchNoBg.png'
import aiIcon from '../../assets/icons/aiSparkle.png'
import plusIcon from '../../assets/icons/plus.png'
import Animated, { Easing, FadeIn, FadeOut, SlideInDown, SlideOutDown, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated'
import Search from '../Search'
import Spacer from '../Spacer'
import Dropdown from '../Dropdown'
import { useUserStore } from '../../stores/useUserStore'
import ActionMenu from '../ActionMenu'
import {foodCategories, foods} from '../../constants/Foods'
import { icons } from '../../constants/icons'

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

const LibraryTab = ({openCreateNewFood, foodToAdd, selectFood, searchValue, ...props}) => {
    const user = useUserStore(state => state.user);


    // const [searchValue, setSearchValue] = useState("");
    const userFoodCategories = user.foodCategories;
    const actionIds = [];
    const foodCategoriesOrganized = ["All Foods", ...userFoodCategories, ...foodCategories];
    const categoryData = foodCategoriesOrganized.map((f, i) => ({id: `${i}`, title: f}));
    const [selectedCategory, setSelectedCategory] = useState("0");

    const allFoods = foods;

 
    const currentCategory = categoryData.find(c => c.id === selectedCategory)?.title;


    const filteredFoods = allFoods.filter(f => {
        if (currentCategory === "All Foods") {
            return f.name.toLowerCase().includes(searchValue.toLowerCase());
        } else {
            return f.categories.includes(currentCategory) && f.name.toLowerCase().includes(searchValue.toLowerCase());
        }
    });

    return (
        <View style={{ position: 'relative',}}>
            {/* <Search value={searchValue} onChangeText={(e) => setSearchValue(e)} placeholder='Search' /> */}
            {/* <Spacer height={20} /> */}
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 10, marginBottom: 10,}}>
                <ThemedText style={{fontSize: 13, fontWeight: 700,  }}>Category</ThemedText>
                <ActionMenu style={{zIndex: 2}} data={[
                    {title: "Create New Food", icon: plusIcon, onPress: openCreateNewFood, },
                   
                    ]} />
            </View>
            
            <Dropdown style={{zIndex: 2}} data={categoryData} selectedId={selectedCategory} setSelectedId={setSelectedCategory} actionIds={actionIds} actions={{"1": openCreateNewFood}} overflow={true} />

            <ScrollView style={{marginLeft: -20, marginRight: -20, height: screenHeight/1.5,}} contentContainerStyle={{paddingBottom: screenHeight/3, paddingHorizontal: 20, paddingTop: 20}} showsVerticalScrollIndicator={false}>
                <View style={{paddingBottom: 50, flexWrap: "wrap", flexDirection: "row", justifyContent: "center", gap: 15,}}>
                    {filteredFoods.map((f, i) => {
                        const selected = foodToAdd.includes(f.id);
                        const icon = f.icon ? icons[f.icon] : icons["fooddoodles303"];
                    return (
                        <Pressable onPress={() => selectFood(f.id)} key={i} style={{paddingHorizontal: 8, paddingVertical: 8, borderRadius: 10, backgroundColor: selected ? "#304998" : "#2E2E2E", flexDirection: "row", alignItems: "center",}}>
                            <View style={{height: 30, width: 30, borderRadius: 5, backgroundColor: f.color, marginRight: 5, overflow: "hidden"}}>
                                <View style={[StyleSheet.absoluteFill, {backgroundColor: "rgba(0,0,0,0.3)"}]}></View>
                                <Image source={icon} style={{height: "100%", width: "100%", objectFit: "contain", tintColor: "white"}} />
                            </View>
                            <Text style={{color: "white", fontSize: 15}}>{f.name}</Text>
                        </Pressable>
                    )})}
                </View>
            </ScrollView>

            
            
        </View>
    )
}

const AddFood = ({setFoodModal, addFood}) => {

    const [foodToAdd, setFoodToAdd] = useState([]); // food ids

    const [searchValue, setSearchValue] = useState(""); // For library

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const selectFood = (foodId) => {
        if (foodToAdd.includes(foodId)) {
            return setFoodToAdd(foodToAdd.filter(id => id !== foodId));
        }
        setFoodToAdd([...foodToAdd, foodId]);
    }

    const tabs = [" Scan", "Library", "AI"];
    const [tab, setTab] = useState(tabs[1]);

    const requestAddFood = () => {
        if (foodToAdd.length < 1) return;
        addFood(foodToAdd);
        setFoodModal(false);
        setFoodToAdd([]);
    }

    const openCreateNewFood = () => {
        console.log("Open create new food");
    }


    // Animate view up when keyboard appears
    useEffect(() => {
        const onKeyboardShow = (e) => {
        setKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
        };

        const onKeyboardHide = () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
        };

        const onKeyboardChange = (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        };

        const willShowSub = Keyboard.addListener("keyboardWillShow", onKeyboardShow);
        const didShowSub = Keyboard.addListener("keyboardDidShow", onKeyboardShow);
        const willHideSub = Keyboard.addListener("keyboardWillHide", onKeyboardHide);
        const didHideSub = Keyboard.addListener("keyboardDidHide", onKeyboardHide);
        const changeSub = Keyboard.addListener('keyboardDidChangeFrame', onKeyboardChange);

        return () => {
        willShowSub.remove();
        didShowSub.remove();
        willHideSub.remove();
        didHideSub.remove();
        changeSub.remove();
        };
    }, []);

    const translateY = useSharedValue(0);
    const searchWidth1 = 150;
    const searchWidth2 = screenWidth - 40;
    const searchWidth = useSharedValue(searchWidth1);

    useEffect(() => {
        translateY.value = withTiming(keyboardHeight > 0 ? -keyboardHeight - (Platform.OS === "ios" ? -15 : -20) : 0, { duration: keyboardHeight > 0 ? 200 : 300 });
        searchWidth.value = withDelay(keyboardHeight > 0 ? 200 : 0, withSpring(keyboardHeight > 0 ? searchWidth2  : searchWidth1, { damping: keyboardHeight > 0 ? 80 : 100, }));
    }, [keyboardHeight]);


    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));
    const animatedSearchStyle = useAnimatedStyle(() => ({
        width: searchWidth.value,
    }));


  return (
    <ThemedView style={{flex: 1, padding: 20}}>

        {/* <KeyboardAvoidingView keyboardVerticalOffset={30} behavior={"padding"} style={{paddingHorizontal: 20, flex: 1, height: 100, zIndex: 1, position: "absolute", bottom: Platform.OS === 'ios' ? -10 : 0, left: 0, right: 0,}}>
            
            
                <Search value={searchValue} onChangeText={(e) => setSearchValue(e)} placeholder='Search' />
            
        </KeyboardAvoidingView> */}

        {tab === tabs[1] && (<Animated.View entering={FadeIn} exiting={FadeOut} style={[ { position: "absolute", left: 20, right: 20, bottom: Platform.OS === "ios" ? 20 : 50, zIndex: 9, alignItems: "center", }, animatedStyle ]} >
                <Animated.View style={[animatedSearchStyle]}>
                    <Search
                        value={searchValue}
                        onChangeText={(text) => setSearchValue(text)}
                        placeholder="Search"
                        backgroundColor='#3D3D3D'
                    />
                </Animated.View>
            
            </Animated.View>)}

        <SafeAreaView>
            <View style={[styles.actionButtons]}>
                <View>
                    <Pressable onPress={() => setFoodModal(false)}>
                        <Image style={{height: 50, width: 50}} source={greyX} />
                    </Pressable>
                </View>
                <View style={{zIndex: 1}}>
                    <Pressable onPress={requestAddFood} style={{paddingHorizontal: 10, paddingVertical: 10, backgroundColor: foodToAdd.length < 1 ? "grey":Colors.primaryBlue, borderRadius: 10, flexDirection: 'row', alignItems: 'center'}}>
                        <Image style={{height: 20, width: 20, marginRight: 5}} source={plus} />
                        <Text style={{fontSize: 20, color: "white", fontWeight: 700}}>{foodToAdd.length}</Text>
                    </Pressable>
                </View>
            </View>

            <View style={[styles.header]}>
                <ThemedText title={true} style={{fontSize: 23, fontWeight: 700, textAlign: "center"}}>Add Food</ThemedText>
            </View>

            <SectionSelect section={tab} setSection={setTab} sections={tabs} icons={[scanIcon, searchIcon, aiIcon]} />

            <Spacer height={20} />

            {tab === tabs[0] && (
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                    <ThemedText style={{textAlign: "center", marginTop: 50}}>Scan coming soon!</ThemedText>
                </Animated.View>
            )}
            {tab === tabs[1] && (
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                    <LibraryTab openCreateNewFood={openCreateNewFood} selectFood={selectFood} foodToAdd={foodToAdd} searchValue={searchValue}  />
                </Animated.View>
            )}
            {tab === tabs[2] && (
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                    <ThemedText style={{textAlign: "center", marginTop: 50}}>AI coming soon!</ThemedText>
                </Animated.View>
            )}

        </SafeAreaView>
    </ThemedView>
  )
}

export default AddFood

const styles = StyleSheet.create({
    actionButtons: {
        height: 50,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
    },
    header: {
        marginBottom: 10,
        fontSize: 15,
        fontWeight: 600
    },
})

