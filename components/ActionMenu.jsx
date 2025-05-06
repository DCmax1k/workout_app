import React, { useRef, useState } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import { Portal } from 'react-native-paper';
import threeEllipses from '../assets/icons/threeEllipses.png';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const MENU_WIDTH = 250;
const ITEM_HEIGHT = 40;

const ActionMenu = ({ data, backgroundColor }) => {
  const [active, setActive] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const MENU_HEIGHT = ITEM_HEIGHT*data.length;

  const openMenu = () => {
    buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
      const isLowerHalf = pageY > screenHeight / 2;
  
      setMenuPos({
        x: pageX - MENU_WIDTH + 30,
        y: isLowerHalf ? pageY - MENU_HEIGHT : pageY + height
      });
  
      setActive(true);
    });
  };

  return (
    <>
      <Pressable
        ref={buttonRef}
        onPress={openMenu}
        style={{
          paddingVertical: 0,
          paddingHorizontal: 5,
          backgroundColor,
          borderRadius: 5,
        }}
      >
        <Image
          style={{ width: 20, height: 20, resizeMode: 'contain' }}
          source={threeEllipses}
        />
      </Pressable>

      <Portal>
          {active && (
          <View style={styles.fullScreenOverlay}>
            {/* BACKDROP - dismisses when tapped */}
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setActive(false)}
            />

            {/* MENU - not affected by backdrop press */}
            <View style={[ styles.menu, { top: menuPos.y, left: menuPos.x,},]}>

              {data.map((item, i) => (
              <Pressable key={i} onPress={() => {setActive(false); item.onPress()}} style={[styles.menuItem, {height: ITEM_HEIGHT}]}>
                <Image style={{height: 15, width: 15, objectFit: "contain"}} source={item.icon} />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </Pressable>
              ))}

            </View>
          </View>
        )}
      </Portal>
    </>
  );
};

export default ActionMenu;

const styles = StyleSheet.create({
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'rgba(0,0,0,0.50)',
  },
  menu: {
    position: 'absolute',
    width: MENU_WIDTH,
    backgroundColor: '#606060',
    borderRadius: 6,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: "center",
    paddingHorizontal: 10,
  },
  menuItemText: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    color: "white",
  },
});
