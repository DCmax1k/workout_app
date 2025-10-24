// import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
// import React, { useState } from 'react'
// import dropdown from '../assets/icons/dropdown.png'
// import { Image } from 'react-native';
// import { Portal } from 'react-native-paper';
// import Animated, { Easing, FadeInUp, FadeOutUp, useAnimatedRef, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// const Dropdown = ({data, height = 50,maxHeight = 225, style, selectedId, setSelectedId, actionIds=[], actions=[], locked = false, overflow =false, backgroundColor="#3D3D3D", hideSelectedFromOptions=true,  ...props}) => {
//     const [active, setActive] = useState(false);

//     const selected = data.find(d => d.id === selectedId);
//     //const notSelected = data.filter(d => d.id !== selectedId);

//     const [overflowShowing, setOverflowShowing] = useState(false);

//     let scrollViewHeight = (data.length-1)*height;
//     if (scrollViewHeight > maxHeight) scrollViewHeight = maxHeight;

//     // Animation slide
//     const h = active ? height*data.length : height;

//     const totalHeight = data.length * height;
//     if (totalHeight > maxHeight) scrollViewHeight = maxHeight;

//     const heightAnim = useSharedValue(height);
//     const heightAnimationStyle = useAnimatedStyle(() => {
//             return {
//                 height: heightAnim.value,
//             }
//           }, [])

        
//     const slideTiming = (destination) => {
//         return withTiming(destination, {
//             duration: 300,
//             easing: Easing.bezier(0.45, 0.78, 0.34, 0.98),
//         });
//     }

//     const selectItem = (itemID) => {
//         // Check for action buttons
//         if (actionIds.includes(itemID)) {
//             actions[itemID]();
//             setActive(false);
//             heightAnim.value = slideTiming(height);
//             return;
//         }
//         // Set selected
//         setSelectedId(itemID);
//         if (active) {
//             setActive(false);
//             heightAnim.value = slideTiming(height);
//             return;
//         }
//         setActive(!active);
//         heightAnim.value = height;
//     }

//     const toggleItems = () => {
//         if (overflow) {
//             setOverflowShowing(!overflowShowing);
//             return;
//         }
//         if (active) {
//             setActive(false);
//             heightAnim.value = slideTiming(height);
//             return;
//         }
//         setActive(!active);
//         heightAnim.value = slideTiming(height*data.length);
        
//     }
//   return (
//     <Animated.View style={[styles.mainCont, {overflow: overflow ? "visible" : "hidden", zIndex: overflowShowing ? 100 : 0}, style, overflow ? {height} : heightAnimationStyle]} >
//         <Pressable key={selected.id} style={[styles.item, {height: height, width: "100%", backgroundColor, borderTopWidth: 0, borderRadius: 10, zIndex: 101}]} onPress={locked ? () => {} : toggleItems}>
//             <Text style={[styles.itemText, {fontWeight: 700}]}>{selected.title}</Text>
//         </Pressable>

//         { (overflow===false || (overflow===true && overflowShowing===true)) && (
//             <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={[{maxHeight: maxHeight, width: '100%', elevation: 100, zIndex: 100}]}>
//             {/* <ScrollView style={{height: scrollViewHeight, backgroundColor: "#323232", borderBottomRightRadius: 10, borderBottomLeftRadius: 10}} >
//                 {data.map((item, i) => {
//                 return  (hideSelectedFromOptions===false || ( hideSelectedFromOptions === true && selected.id !== item.id )) &&  (<Pressable key={item.id} style={[styles.item, {height: height, fontSize: 18,},]} onPress={() => {selectItem(item.id); setOverflowShowing(false)}}>
//                         <Text style={[styles.itemText]}>{item.title}</Text>
//                     </Pressable>
//                     )})}
//             </ScrollView> */}
//             <View style={{maxHeight: scrollViewHeight+20, paddingTop: 10, backgroundColor: "#323232", borderBottomRightRadius: 10, borderBottomLeftRadius: 10, overflow: "hidden", transform: [{translateY: -10}]}}>

//                 <FlatList
//                     style={{ height: scrollViewHeight, }}
//                     showsVerticalScrollIndicator={false}
//                     data={data}
//                     keyExtractor={(item) => item.id.toString()}
//                     initialScrollIndex={data.findIndex((item) => item.id === selected.id)}
//                     getItemLayout={(data, index) => ({
//                         length: height,
//                         offset: height * index,
//                         index,
//                     })}
//                     renderItem={({ item }) =>
//                         (hideSelectedFromOptions === false || selected.id !== item.id) && (
//                         <Pressable
//                             style={[styles.item, { height, fontSize: 18 }]}
//                             onPress={() => {
//                             selectItem(item.id);
//                             setOverflowShowing(false);
//                             }}
//                         >
//                             <Text style={[styles.itemText, actionIds.includes(item.id) && {color: "#92A8FF"}]}>{item.title}</Text>
//                         </Pressable>
//                         )
//                     }
//                     />
//             </View>
            
            
//         </Animated.View>)}


//         <Image style={{position: 'absolute', pointerEvents: "none", height: 20, width: 20, objectFit: "contain", right: 10, top: 15, tintColor: "#546FDB", zIndex: 102}} source={dropdown} />
        
//     </Animated.View>
    
//   )
// }

// export default Dropdown

// const styles = StyleSheet.create({
//     mainCont: {
//         backgroundColor: "#323232",
//         borderRadius: 10,
//     },
//     item: {
//         justifyContent: "center",
//         alignItems: "flex-start",
//         borderTopWidth: 1,
//         borderTopColor: "#565656",
//     },
//     itemText: {
//         color: "white",
//         fontSize: 18,
//         paddingLeft: 10
//     }
// })


// Correctly sets background so that it can be closed clicking anywhere else
import React, { useState, useRef } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  findNodeHandle,
  UIManager,
  Dimensions,
} from 'react-native';
import { Portal } from 'react-native-paper';
import Animated, {
  Easing,
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import dropdown from '../assets/icons/dropdown.png';

const { height: screenHeight } = Dimensions.get('window');

const Dropdown = ({
  data,
  height = 50,
  maxHeight = 225,
  style,
  selectedId,
  setSelectedId,
  actionIds = [],
  actions = [],
  locked = false,
  overflow = false,
  backgroundColor = '#3D3D3D',
  hideSelectedFromOptions = true,
  ...props
}) => {
  const [active, setActive] = useState(false);
  const [anchorLayout, setAnchorLayout] = useState(null);

  const anchorRef = useRef(null);

  const selected = data.find((d) => d.id === selectedId);
  const [overflowShowing, setOverflowShowing] = useState(false);

  let scrollViewHeight = (data.length - 1) * height;
  if (scrollViewHeight > maxHeight) scrollViewHeight = maxHeight;

  const heightAnim = useSharedValue(height);
  const heightAnimationStyle = useAnimatedStyle(() => ({
    height: heightAnim.value,
  }));

  const slideTiming = (destination) =>
    withTiming(destination, {
      duration: 300,
      easing: Easing.bezier(0.45, 0.78, 0.34, 0.98),
    });

  const selectItem = (itemID) => {
    if (actionIds.includes(itemID)) {
      actions[itemID]();
      closeDropdown();
      return;
    }
    setSelectedId(itemID);
    closeDropdown();
  };

  const closeDropdown = () => {
    setActive(false);
    setOverflowShowing(false);
    heightAnim.value = slideTiming(height);
  };

  const toggleItems = () => {
    if (locked) return;

    if (!active && overflow) {
      measureAnchor(); // measure before opening
      setOverflowShowing(true);
      return;
    }
    if (active) {
      closeDropdown();
    } else {
      heightAnim.value = slideTiming(height * data.length);
      setActive(true);
    }
  };

  const measureAnchor = () => {
    if (!anchorRef.current) return;

    anchorRef.current.measure((x, y, width, height, pageX, pageY) => {
        // pageX and pageY are the absolute coordinates on screen
        setAnchorLayout({ x: pageX, y: pageY, w: width, h: height });
    });
   };

  return (
    <>
      {/* The “anchor” in layout flow */}
      <Animated.View
        ref={anchorRef}
        onLayout={measureAnchor}
        style={[
          styles.mainCont,
          { overflow: overflow ? 'visible' : 'hidden' },
          style,
          overflow ? { height } : heightAnimationStyle,
          {
            borderBottomLeftRadius: overflowShowing ? 0 : 10,   // <- dynamically change
            borderBottomRightRadius: overflowShowing ? 0 : 10,  // <- dynamically change
          }
        ]}
      >
        <Pressable
          key={selected.id}
          style={[
            styles.item,
            {
              height,
              width: '100%',
              backgroundColor,
              borderTopWidth: 0,
              borderRadius: 10,
              borderBottomLeftRadius: overflowShowing ? 0 : 10,   // <- dynamically change
              borderBottomRightRadius: overflowShowing ? 0 : 10,  // <- dynamically change
            },
          ]}
          onPress={toggleItems}
        >
          <Text style={[styles.itemText, { fontWeight: '700' }]}>
            {selected.title}
          </Text>
          <Image
            style={styles.dropdownIcon}
            source={dropdown}
          />
        </Pressable>

        {/* Inline dropdown (for non-overflow mode) */}
        {!overflow && (
          <Animated.View
            // entering={FadeInUp}
            // exiting={FadeOutUp}
            style={{
              maxHeight: maxHeight,
              width: '100%',
              zIndex: 100,
            }}
          >
            <DropdownList
              data={data}
              height={height}
              scrollViewHeight={scrollViewHeight}
              selected={selected}
              hideSelectedFromOptions={hideSelectedFromOptions}
              selectItem={selectItem}
              actionIds={actionIds}
            />
          </Animated.View>
        )}
      </Animated.View>

      {/* Portal overlay for overflow mode */}
      {overflowShowing && anchorLayout && (
        <Portal>
          <View style={StyleSheet.absoluteFill}>
            {/* Transparent backdrop to close when clicking outside */}
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={closeDropdown}
            />
            {/* Dropdown positioned where the anchor is */}
            <Animated.View
              entering={FadeInUp}
              exiting={FadeOutUp}
              style={[
                {
                  position: 'absolute',
                  top: anchorLayout.y + anchorLayout.h ,
                  left: anchorLayout.x,
                  width: anchorLayout.w,
                  maxHeight: maxHeight,
                  zIndex: 200,
                  elevation: 20,
                  
                },
              ]}
            >
              <DropdownList
                data={data}
                height={height}
                scrollViewHeight={scrollViewHeight}
                selected={selected}
                hideSelectedFromOptions={hideSelectedFromOptions}
                selectItem={selectItem}
                actionIds={actionIds}
              />
            </Animated.View>
          </View>
        </Portal>
      )}
    </>
  );
};

// Extracted for cleanliness
const DropdownList = ({
  data,
  height,
  scrollViewHeight,
  selected,
  hideSelectedFromOptions,
  selectItem,
  actionIds,
}) => {
  return (
    <View
      style={{
        maxHeight: scrollViewHeight + 20,
        paddingTop: 0,
        backgroundColor: '#323232',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        overflow: 'hidden',
      }}
    >
      <FlatList
        style={{ height: scrollViewHeight }}
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        initialScrollIndex={data.findIndex((item) => item.id === selected.id)}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        renderItem={({ item }) =>
          (hideSelectedFromOptions === false || selected.id !== item.id) && (
            <Pressable
              style={[styles.item, { height }]}
              onPress={() => selectItem(item.id)}
            >
              <Text
                style={[
                  styles.itemText,
                  actionIds.includes(item.id) && { color: '#92A8FF' },
                ]}
              >
                {item.title}
              </Text>
            </Pressable>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainCont: {
    backgroundColor: '#323232',
    borderRadius: 10,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#565656',
    paddingHorizontal: 10,
  },
  itemText: {
    color: 'white',
    fontSize: 18,
  },
  dropdownIcon: {
    position: 'absolute',
    height: 20,
    width: 20,
    resizeMode: 'contain',
    right: 10,
    tintColor: '#546FDB',
  },
});

export default Dropdown;

