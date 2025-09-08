import { SectionList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../../../components/ThemedView'
import TitleWithBack from '../../../components/TitleWithBack'
import { useUserStore } from '../../../stores/useUserStore'
import ThemedText from '../../../components/ThemedText'
import PastWorkoutCard from '../../../components/workout/PastWorkoutCard'
import Spacer from '../../../components/Spacer'
import ConfirmMenu from '../../../components/ConfirmMenu'
import { Provider } from 'react-native-paper'
import SwipeToDelete from '../../../components/SwipeToDelete'
import { SafeAreaView } from 'react-native-safe-area-context'

function formatMonthYear(date) {
  const month = date.toLocaleString('default', { month: 'long' }).toUpperCase(); // "MAY"
  const year = date.getFullYear(); // 2025
  return `${month} ${year}`; // "MAY 2025"
}

const WorkoutHistory = () => {
  const user = useUserStore(state => state.user);

  const [confirmMenuActive, setConfirmMenuActive] = useState(false);
  const [confirmMenuData, setConfirmMenuData] = useState({
      title: "The title",
      subTitle: "The description for the confirmation",
      subTitle2: "Another one here",
      option1: "Update",
      option2: "Cancel",
      confirm: () => {setConfirmMenuActive(false);},
  });

  const grouped = user.pastWorkouts ? user.pastWorkouts.reduce((acc, workout) => {
    const dateObj = new Date(workout.time);
    //const dateKeyTemp = dateObj.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const dateKey = formatMonthYear(dateObj);

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(workout);
    return acc;
  }, {}) : {};

  const sectionalData = Object.entries(grouped)
    .map(([date, workouts]) => ({
      title: date,
      data: workouts
    }))

  return (
    <Provider>
        <ThemedView style={{flex: 1, paddingHorizontal: 20}}>
          <SafeAreaView style={{flex: 1}}>
              <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />

              <TitleWithBack title={"Workout History"} style={{marginLeft: -20}} />

              <Spacer size={10} />

              
              {sectionalData.length < 1 === true && (
                <View>
                  <ThemedText style={{textAlign: "center"}}>No completed workouts yet.</ThemedText>
                </View>
                
              )}
              <SectionList
              
                  sections={sectionalData}
                  keyExtractor={(item, i) => i}
                  renderItem={({ item }) => {
                    return (
                        <PastWorkoutCard
                          data={item}
                          />
                    )}}
                  renderSectionHeader={({ section: { title } }) => (
                      <ThemedView>
                          <ThemedText style={styles.header}>{title}</ThemedText>
                      </ThemedView>
                  )}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 120 }}
                  
              />

          </SafeAreaView>
      </ThemedView>
    </Provider>
    
  )
}

export default WorkoutHistory

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#464646',
    textAlign: "center",
  }
})