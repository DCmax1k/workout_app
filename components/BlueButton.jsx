import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'
import rightCarrot from '../assets/icons/rightCarrot.png'

const BlueButton = ({style, title, showRight = false, ...props}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: props.color || Colors.primaryBlue, flexDirection: 'row', justifyContent: showRight ? 'space-between' : 'center' }, style]}
      {...props}
    >
      <View style={{alignItems: showRight ? 'flex-start' : 'center'}}>
        <Text style={styles.buttonText}>{title}</Text>
        {props.subtitle && (
          <Text style={[styles.buttonText, { fontSize: 12, fontWeight: 400, color: "#D0D0D0" }]}>{props.subtitle}</Text>
        )}
      </View>
      
      {showRight && (<Image style={{height: 20, width: 20}} source={rightCarrot} />)}
    </TouchableOpacity>
  )
}

export default BlueButton

const styles = StyleSheet.create({
    button: {
        padding: 10,
        paddingHorizontal: 20,
        color: "#fff",
        borderRadius: 10,
        alignItems: 'center',
    }, 
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 700,
        textAlign: "center",
    }
})