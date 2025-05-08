import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import dropdown from '../assets/icons/dropdown.png'
import { Image } from 'react-native';
import whiteX from '../assets/icons/whiteX.png'
import { Portal } from 'react-native-paper';

const MultiSelectDropdown = ({data, height = 50, maxHeight = 175, style, selectedIds, setSelectedIds,  ...props}) => {
    const [active, setActive] = useState(false);

    const selected = data.filter(d => selectedIds.includes(d.id));
    const notSelected = data.filter(d => !selectedIds.includes(d.id));

    let scrollViewHeight = (notSelected.length-1)*height;
    if (scrollViewHeight > maxHeight) scrollViewHeight = maxHeight;

    const addItem = (id) => {
        const newSelected = [...selectedIds, id];
        setActive(false);
        setSelectedIds(newSelected);
    }
    const removeItem = (id) => {
        const newSelected = selectedIds.filter(it => it !== id);
        setActive(false);
        setSelectedIds(newSelected);
    }

  return (
    <View>
        {/* Dropdown */}
        <View style={[styles.mainCont, {height: active ? height*data.length > (maxHeight+height) ? (maxHeight+height) : height*data.length : height, overflow: "visible", zIndex: active ? 10 : 0}, style]} >
            <Pressable key={selected.id} style={[styles.item, {height: height, fontSize: 18, backgroundColor: "#3D3D3D", borderTopWidth: 0, borderRadius: 10}]} onPress={() => setActive(!active)}>
                <Text style={[styles.itemText]}>Pick from selection</Text>
            </Pressable>

            {active && (
                <View style={{maxHeight: maxHeight, position: "absolute", top: height, left: 0, width: "100%", elevation: 100, zIndex: 100}}>
                    <ScrollView style={{height: scrollViewHeight, backgroundColor: "#595959", borderBottomRightRadius: 10, borderBottomLeftRadius: 10}} >
                    {notSelected.map((item, i) => {
                        return (<Pressable key={item.id} style={[styles.item, {height: height, fontSize: 18,},]} onPress={() => {addItem(item.id)}}>
                                <Text style={[styles.itemText]}>{item.title}</Text>
                            </Pressable>
                        )})}
                    </ScrollView>
                </View>
            )}
            
            

            <Image style={{position: 'absolute', height: 20, width: 20, objectFit: "contain", right: 10, top: 15}} source={dropdown} />
            
        </View>
                
        {/* Items */}
        <View style={{flexDirection: "row", flexWrap: 'wrap', }}>
            {selected.map(item => {
                return (
                <Pressable onPress={() => {removeItem(item.id)}} key={item.id} style={{flexDirection: 'row', alignItems: 'center', marginRight: 5, marginBottom: 5, paddingVertical: 2, paddingHorizontal: 10, backgroundColor: "#3C3C3C", borderRadius: 9999,}}>
                    <Image style={{height: 15, width: 15, objectFit: "contain", marginLeft: -5, marginRight: 3, tintColor: "grey", }} source={whiteX} />
                    <Text style={{ fontSize: 14, color: "white"}}>{item.title}</Text>
                    
                </Pressable>
            )})}
        </View>

    </View>
    
  )
}

export default MultiSelectDropdown

const styles = StyleSheet.create({
    mainCont: {
        backgroundColor: "#595959",
        borderRadius: 10,
        marginBottom: 5,
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