import React, { useContext } from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

import { InputScreen, Text, Button, Spacer } from '../../components'
import { OnboardingContext } from '../../context'

export const Fourth = (props) => {
  const { setOnBoarding } = useContext(OnboardingContext)

  return (
    <InputScreen background="lottie" style={{ flex: 100 }} source={require('../../../assets/lottie/win rewards.json')}>
      {/* <Spacer size={12} /> */}
      <View style={{ width: '100%', flex: 1, paddingHorizontal: 24 }}>
        <Text variant="primaryText" size="subtitle_one" style={{ alignSelf: 'center', textAlign: 'center' }}>
          Commit to self care
        </Text>
        <Spacer size={16} />
        <Text variant="secondaryText" size="body_one" style={{ color: '#9eafab' }}>
          We are so excited to assist you to prioritize your mental well-being, learn more about yourself, and build new self care habits!
          {"\n\n"}
          Reminder: This app is designed as a self-helping tool to help you focus on self care and become more myndful. It should never be considered a substitute for mental health services or any type of medical care.
        </Text>
        <Spacer size={24} />
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-start' }}>
          <View style={{ width: '32%' }}>
            <Button variant="primary" onPress={() => setOnBoarding(false)}>
              <Ionicons name="ios-arrow-forward-sharp" size={26} color="#fff" />
            </Button>
          </View>
        </View>
        <Spacer size={24} />
      </View>
    </InputScreen>
  )
}
