import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import ThemedText from './ThemedText'
import badge from '../assets/icons/premiumBadge.png'
import ImageContain from './ImageContain'
import { Colors } from '../constants/Colors'
import getAchievementBadge from '../util/getAchievementBadge'
import ProfileImg from './ProfileImg'

const screenWidth = Dimensions.get("screen").width;

const DisplayName = ({style, fontSize=25, name = "testName123", premium=false, onMeasured, usernameDecoration=null, achievement=null, maxWidth=screenWidth-120, profileImg=null, makeText=false, ...props}) => {

    const achievementIcon = achievement?.show ? getAchievementBadge(achievement.totalWorkouts)  : null; // {show: true, totalWorkouts}
    const pre = usernameDecoration ? usernameDecoration : {prefixColor: Colors.protein, prefix: ""};  

    const minPremiumBadgeScale = 0.6;

    const [measuredSize, setMeasuredSize] = useState(null);

    const handleLayout = (e) => {
      const { width, height } = e.nativeEvent.layout;
      setMeasuredSize({ width, height });
      if (onMeasured) onMeasured({ width, height });
    };

    const LayoutContent = (
      <>
        {profileImg && <ProfileImg style={{marginRight: 5}} size={fontSize*1.5} profileImg={profileImg} />}
        {achievementIcon && <ImageContain size={fontSize} source={achievementIcon} style={{marginRight: 4}} />}
        {pre.prefix && <ThemedText title={true} style={{fontSize: Math.max(fontSize*0.5, 8), fontWeight: 600, color: pre.prefixColor, marginRight: 3, }}>{pre.prefix + " "}</ThemedText>}
        <ThemedText title={true} numberOfLines={1} adjustsFontSizeToFit  style={{fontSize, fontWeight: 600, color: premium ? "#94A7F3" : "white"}}>{name}</ThemedText>

        {premium && <Text>{" "}</Text>}
        {premium && <ImageContain size={Math.max(fontSize*minPremiumBadgeScale, 10)} source={badge} style={{}} />}
      </>
    )

  return makeText ? (
    <Text style={[style, {flexDirection: "row", alignItems: "center", maxWidth: maxWidth,  }]} {...props}>

        {LayoutContent}
    </Text>
  ) : (
    <View style={[style, {flexDirection: "row", alignItems: "center", maxWidth: maxWidth,  }]} {...props}>

        {LayoutContent}
    </View>
  )
}

export default DisplayName

const styles = StyleSheet.create({})