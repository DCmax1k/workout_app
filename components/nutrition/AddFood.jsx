import { Dimensions, FlatList, Keyboard, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
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
import rightArrow from '../../assets/icons/rightArrow.png'
import aiIcon from '../../assets/icons/aiSparkle.png'
import cameraIcon from '../../assets/icons/camera.svg'
import doubleCheck from '../../assets/icons/doubleCheck.png'
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown,SlideInDown,SlideOutDown,useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated'
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
import FilterAndSearch from '../FilterAndSearch'
import { Image } from 'expo-image'
import MacrosRow from './MacrosRow'
import Camera from '../Camera'
import ConfirmMenu from '../ConfirmMenu'
import ImageContain from '../ImageContain'
import AIButton from '../AIButton'
import sendData from '../../util/server/sendData'
import PlateItem from './PlateItem'
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator'
import Loading from '../Loading'
import BlueButton from '../BlueButton'
import FoodItem from './FoodItem'


const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

const AITab = ({showCreditsTooltip, foodToAdd, selectFood, openFoodPreview, setFoodToAdd, page, setPage, foodsFound, fromPage, setFromPage, setFoodsFound, ...props}) => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);
    const [photoUri, setPhotoUri] = useState(null);
    const [aiDetails, setAiDetails] = useState("");
    const [alert, setAlert] = useState("");
    const imageBase64Ref = useRef(null);
    const [analyzing, setAnalyzing] = useState(false);

    
    const imageTaken = async (photo) => {
        
        try {
            const context = ImageManipulator.manipulate(photo.uri);
            // Resize to 768px (The OpenAI "Sweet Spot" for token cost vs accuracy)
            context.resize({ width: 768 });
            // Render the changes
            const imageRef = await context.renderAsync();
            
            // 3. GENERATE BASE64
            // We only generate the string for the small, resized image
            const result = await imageRef.saveAsync({
                base64: true,
                compress: 0.7,
                format: SaveFormat.JPEG,
            });

            // 4. Update the Ref with the optimized string
            // The user won't click "Analyze" fast enough to beat this (~200ms)
            imageBase64Ref.current = `data:image/jpeg;base64,${result.base64}`;
            setPhotoUri(photo.uri);
            
        } catch (error) {
            console.error("Error optimizing image for AI:", error);
            setAlert("Error processing image. Please retake.");
        }
    };

    const requestTextAnalyze = async () => {
        if (!aiDetails) {
            
            return;
        }
        setFromPage('text');
        setPage(1);
        setAnalyzing(true);
        const response = await sendData('/ai/analyzefoodtext', { userPrompt: aiDetails, jsonWebToken: user.jsonWebToken});
        if (response.status !== "success") {
            setAlert(response.message || "Error analyzing details. Please try again.");
        } else {
            setAlert("");
            // Update client credits
            updateUser({extraDetails: {ai: {foodText: {credits: response.remaining}}}});
            const rawfoods = response.analysis.foods || [];
            const foods = rawfoods.map(f => ({
                ...f,
                id: generateUniqueId(),
                categories: [],
            }))
            setFoodsFound(foods || []);  

        }
        setAnalyzing(false);
    }
    const requestAnalyze = async () => {
        if (!photoUri) return requestTextAnalyze();
        // Request AI analyze here
        setFromPage('image');
        setPage(1);
        setAnalyzing(true);
        const response = await sendData('/ai/analyzefood', { imageBase64: imageBase64Ref.current, userPrompt: aiDetails, jsonWebToken: user.jsonWebToken});
        // TESTING MOCK RESPONSE
        // const response = await new Promise((resolve) => {
        //     setTimeout(() => {
        //         resolve({
        //             status: "success",
        //             analysis: {
        //                 foods: [
        //                     {
        //                         name: "Sample Food Item",
        //                         quantity: 1,
        //                         unit: "unit",
        //                         color: "#DB8854",
        //                         description: "A placeholder food item",
        //                         nutrition: { calories: 250, protein: 10, carbs: 30, fat: 8 },
        //                     },
        //                     {
        //                         name: "Another Food Item",
        //                         quantity: 1,
        //                         unit: "unit",
        //                         color: "#76BA1B",
        //                         description: "Another placeholder",
        //                         nutrition: { calories: 150, protein: 5, carbs: 20, fat: 4 },
        //                     },

        //                 ],
        //             },
        //         });
        //     }, 3000); // Simulate a 3-second delay
        // })
        // console.log("AI Response:", response);
        if (response.status !== "success") {
            setAlert(response.message || "Error analyzing image. Please try again.");
        } else {
            setAlert("");
            // Update client credits
            updateUser({extraDetails: {ai: {image: {credits: response.remaining}}}});
            const rawfoods = response.analysis.foods || [];
            const foods = rawfoods.map(f => ({
                ...f,
                id: generateUniqueId(),
                categories: [],
            }))
            setFoodsFound(foods || []);  

        }
        setAnalyzing(false);
    }

    const selectAll = () => {
        const newFoodsToAdd = [ ...foodsFound, ...foodToAdd.filter(f => !foodsFound.map(ff => ff.id).includes(f.id))];
        setFoodToAdd(newFoodsToAdd);
    }

    const retake = () => {
        if (fromPage === 'image') {
            setPhotoUri(null);
            setPage(0);
        } else if (fromPage === 'text') {
            setAiDetails("");
            setPhotoUri(null);
            setPage(-1);
        } else {
            console.log("Page error AddFood")
        }
        
    }

    return (
        <View>
            {page === -1 ? (
            <Animated.View key={"page--1"} entering={FadeIn} exiting={FadeOut} style={{paddingVertical: 0,}} {...props}>
                <BlueButton onPress={() => setPage(0)} title="Scan Picture of Food" subtitle={`Credits: ${user.extraDetails.ai.image.credits ?? 10}`} icon={cameraIcon} />
                <ThemedText style={{fontSize: 12, paddingVertical: 15, textAlign: 'center'}}>or use only the prompt</ThemedText>
                {/* Textbox and buttons */}
                <View style={{width: "100%", alignItems: 'center', gap: 10,}}>
                    {/* Text box */}
                    <View style={{paddingHorizontal: 0, width: "100%",}}>
                        <TextInput
                        value={aiDetails}
                        placeholder='Add details about your food...'
                        onChangeText={(v) => {setAiDetails(v)}}
                        editable
                        multiline
                        numberOfLines={4}
                        maxLength={200}
                        placeholderTextColor={"#AAAAAA"}
                        style={{backgroundColor: "rgba(0,0,0,0.8)", borderRadius: 15, height: 120, width: "100%", textAlignVertical: 'top', color: "white", fontSize: 15, paddingHorizontal: 15, paddingVertical: 15, fontWeight: "300", fontFamily: "DoppioOne-Regular",}}
                        />
                    </View>
                    
                    {/* Buttons */}
                    <View style={{width: "100%", flexDirection: 'row', justifyContent: "space-between", zIndex: 10, paddingHorizontal: 0,}}>
                        {/* <ThemedText style={[styles.header, { fontSize: 15}]} >Credits: {user.extraDetails.ai.foodText.credits ?? 30}</ThemedText> */}
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <ThemedText style={[styles.header, { fontSize: 15}]} >Credits: {user.extraDetails.ai.foodText.credits ?? 10}</ThemedText>
                            <Pressable onPress={showCreditsTooltip} style={{height: 20, width: 20, borderColor: '#585858', borderWidth: 2, borderRadius: 99999 , marginLeft: 10, alignItems: "center", justifyContent: "center"}}>
                                <Text style={{color: "#585858", fontSize: 14, marginTop: Platform.OS==='ios'?0:-2, fontWeight: "800" }}>?</Text>
                            </Pressable>
                        </View>
                        <AIButton fontSize={20} imageSize={30} onPress={() => requestAnalyze()} title={"Analyze"} />
                    </View>
                </View>
            </Animated.View>
        ) : page === 0 ? (
            <Animated.View key={"page0"} entering={FadeIn} exiting={FadeOut} style={{paddingVertical: 0,}} {...props}>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",}}>
                    <Pressable style={{alignSelf: "flex-start", flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingVertical: 5, gap: 10, backgroundColor: Colors.primaryOrange, borderRadius: 999,}} onPress={() => setPage(-1)}>
                        <ImageContain source={rightArrow} style={{transform: [{rotate: "180deg"}]}} />
                        <Text style={{color: "white", fontSize: 18}}>Back</Text>
                    </Pressable>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <ThemedText style={[styles.header, { fontSize: 15}]} >Credits: {user.extraDetails.ai.image.credits ?? 10}</ThemedText>
                        <Pressable onPress={showCreditsTooltip} style={{height: 20, width: 20, borderColor: '#585858', borderWidth: 2, borderRadius: 99999 , marginLeft: 10, alignItems: "center", justifyContent: "center"}}>
                            <Text style={{color: "#585858", fontSize: 14, marginTop: Platform.OS==='ios'?0:-2, fontWeight: "800" }}>?</Text>
                        </Pressable>
                    </View>
                </View>
                
                <View style={{height: screenHeight-320, width: "100%", borderRadius: 30, overflow: "hidden", marginTop: 10,}}>
                    <Camera imageTaken={imageTaken} cameraStyle={{borderRadius: 50}} />
                    {/* Camera */}
                    {photoUri && (
                        <Animated.View entering={FadeIn} exiting={FadeOut} style={[StyleSheet.absoluteFill, {borderRadius: 30, zIndex: 10, }]}>
                            <ImageContain source={{uri: photoUri}} cover={true} style={{height: "100%", width: "100%"}} />
                            {/* Textbox and buttons */}
                            <View style={{position: 'absolute', width: "100%", top: 20, alignSelf: 'center', alignItems: 'center', gap: 10,}}>
                                {/* Text box */}
                                <View style={{paddingHorizontal: 20, width: "100%",}}>
                                    <TextInput
                                    value={aiDetails}
                                    placeholder='Add details for better results...'
                                    onChangeText={(v) => {setAiDetails(v)}}
                                    editable
                                    multiline
                                    numberOfLines={4}
                                    maxLength={200}
                                    placeholderTextColor={"#AAAAAA"}
                                    style={{backgroundColor: "rgba(0,0,0,0.8)", borderRadius: 15, height: 120, width: "100%", textAlignVertical: 'top', color: "white", fontSize: 15, paddingHorizontal: 15, paddingVertical: 15, fontWeight: "300", fontFamily: "DoppioOne-Regular",}}
                                    />
                                </View>
                                
                                {/* Buttons */}
                                <View style={{width: "100%", flexDirection: 'row', justifyContent: "space-between", zIndex: 10, paddingHorizontal: 20,}}>
                                    <Pressable onPress={() => setPhotoUri(null)} style={{ backgroundColor: "white", borderRadius: 10, justifyContent: "center", paddingHorizontal: 20}}>
                                        <Text style={{color: "black", fontSize: 20}}>Retake</Text>
                                    </Pressable>
                                    <AIButton fontSize={20} imageSize={30} onPress={() => requestAnalyze()} title={"Analyze"} />
                                </View>
                            </View>
                        </Animated.View>
                        
                    )}
                </View>
                <ThemedText style={{textAlign: "center", marginTop: 10}}>Image of Food or Nutrition Facts</ThemedText>
            </Animated.View>
        ) : (
            <Animated.View key={"page1"} entering={FadeIn} exiting={FadeOut} style={{paddingVertical: 0, marginHorizontal: -20, width: screenWidth}} {...props}>
                <View style={{paddingHorizontal: 20, marginBottom: 10, marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <Pressable style={{alignSelf: "flex-start", flexDirection: "row", alignItems: "center", marginBottom: 10, paddingHorizontal: 20, paddingVertical: 10, gap: 10, backgroundColor: Colors.primaryOrange, borderRadius: 999,}} onPress={retake}>
                        <ImageContain source={rightArrow} style={{transform: [{rotate: "180deg"}]}} />
                        <Text style={{color: "white", fontSize: 18}}>{fromPage==="image" ? "Retake" : "Another"}</Text>
                    </Pressable>
                    <Pressable onPress={() => selectAll()} style={{alignSelf: "flex-start", flexDirection: "row", alignItems: "center", marginBottom: 10, paddingHorizontal: 20, paddingVertical: 10, gap: 10, backgroundColor: "white", borderRadius: 999,}}>
                        <Text style={{color: "black", fontSize: 18}}>Select All</Text>
                        {/* <ImageContain source={doubleCheck} /> */}
                    </Pressable>
                </View>
                
                {alert !== "" && (
                    <ThemedText style={{color: "red", textAlign: "center", marginBottom: 10, paddingHorizontal: 20}}>{alert}</ThemedText>
                )}
                <ScrollView style={{maxHeight: screenHeight-200,}} contentContainerStyle={{paddingBottom: 220, paddingHorizontal: 20}} showsVerticalScrollIndicator={false}>
                    {analyzing ? (
                        <View style={{flexDirection: "row", marginTop: 50, alignItems: "center", justifyContent: "center", gap: 10,}}>
                            <Loading />
                            <ThemedText>Analyzing {fromPage === "image" ? "image" : "text"}...</ThemedText>
                            
                        </View>
                        
                    ) : foodsFound.length < 1 ? (
                        <ThemedText style={{textAlign: "center", marginTop: 20}}>No foods were identified. Try retaking the photo with a clearer view of the food or nutrition facts.</ThemedText>
                    ) : (
                        foodsFound.length > 0 && (<Animated.View entering={FadeIn} exiting={FadeOut} >
                            {foodsFound.map((item, i) => {
                                const selected = foodToAdd.map(f => f.id).includes(item.id);
                                const icon = item.icon ? icons[item.icon] : null;
                                const backgroundColor = selected
                                    ? "#304998"
                                    : "#2E2E2E";

                                return (
                                    <TouchableScale
                                        key={item.id}
                                        activeScale={1.05}
                                        friction={10}
                                        tension={200}
                                        // onLongPress={() => openFoodPreview(item)}
                                        onPress={() => selectFood(item)}
                                        style={{
                                            paddingHorizontal: 10,
                                            paddingVertical: 10,
                                            borderRadius: 10,
                                            backgroundColor,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginBottom: 5, // spacing between items
                                        }}
                                    >
                                        <FoodItem food={item}  />
                                    </TouchableScale>
                                );
                            }
                        )}
                        </Animated.View>)
                        )}
                </ScrollView>
                            
                
            </Animated.View>
        )}
        </View>
    ) 
}

const LibraryTab = ({openCreateNewFood, foodToAdd, selectFood, openFoodPreview, searchValue, setSearchValue, editFoods, setEditFoods, user, allFoods, ...props}) => {
    

    
    // const [searchValue, setSearchValue] = useState("");
    const userFoodCategories = user.foodCategories;
    const actionIds = [];

    const foodCategoriesOrganized = ["All Foods", ...userFoodCategories, ...foodCategories];
    const categoryData = foodCategoriesOrganized.map((f, i) => ({id: `${i}`, title: f}));
    const [selectedCategory, setSelectedCategory] = useState("0");

    const [filterSelected, setFilterSelected] = useState([]);

 
    const currentCategory = categoryData.find(c => c.id === selectedCategory)?.title;


    // const filteredFoods = allFoods.filter(f => {
    //     if (currentCategory === "All Foods") {
    //         return f.name.toLowerCase().includes(searchValue.toLowerCase());
    //     } else {
    //         return f.categories.includes(currentCategory) && f.name.toLowerCase().includes(searchValue.toLowerCase());
    //     }
    // });
    const filteredFoods = allFoods.filter(f => {
        if (filterSelected.length === 0) return f.name.toLowerCase().includes(searchValue.toLowerCase());
        for (let i = 0; i<filterSelected.length; i++) {
            if ((f.categories.includes(filterSelected[i])) && f.name.toLowerCase().includes(searchValue.toLowerCase())) {
                return true;
            }
        }
        return false;
    });

    return (
        <View style={{ position: 'relative',}}>

            {/* <Search value={searchValue} onChangeText={(e) => setSearchValue(e)} placeholder='Search' /> */}
            {/* <Spacer height={20} /> */}
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 10, marginBottom: 10,}}>
                <ThemedText style={{fontSize: 13, fontWeight: 700,  }}>Category</ThemedText>
                {/* <View style={{flexDirection: "row", alignItems: "center"}}>
                    <ThemedText style={{fontSize: 13, fontWeight: 700, marginRight: 5 }}>Food Options</ThemedText>
                    <ActionMenu style={{zIndex: 2}} data={[
                        {title: "Create New Food", icon: plusIcon, onPress: openCreateNewFood, },
                        {title: "Edit Foods", icon: pencilIcon, onPress: () => {setEditFoods(!editFoods)}, },
                        ]} />
                </View> */}
                
            </View>
            
            <FilterAndSearch setValue={(e) => setSearchValue(e)} value ={searchValue} onChangeText={(e) => setSearchValue(e)} options={[...userFoodCategories, ...foodCategories]} selected={filterSelected} setSelected={setFilterSelected} padding={15} style={{marginHorizontal: -20,}} />
            {/* <Dropdown style={{zIndex: 2}} data={categoryData} selectedId={selectedCategory} setSelectedId={setSelectedCategory} actionIds={actionIds} actions={{"1": openCreateNewFood}} overflow={true} /> */}
            {filterSelected.length > 0 && (<Spacer height={10} />)}

            {/* <ScrollView style={{marginLeft: -20, marginRight: -20, height: screenHeight/1.5,}} contentContainerStyle={{paddingBottom: screenHeight/3, paddingHorizontal: 20, paddingTop: 10}} showsVerticalScrollIndicator={false}>
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
            </ScrollView> */}




            {/* New design flatlist */}
            <FlatList
                style={{ marginLeft: -20, marginRight: -20, }}
                data={filteredFoods}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: screenHeight,
                    paddingHorizontal: 20,
                    paddingTop: 10,
                }}
                renderItem={({ item }) => {
                    const selected = foodToAdd.map(f => f.id).includes(item.id);
                    const backgroundColor = editFoods
                        ? "#AB3F41"
                        : selected
                        ? "#304998"
                        : "#2E2E2E";

                    return (
                        <TouchableScale
                            activeScale={1.05}
                            friction={10}
                            tension={200}
                            onLongPress={() => openFoodPreview(item)}
                            onPress={() => selectFood(item)}
                            style={{
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                borderRadius: 10,
                                backgroundColor,
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 5, // spacing between items
                            }}
                        >
                            <FoodItem food={item}  />
                        </TouchableScale>
                    );
                }}
            />


            
            
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

    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState();

    const [searchValue, setSearchValue] = useState(""); // For library

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const [aiPage, setAiPage] = useState(-1); // -1: Prompt, 0: capture, 1: details
    const [fromAiPage, setFromAiPage] = useState("text"); // text, image
    const [foodsFound, setFoodsFound] = useState([]); // From AI

    const openEditFood = (food) => {
        if (foodPreviewOpen) setFoodPreviewOpen(false);
        router.push({
            pathname: '/editFood',
            params: {
                food: JSON.stringify(food),
                openedFrom: "addFood",
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

    const tabs = [" Scan", "Library", "AI"];
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
                autoSelectName: 1,
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

    const showCreditsTooltip = () => {
        setConfirmMenuData({
            title: "AI Analysis Credits",
            subTitle: user.premium ? "You are limited to 10 image AI analyses per day, and 30 text AI analyses per day." : "You are limited to 10 free image AI analyses, and 30 free text AI analyses.",
            subTitle2: user.premium ? "" : "Upgrade to Premium to get more analysis credits and unlock additional features.",
            option1: "Okay",
            option1color: "#546FDB",
            confirm: () => setConfirmMenuActive(false),
        });
        setConfirmMenuActive(true);
    }

  return (
    <ThemedView style={{flex: 1, padding: 20}}>

        {/* <KeyboardAvoidingView keyboardVerticalOffset={30} behavior={"padding"} style={{paddingHorizontal: 20, flex: 1, height: 100, zIndex: 1, position: "absolute", bottom: Platform.OS === 'ios' ? -10 : 0, left: 0, right: 0,}}>
            
            
                <Search value={searchValue} onChangeText={(e) => setSearchValue(e)} placeholder='Search' />
            
        </KeyboardAvoidingView> */}

        {/* Add items floating button */}
        {foodToAdd.length > 0 && !(tab === tabs[2] && aiPage === 0) && <Animated.View entering={SlideInDown.springify().damping(90)} exiting={SlideOutDown.springify().damping(90)} style={{position: 'absolute', bottom: 50, left: 20, right: 20, zIndex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Pressable onPress={requestAddFood} style={{paddingHorizontal: 20, paddingVertical: 20, backgroundColor: foodToAdd.length < 1 ? "grey":Colors.primaryBlue, borderRadius: 10, flexDirection: 'row', alignItems: 'center'}}>
                <Image style={{height: 20, width: 20, marginRight: 10}} source={plus} />
                <Text style={{fontSize: 20, color: "white", fontWeight: 400}}>Add <Text style={{fontWeight: 700}}>{foodToAdd.length}</Text> food{foodToAdd.length===1?"":"s"}</Text>
            </Pressable>
        </Animated.View>}


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

          {/* Super cool search bar that no longer is used */}
        {/* {tab === tabs[1] && (<Animated.View entering={FadeIn} exiting={FadeOut} style={[ { position: "absolute", left: 20, right: 20, bottom: Platform.OS === "ios" ? 20 : 50, zIndex: 9, alignItems: "center", }, animatedStyle ]} >
                <Animated.View style={[animatedSearchStyle]}>
                    <Search
                        value={searchValue}
                        onChangeText={(text) => setSearchValue(text)}
                        placeholder="Search"
                        backgroundColor='#3D3D3D'
                    />
                </Animated.View>
            
            </Animated.View>)} */}

        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
        <SafeAreaView>
            <View style={[styles.actionButtons]}>
                <View>
                    <Pressable onPress={() => router.back()}>
                        <Image style={{height: 50, width: 50}} source={greyX} />
                    </Pressable>
                </View>
                <View style={{zIndex: 1}}>
                    {/* <Pressable onPress={requestAddFood} style={{paddingHorizontal: 10, paddingVertical: 10, backgroundColor: foodToAdd.length < 1 ? "grey":Colors.primaryBlue, borderRadius: 10, flexDirection: 'row', alignItems: 'center'}}>
                        <Image style={{height: 20, width: 20, marginRight: 5}} source={plus} />
                        <Text style={{fontSize: 20, color: "white", fontWeight: 700}}>{foodToAdd.length}</Text>
                    </Pressable> */}

                    <Pressable onPress={() => openCreateNewFood()} style={{paddingHorizontal: 10, paddingVertical: 10, flexDirection: 'row', alignItems: 'center',}}>
                        <Text style={{fontSize: 15, color: "#FF696C", fontWeight: 400}}>New</Text>
                    </Pressable>
                </View>
            </View>

            <View style={[styles.header, {transform: [{translateY: -15}]}]}>
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
                    setSearchValue={setSearchValue}
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
                    <AITab
                    showCreditsTooltip={showCreditsTooltip}
                    selectFood={selectFood}
                    foodToAdd={foodToAdd}
                    openFoodPreview={openFoodPreview}
                    setFoodToAdd={setFoodToAdd}
                    page={aiPage}
                    setPage={setAiPage}
                    foodsFound={foodsFound}
                    setFoodsFound={setFoodsFound}
                    fromPage={fromAiPage}
                    setFromPage={setFromAiPage}
                    />
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
    header: {
      fontSize: 20,
      fontWeight: 700,
    },
})

