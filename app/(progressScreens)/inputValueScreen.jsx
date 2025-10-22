import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import ThemedView from '../../components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import TitleWithBack from '../../components/TitleWithBack';
import Spacer from '../../components/Spacer';
import HorizontalScrollInput from '../../components/HorizontalScrollInput';
import { Colors } from '../../constants/Colors';
import emitter from '../../util/eventBus';
import { truncate } from '../../util/truncate';
import clockIcon from '../../assets/icons/clock.png';
import calenderIcon from '../../assets/icons/calender.png';
import ThemedText from '../../components/ThemedText';
import PopupSheet from '../../components/PopupSheet';
import ScrollPicker from '../../components/ScrollPicker';
import formatTime from '../../util/formatTime';
import Calender from '../../components/Calender';

const screenHeight = Dimensions.get('screen').height;

const round1 = num => Math.round(num * 10) / 10;

const firstCapital = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const OptionInput = ({style, imageSource = clockIcon, text="Time", imageSize = 20, inputText = "9:55 pm", onPress = () => {}, ...props}) => {
  return (
    <View style={[style]} {...props}>
      <View style={{flexDirection: "row", alignItems: "center", paddingLeft: 5}}>
        <ThemedText title={true} style={{fontSize: 16, marginRight: 10,}}>{text}</ThemedText>
        <View style={{width: imageSize, height: imageSize,}}>
          <Image source={imageSource} style={{objectFit: "contain", height: "100%", width: "100%"}} />
        </View>
      </View>
      <Spacer height={5} />
      <View flexDirection="row">
        <Pressable onPress={onPress} style={{paddingVertical: 10, paddingHorizontal: 10, borderRadius: 10, backgroundColor: "#393939"}}>
          <Text style={{fontSize: 20, color: "#B8B8B8", letterSpacing: 2, fontWeight: "600" }}>{inputText}</Text>
        </Pressable>
      </View>
      
    </View>
  )
}

const InputValueScreen = () => {

    const params = useLocalSearchParams();
    const data = JSON.parse(params.data);

    //const [value, setValue] = useState(round1(data.value));
    const [value, setValue] = useState(parseFloat(`${round1(data.value)}`));

    // Time inputs
    const [currentPopupContent, setCurrentPopupContent] = useState("") // time, date,
    const [popupMenuActive, setPopupMenuActive] = useState(false);

    const [timeAndDate, setTimeAndDate] = useState(new Date(data.options.defaultDate) ?? new Date());

    let timeHours = timeAndDate.getHours();
    let timeMinutes = timeAndDate.getMinutes();
    let ampm = timeHours >= 12 ? "pm" : "am";
    timeHours = timeHours % 12;
    timeHours = timeHours ? timeHours : 12;
    useEffect(() => {
      timeHours = timeAndDate.getHours();
      timeMinutes = timeAndDate.getMinutes();
      ampm = timeHours >= 12 ? "pm" : "am";
      timeHours = timeHours % 12;
      timeHours = timeHours ? timeHours : 12;
    }, [timeAndDate]);

    const saveValue = () => {
        emitter.emit("done", { ...data, value, timeAndDate });
        router.back();
    }

    // Example data
    // const data = {
    //     title: "Title",
    //     value: 180,
    //     increment: 1,
    //     range: [0, 1000],
    //     unit: 'lbs',
// optional
    //    target: "string to identify it get back",
    //    options: {
    //        time: true/false,
    //        date: true/false,
    //        defaultDate: Date.now(),
    //    }
    // }

    const openChangeTime = () => {
      setCurrentPopupContent("changeTime");
      setPopupMenuActive(true);
    }
    const openChangeDate = () => {
      setCurrentPopupContent("changeDate");
      setPopupMenuActive(true);
    }
    const setTimeHours = (hours) => {
      if (ampm === "pm" && hours < 12) {
        hours += 12;
      }
      const newDate = new Date(timeAndDate);
      newDate.setHours(hours);
      setTimeAndDate(newDate);
    }
    const setTimeMinutes = (minutes) => {
      const newDate = new Date(timeAndDate);
      newDate.setMinutes(minutes);
      setTimeAndDate(newDate);
    }
    const setAm = () => {
      if (ampm === "pm") {
        const newDate = new Date(timeAndDate);
        let hours = newDate.getHours();
        hours -= 12;
        newDate.setHours(hours);
        setTimeAndDate(newDate);
      }
    }
    const setPm = () => {
      if (ampm === "am") {
        const newDate = new Date(timeAndDate);
        let hours = newDate.getHours();
        hours += 12;
        newDate.setHours(hours);
        setTimeAndDate(newDate);
      }
    }
    // const setDate = (date) => {
    //   const newDate = new Date(timeAndDate);
    //   newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    //   setTimeAndDate(newDate);
    // }

    const showTime = data?.options?.showTime || false;
    const showDate = data?.options?.showDate || false;

  return (
    <ThemedView style={{flex: 1, height: screenHeight, position: "relative"}}>
        <PopupSheet active={popupMenuActive} setActive={setPopupMenuActive}>
          {currentPopupContent === "changeTime" && (
            <View>
              <View style={{flexDirection: "row", justifyContent: "center"}}>
                <View style={{alignItems: "center"}}>
                  <ThemedText title={true} style={{fontSize: 20, fontWeight: "800"}}>Hour</ThemedText>
                  <Spacer height={10} />
                  <ScrollPicker
                    width={120}
                    range={[1, 12]}
                    increment={1}
                    padWithZero={false}
                    initialValue={timeHours}
                    onValueChange={(val) => setTimeHours(val)}
                  />
                </View>
                <View style={{alignItems: "center"}}>
                  <ThemedText title={true} style={{fontSize: 20, fontWeight: "800"}}>Minutes</ThemedText>
                  <Spacer height={10} />
                  <ScrollPicker
                    width={120}
                    range={[0, 59]}
                    increment={1}
                    padWithZero={true}
                    initialValue={timeMinutes}
                    onValueChange={(val) => setTimeMinutes(val)}
                  />
                </View>
              </View>
              <Spacer height={20} />
              {/* Pm or am options */}
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Pressable onPress={setAm} style={{flex: 1, marginRight: 5,  height: 60, backgroundColor: ampm === "am" ? "#546FDB" : "#595959", borderRadius: 15, justifyContent: 'center', alignItems: "center", position: "relative"}}>
                  <Text style={{color: "white", fontSize: 20, fontWeight: "700", }}>AM</Text>
                </Pressable>
                <Pressable onPress={setPm} style={{flex: 1, marginLeft: 5, height: 60, backgroundColor: ampm === "pm" ? "#546FDB" : "#595959", borderRadius: 15, justifyContent: 'center', alignItems: "center", position: "relative"}}>
                  <Text style={{color: "white", fontSize: 20, fontWeight: "700", }}>PM</Text>
                </Pressable>
              </View>
            </View>
            
          )}

          {currentPopupContent === "changeDate" && (
            <View>
                <Calender initialDate={new Date(timeAndDate)} set={setTimeAndDate} />

            </View>
          )}
          
        </PopupSheet>
        <SafeAreaView style={{flex: 1}}>
            <TitleWithBack title={firstCapital(truncate(data.title, 30) || "")} />
            <Spacer />
            <HorizontalScrollInput initialValue={data.value} value={value} setValue={setValue} increment={data.increment} range={data.range} unit={data.unit} scrollItemWidth={data.scrollItemWidth || 10} />

            {/* Extra options - time, date, unit */}
            <ScrollView style={{paddingHorizontal: 30, flex: 1}} contentContainerStyle={{paddingBottom: 120}}>

                {showTime && (
                  <View>
                    <OptionInput imageSource={clockIcon} imageSize={15} onPress={openChangeTime} inputText={formatTime(timeAndDate)} />
                    <Spacer height={20} />
                  </View>
                  
                )}

                {showDate && (
                  <View>
                    <OptionInput text={"Date"} imageSource={calenderIcon} imageSize={20} onPress={openChangeDate} inputText={timeAndDate.toLocaleDateString()} />
                    <Spacer height={20} />
                  </View>
                  
                )}

            </ScrollView>

            <View style={{position: "absolute", bottom: 30, left: 0, right: 0, height: 80, backgroundColor: Colors.primaryBlue,}}>
                <Pressable onPress={saveValue} style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: 18, fontWeight: '600', color: "white"}}>Save</Text>
                </Pressable>    
            </View>
        </SafeAreaView> 
    </ThemedView>
  )
}

export default InputValueScreen

const styles = StyleSheet.create({})