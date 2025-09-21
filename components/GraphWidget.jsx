import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import LineGraph from './LineGraph'
import Spacer from './Spacer'
import { Colors } from '../constants/Colors'
import RightArrow from '../assets/icons/rightArrow.png'
import SectionSelect from './SectionSelect'
import { useUserStore } from '../stores/useUserStore'

const lbsToKgs = (lbs) => {
    return 0.453592*lbs;
}
const dayProgress = () => {
    const now = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // midnight today
    const elapsed = now.getTime() - startOfDay.getTime();
    const total = 24 * 60 * 60 * 1000; // total ms in a day
    return elapsed / total;
}

const getWeightAtDate = (weights, targetDate) => {

    const targetTimeDate = new Date(targetDate);
    targetTimeDate.setHours(17,0,0,0); // Checks up to before 5pm if the weight was logged
    const targetTime = targetTimeDate.getTime();

    // Filter all weights that happened **before or at the target date**
    const pastWeights = weights.filter(w => new Date(w.date).getTime() <= targetTime);

    if (pastWeights.length === 0) return null; // no weight before this date

    // Find the latest one before the target date
    const lastWeight = pastWeights.reduce((latest, w) => {
        return new Date(w.date) > new Date(latest.date) ? w : latest;
    });

    return lastWeight.amount;
}

function yearsBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    let years = d2.getFullYear() - d1.getFullYear();
    // Adjust if the second date hasn't reached the month/day of the first date yet
    if ( d2.getMonth() < d1.getMonth() || (d2.getMonth() === d1.getMonth() && d2.getDate() < d1.getDate())) {
        years--;
    }
    return years;
}

const GraphWidget = ({fullWidget = false, fillWidth=false, data=[], dates = [], zeroMissingData = false, showWarning = false, showDecimals=2, onPress = () => {}, ...props}) => {
    const user = useUserStore((state) => state.user); // Used for expenditure offset adding

    const oriData = JSON.parse(JSON.stringify(data));
    const oriDates = JSON.parse(JSON.stringify(dates));

    const sectionOptions = ["Daily", "Weekly", "Monthly"]; // Daily shows 7 days, weeklyshows 4 weeks (28 days), monthly shows 6 months (180 days);
    const [section, setSection] = useState(sectionOptions[0]);

    // Make data in form of daily points
    const sixMonthsAgo = new Date();
    const dayOffset = section===sectionOptions[0] ? 7 : section===sectionOptions[1] ? 28 : 180
    sixMonthsAgo.setDate(sixMonthsAgo.getDate() - dayOffset);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyDataPoints = [];
    const dailyDatePoints = [];
    
    // Create 6 months of 0's if zeroMissingData == true
    if (zeroMissingData) {
        for (let day = new Date(sixMonthsAgo); day.getTime() <= today.getTime(); day.setDate(day.getDate() + 1)) {
            let expenditureOffset = 0; // For the day, calculate resting amount
            const userWeightWidget = user.tracking.logging["weight"];
            if (((userWeightWidget.data.length > 0) && user.settings.height !== null && user.settings.gender !==null && user.settings.birthday !== null) === true) { // Same logic in progress index
                //const userWeight = userWeightWidget.data[userWeightWidget.data.length-1].amount;
                const userWeight = getWeightAtDate(userWeightWidget.data, day);
                const weightKgs = userWeight ? userWeightWidget.unit === "lbs" ? lbsToKgs(userWeight) : userWeight : null;
                const age = yearsBetween(user.settings.birthday, today);
                const fracOfToday = day.getTime() !== today.getTime() ? 1 : dayProgress();
                if (userWeight) {
                    if (user.settings.gender === "male") {
                        expenditureOffset = (10*weightKgs) + (6.25*user.settings.height) - (5*age) + 5;
                    } else if (user.settings.gender === "female") {
                        expenditureOffset = (10*weightKgs) + (6.25*user.settings.height) - (5*age) - 161;
                    } else {
                        expenditureOffset = (10*weightKgs) + (6.25*user.settings.height) - (5*age) - 100;
                    }
                    expenditureOffset *= fracOfToday;
                } 
            }
            dailyDataPoints.push(0+(expenditureOffset));
            dailyDatePoints.push(day.getTime());
        }
        // Loop through oriData and fit into dailyData
        const dailyDate = new Date(sixMonthsAgo);
        let loopInd = 0; // index of dailyData
        for (let i = 0; i<oriData.length; i++) {
            const dataDate = new Date(oriDates[i]);
            dataDate.setHours(0,0,0,0);
            // Catch up the dailys
            if (dataDate.getTime() > dailyDate.getTime()) {
                while (dataDate.getTime() > dailyDate.getTime()) {
                    dailyDate.setDate(dailyDate.getDate() + 1);
                    loopInd++;
                }
                
            }
            if (dataDate.getTime() === dailyDate.getTime()) {
                dailyDataPoints[loopInd] = dailyDataPoints[loopInd] + oriData[i];
                dailyDatePoints[loopInd] = oriDates[i];
                loopInd++;
                dailyDate.setDate(dailyDate.getDate()+1);
            } else {
                continue; // Data is from before sixMonthsAgo
            }
        }
        data = dailyDataPoints;
        dates = dailyDatePoints;
    } else {
        if (data.length < 2) {
            data = [oriData[0] || 0, oriData[0] || 0];
            dates = [oriDates[0] || today.getTime(), oriDates[0] || today.getTime()];
        }
        data = data.filter((d, ind) => new Date(dates[ind]).getTime() >= sixMonthsAgo.getTime());
        // else {
        //     if (section === sectionOptions[0]) {
        //         // Past 5
        //         if (data.length > 5) {
        //             data = oriData.splice(oriData.length - 5, 5);
        //             dates = oriDates.splice(oriDates.length - 5, 5);
        //         }
                
        //     } else if (section === sectionOptions[1]) {
        //         // Past 10
        //         if (data.length > 10) {
        //             data = oriData.splice(oriData.length - 10, 10);
        //             dates = oriDates.splice(oriDates.length - 10, 10);
        //         }
        //     } else {
        //         // Monthly - Past 180 days
        //         data = oriData;
        //         dates = oriDates;
        //     }
        // }
        
    }
    

    


    


    let showYearRecent = {};
    const showYear = today.getFullYear() !== new Date(dates[dates.length - 1]).getFullYear();
    if (showYear) {
        showYearRecent.year = "numeric";
    }

    
    
    const firstItem = data[0] || 0;
    const lastItem = data[data.length - 1] || 0;

    const percentDifferenceTemp =  100*((lastItem-firstItem)/firstItem);
    let percentDifference = Math.round(percentDifferenceTemp * 10) / 10; // round to 1 decimal place
    if (isNaN(percentDifference)) percentDifference = 0;
    if (!isFinite(percentDifference)) percentDifference = 100;
    const isPositive = percentDifference > 0 ? true : false;

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
   
    const initialDateString = new Date(dates[0]).toLocaleDateString();
    const initialDateStringNoYear = initialDateString.split("").splice(0, initialDateString.length-5).join("");
    const initialDateStringJustYear = initialDateString.split("").splice(initialDateString.length-4, 4).join("");
    const isSameYear = initialDateStringJustYear === new Date().getFullYear().toString();

    const parseDecimals = (value, fixedTo = 0) => {
        return parseFloat(parseFloat(value).toFixed(fixedTo));
    }
    
  return (
    <View style={[styles.container, (fullWidget || fillWidth) ? {flex: 1, width: "100%"} : {width: 200}, props.style]} >
        {fullWidget === false && (<Pressable style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10}} onPress={onPress} />)} 

        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <View>
                <View style={{flexDirection: "row", alignItems: "center", marginBottom: 5}}>
                    {showWarning && (<View style={{height: 22, width: 22, backgroundColor: "#B13939", borderRadius: 99999, justifyContent: "center", alignItems: "center", marginRight: 5}}>
                        <Text style={{color: "white", fontWeight: "800", fontSize: 17}}>!</Text>
                    </View>)} 
                    <Text  style={[styles.title, ]}>{props.title}</Text>
                    
                </View>
                
                <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                    <Text style={styles.amount}>{noData ? "No data" : parseDecimals(lastItem, showDecimals)}</Text>
                    <Text style={styles.unit}>{noData ? "" : props.unit}</Text>
                </View>
            </View>

            {(fullWidget === true) && (<View>
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
                        <Text style={{color: "#848484", fontSize: 12}}>{parseDecimals(data[data.length -1], 0)  }</Text>
                    </View>
                </View>)}
                {/* General markers with top and bottom */}
                {(<View style={{width: "100%", height: 1, backgroundColor: "#585858", borderRadius: 99999, position: "relative", top: 0, left: 0, transform: [{translateY: -2*backGridTopOffset}], opacity: showMax ? 1 : 0}} >
                    
                    <View style={{position: "absolute", height: 50, top: -25, left: "101%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: "#848484", fontSize: 12}}>{parseDecimals(max, showDecimals)}</Text>
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
                        <Text style={{color: "#848484", fontSize: 12}}>{ parseDecimals(min, showDecimals) }</Text>
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
            />
        </View>)}

        


        {/* Preview footer */}
        { fullWidget === false && (<View>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={[styles.bottomText, {color: isPositive ? "#86BE79" : "#FF8686", fontWeight: "700"}]}>{isPositive ? "+":""}{percentDifference}%</Text>
                {noData ? null : <Text style={styles.bottomText}>since {isSameYear ? initialDateStringNoYear : initialDateString}</Text>}
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