import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors';

const MacrosRow = ({style, nutrition, multiplier=1, showDecimal=true, ...props}) => {

  return (
    <View {...props} style={[{flexDirection: "row", gap: 5}, style]}>
        {new Array(4).fill(null).map((_, i) => {
            const nutritionKey = ["calories", "protein", "carbs", "fat"][i];
            const backgroundColor = [Colors.calories, Colors.protein, "#1BB14C", Colors.fat][i];
            const abr = ["Cal", "P", "C", "F"][i];
            const pAmount = nutrition[nutritionKey]*multiplier;
            const nAmount = showDecimal ? parseInt(nutrition[nutritionKey]*multiplier*10)/10 : parseInt(pAmount);

            return (
                <View key={i} style={{backgroundColor, flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 5, paddingVertical: 3, borderRadius: 9999, marginTop: 3}}>
                    <Text style={{color: "white", fontSize: 12, fontWeight: "800"}}>{nAmount}</Text>
                    <Text style={{color: "#ffffffb9", fontSize: 9, fontWeight: "600", marginBottom: 1, marginLeft: 1}}>{abr}</Text>
                </View>
            )
        })}
    </View>
  )
}

export default MacrosRow

const styles = StyleSheet.create({})