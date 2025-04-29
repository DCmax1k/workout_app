import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LineGraph from './LineGraph'
import Spacer from './Spacer'
import { Colors } from '../constants/Colors'
import RightArrow from '../assets/icons/rightArrow.png'

const PreviewData = (props) => {

    const firstItem = props.data[0];
    const lastItem = props.data[props.data.length - 1];

    const percentDifferenceTemp =  100*((lastItem-firstItem)/firstItem);
    const percentDifference = Math.round(percentDifferenceTemp * 10) / 10; // round to 1 decimal place
    const isPositive = percentDifference > 0 ? true : false;
    
  return (
    <Pressable style={styles.container} onPress={props.onPress}>
        <View>
            <Text  style={styles.title}>{props.title}</Text>
            <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                <Text style={styles.amount}>{lastItem}</Text>
                <Text style={styles.unit}>{props.unit}</Text>
            </View>
        </View>

        <Spacer height={30} />

        <LineGraph data={props.data} color={props.color} aspectRatio={1/6}  />

        <Spacer height={15} />

        <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={[styles.bottomText, {color: isPositive ? "#86BE79" : "#FF8686", fontWeight: "700"}]}>{isPositive ? "+":""}{percentDifference}%</Text>
            <Text style={styles.bottomText}>Last {props.timeframe}</Text>
            <Image style={styles.arrowImage} source={RightArrow} />
        </View>

    </Pressable>
  )
}

export default PreviewData

const styles = StyleSheet.create({
    container: {
        width: 180,
        padding: 10,
        backgroundColor: "#262626",
        borderRadius: 10,
        marginRight: 20,
    },
    title: {
        fontSize: 16,
        color: Colors.dark.text,
        marginBottom: 5,
    },
    amount: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginRight: 5,
    },
    unit: {
        fontSize: 14,
        color: "#848484",
    },
    bottomText: {
        fontSize: 12,
        color: Colors.dark.text,
        marginLeft: 5,
    },
    arrowImage: {
        width: 10,
        height: 10,
        marginLeft: "auto",
        tintColor: Colors.dark.text,
    }
})