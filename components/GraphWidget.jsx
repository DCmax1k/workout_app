import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import LineGraph from './LineGraph'
import Spacer from './Spacer'
import { Colors } from '../constants/Colors'
import RightArrow from '../assets/icons/rightArrow.png'
import SectionSelect from './SectionSelect'


const GraphWidget = ({fullWidget = false, data=[], dates = [], ...props}) => {

    const oriData = JSON.parse(JSON.stringify(data));
    const oriDates = JSON.parse(JSON.stringify(dates));

    const sectionOptions = ["Past 5", "Past 10", "All time"];
    const [section, setSection] = useState(sectionOptions[0]);

    if (section === sectionOptions[0]) {
        // Past 5
        if (data.length > 5) {
            data = oriData.splice(oriData.length - 5, 5);
            dates = oriDates.splice(oriDates.length - 5, 5);
        }
        
    } else if (section === sectionOptions[1]) {
        // Past 10
        if (data.length > 10) {
            data = oriData.splice(oriData.length - 10, 10);
            dates = oriDates.splice(oriDates.length - 10, 10);
        }
    } else {
        data = oriData;
        dates = oriDates;
    }
    
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
        showMax = false;
        showMin = false,
        showMiddle = true;
    }
   
    const initialDateString = new Date(dates[0]).toLocaleDateString();
    const initialDateStringNoYear = initialDateString.split("").splice(0, initialDateString.length-5).join("");
    const initialDateStringJustYear = initialDateString.split("").splice(initialDateString.length-5, 5).join("");
    const isSameYear = initialDateStringJustYear === new Date().getFullYear().toString();
    
  return (
    <View style={[styles.container, fullWidget ? {flex: 1, width: "100%"} : {width: 200}]} >

        {/* Pressable covesr the entire screen for small widget */}
        <View>

        </View>

        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <View>
                <Text  style={styles.title}>{props.title}</Text>
                <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                    <Text style={styles.amount}>{lastItem}</Text>
                    <Text style={styles.unit}>{props.unit}</Text>
                </View>
            </View>

            {fullWidget === true && (<View>
                <Text  style={styles.title}>{props.subtitle}</Text>
                <View style={{flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-end"}}>
                    <Text style={[{fontSize: 16, color: isPositive ? "#86BE79" : "#FF8686", fontWeight: "700"}]}>{isPositive ? "+":""}{percentDifference}%</Text>
                </View>
            </View>)}
            


        </View>

        <Spacer height={30} />

        <View style={{ paddingRight: backGridRightOffset, marginLeft: fullWidget ? 10 : 5, marginBottom: fullWidget ? 50 : 20, width: "100%", zIndex: 1}} onLayout={(e) => setGraphHeight(e.nativeEvent.layout.height) }>
            {/* SVG graph */}
            <LineGraph data={data} color={props.color} aspectRatio={fullWidget ? 1/2 : 1/4} />

            {/* Back grid Three data horizontal line */}
            <View style={{ paddingVertical: backGridTopOffset, paddingRight: backGridRightOffset, zIndex: -1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "space-between", alignItems: "center"}}>

                {/* Most recent marker */}
                {(<View style={{width: "100%", height: 3, backgroundColor: "#585858", borderRadius: 99999,position: "absolute", bottom: endBottomOffset, left: 0, transform: [{translateY: -2*backGridTopOffset}], opacity: showMiddle ? 1 : 0}} >
                    <View style={{position: "absolute", height: 50, top: -25, left: "101%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: "#848484", fontSize: 12}}>{ data[data.length -1] }</Text>
                    </View>
                </View>)}
                {/* General markers with top and bottom */}
                {(<View style={{width: "100%", height: 1, backgroundColor: "#585858", borderRadius: 99999, position: "relative", top: 0, left: 0, transform: [{translateY: -2*backGridTopOffset}], opacity: showMax ? 1 : 0}} >
                    
                    <View style={{position: "absolute", height: 50, top: -25, left: "101%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: "#848484", fontSize: 12}}>{max}</Text>
                    </View>
                </View>)}

                {(<View style={{width: "100%", height: 1, backgroundColor: "#585858", borderRadius: 99999, position: "relative", top: 0, left: 0, transform: [{translateY: -2*backGridTopOffset}], opacity: showMax ? 1 : 0}} >

                </View>)}

                {(<View style={{width: "100%", height: 1, backgroundColor: "#585858", borderRadius: 99999, position: "relative", top: 0, left: 0, transform: [{translateY: -2*backGridTopOffset}], opacity: showMax ? 1 : 0}} >

                </View>)}

                {(<View style={{width: "100%", height: 1, backgroundColor: "#585858", borderRadius: 99999, position: "relative", top: 0, left: 0, transform: [{translateY: -2*backGridTopOffset}], opacity: showMax ? 1 : 0}} >
                    

                </View>)}


                {(<View style={{width: "100%", height: 1, backgroundColor: "#585858", borderRadius: 99999, position: "relative", bottom: 0, left: 0, transform: [{translateY: -2*backGridTopOffset}], opacity: showMin ? 1 : 0}} >
                    <View style={{position: "absolute", height: 50, top: -25, left: "101%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: "#848484", fontSize: 12}}>{ min }</Text>
                    </View>
                </View>)}
            </View>

            {/* Dates, beginning and end */}
            {fullWidget === true && (<View style={{ paddingVertical: backGridTopOffset, marginRight: backGridRightOffset, zIndex: -1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>

                {(<View style={{width: 1, height: 7, backgroundColor: "#585858", borderRadius: 99999, position: "absolute", top: "99%", left: 0,  }} >
                    
                    <View style={{position: "absolute", height: 25, width: 100,  top: "100%", left: -10, display: "flex", justifyContent: "center"}}>
                        <Text style={{textAlign: "left", color: "#848484", fontSize: 12}}>{new Date(dates[0]).toLocaleDateString()}</Text>
                    </View>
                </View>)}

                {(<View style={{width: 1, height: 7, backgroundColor: "#585858", borderRadius: 99999, position: "absolute", top: "99%", right: 0,}} >
                    <View style={{position: "absolute", height: 25, width: 100,  top: "100%", right: -10,  display: "flex", justifyContent: "center" }}>
                        <Text style={{textAlign: "right", color: "#848484", fontSize: 12}}>{"Now"}</Text>
                    </View>
                </View>)}

            </View>)}
            
        </View>

        {/* Action tab and buttons */}
        { fullWidget === true && (<View style={{flex: 1, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", zIndex: 2}}>
            <SectionSelect
            fontSize={16}
            backgroundColor={'#5D5D5D'}
            sliderColor={"#3A3A3A"}
            barWidth={"100%"}
            height={50}
            section={section}
            setSection={setSection}
            sections={sectionOptions}
            />
        </View>)}

        


        {/* Preview footer */}
        { fullWidget === false && (<View>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={[styles.bottomText, {color: isPositive ? "#86BE79" : "#FF8686", fontWeight: "700"}]}>{isPositive ? "+":""}{percentDifference}%</Text>
                <Text style={styles.bottomText}>since {isSameYear ? initialDateStringNoYear : initialDateString}</Text>
                <Image style={styles.arrowImage} source={RightArrow} />
            </View>
        </View>)}
        

    </View>
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