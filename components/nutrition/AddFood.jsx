import { Dimensions, Image, Keyboard, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '../ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'
import greyX from '../../assets/icons/greyX.png'
import { Colors } from '../../constants/Colors'
import plus from '../../assets/icons/plus.png'
import pencilIcon from '../../assets/icons/pencil.png'
import ThemedText from '../ThemedText'
import SectionSelect from '../SectionSelect'
import scanIcon from '../../assets/icons/scan.png'
import searchIcon from '../../assets/icons/searchNoBg.png'
import aiIcon from '../../assets/icons/aiSparkle.png'
import plusIcon from '../../assets/icons/plus.png'
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown,useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated'
import Search from '../Search'
import Spacer from '../Spacer'
import Dropdown from '../Dropdown'
import { useUserStore } from '../../stores/useUserStore'
import ActionMenu from '../ActionMenu'
import {foodCategories, foods} from '../../constants/Foods'
import { icons } from '../../constants/icons'
import { router } from 'expo-router'
import emitter from '../../util/eventBus'
import getAllFood from '../../util/getAllFood'
import { generateUniqueId } from '../../util/uniqueId'
import { truncate } from '../../util/truncate'
import { Portal } from 'react-native-paper'
import FoodPreview from './FoodPreview'
import TouchableScale from '../TouchableScale'

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

const LibraryTab = ({openCreateNewFood, foodToAdd, selectFood, openFoodPreview, searchValue, editFoods, setEditFoods, user, allFoods, ...props}) => {
    

    

    // const [searchValue, setSearchValue] = useState("");
    const userFoodCategories = user.foodCategories;
    const actionIds = [];
    const foodCategoriesOrganized = ["All Foods", ...userFoodCategories, ...foodCategories];
    const categoryData = foodCategoriesOrganized.map((f, i) => ({id: `${i}`, title: f}));
    const [selectedCategory, setSelectedCategory] = useState("0");

    

 
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
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <ThemedText style={{fontSize: 13, fontWeight: 700, marginRight: 5 }}>Food Options</ThemedText>
                    <ActionMenu style={{zIndex: 2}} data={[
                        {title: "Create New Food", icon: plusIcon, onPress: openCreateNewFood, },
                        {title: "Edit Foods", icon: pencilIcon, onPress: () => {setEditFoods(!editFoods)}, },
                        ]} />
                </View>
                
            </View>
            
            <Dropdown style={{zIndex: 2}} data={categoryData} selectedId={selectedCategory} setSelectedId={setSelectedCategory} actionIds={actionIds} actions={{"1": openCreateNewFood}} overflow={true} />

            <ScrollView style={{marginLeft: -20, marginRight: -20, height: screenHeight/1.5,}} contentContainerStyle={{paddingBottom: screenHeight/3, paddingHorizontal: 20, paddingTop: 20}} showsVerticalScrollIndicator={false}>
                <View style={{paddingBottom: 50, flexWrap: "wrap", flexDirection: "row", justifyContent: "center", gap: 15,}}>
                    {filteredFoods.map((f, i) => {
                        const selected = foodToAdd.map(f => f.id).includes(f.id);
                        const icon = f.icon ? icons[f.icon] : icons["fooddoodles303"];
                        const backgroundColor = editFoods ? "#AB3F41" : selected ? "#304998" : "#2E2E2E" ;
                    return (
                        <TouchableScale activeScale={1.1} friction={10} tension={120} onLongPress={() => openFoodPreview(f)} onPress={() => selectFood(f)} key={i} style={{paddingHorizontal: 8, paddingVertical: 8, borderRadius: 10, backgroundColor, flexDirection: "row", alignItems: "center",}}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <View style={{height: 30, width: 30, borderRadius: 5, backgroundColor: f.color, marginRight: 5, overflow: "hidden"}}>
                                    <View style={[StyleSheet.absoluteFill, {backgroundColor: "rgba(0,0,0,0.3)"}]}></View>
                                    <Image source={icon} style={{height: "100%", width: "100%", objectFit: "contain", tintColor: "white"}} />
                                </View>
                                <Text style={{color: "white", fontSize: 15}}>{truncate(f.name, 30)}</Text>
                            </View>
                            
                        </TouchableScale>
                    )})}
                </View>



            </ScrollView>

            
            
        </View>
    )
}

const AddFood = ({...props}) => {
    const user = useUserStore(state => state.user);

    const allFoods = getAllFood(user);

    const [foodToAdd, setFoodToAdd] = useState([]); // foods
    const [editFoods, setEditFoods] = useState(false);

    const [foodPreview, setFoodPreview] = useState(null); // {...food}
    const [foodPreviewOpen, setFoodPreviewOpen] = useState(false);

    const [searchValue, setSearchValue] = useState(""); // For library

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const openEditFood = (food) => {
        if (foodPreviewOpen) setFoodPreviewOpen(false);
        router.push({
            pathname: '/editFood',
            params: {
                food: JSON.stringify(food),
            }
        })
            
    }

    const selectFood = (food) => {
        if (editFoods) return openEditFood(food);


        if (foodToAdd.map(f => f.id).includes(food.id)) {
            const foodsToAdd = foodToAdd.filter(f => f.id !== food.id);
            setFoodToAdd(foodsToAdd);
        } else {
            const foodsToAdd = [...foodToAdd, food];
            setFoodToAdd(foodsToAdd);
        }
        
    }

    const tabs = [" Scan", "Search", "AI"];
    const [tab, setTab] = useState(tabs[1]);

    const requestAddFood = () => {
        if (foodToAdd.length < 1) return;
        //addFood(foodToAdd);
        emitter.emit("addFood", { foodToAdd, });
        router.back();
        setFoodToAdd([]);
    }

    const openCreateNewFood = () => {
        const newFood = {
            name: "New Food",
            unit: "unit",
            categories: [],
            nutrition: { "calories": 0, "protein": 0, "carbs": 0, "fat": 0 },
            icon: "fooddoodles326",
            color: "#6D3F32",
            description: "",
            id: generateUniqueId(),
            created: true,
        }

        router.push({
            pathname: '/editFood',
            params: {
                food: JSON.stringify(newFood),
            }
        })
        return;
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

    const openFoodPreview = (f) => {
        setFoodPreview(f);
        setFoodPreviewOpen(true);
    }


  return (
    <ThemedView style={{flex: 1, padding: 20}}>

        {/* <KeyboardAvoidingView keyboardVerticalOffset={30} behavior={"padding"} style={{paddingHorizontal: 20, flex: 1, height: 100, zIndex: 1, position: "absolute", bottom: Platform.OS === 'ios' ? -10 : 0, left: 0, right: 0,}}>
            
            
                <Search value={searchValue} onChangeText={(e) => setSearchValue(e)} placeholder='Search' />
            
        </KeyboardAvoidingView> */}

        {/* Food Preview */}
        {foodPreviewOpen&& (
            <Portal >
              <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", width: screenWidth, height: screenHeight, zIndex: 2}} >

                  <Pressable onPress={() => setFoodPreviewOpen(false)} style={{height: "100%", width: "100%", zIndex: 0}}></Pressable>

                  <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={{position: "absolute", width: screenWidth-20, top: 50, left: 10, zIndex: 2}}>
                    <FoodPreview food={foodPreview} setFoodPreviewOpen={setFoodPreviewOpen} editFood={openEditFood} />
                  </Animated.View>

                

              </Animated.View>
            </Portal>
            
          )}

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
                    <Pressable onPress={() => router.back()}>
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

            <View style={{position: "relative"}}>
                <SectionSelect section={tab} setSection={setTab} sections={tabs} icons={[scanIcon, searchIcon, aiIcon]} />

                {/* done button for editting food */}
                {editFoods && (
                    <Animated.View style={[StyleSheet.absoluteFill]} entering={FadeIn} exiting={FadeOut}>
                        <Pressable onPress={() => setEditFoods(false)} style={[StyleSheet.absoluteFill, {backgroundColor: Colors.primaryBlue, zIndex: 1, borderRadius: 10, justifyContent: "center", alignItems: "center"}]}>
                            <ThemedText style={{textAlign: "center", fontSize: 18, fontWeight: "600", color: "white"}}>Done Editting</ThemedText>
                        </Pressable>
                    </Animated.View>
                )}
                
                
            </View>
            

            <Spacer height={20} />

            {tab === tabs[0] && (
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                    <ThemedText style={{textAlign: "center", marginTop: 50}}>Scan coming soon!</ThemedText>
                </Animated.View>
            )}
            {tab === tabs[1] && (
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                    <LibraryTab
                    openCreateNewFood={openCreateNewFood}
                    selectFood={selectFood}
                    foodToAdd={foodToAdd}
                    searchValue={searchValue}
                    editFoods={editFoods}
                    setEditFoods={setEditFoods}
                    user={user}
                    allFoods={allFoods}
                    openFoodPreview={openFoodPreview}
                    />
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
        marginTop: -20,
        marginBottom: 10,
        fontSize: 15,
        fontWeight: 600
    },
})

