import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import TitleWithBack from '../../../components/TitleWithBack'
import { SafeAreaView } from 'react-native-safe-area-context'
import ConfirmMenu from '../../../components/ConfirmMenu'
import { useUserStore } from '../../../stores/useUserStore'
import ProfileImg from '../../../components/ProfileImg'
import Spacer from '../../../components/Spacer'
import DisplayName from '../../../components/DisplayName'
import ThemedTextInput from '../../../components/ThemedTextInput'
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated'
import { Colors } from '../../../constants/Colors'
import sendData from '../../../util/server/sendData'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import Loading from '../../../components/Loading'
import * as ImagePicker from "expo-image-picker";

const EditProfilePage = () => {
  const {showAlert} = useBottomSheet();

  const user = useUserStore(state => state.user);
  const updateUser = useUserStore(state => state.updateUser);

  const u = JSON.parse(JSON.stringify(user));

  const [confirmMenuActive, setConfirmMenuActive] = useState(false);
  const [confirmMenuData, setConfirmMenuData] = useState({});

  //const [profileImg, setProfileImg] = useState(u.profileImg); // Later add a save button
  const [username, setUsername] = useState(u.username);
  const [description, setDescription] = useState(u.usernameDecoration.description ?? "");

  const [loadingUsername, setLoadingUsername] = useState(false);
  const [loadingProfileImg, setLoadingProfileImg] = useState(false);

  const updateServerData = async data => {
    const response = await sendData("/dashboard/editprofile", {...data, jsonWebToken: user.jsonWebToken});
    if (response.status !== "success") {
      showAlert(response.message, false);
      return false;
    }
    return true;
  }

  const saveUsername = async () => {
    setLoadingUsername(true);
    // Send server request
    const data = {
      key: "username",
      value: username,
    };
    const success = await updateServerData(data);
    if (success) {
      updateUser({username});
    }
    setLoadingUsername(false);

  }
  const saveDescription = () => {
    // Change client side
    updateUser({usernameDecoration: {description: description}});
    // Send server request
    const data = {
      key: "desc",
      value: description,
    };
    updateServerData(data);

  }

  const showComingSoon = () => {
      console.log("Showing...");
      setConfirmMenuData({
            title: "Coming soon!",
            subTitle: "",
            subTitle2: "",
            option1: "Okay",
            option1color: "#546FDB",
            confirm: () => setConfirmMenuActive(false),
        });
        setConfirmMenuActive(true);
    }

    const pickImage = async () => {
      // Ask permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Permission to access the media library is required.');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        quality: 1,
        base64: true,
      });

      //console.log(result);

      if (!result.canceled) {
        setLoadingProfileImg(true);
        //setImage(result.assets[0].uri);
        const asset = result.assets[0];
        const base64Image = `data:${asset.mimeType || "image/jpeg"};base64,${asset.base64}`;

        const response = await sendData('/dashboard/editprofile', {key: "profileImg", value: base64Image, jsonWebToken: user.jsonWebToken});
        if (response.status !== "success") {
          showAlert(response.message, false);
        } else {
          const {imageURL, imageID} = response;
          updateUser({profileImg: {url: imageURL, public_id: imageID}});
        }
        setLoadingProfileImg(false);
      }
    };

  return (
    <ThemedView style={styles.container}>
        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
        <SafeAreaView>
            <TitleWithBack title={"Edit Profile"} />
            <Spacer height={20} />
            <View style={{width: "100%", justifyContent: "center", alignItems: "center"}}>
              <View style={{width: 100, height: 100}}>
                <Pressable onPress={pickImage} style={[StyleSheet.absoluteFill, {backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1, borderRadius: 99999,  }]}>
                  {loadingProfileImg ? (
                    <View style={[StyleSheet.absoluteFill, { justifyContent: "center", alignItems: "center"}]}>
                      <Loading style={{width: 20, height: 20,}} />
                    </View>
                  ):(
                    <View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                      <Text style={{color: "white", textAlign: "center", fontWeight: "800"}}>Change</Text>
                      <Text style={{color: "white", textAlign: "center", fontWeight: "800"}}>Image</Text>
                    </View>
                  )}
                  
                  
                </Pressable>
                <ProfileImg profileImg={user.profileImg} size={100} />
              </View>
              
              <Spacer height={40} />

              {/* Save input - username */}
              <View style={{width: "100%"}}>
                <ThemedTextInput value={username} placeholder='Username' onChange={(v) => {setUsername(v.split('').splice(0, 15).join(''))}} />
                  {/* Svae button */}
                  {username !== user.username && (
                  <Animated.View entering={SlideInRight.springify().damping(90)} exiting={SlideOutRight.springify().damping(90)} style={{position: 'absolute', right: 20, top: 0, bottom: 0, zIndex: 2, justifyContent: "center"}}>
                    <Pressable onPress={saveUsername} style={{padding: 20, backgroundColor: Colors.primaryBlue,borderRadius: 10 }}>
                      {loadingUsername ? (<View>
                         <Loading style={{width: 20, height: 20,}} />
                      </View>) : (<View style={{width: "100%", justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: "white", textAlign: "center"}}>Save</Text>
                      </View>)}
                      
                    </Pressable>
                  </Animated.View>)}
              </View>

              <Spacer height={20} />
              
              {/* Save input  -description */}
              <View style={{width: "100%", paddingHorizontal: 30}}>
                <TextInput
                value={description}
                placeholder='Description goes here...'
                onChangeText={(v) => {setDescription(v)}}
                editable
                multiline
                numberOfLines={4}
                maxLength={100}
                placeholderTextColor={"#a0a0a0ff"}
                style={{backgroundColor: "#252525", borderRadius: 15, height: 100, width: "100%", textAlignVertical: 'top', color: "white", fontSize: 15, paddingHorizontal: 20, paddingVertical: 20, fontFamily: "DoppioOne-Regular",}}
                />
              </View>
              <Spacer height={10} />
              <View style={{width: "100%"}}>
                {description !== user.usernameDecoration.description && (
                  <Animated.View entering={SlideInRight.springify().damping(90)} exiting={SlideOutRight.springify().damping(90)} style={{position: 'absolute', right: 30, zIndex: 2, justifyContent: "center"}}>
                    <Pressable onPress={saveDescription} style={{padding: 20, backgroundColor: Colors.primaryBlue, borderRadius: 10 }}>
                      <Text style={{color: "white", textAlign: "center"}}>Save</Text>
                    </Pressable>
                  </Animated.View>
                )}
                
              </View>
              

              <Spacer height={40} />
                
                
            </View>


            
        </SafeAreaView>
    </ThemedView>
  )
}

export default EditProfilePage

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    
  })