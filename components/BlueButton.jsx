import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'
import rightCarrot from '../assets/icons/rightCarrot.png'

const BlueButton = ({style, title, showRight = false, icon, ...props }) => {
  return (
    <TouchableOpacity style={[style]} {...props}
      
    >
      <View style={[styles.button, { backgroundColor: props.color || Colors.primaryBlue, flexDirection: 'row', justifyContent: showRight ? 'space-between' : 'center' ,}]}
      >
        {/* Icon */}
        {icon && (
          <View style={{position: "absolute", top: 10, left: 10, height: 20, width: 20,  alignItems: "center", justifyContent: "center"}}>
            <Image source={icon} style={{height: 20, width: 20, objectFit: "contain"}} />
          </View>
          
        )}

        <View style={{alignItems: showRight ? 'flex-start' : 'center'}}>
          <Text style={styles.buttonText}>{title}</Text>
          {props.subtitle && (
            <Text style={[styles.buttonText, { fontSize: 12, fontWeight: 400, color: "#D0D0D0" }]}>{props.subtitle}</Text>
          )}

      </View>
      {showRight && (<Image style={{height: 20, width: 20}} source={rightCarrot} />)}
        
      </View>

        


      
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
        position: "relative",
    }, 
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 700,
        textAlign: "center",
    }
})