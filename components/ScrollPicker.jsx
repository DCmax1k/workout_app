import React, { useEffect, useMemo, useRef } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import rightCarrot from '../assets/icons/rightCarrot.png'
import Spacer from './Spacer';

const ITEM_HEIGHT = 40; // height per row

const ScrollPicker = ({
  width = 80,
  range = [0, 100],
  increment = 1,
  padWithZero = false,
  onValueChange,
  initialValue = 0,
  backgroundcolor = "#303030",
}) => {
  // Generate list of numbers
  const data = useMemo(() => {
    const arr = [];
    for (let i = range[0]; i <= range[1]; i += increment) {
      arr.push(i);
    }
    return arr;
  }, [range, increment]);

  const flatListRef = useRef(null);

  // Format with leading zero if needed
  const formatNumber = (num) => {
    if (padWithZero) {
      return String(num).padStart(2, '0');
    }
    return String(num);
  };

  // Find initial index
  const initialIndex = data.findIndex((n) => n === initialValue);

  const onScrollEnd = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const value = data[index];
    if (onValueChange) onValueChange(value);

    // snap to index
    // flatListRef.current?.scrollToIndex({ index, animated: true });
  };
  useEffect(() => {
    if (flatListRef.current && initialIndex > -1) {
        // wait for next frame to ensure FlatList is measured
        requestAnimationFrame(() => {
            flatListRef.current.scrollToIndex({ index: initialIndex, animated: false });
        });
    }
    }, [flatListRef, initialIndex]);

  return (
    <View style={{flexDirection: "column"}}>
        <View style={{width, height: ITEM_HEIGHT/2, justifyContent: "center", alignItems: "center"}}>
            <Image source={rightCarrot} style={{objectFit: "contain", transform: [{rotate: "-90deg"}], height: "100%", width: "100%", tintColor: "#454545"}} />
        </View>
        <Spacer height={10} />
        <View style={[styles.container, { width, height: ITEM_HEIGHT * 3, }]}>
        
            <FlatList
                ref={flatListRef}
                data={data}
                keyExtractor={(item, i) => i.toString()}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                initialScrollIndex={initialIndex > -1 ? initialIndex : 0}
                getItemLayout={(data, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
                })}
                onMomentumScrollEnd={onScrollEnd}
                contentContainerStyle={{
                    paddingVertical: ITEM_HEIGHT,
                }}
                style={{width: "100%", height: ITEM_HEIGHT*3}}
                renderItem={({ item, index }) => {
                return (
                    <View style={[styles.item, { height: ITEM_HEIGHT }]}>
                    <Text
                        style={[
                        styles.text,
                        {
                            color: 'white',
                        },
                        ]}
                    >
                        {formatNumber(item)}
                    </Text>
                    </View>
                );
                }}
            />

            {/* Overlay center highlight */}
            <View
                pointerEvents="none"
                style={[
                styles.greyout,
                { top: 0, height: ITEM_HEIGHT, width, backgroundColor: backgroundcolor },
                ]}
            />
            <View
                pointerEvents="none"
                style={[
                styles.greyout,
                { top: ITEM_HEIGHT*2, height: ITEM_HEIGHT, width, backgroundColor: backgroundcolor },
                ]}
            />

            {/* Center */}
            <View
                pointerEvents="none"
                style={[
                {position: "absolute", backgroundColor: "#454545", zIndex: -1, borderRadius: 99999},
                { top: ITEM_HEIGHT, height: ITEM_HEIGHT, width: width/2, },
                ]}
            />

        </View>
        <Spacer height={10} />
        <View style={{width, height: ITEM_HEIGHT/2, justifyContent: "center", alignItems: "center"}}>
            <Image source={rightCarrot} style={{objectFit: "contain", transform: [{rotate: "90deg"}], height: "100%", width: "100%", tintColor: "#454545"}} />
        </View>
    </View>
    
  );
};

export default ScrollPicker;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexDirection: "column",
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: '600',
  },
  greyout: {
    position: 'absolute',
    opacity: 0.85,
  },
});
