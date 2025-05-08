import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import dropdown from '../assets/icons/dropdown.png'
import { Image } from 'react-native';
import { Portal } from 'react-native-paper';

const Dropdown = ({data, height = 50,maxHeight = 225, style, selectedId, setSelectedId,  ...props}) => {
    const [active, setActive] = useState(false);

    const selected = data.find(d => d.id === selectedId);
    const notSelected = data.filter(d => d.id !== selectedId);

    let scrollViewHeight = (data.length-1)*height;
    if (scrollViewHeight > maxHeight) scrollViewHeight = maxHeight;
  return (
    <View style={[styles.mainCont, {height: active ? height*data.length : height, overflow: "visible", zIndex: active ? 10 : 0}, style]} >
        <Pressable key={selected.id} style={[styles.item, {height: height, fontSize: 18, backgroundColor: "#3D3D3D", borderTopWidth: 0, borderRadius: 10}]} onPress={() => setActive(!active)}>
            <Text style={[styles.itemText, {fontWeight: 700}]}>{selected.title}</Text>
        </Pressable>

        {active && (
        <View style={{maxHeight: maxHeight, position: "absolute", top: height, left: 0, width: '100%', elevation: 100, zIndex: 100}}>
            <ScrollView style={{height: scrollViewHeight, backgroundColor: "#595959", borderBottomRightRadius: 10, borderBottomLeftRadius: 10}} >
                {notSelected.map((item, i) => {
                return (<Pressable key={item.id} style={[styles.item, {height: height, fontSize: 18,},]} onPress={() => {setActive(!active); setSelectedId(item.id)}}>
                        <Text style={[styles.itemText]}>{item.title}</Text>
                    </Pressable>
                    )})}
            </ScrollView>
        </View>
        )}
        

        <Image style={{position: 'absolute', height: 20, width: 20, objectFit: "contain", right: 10, top: 15}} source={dropdown} />
        
    </View>
  )
}

export default Dropdown

const styles = StyleSheet.create({
    mainCont: {
        backgroundColor: "#595959",
        borderRadius: 10,
    },
    item: {
        justifyContent: "center",
        alignItems: "flex-start",
        borderTopWidth: 1,
        borderTopColor: "grey",
        backgroundColor: "#595959",
    },
    itemText: {
        color: "white",
        fontSize: 18,
        paddingLeft: 10
    }
})