import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import carrotArrow from '../assets/icons/carrotArrow.png'

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const screenWidth = Dimensions.get("screen").width;
const calenderMarginHorizontal = 20;
const calenderPaddingHorizontal = 10;
const calenderContentWidth = screenWidth-(2*calenderMarginHorizontal)-(2*calenderPaddingHorizontal);

const Calender = ({initialDate=new Date(), active=true, datesWithData=[], set=()=>{}}) => {

    const [dat, setDat] = useState(initialDate);
    const [selectedDate, setSelectedDate] = useState(initialDate);

    const strCutoff = (str, length, placeholder = '') => {
        if (str.length > length) {
            return str.substring(str, length) + '...';
        } else if (str.length === 0) {
            return placeholder;
        } else {
            return str;
        }
    }

    const setSelected = (d) => {
        setSelectedDate(d);
        set(d);
    }

    const formatDate = (date) => {
        const d = new Date(date);
        const DAY = d.getDate();
        const MONTH = d.getMonth() + 1;
        const YEAR = d.getFullYear();

        return `${YEAR}_${MONTH}_${DAY}`;
    }
    const compareDates = (date1, date2) => {
        const test1 = formatDate(date1);
        const test2 = formatDate(date2);
        return test1 === test2;
    }
    const nextMonth = () => {
        const date = new Date(dat);
        const year = date.getFullYear();
        const month = date.getMonth();
        setDat(new Date(year, month + 1), 1);
    }
    const prevMonth = () => {
        const date = new Date(dat);
        const year = date.getFullYear();
        const month = date.getMonth();
        setDat(new Date(year, month - 1), 1);
    }


    const getCalenderDates = () => {
        const date = new Date(dat);
        const year = date.getFullYear();
        const month = date.getMonth();

        // Actual month dates
        const lastDate = new Date(year, month + 1, 0);
        const monthDates = [];
        for (let i = 1; i < lastDate.getDate(); i++) {
            monthDates.push(new Date(year, month, i))
        }
        monthDates.push(lastDate);

        // Previous month last few days
        const lastDateLastMonth = new Date(year, month, 0);
        const lengthPrevDates = monthDates[0].getDay();
        const prevDates = [];
        for (let j = lastDateLastMonth.getDate(); prevDates.length < lengthPrevDates; j--) {
            prevDates.unshift(new Date(year, month - 1, j));
        }

        // Next month first few days
        const lengthNextDates = 6 - lastDate.getDay();
        const nextDates = [];
        for (let k = 1; k <= lengthNextDates; k++) {
            nextDates.push(new Date(year, month + 1, k));
        }

        const allDates = [...prevDates, ...monthDates, ...nextDates];
        return allDates;


    }

    const date = new Date(dat);
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const allDates = getCalenderDates();
  return (
    <View style={[styles.calender]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          {month + " " + year}
        </Text>

        <View style={styles.backAndNext}>
          <Pressable onPress={prevMonth} style={styles.navButton}>
            <Image source={carrotArrow} style={[styles.navImg, styles.backImg]} />
          </Pressable>
          <Pressable onPress={nextMonth} style={styles.navButton}>
            <Image source={carrotArrow} style={[styles.navImg, styles.nextImg]} />
          </Pressable>
        </View>
      </View>

      {/* Dates */}
      <View style={styles.datesCont}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
          <View key={d} style={[styles.dayCont, styles.weekDay]}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>{d}</Text>
          </View>
        ))}

        {allDates.map((d, i) => {
          const isSelected = compareDates(d, selectedDate);
          const hasData = datesWithData.findIndex(k => new Date(k).toDateString() === d.toDateString()) >= 0;
          const isPartOfThisMonth = (d.getMonth() === dat.getMonth()) && (d.getFullYear() === dat.getFullYear());

          return (
            <View
              key={`date-${d.getTime()}-${i}`}
              style={[
                styles.dayCont,
                
              ]}
            >
                { isSelected === true && (<View style={styles.daySelected}></View>)}
                { hasData === true && (<View style={styles.hasData}></View>)}
              <Pressable onPress={() => {setSelected(new Date(d)); setDat(new Date(d))}} style={styles.day}>
                <Text
                  style={[
                    { color: isPartOfThisMonth ? 'white' : '#737373' },
                    isSelected && styles.daySelectedText,
                  ]}
                >
                  {d.getDate()}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default Calender

const styles = StyleSheet.create({
    
calender: {
    padding: calenderPaddingHorizontal,
    width: screenWidth - 40,
    backgroundColor: "#393939",
    borderRadius: 12,
    color: "white",
    zIndex: 3,
    fontSize: 14, 
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5, // Android shadow
  },

  header: {
    height: 40,
    width: calenderContentWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  backAndNext: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 80,
    height: 40,
  },

  navButton: {
    width: 32,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  navImg: {
    height: 12, 
    resizeMode: "contain",
  },

  backImg: {
    transform: [{ rotate: "90deg" }],
  },

  nextImg: {
    transform: [{ rotate: "270deg" }],
  },

  datesCont: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },

  dayCont: {
    width: calenderContentWidth/7,
    height: calenderContentWidth/7,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  weekDay: {
    height: 24,
    fontWeight: "bold",
  },

  day: {
    justifyContent: "center",
    alignItems: "center",
    height: "65%",
    width: "65%",
    borderRadius: 100,
  },

  daySelected: {
    backgroundColor: "white",
    borderRadius: 9999,
    height: 35, 
    width: 35,
    position: "absolute",
    top: (calenderContentWidth/7)/2 - 17.5,
    left: (calenderContentWidth/7)/2 - 17.5,
    zIndex: -1,
  },
  hasData: {
    backgroundColor: "#546FDB",
    borderRadius: 9999,
    height: 7, 
    width: 7,
    position: "absolute",
    bottom: 9,
    left: (calenderContentWidth/7)/2 - 3.5,
    zIndex: -1,
  },

  daySelectedText: {
    color: "black",
  },

  dayGrey: {
    color: "#737373",
  },
});