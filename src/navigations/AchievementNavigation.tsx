import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
// import { SafeAreaView } from 'react-native-safe-area-context'
import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native'
import { Portal } from 'react-native-paper'

import { AchievementList, LeaderList } from '../screens'
// import { MotivationNavigation } from '../navigations'
import { MotivationNavigation } from './MotivationNavigation'
import { Navbar, Button, Text, Banner, Spacer, Modal, RewardInfoModal } from '../components'
import { colors } from '../config'

const Stack = createStackNavigator()

const Tab = createMaterialTopTabNavigator()

function MyTabBar({ state, descriptors, navigation, position }) {
  const refRBSheet = React.useRef()
  return (
    <SafeAreaView style={{ backgroundColor: '#fff' }}>
      <Navbar showBack pageTitle="Achievements" />
      {/* <Banner
        onPress={() => refRBSheet.current.open()}
        help
        background={require('../../assets/banner_achievements.png')}
        coins="100000"
        medals="500"
      /> */}
      {/* <Spacer size={8} /> */}
      <View style={{ flexDirection: 'row' }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingRight: 12,
            paddingLeft: 24,
            paddingBottom: 12,
          }}
          style={{ flexDirection: 'row' }}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key]
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name

            const isFocused = state.index === index

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              })

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name)
              }
            }

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              })
            }

            return (
              <Button
                variant={isFocused ? 'activeTab' : 'defaultTab'}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{ marginRight: 8 }}
                key={label}
              >
                <Text font="NotoSans_400Regular">{label}</Text>
              </Button>
            )
          })}
        </ScrollView>
      </View>
      <Portal>
        <Modal ref={refRBSheet}>
          <RewardInfoModal />
        </Modal>
      </Portal>
    </SafeAreaView>
  )
}

export const AchievementsNavigation = ({ route = 'Achievements' }) => (
  <Tab.Navigator
    initialRouteName={route}
    tabBar={(props) => <MyTabBar {...props} />}
    swipeEnabled={false}
  >
    <Tab.Screen
      name="My Progress"
      key="AchievementList"
      component={AchievementList}
    />
    <Tab.Screen name="Motivation Board" key="Leaderboard" component={MotivationNavigation} />
  </Tab.Navigator>
)
