import React from 'react';
import { View, FlatList, RefreshControl } from 'react-native'

import { Text, OneHabit } from '../../../../components'

import { allHabits, habitByCategory } from '../../../../api'
import { useApi } from '../../../../hooks'

export const ListHabit = (props) => {
  const { data, error, loading, request } = useApi(allHabits)
  const habitByCategoryApi = useApi(habitByCategory)

  React.useEffect(() => {
    if (props.route.params?.id) {
      habitByCategoryApi.request(props.route.params.id)
    } else request()
  }, [props.route.params])

  return (
    <FlatList
      refreshControl={
        <RefreshControl
          progressViewOffset={50}
          enabled
          refreshing={loading}
          onRefresh={request}
        />
      }
      data={props.route.params?.id ? habitByCategoryApi.data?.data : data?.data}
      renderItem={({ item }) => <OneHabit {...item} onPress={() => props.navigation.navigate("Add Habit", item)} />}
      keyExtractor={(item, index) => `habit-item-${index}`}
      contentContainerStyle={{ flexGrow: 1, paddingVertical: 16, alignItems: 'center' }}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ padding: 8 }} />}
      style={{ width: '100%' }}
    />
  )
}