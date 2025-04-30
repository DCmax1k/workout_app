import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import {Colors} from '../constants/Colors'

const ThemedText = ({ style, title = false, ...props  }) => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.dark

    const textStyle = title ? theme.title : theme.text
  return (
    <Text
        style={[{color: props.color || textStyle}, style]}
        {...props}
    />
  )
}

export default ThemedText

const styles = StyleSheet.create({})