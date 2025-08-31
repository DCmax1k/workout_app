import { Dimensions, StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import ThemedText from './ThemedText';
import { Colors } from '../constants/Colors';
import Spacer from './Spacer';

const screenWidth = Dimensions.get('screen').width;

const markerHeight = 20;

const clamp = (num, min, max) => Math.max(min, Math.min(num, max));
const round1 = num => Math.round(num * 10) / 10;

const createRangeArray = (min, max, increment) => {
    const arr = [];
    for (let i = min; i <= max; i += increment) {
        arr.push(round1(i));
    }
    return arr;
};

const HorizontalScrollInput = ({initialValue = 0, increment = 0.1, range = [0, 1000], unit ='lbs', value = null, scrollItemWidth = 10, setValue = () => {}}) => {

    const numbers = createRangeArray(range[0], range[1], increment);
    const initialIndex = Math.round((initialValue - range[0]) / increment);
    
    const flatListRef = useRef(null);

    // Center initial value on mount
    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                index: initialIndex,
                animated: false,
                viewPosition: 0.5 // center the item
            });
        }
    }, []);

    const isInt = num => parseFloat(num) % (increment*10) === 0;
    const isIntHalf = num => parseFloat(num) % (increment*5) === 0;

    // For FlatList performance
    const getItemLayout = (_, index) => ({
        length: scrollItemWidth,
        offset: scrollItemWidth * index,
        index,
    });

    return (
        <View style={{flexDirection: "column", alignItems: "center", position: "relative"}}>
            {/* Show value and unit */}
            <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60,}}>
                <ThemedText title={true} style={{height: 60, fontSize: 40, fontWeight: "bold", borderColor: "blue", marginTop: 10}}>
                    {value.toFixed(1)}
                </ThemedText>
                <ThemedText style={{height: 60, fontSize: 20, fontWeight: '300', borderColor: "blue", marginTop: 47, marginLeft: 10}}>
                    {unit}
                </ThemedText>
            </View>

            {/* Actual scroll input */}
            <View style={{ width: screenWidth, alignItems: 'center', marginVertical: 20, position: "relative", }}>
                {/* Blue center marker */}
                <View style={{position: "absolute", left: 0, right: 0, top: -(markerHeight/2), alignItems: "center", zIndex: 1, elevation: 1, pointerEvents: "none"}}>
                    <View style={[styles.marker, {height: markerHeight*2.5, width:  scrollItemWidth*0.3 + 2, backgroundColor: Colors.primaryBlue}]}>
                                        
                    </View>
                </View>
                <FlatList
                    style={{width: "100%"}}
                    // removeClippedSubviews={false}
                    ref={flatListRef}
                    data={numbers}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={scrollItemWidth}
                    decelerationRate="fast"
                    getItemLayout={getItemLayout}
                    initialScrollIndex={initialIndex}
                    initialNumToRender={200} 
                    maxToRenderPerBatch={200}
                    windowSize={3}
                    contentContainerStyle={{ paddingHorizontal: screenWidth / 2 - scrollItemWidth / 2 }}
                    keyExtractor={item => item.toString()}
                    renderItem={({ item }) => (
                        <View style={[{ height: 120,  width: scrollItemWidth, alignItems: "center", overflow: 'visible'}]}>
                            <View style={[{height: "100%", alignItems: "center"}]}>
                                <View style={[styles.marker, {height: isInt(item) ? markerHeight*2 : isIntHalf(item) ? markerHeight*1.5 : markerHeight, width: scrollItemWidth*0.3}]}>
                                    
                                </View>
                                {isInt(item) === true && (
                                    <View style={{ width: scrollItemWidth*9}}>
                                        <Spacer height={5} />
                                        <ThemedText style={{textAlign: "center", fontSize: 16, fontWeight: "600"}}>{item}</ThemedText>
                                    </View>
                                )}
                            </View>
                           
                        </View>
                    )}
                    onScroll={e => {
                        const x = e.nativeEvent.contentOffset.x;
                        const index = Math.round(x / scrollItemWidth);
                        const newValue = clamp(range[0] + index * increment, range[0], range[1]);
                        setValue(round1(newValue));
                    }}
                    scrollEventThrottle={16}
                />
            </View>

            
        </View>
    )
}

export default HorizontalScrollInput

const styles = StyleSheet.create({
    marker: {
        backgroundColor: '#505050',
        borderRadius: 99999,
    }
})
