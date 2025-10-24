import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Search from './Search'
import ActionMenu from './ActionMenu'
import filterIcon from '../assets/icons/filter.png'
import greyX from '../assets/icons/greyX.png'
import Animated, { FadeIn, FadeInUp, FadeOut, FadeOutDown, FadeOutUp, LinearTransition } from 'react-native-reanimated'

const Option = ({style, label, onPress, iconScale=1, backgroundColor="#3D3D3D", icon=null}) => {
    return (
        <Pressable onPress={onPress} style={[{padding: 5, paddingHorizontal: 10, borderRadius: 9999, flexDirection: 'row', alignItems: 'center', backgroundColor, gap: 5}, style]}>
            {icon && <View style={{width: 15, height: 15, marginRight: 5, justifyContent: "center", alignItems: "center"}}>
                <Image source={icon} style={{width: "100%", height: "100%", objectFit: 'contain', tintColor: "white", transform: [{scale: iconScale}]}} />
            </View>}
            <Text style={{color: "white", fontWeight: "400", fontSize: 14}}>{label}</Text>
        </Pressable>
    )
}

const FilterAndSearch = ({style, value, onChangeText, selected, setSelected, options = ["Chest", "Abs", "Back", "Biceps", "Triceps", "Forearms", "Shoulders", "Legs",], padding=10, ...props}) => {


    const actionMenuData = options.filter(o => !selected.includes(o)).map((o) => {
        return {
            title: o,
            icon: null,
            onPress: () => {
                if (selected.includes(o)) {
                    let newSelected = selected.filter((item) => item !== o);
                    setSelected(newSelected);
                } else {
                    setSelected([...selected, o]);
                }
            }
        }
    })

  return (
    <View style={[{flexDirection: "column"}, style]} {...props}>
        <View style={[{ flexDirection: "row", alignItems: "center", paddingHorizontal: padding,}]} >
            <Search value={value} onChangeText={onChangeText} style={{flex: 1, marginRight: 10 }} />
            <ActionMenu icon={filterIcon} data={actionMenuData} />
        </View>

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{marginTop: 5}} contentContainerStyle={{paddingHorizontal: padding, flexDirection: 'row', justifyContent: "flex-start", minWidth: "100%", alignItems: 'center', gap: 10}}>
                {selected.map((option, index) => (
                    <Animated.View entering={FadeIn} exiting={FadeOut} key={option} >
                        <Option key={option} label={option} icon={greyX} iconScale={1.3} backgroundColor={"#303A66"} onPress={() => {
                            let newSelected = selected.filter((item) => item !== option);
                            setSelected(newSelected);
                        }} />
                    </Animated.View>
                    
                ))}
            </ScrollView>
        
    </View>
    
  )
}

export default FilterAndSearch

const styles = StyleSheet.create({})