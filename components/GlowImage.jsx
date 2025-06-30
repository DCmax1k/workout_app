import { Dimensions, Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { Portal } from 'react-native-paper';
import Animated, { FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const GlowImage = ({ style, source, id = 0, ...props }) => {
  const [active, setActive] = useState(false);

  const tag = 'image-'+id;
  return (
    <View {...props}>
      <Pressable onPress={() => {
          console.log('clicked'); setActive(true);
          console.log("Pushing with tag", tag, "and source", source)

          const data = JSON.stringify({
            source,
            tag,
          });

          router.push({
            pathname: "/GlowImageCont",
            params: {
              data,
            },
          });
          
        }}>
          <Animated.View  >
            <Animated.Image source={source} style={style} sharedTransitionTag={tag} />
          </Animated.View>
        
      </Pressable>

      {/* {active && (
        <Portal>
              <Pressable
                    onPress={() => setActive(false)}
                    style={StyleSheet.absoluteFill} // covers the whole screen
                >
                    <Animated.View style={styles.overlay}>
                    <Animated.Image
                        source={source}
                        style={styles.fullscreenImage}
                        entering={FadeIn.delay(100)}
                    />
                    </Animated.View>
                </Pressable>  
          
        </Portal>
      )} */}
    </View>
  );
};

export default GlowImage;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
});
