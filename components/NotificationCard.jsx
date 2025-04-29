import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const NotificationCard = ({style, ...props}) => {
  return (
    <View style={[styles.card, style]} {...props}>
      <Text style={styles.header}>{props.header}</Text>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.subtitle}>{props.subtitle}</Text>
    </View>
  )
}

export default NotificationCard

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#2D2D2D",
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
    },
    header: {
        fontSize: 10,
        color: "#828282",
        fontWeight: 700,
        marginBottom: 4,
    },
    title: {
        fontSize: 15,
        color: "#fff",
        fontWeight: 700,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        color: "#DB8854",
        fontWeight: 400,
    }
})