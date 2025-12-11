import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ActionMenu from '../ActionMenu'
import threeEllipses from '../../assets/icons/threeEllipses.png'
import { truncate } from '../../util/truncate'
import MacrosRow from './MacrosRow'
import ThemedText from '../ThemedText'
import formatDate from '../../util/formatDate'
import { useUserStore } from '../../stores/useUserStore'
import getDateKey from '../../util/getDateKey'
import { Colors } from '../../constants/Colors'
import sinceWhen from '../../util/sinceWhen'

const ConsumedMealCard = ({style, meal, actionMenuData=null, ...props}) => {

    const getFoodsDescription = () => {
        const foods = meal.fullMeal.foods;
        let desc = " - ";
        if (foods.length === 1) return desc+foods[0].name;
        foods.forEach((food, i) => {
            const lastItem = i===foods.length-1;
            let str = food.name;
            if (!lastItem) str+=", ";
            desc+=str;
        });
        return desc;
    }

    const mealNutrition = meal.totalNutrition;

  return (
    <View {...props} style={[{width: "100%", backgroundColor: "#202020", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10, justifyContent: "center", alignItems: "center",}, style]}>
        <View style={{width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", zIndex: 1}}>
            <View style={{ marginBottom: 4, width: "80%", }}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, }}>
                    <Text style={{ color: "white", fontWeight: "600" }}>{meal.name}</Text>
                    <Text style={{ color: "#BCBCBC", fontWeight: "300" }}>{getFoodsDescription()}</Text>
                </Text>
            </View>
            {/* <View style={{height: 10, width: 20}}>
                <Image source={threeEllipses} style={{objectFit: "contain", height: "100%", width: "100%", tintColor: "#999999ff"}} />
            </View> */}
            {actionMenuData && <ActionMenu data={actionMenuData} showDebug={true} style={{zIndex: 1, paddingTop: 10, marginTop: -10, paddingBottom: 10, marginBottom: -10}} />}
        </View>
        <View style={{width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <ThemedText style={{fontSize: 13}}>{sinceWhen(meal.date ?? new Date())}</ThemedText>
            <MacrosRow nutrition={mealNutrition} />
        </View>
    </View>
  )
}

export default ConsumedMealCard

const styles = StyleSheet.create({})