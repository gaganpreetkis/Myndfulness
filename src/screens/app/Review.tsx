import React from 'react'
import { View } from 'react-native'

import { Text } from '../../components'

export const Review = (props) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text size="body_one">Review</Text>
    </View>
  )
}