// import { Image, StyleSheet, Text, View , ScrollView, Pressable, Dimensions} from 'react-native'
// import React, { useEffect } from 'react'
// import { useUserStore } from '../stores/useUserStore';
// import { Redirect, useRouter } from 'expo-router';

// import WelcomePage from '../components/onboarding/WelcomePage';
// import { TestUsers } from '../constants/TestUsers';

// const screenWidth = Dimensions.get("window").width;
// const screenHeight = Dimensions.get("window").height;

// const USER = TestUsers[0]; // Default user

// const Login = () => {
//     const users = useUserStore((state) => state.users);
//     const user = useUserStore((state) => state.user);
//     const setUser = useUserStore((state => state.setUser));
//     const router = useRouter();
//     // Login automatically
//     useEffect(() => {
//         const timoutId = setTimeout(() => {

//             // RESET USER
//             //setUser(JSON.parse(JSON.stringify(USER)));


//             // ReLogin user
//             // if (Object.keys(users).length > 0) {
//             //   setUser(JSON.parse(JSON.stringify(users[Object.keys(users)[0]])));
//             // } 
            

//         }, 1000);

//         return () => clearTimeout(timoutId);
//     }, []);

    

//   return user ? (
//     <Redirect href={"/dashboard"} />
//   )
//   : (
//     <View style={{flex: 1, height: screenHeight, width: screenWidth}}>
//       <WelcomePage />
//     </View>
//   )
// }

// export default Login

// const styles = StyleSheet.create({})