import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LineGraph from './LineGraph'
import Spacer from './Spacer'
import { Colors } from '../constants/Colors'
import RightArrow from '../assets/icons/rightArrow.png'


const GraphWidget = ({fullWidget = false, data=[], dates = [], ...props}) => {

    const firstItem = data[0];
    const lastItem = data[data.length - 1];

    const percentDifferenceTemp =  100*((lastItem-firstItem)/firstItem);
    let percentDifference = Math.round(percentDifferenceTemp * 10) / 10; // round to 1 decimal place
    if (isNaN(percentDifference)) percentDifference = 0;
    if (!isFinite(percentDifference)) percentDifference = 100;
    const isPositive = percentDifference > 0 ? true : false;

    const [graphHeight, setGraphHeight] = React.useState(0);

    const backGridTopOffset = 0;
    const backGridRightOffset = 40;

    const max = Math.max(...data);
    const min = Math.min(...data);

    let showMax = true;
    let showMin = true;
    let showMiddle = true;

    let endBottomPerfentOffset = ((data[data.length - 1]-min)/(max-min));
    if (isNaN(endBottomPerfentOffset)) endBottomPerfentOffset = 0.5;
     const endBottomOffset = endBottomPerfentOffset * graphHeight; // For middle number
    if (endBottomPerfentOffset < 0.1 || endBottomPerfentOffset > 0.9) {
        showMiddle = false;
    }
    if (max === min) {
        console.log("testing ", endBottomPerfentOffset);
        showMax = false;
        showMin = false,
        showMiddle = true;
    }
   

    
  return (
    <Pressable style={[styles.container, fullWidget ? {flex: 1, width: "100%"} : null]} onPress={props.onPress}>
        <View>
            <Text  style={styles.title}>{props.title}</Text>
            <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                <Text style={styles.amount}>{lastItem}</Text>
                <Text style={styles.unit}>{props.unit}</Text>
            </View>
        </View>

        <Spacer height={30} />

        <View style={{ paddingRight: backGridRightOffset, marginLeft: 10, width: "100%",}} onLayout={(e) => setGraphHeight(e.nativeEvent.layout.height) }>
            {/* SVG graph */}
            <LineGraph data={data} color={props.color} aspectRatio={1/2} />

            {/* Back grid */}
            <View style={{ paddingVertical: backGridTopOffset, paddingRight: backGridRightOffset, zIndex: -1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                {  (<View style={{width: "100%", height: 2, backgroundColor: "#585858", borderRadius: 99999, position: "absolute", top: 0, left: 0, transform: [{translateY: -2*backGridTopOffset}], opacity: showMax ? 1 : 0}} >
                    
                    <View style={{position: "absolute", height: 50, top: -25, left: "101%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: "#848484", fontSize: 12}}>{max}</Text>
                    </View>
                </View>)}

                { (<View style={{width: "100%", height: 2, backgroundColor: "#585858", borderRadius: 99999,position: "absolute", bottom: endBottomOffset, left: 0, transform: [{translateY: -2*backGridTopOffset}], opacity: showMiddle ? 1 : 0}} >
                    <View style={{position: "absolute", height: 50, top: -25, left: "101%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: "#848484", fontSize: 12}}>{ data[data.length -1] }</Text>
                    </View>
                </View>)}

                { (<View style={{width: "100%", height: 2, backgroundColor: "#585858", borderRadius: 99999, position: "absolute", bottom: 0, left: 0, transform: [{translateY: -2*backGridTopOffset}], opacity: showMin ? 1 : 0}} >
                    <View style={{position: "absolute", height: 50, top: -25, left: "101%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: "#848484", fontSize: 12}}>{ min }</Text>
                    </View>
                </View>)}
            </View>
        </View>

        

        <Spacer height={15} />

        <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={[styles.bottomText, {color: isPositive ? "#86BE79" : "#FF8686", fontWeight: "700"}]}>{isPositive ? "+":""}{percentDifference}%</Text>
            <Text style={styles.bottomText}>Last {props.timeframe}</Text>
            <Image style={styles.arrowImage} source={RightArrow} />
        </View>

    </Pressable>
  )
}

export default GraphWidget

const styles = StyleSheet.create({
    container: {
        width: 180,
        padding: 10,
        backgroundColor: "#3A3A3A",
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