import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import LineGraph from '../LineGraph'
import Spacer from '../Spacer'
import { Colors } from '../../constants/Colors'
import RightArrow from '../../assets/icons/rightArrow.png'
import SectionSelect from '.././SectionSelect'
import sinceWhen from '../../util/sinceWhen'
import fillDailyData from '../../util/fillDailyData'
// import fillDailyData from '../util/fillDailyData'

const EnergyBalanceGraph = ({fullWidget = false, fillWidth=false, fillDaily=null, data=[], dates = [], calorieData=[], calorieDates=[], showWarning = false, initialSectionIndex=0, showDecimals=0, onPress = () => {}, disablePress=false, animationDuration=0, hideFooter=false, premiumIndexs=[1, 2], ...props}) => {

    const oriData = JSON.parse(JSON.stringify(data));
    const oriDates = JSON.parse(JSON.stringify(dates));
    const oriCalorieData = JSON.parse(JSON.stringify(calorieData));
    const oriCalorieDates = JSON.parse(JSON.stringify(calorieDates));


    const sectionOptions = ["Daily", "Weekly", "Monthly"]; // Daily shows 7 days, weeklyshows 4 weeks (28 days), monthly shows 6 months (180 days);
    const [section, setSection] = useState(sectionOptions[initialSectionIndex]);

    // Make data in form of daily points
    const sixMonthsAgo = new Date();
    const dayOffset = section===sectionOptions[0] ? 7 : section===sectionOptions[1] ? 28 : 180
    const verticalGraphDivisionsCount = section===sectionOptions[0] ? 7+1 : section===sectionOptions[1] ? 4+1 : 6+1; // 7 (days), 4 (weeks), 6 (months); plus 1 for space-between justified
    const strokeWidth = section===sectionOptions[0] ? 3 : section===sectionOptions[1] ? 3 : 3;
    sixMonthsAgo.setDate(sixMonthsAgo.getDate() - dayOffset);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

   
    

     // Use fillMissingDataPerDay here so that the graph fills in the last info or zero data to section out the data
    data = oriData.filter((d, ind) => new Date(oriDates[ind]).getTime() >= sixMonthsAgo.getTime());
    dates = oriDates.filter((d, ind) => new Date(oriDates[ind]).getTime() >= sixMonthsAgo.getTime());
    calorieData = oriCalorieData.filter((d, ind) => new Date(oriCalorieDates[ind]).getTime() >= sixMonthsAgo.getTime());
    


    let showYearRecent = {};
    const showYear = today.getFullYear() !== new Date(dates[dates.length - 1]).getFullYear();
    if (showYear) {
        showYearRecent.year = "numeric";
    }

    
    
    const firstItem = data[0] || 0;
    const lastItem = data[data.length - 1] || 0;

    const mostRecentCalorie = parseInt(calorieData[calorieData.length -1] || 0);
    const mostRecentExpenditure = parseInt(lastItem);
    const energyDifference = mostRecentCalorie - mostRecentExpenditure;

    const percentDifferenceTemp =  100*((lastItem-firstItem)/firstItem);
    let percentDifference = Math.round(percentDifferenceTemp * 10) / 10; // round to 1 decimal place
    if (isNaN(percentDifference)) percentDifference = 0;
    if (!isFinite(percentDifference)) percentDifference = 100;
    const isPositive = percentDifference > 0 ? true : false;
    const showPercentDifference = fillDaily !== "zero";

    const [graphHeight, setGraphHeight] = React.useState(0);

    const backGridTopOffset = 0;
    const backGridRightOffset = 40;

    const noData = data.length === 0;

    const max = !noData ? Math.max(...data) : 0;
    const min = !noData ? Math.min(...data) : 0;

    let showMax = true;
    let showMin = true;
    let showMiddle = true;

    let endBottomPerfentOffset = ((data[data.length - 1]-min)/(max-min));
    if (isNaN(endBottomPerfentOffset)) endBottomPerfentOffset = 0.5;
     const endBottomOffset = endBottomPerfentOffset * graphHeight; // For middle number
    if (endBottomPerfentOffset < fullWidget ? 0.1 : 0.2 || endBottomPerfentOffset > fullWidget ? 0.9 : 0.8) {
        showMiddle = false;
    }
    if (max === min) {
        showMax = false;
        showMin = false,
        showMiddle = true;
    }


    const parseDecimals = (value, fixedTo = 0) => {
        return parseFloat(parseFloat(value).toFixed(fixedTo));
    }

    const maxDataValue = Math.max(...calorieData, ...data);
    
  return (
    <View style={[styles.container, (fullWidget || fillWidth) ? {flex: 1, width: "100%", height: Platform.OS === "ios" ? 205 : 210,} : {width: 200, height: 170,}, fullWidget && {height: 350}, props.style]} >
        {fullWidget === false && disablePress === false && (<Pressable style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10}} onPress={onPress} />)} 

        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between",}}>
            <View>
                <View style={{flexDirection: "row", alignItems: "center", marginBottom: 5}}>
                    {showWarning && (<View style={{height: 22, width: 22, backgroundColor: "#B13939", borderRadius: 99999, justifyContent: "center", alignItems: "center", marginRight: 5}}>
                        <Text style={{color: "white", fontWeight: "800", fontSize: 17}}>!</Text>
                    </View>)} 
                    <Text  style={[styles.title, props.titleStyles]}>{props.title}</Text>
                    
                </View>
                
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{fontSize: 17, color: Colors.primaryBlue}}>{mostRecentCalorie}</Text>
                    <Text style={{fontSize: 12, color: "#939393", marginHorizontal: 7}}>-</Text>
                    <Text style={{fontSize: 17, color: Colors.primaryOrange}}>{mostRecentExpenditure}</Text>
                    <Text style={{fontSize: 12, color: "#939393", marginHorizontal: 7}}>=</Text>
                    <Text style={{fontSize: 17, color: "white", fontWeight: "800"}}>{energyDifference}</Text>
                </View>
            </View>

           <View style={{flexDirection: "column"}}>
                    <View style={{flexDirection: "row", alignItems: "center", marginBottom: 3}}>
                        <View style={{height: 6, width: 6, backgroundColor: Colors.primaryBlue, marginRight: 5, borderRadius: 999}} />
                        <Text style={{fontSize: 12, color: "#939393", fontWeight: "400"}}>Calories</Text>
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <View style={{height: 6, width: 6, backgroundColor: Colors.primaryOrange, marginRight: 5, borderRadius: 999}} />
                        <Text style={{fontSize: 12, color: "#939393", fontWeight: "400"}}>Expenditure</Text>
                    </View>
            </View>
            


        </View>

        <Spacer height={30} />

        <View style={{ paddingRight: backGridRightOffset, marginLeft: fullWidget ? 10 : 5, marginBottom: fullWidget ? 50 : 20, width: "100%", zIndex: 1}} onLayout={(e) => setGraphHeight(e.nativeEvent.layout.height) }>
            {/* SVG graph */}
            <LineGraph style={{zIndex: 1}} data={data} color={props.color} duration={animationDuration} otherMaxValue={maxDataValue} otherMinValue={0} aspectRatio={fullWidget ? 1/2 : 1/4} strokeWidth={ strokeWidth} dashed={true} />

            {/* Back grid Three data horizontal line */}
            <View style={{ paddingVertical: backGridTopOffset, paddingRight: backGridRightOffset, zIndex: -1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "space-between", alignItems: "center"}}>

                {/* Most recent marker */}
                {(<View style={{width: "100%", height: 3, backgroundColor: "#585858", borderRadius: 99999,position: "absolute", bottom: endBottomOffset, left: 0, transform: [{translateY: -2*backGridTopOffset}], opacity: showMiddle ? 1 : 0}} >
                    <View style={{position: "absolute", height: 50, top: -25, left: "101%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: "#848484", fontSize: 12}}>{parseDecimals(data[data.length -1], 0)  }</Text>
                    </View>
                </View>)}
                {/* General markers with top and bottom */}
                {(<View style={{width: "100%", height: 1, backgroundColor: "#585858", borderRadius: 99999, position: "relative", top: 0, left: 0, transform: [{translateY: -2*backGridTopOffset}], opacity: showMax ? 1 : 0}} >
                    
                    <View style={{position: "absolute", height: 50, top: -25, left: "101%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: "#848484", fontSize: 12}}>{parseDecimals(maxDataValue, showDecimals)}</Text>
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
                        <Text style={{color: "#848484", fontSize: 12}}>{ parseDecimals(0, showDecimals) }</Text>
                    </View>
                </View>)}
            </View>

            {/* Back grid verticalGraphDivisionsCount vertical lines */}
            {/* <View style={{ paddingVertical: backGridTopOffset, paddingRight: backGridRightOffset, zIndex: -1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                {new Array(verticalGraphDivisionsCount).fill(null).map((v, i) => {
                    return (
                        <View key={i} style={{height: "100%", width: 1, backgroundColor: "#585858", borderRadius: 99999, position: "relative", top: 0, left: 0, transform: [{translateY: -2*backGridTopOffset}, {scaleY: 1.3}], opacity: (i === verticalGraphDivisionsCount-1 || i === 0) ? 0 : 1}} >
                    
                        </View>
                    )
                })}
            </View> */}

            {/* Calorie bars */}
            <View style={{ paddingVertical: backGridTopOffset, paddingRight: backGridRightOffset, zIndex: -1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end"}}>
                {calorieData.map((v, i) => {
                    const height = (calorieData[i]/maxDataValue) * graphHeight;
                    const space = [5, 2, 0];
                    return (
                        <View key={i} style={{height, marginHorizontal: space[sectionOptions.indexOf(section)], flex: 1, backgroundColor: Colors.primaryBlue, borderRadius: 99999, position: "relative", top: 0, left: 0, transform: [{translateY: -2*backGridTopOffset}],}} >
                    
                        </View>
                    )
                })}
            </View>


            {/* Dates, beginning and end - energy balance force true */}
            {(true || fullWidget === true ) && (<View style={{ paddingVertical: backGridTopOffset, marginRight: backGridRightOffset, zIndex: -1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>

                {(<View style={{width: 1, height: 7, backgroundColor: "#585858", borderRadius: 99999, position: "absolute", top: "99%", left: 0,  }} >
                    
                    <View style={{position: "absolute", height: 25, width: 100,  top: "100%", left: -10, display: "flex", justifyContent: "center"}}>
                        <Text style={{textAlign: "left", color: "#848484", fontSize: 12}}>{new Date(dates[0]).toLocaleDateString()}</Text>
                    </View>
                </View>)}

                {(<View style={{width: 1, height: 7, backgroundColor: "#585858", borderRadius: 99999, position: "absolute", top: "99%", right: 0,}} >
                    <View style={{position: "absolute", height: 25, width: 100,  top: "100%", right: -10,  display: "flex", justifyContent: "center" }}>
                        <Text style={{textAlign: "right", color: "#848484", fontSize: 12}}>{  new Date(dates[dates.length -1]).toLocaleDateString('en-US', {month: 'numeric', day: 'numeric', ...showYearRecent})}</Text>
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
            premiumIndexs={premiumIndexs}
            />
        </View>)}

        


        {/* Preview footer */}
        { fullWidget === false && hideFooter === false && (<View>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                {showPercentDifference && (<Text style={[styles.bottomText, {color: isPositive ? "#86BE79" : "#FF8686", fontWeight: "700"}]}>{isPositive ? "+":""}{percentDifference}%</Text>)}
                {noData ? null : <Text style={styles.bottomText}>since {sinceWhen(dates[0])}</Text>}
                <Image style={styles.arrowImage} source={RightArrow} />
            </View>
        </View>)}
        

    </View>
  )
}

export default EnergyBalanceGraph;

const styles = StyleSheet.create({
    container: {
        
        padding: 10,
        marginRight: 20,
        backgroundColor: "#3A3A3A",
        borderRadius: 10,
        
    },
    title: {
        fontSize: 16,
        color: Colors.dark.text,
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
        marginBottom: 2,
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