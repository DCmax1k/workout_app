import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Spacer = ({height = 40, bar=false, barColor= "#a8a8a8ff", barWidth=1, width= "100%"}) => {
  return (
    <View style={{width: "100%", height, justifyContent: "center", alignItems: "center"}}>
      {bar && <View style={{backgroundColor: barColor, height: barWidth, borderRadius: 9999, width}}></View>}
    </View>
  )
}

export default Spacer

const styles = StyleSheet.create({})