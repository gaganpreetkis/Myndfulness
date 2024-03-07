import React from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

import { InputScreen, Text, Button, Spacer } from '../../components'

export const Third = (props) => {
  const navigateTo = props.navigation.navigate

  return (
    <InputScreen background="lottie" style={{ flex: 100 }} source={require('../../../assets/lottie/reflect on yourself.json')}>
      {/* <Spacer size={12} /> */}
      <View style={{ width: '100%', flex: 1/* , paddingHorizontal: 24 */ }}>
        <Text variant="primaryText" size="headline_three" style={{ alignSelf: 'center', textAlign: 'center' }}>
          You're in the right{"\n"}place if you are:
        </Text>
        <Spacer size={32} />
        <Text variant="secondaryText" size="subtitle_one" style={{ alignSelf: 'center', textAlign: 'center' }}>
          Excited to self reflect and{"\n"}learn more about yourself
        </Text>
        <Spacer size={24} />
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-start' }}>
          <View style={{ width: '32%', marginStart: 24 }}>
            <Button variant="primary" onPress={() => navigateTo('Fourth')}>
              <Ionicons name="ios-arrow-forward-sharp" size={26} color="#fff" />
            </Button>
          </View>
        </View>
        <Spacer size={24} />
      </View>
    </InputScreen>
  )
}
