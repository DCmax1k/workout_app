import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'

const BlueButton = ({style, title, ...props}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: Colors.primaryBlue || "#fff" }, style]}
      {...props}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

export default BlueButton

const styles = StyleSheet.create({
    button: {
        padding: 10,
        color: "#fff",
        borderRadius: 10,
    }, 
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 700,
        textAlign: "center",
    }
})