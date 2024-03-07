import React from 'react'
import { View, FlatList, RefreshControl, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CommonActions } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import * as Analytics from 'expo-firebase-analytics'
import * as Notifications from 'expo-notifications'

import { Navbar, Text, OneTask, Banner } from '../../components'
import { allTasks, completeTask, incompleteTask } from '../../api'
import { useApi } from '../../hooks'
import { syncUser } from '../../store/features/userSlice'
import { fetchTotal } from '../../store/features/taskSlice'
import { RootState } from '../../store/rootReducer'

export const DailyReview = (props) => {
  const dispatch = useDispatch()
  const allTaskApi = useApi(allTasks, true)
  const completeTaskApi = useApi(completeTask)
  const inCompleteTaskApi = useApi(incompleteTask)
  const [message, setMessage] = React.useState(
    'Make sure you’ve completed journaling and self-reflection for today to earn more coins!'
  )
  const taskState = useSelector((state: RootState) => state.task)

  const refresh = (routineName) => {
    dispatch(syncUser(routineName))
    dispatch(fetchTotal())
  }

  React.useEffect(() => {
    if (allTaskApi != undefined && allTaskApi.data !=undefined && allTaskApi.data.length) {
      setMessage(
        'Make sure you’ve completed journaling and self-reflection for today to earn more coins!'
      )
    } else {
      setMessage('Yay! You’re done reviewing all your habits for now!')
    }
  }, [allTaskApi.data])

  React.useEffect(() => {
    if (allTaskApi.loading) {
      setMessage('')
    }
  }, [allTaskApi.loading])

  const handleCompleteTask = async (id, routineName) => {
    await completeTaskApi.request(id)
    refresh(routineName)
    Analytics.logEvent('routine_complete', { routine_name: routineName })
  }

  const handleIncompleteTask = async (id, routineName) => {
    await inCompleteTaskApi.request(id)
    refresh(routineName)
    Analytics.logEvent('routine_incomplete', { routine_name: routineName })
  }

  React.useEffect(() => {
    if (allTaskApi.loading) {
      setMessage('')
    }
  }, [allTaskApi.loading])

  React.useEffect(() => {
    Notifications.setBadgeCountAsync(taskState.total)
  }, [taskState.total])

  return (
    <SafeAreaView style={{ backgroundColor: '#fff' }}>
      <Navbar showBack pageTitle="Daily Review" hideBell />
      <FlatList
        ListHeaderComponent={
          <Banner
            onPress={() => props.navigation.navigate('AchievementsNavigation')}
            background={require('../../../assets/banner_achievements.png')}
            coins="100000"
            medals="500"
          />
        }
        ListHeaderComponentStyle={{ marginBottom: 16 }}
        refreshControl={
          <RefreshControl
            progressViewOffset={50}
            enabled
            refreshing={allTaskApi.loading}
            onRefresh={allTaskApi.resetPagination}
          />
        }
        onEndReachedThreshold={0.01}
        onEndReached={() => allTaskApi.request()}
        data={allTaskApi.data}
        renderItem={({ item }) => (
          <OneTask
            {...item}
            onComplete={() => handleCompleteTask(item.id, item.habit_name)}
            onIncomplete={() => handleIncompleteTask(item.id, item.habit_name)}
          />
        )}
        keyExtractor={(item, index) => `routine-item-${index}`}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 0,
          paddingVertical: 16,
          paddingBottom: 80,
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ padding: 8 }} />}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: allTaskApi != undefined && allTaskApi.data !=undefined && allTaskApi.data.length ? '#efefef' : '#fff',
        }}
        ListFooterComponent={
          <View style={{ paddingHorizontal: 10, marginVertical: 8 }}>
            {allTaskApi != undefined && allTaskApi.data !=undefined && allTaskApi.data.length ? (
              <>
                <Text style={{}} variant="black" font="Poppins_400Regular">
                  {message}
                </Text>
                <View style={{ padding: 8 }} />
              </>
            ) : (
              <>
                <Image
                  style={{
                    width: '100%',
                    height: undefined,
                    aspectRatio: 1,
                  }}
                  source={require('../../../assets/all_caught_up.png')}
                />
              </>
            )}
          </View>
        }
      />
    </SafeAreaView>
  )
}
