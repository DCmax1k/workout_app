import { Dimensions, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ThemedText from '../../components/ThemedText'
import { router, useLocalSearchParams } from 'expo-router';
import ThemedView from '../../components/ThemedView';
import ConfirmMenu from '../../components/ConfirmMenu';
import { SafeAreaView } from 'react-native-safe-area-context';
import deepEqual from '../../util/deepEqual';
import { Colors } from '../../constants/Colors';
import { useUserStore } from '../../stores/useUserStore';
import { icons } from '../../constants/icons';
import customizeIcon from '../../assets/icons/customizeIcon.png'
import pencil from '../../assets/icons/pencil.png'
import trashIcon from '../../assets/icons/trash.png'
import plusIcon from '../../assets/icons/plus.png'
import Spacer from '../../components/Spacer';
import ActionMenu from '../../components/ActionMenu';
import { foodCategories } from '../../constants/Foods';
import MultiSelectDropdown from '../../components/MultiSelectDropdown';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const EditFood = () => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const params = useLocalSearchParams();
    const f = JSON.parse(params.food) ?? {};
    const foodBeforeEdits = f;

    const [food, setFood] = useState(JSON.parse(JSON.stringify(f)));
    const foodNameInputRef = useRef(null);

    const userFoodCategories = user.foodCategories;
    const foodCategoriesOrganized = [...userFoodCategories, ...foodCategories];
    const categoryData = foodCategoriesOrganized.map((f, i) => ({id: `${i}`, title: f}));

    const preSetCategoryIds = categoryData.filter(d =>{ 
        return food.categories.includes(d.title)
    }).map(c=> c.id);
    const [categoryIds, setCategoryIds] = useState(preSetCategoryIds);
    
    
    

    useEffect(() => {
        const newCategories = categoryIds.map(id => categoryData.find(c => c.id === id)).map(c => c.title);
        updateFood({categories: newCategories});
    }, [categoryIds])


    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState({
            title: "The title",
            subTitle: "The description for the confirmation",
            subTitle2: "Another one here",
            option1: "Update",
            
            option2: "Cancel",
            confirm: () => {},
        });

    const updateFood = (updates) => {
        const newFood = {...food, ...updates};
        setFood(newFood);
    }

    const updateFoodName = (value) => {
        updateFood({name: value});
    }

    const updateMacro = (nutritionKey, value) => {
        const nutrition = food.nutrition;
        nutrition[nutritionKey] = value;
        updateFood({nutrition})
    }
    const handleEndEdittingMacro = (nutritionKey, e) => {
        const value =  e.nativeEvent.text;
        const nutrition = food.nutrition;
        nutrition[nutritionKey] = parseInt(value*10)/10;
        updateFood({nutrition})
    }

    const handleEndEditting = () => {
        if (!food.name) updateFoodName("New Food");
    }

    const cancelEdit = () => {
        // Check if edits were made
        if ( deepEqual(foodBeforeEdits, food) ) {
        router.back()
        } else {
        setConfirmMenuData({
            title: "Leave without saving?",
            subTitle: "Any changes will be discarded.",
            subTitle2: "This action cannot be undone.",
            option1: "Don't save and leave",
            option1color: "#DB5454",
            option2: "Stay",
            confirm: () => router.back(),
        });
        setConfirmMenuActive(true);
        }
    }

    const requestSaveFood = () => {
        const customFoods = user.customFoods;
        customFoods[food.id] = food;
        //console.log("Saving food", food);
        updateUser({customFoods});
        router.back();
      }

      const archiveFood = () => {
        const archivedFoods = user.archivedFoods;
        archivedFoods[food.id] = true;
        router.back();
        setTimeout(() => {
            updateUser({archivedFoods});
        }, 300);
        
      }

      const deleteFood = () => {
        const customFoods = user.customFoods;
        delete customFoods[food.id];
        router.back();
        setTimeout(() => {
            updateUser({customFoods});
        }, 300);
      }

      const requestDeleteFood = () => {
        if (food.created === true ?? false) {
            setConfirmMenuData({
                title: "Delete Food?",
                subTitle: "Are you sure you would like to delete this food item?",
                subTitle2: "This action cannot be undone.",
                option1: "Delete Food",
                option1color: "#DB5454",
                option2: "Go back",
                confirm: () => deleteFood(),
            });
            setConfirmMenuActive(true);
        } else {
            setConfirmMenuData({
                title: "Archive Food?",
                subTitle: "Are you sure you would like to archive this food item?",
                subTitle2: "Unarchive this food item from settings.",
                option1: "Archive Food",
                option1color: "#DB5454",
                option2: "Go back",
                confirm: () => archiveFood(),
            });
            setConfirmMenuActive(true);
        }
        
      }

      const createNewCategory = () => {
            setConfirmMenuData({
                title: "Coming soon",
                subTitle: "",
                option1: "Okay",
                option1color: Colors.primaryBlue,
                confirm: () => {},
            });
            setConfirmMenuActive(true);
      }

      const openCustomize =() => {
        setConfirmMenuData({
                title: "Coming soon",
                subTitle: "",
                option1: "Okay",
                option1color: Colors.primaryBlue,
                confirm: () => {},
            });
            setConfirmMenuActive(true);
      }
      

  return (
    <ThemedView style={{flex: 1, padding: 20}}>
        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
        <SafeAreaView style={{flex: 1, marginBottom: -50,}}>

          <View style={[styles.actionButtons]}>
              <View>
                <Pressable onPress={cancelEdit} style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#4B4B4B", borderRadius: 10, }}>
                      <Text style={{fontSize: 15, color: "white",}}>Cancel</Text>
                  </Pressable>
              </View>
              <View>
                  <Pressable onPress={requestSaveFood} style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.protein, borderRadius: 10, }}>
                      <Text style={{fontSize: 15, color: "white",}}>Save</Text>
                  </Pressable>
              </View>
          </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}} >
                     <ScrollView contentContainerStyle={{paddingBottom: screenHeight/2, paddingTop: 170}} showsVerticalScrollIndicator={false}>
                        <View style={{width: screenWidth, height: screenWidth/2, alignItems: "center", marginLeft: -20}}>
                            <View style={{height: screenWidth/2, width: screenWidth/2, backgroundColor: food.color, borderRadius: 20, justifyContent: "center", alignItems: "center", overflow: "hidden"}}>
                                <View style={[StyleSheet.absoluteFill, {backgroundColor: "rgba(0,0,0,0.3)"}]}></View>
                                <Image source={food.icon ? icons[food.icon] : icons["fooddoodles303"]} style={{height: screenWidth/2, width: screenWidth/2, objectFit: "contain", tintColor: "white"}} />
                            </View>
                        </View>
                        
                        <Spacer height={20} />
                        <View style={{width: screenWidth-40, alignItems: "center",}}>
                            <Pressable onPress={openCustomize} style={{backgroundColor: "#363636", flexDirection: "row", alignItems: "center", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 15}}>
                                <Image style={{height: 30, width: 30, tintColor: "white", objectFit: "contain", marginRight: 10}} source={customizeIcon} />
                                <Text style={{fontSize: 16, fontWeight: "600", color: "white"}}>Customize</Text>
                            </Pressable>
                        </View>
                        
                        <Spacer height={20} />
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                            <Pressable style={{ height: 40, width: 40, justifyContent: "center", alignItems: "center"}} onPress={() => {if (foodNameInputRef.current) {foodNameInputRef.current.focus()}}}>
                                <Image style={{height: 15, width: 15, marginRight: 10}} source={pencil} />
                            </Pressable>
                            
                            <TextInput selectTextOnFocus ref={foodNameInputRef} onChangeText={updateFoodName} onEndEditing={handleEndEditting} value={food.name} style={styles.foodNameInput} />
                            <ActionMenu data={[{title: (food.created === true ?? false) ? "Delete Food" : "Archive Food", icon: trashIcon, onPress: requestDeleteFood, color: "#FF6C6C"}]} />
                        </View>


                        {/* <Spacer height={10} /> */}
                        {/* Calories Macros */}
                        <View>
                            {new Array(4).fill(null).map((_, i) => {
                                const nutrition = food.nutrition;
                                const nutritionKey = ["calories", "protein", "carbs", "fat"][i];
                                const backgroundColor = [Colors.calories, Colors.protein, Colors.carbs, Colors.fat][i];
                                const abr = ["Calories", "Protein", "Carbohydrates", "Fat"][i];
                                const nAmount = nutrition[nutritionKey]?.toString() || ""; // no rounding!

                    
                                const height = 60;
                                return (
                                    <View key={i} style={{flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10}} >
                                        <View style={{height, width: 20, borderRadius: 999, backgroundColor}}></View>
                                        <View style={{backgroundColor: "#3C3C3C", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
                                            <TextInput selectTextOnFocus keyboardType='numeric' style={{color: "white", fontSize: 18, fontWeight: "800", width: 100, height, paddingHorizontal: 20,}} value={nAmount} onChangeText={(e) => updateMacro(nutritionKey, e)} onEndEditing={(e) => handleEndEdittingMacro(nutritionKey, e)} />
                                        </View>
                                        
                                        <Text style={{color: "white", fontSize: 16, fontWeight: "800"}}>{abr}</Text>
                                        
                                    </View>
                                )
                            })}
                        </View>

                        <Spacer height={20} />
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 10, marginBottom: 10,}}>
                            <ThemedText style={{fontSize: 13, fontWeight: 700,  }}>Category</ThemedText>
                            <ActionMenu style={{zIndex: 2}} data={[
                                {title: "Create New Category", icon: plusIcon, onPress: createNewCategory, },
                                ]} />
                        </View>

                        <MultiSelectDropdown locked={false} selectedIds={categoryIds} setSelectedIds={setCategoryIds} data={categoryData} />
                            
                        <Spacer height={20} />


                    </ScrollView> 
            </KeyboardAvoidingView>

          

            

        </SafeAreaView>
    </ThemedView>
  )
}

export default EditFood

const styles = StyleSheet.create({
    actionButtons: {
        height: 50,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: -150,
        zIndex: 1,
    },
    foodNameInput: {
        fontSize: 23,
        color: "white",
        flex: 1,
        fontWeight: 700
    }
})