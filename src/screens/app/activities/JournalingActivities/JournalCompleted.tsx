import React from 'react'
import { Dimensions, FlatList, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux'
import LottieView from 'lottie-react-native';

import { Navbar, Text, BasicCard, Spacer, Button } from '../../../../components'
import { syncUser } from '../../../../store/features/userSlice'

const data = [{ text: "Sed eget massa lorem. Aenean at molestie nibh. Aenean id pretium ante. Nam ultrices maximus turpis nec interdum. Proin non ligula est." }]

export const JournalCompleted = (props) => {
  const navigateTo = props.navigation.navigate
  const dispatch = useDispatch()

  const reset = () => {
    dispatch(syncUser())
    // props.navigation.dispatch(
    //   CommonActions.reset({
    //     index: 1,
    //     routes: [
    //       {
    //         name: 'ActivityNavigation'
    //       },
    //       {
    //         name: 'YourJournalEntries',
    //       }
    //     ],
    //   })
    // );
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'ActivityNavigation' }],
      })
    )
  }

  return (
    <SafeAreaView style={{ backgroundColor: '#8FD3F4', flex: 1 }} >
      <LinearGradient
        colors={['#8FD3F4', '#84FAB0']}
        start={[1, 0]}
        end={[1, 1]}
        locations={[0, 1]}
        style={{ flex: 1 }}
      >
        <Navbar showBack pageTitle="Journal" />
        <LottieView
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute'
          }}
          loop={false}
          autoPlay
          source={require('../../../../../assets/lottie/feedback.json')}
          resizeMode="cover"
        />
        <View style={{ alignItems: 'center', flex: 1, marginTop: 24 }}>
          <BasicCard style={{ width: (95 / 100) * Dimensions.get('screen').width, padding: 24, height: (40 / 100) * Dimensions.get("screen").height }}>
            <Text variant="primaryText" font="Poppins_400Regular" size="subtitle_two">Journal Successfully filled!</Text>
            <Spacer size={12} />
            <Text variant="primaryText" font="NotoSans_400Regular">
              {/* Keep this streak on to keep earning coins and feature on our leaderboard. */}
              Great job journaling today! Now you can always look back on your mood calendar and see how you were doing on this date. If you enjoy this, make sure to check out our CBT-inspired self reflection's as well!
            </Text>
          </BasicCard>
        </View>
        <View style={{ marginHorizontal: 18 }}>
          <Button variant="primary" onPress={reset}>
            <Text font="NotoSans_400Regular" variant="white" size="body_one">
              {/* View Your Journals */}
              Back to Daily Mood Journal
            </Text>
          </Button>
        </View>
        <Spacer size={24} />
      </LinearGradient>
    </SafeAreaView>
  )
}