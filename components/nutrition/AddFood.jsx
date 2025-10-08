import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
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
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import Search from '../Search'
import Spacer from '../Spacer'
import Dropdown from '../Dropdown'
import { useUserStore } from '../../stores/useUserStore'
import ActionMenu from '../ActionMenu'
import {foodCategories, foods} from '../../constants/Foods'
import { icons } from '../../constants/icons'

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

const LibraryTab = ({openCreateNewCategory, foodToAdd, selectFood, ...props}) => {
    const user = useUserStore(state => state.user);


    const [searchValue, setSearchValue] = useState("");
    const userFoodCategories = user.foodCategories;
    const actionIds = [];
    const foodCategoriesOrganized = ["All Foods", ...userFoodCategories, ...foodCategories];
    const categoryData = foodCategoriesOrganized.map((f, i) => ({id: `${i}`, title: f}));
    const [selectedCategory, setSelectedCategory] = useState("0");

    const allFoods = foods;

    console.log("Category data: ", selectedCategory);
    const currentCategory = categoryData.find(c => c.id === selectedCategory)?.title;
    console.log("Current category: ", currentCategory);

    const filteredFoods = allFoods.filter(f => {
        if (currentCategory === "All Foods") {
            return f.name.toLowerCase().includes(searchValue.toLowerCase());
        } else {
            return f.category?.toLowerCase() === currentCategory.toLowerCase() && f.name.toLowerCase().includes(searchValue.toLowerCase());
        }
    });

    return (
        <View>
            <Search value={searchValue} onChangeText={(e) => setSearchValue(e)} placeholder='Search' />
            <Spacer height={20} />
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 10, marginBottom: 10,}}>
                <ThemedText style={{fontSize: 13, fontWeight: 700,  }}>Category</ThemedText>
                <ActionMenu style={{zIndex: 2}} data={[
                    {title: "Create New Category", icon: plusIcon, onPress: openCreateNewCategory, },
                   
                    ]} />
            </View>
            
            <Dropdown style={{zIndex: 2}} data={categoryData} selectedId={selectedCategory} setSelectedId={setSelectedCategory} actionIds={actionIds} actions={{"1": openCreateNewCategory}} overflow={true} />

            <Spacer height={20} />

            <ScrollView style={{marginLeft: -20, marginRight: -20, maxHeight: screenHeight/1.5,}} contentContainerStyle={{paddingBottom: screenHeight/3, paddingHorizontal: 20}} showsVerticalScrollIndicator={false}>
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

    const openCreateNewCategory = () => {
        console.log("Open create new category");
    }

  return (
    <ThemedView style={{flex: 1, padding: 20}}>
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
                    <LibraryTab openCreateNewCategory={openCreateNewCategory} selectFood={selectFood} foodToAdd={foodToAdd}  />
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