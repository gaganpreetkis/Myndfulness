import React from 'react'
import {
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  FlatList,
  RefreshControl
} from 'react-native'
import { Portal } from 'react-native-paper'

import {
  Text,
  Navbar,
  Button,
  Spacer,
  Banner,
  Modal,
  OneLeader,
  SafeAreaView,
  BasicCard,
  RewardInfoModal
} from '../../../components'
import { colors } from '../../../config'
import { allLeaderboards } from '../../../api'
import { useApi } from '../../../hooks'
export const LeaderList = (props) => {
  // const leaderboardApi = useApi(allLeaderboards)
  const refRBSheet = React.useRef()
  const [list, setList] = React.useState([])
  const params = props.route.params
  React.useEffect(() => {
    // console.log(Object.keys(params), " params")
    // console.log(Object.keys(params).length, " params length")
    // console.log(Object.keys(params).length, " params length")

    // Object.values(params).forEach(element => console.log(element))

    const updatedList = [
      ...list,
      ...Object.values(params).sort((a, b) => parseFloat(b.total_medal) - parseFloat(a.total_medal))
    ]

    setList(updatedList)

  }, [params])
  React.useEffect(() => {
    console.log(list, " List")
  }, [list])

  return <View style={{ flex: 1 }}>
    {/* <Banner
      onPress={() => refRBSheet.current.open()}
      help
      background={require('../../../../assets/banner_achievements.png')}
      coins="100000"
      medals="500"
    />
    <Spacer size={32} /> */}
    {list && list.length > 0 ?
      <FlatList
        ListHeaderComponent={
          <Spacer size={8} />
        }
        ListHeaderComponentStyle={{ paddingBottom: 16 }}
        /*  refreshControl={
           <RefreshControl
             progressViewOffset={50}
             enabled
             refreshing={achievementApi.loading}
             onRefresh={achievementApi.request}
           />
         } */
        data={list}
        renderItem={({ item }) => <OneLeader {...item} />}
        keyExtractor={(item, index) => `achievement-item-${index}`}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ padding: 8 }} />}
        ListFooterComponent={
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Spacer size={16} />
            <BasicCard style={{ padding: 16 }}>
              <Text
                size="subtitle_two"
                variant="primaryText"
                font="Poppins_400Regular"
              >
                Premium users have significantly higher earning potential to make it on our motivation board!
              </Text>
              <Text
                size="caption_one"
                font="Poppins_400Regular"
                variant="secondaryText"
              >
                Each section displays the top 10 users from that time frame
              </Text>
              <Spacer size={32} />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require("../../../../assets/Top.png")} style={{ width: '10%', height: undefined, aspectRatio: 1, overflow: 'hidden' }} />
                <Spacer size={16} />
                <Text variant="primaryText" font="NotoSans_400Regular" size="body_two" style={{ flexShrink: 1 }}>
                  Track your progress within the community
                </Text>
              </View>
              <Spacer size={16} />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require("../../../../assets/badge.png")} style={{ width: '10%', height: undefined, aspectRatio: 1, overflow: 'hidden' }} />
                <Spacer size={16} />
                <Text variant="primaryText" font="NotoSans_400Regular" size="body_two" style={{ flexShrink: 1 }}>
                  Achieve personal bests
                </Text>
              </View>
              <Spacer size={16} />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require("../../../../assets/mechandise.png")} style={{ width: '10%', height: undefined, aspectRatio: 1, overflow: 'hidden' }} />
                <Spacer size={16} />
                <Text variant="primaryText" font="NotoSans_400Regular" size="body_two" style={{ flexShrink: 1 }}>
                  We occasionally reward top scorers with Myndfulnesss Merch and prizes
                </Text>
              </View>
            </BasicCard>

            <Spacer size={16} />
          </View>
        }
        style={{ width: '100%' }}
      />
      :
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 24 }}>
          <Text variant="primaryText" font="Poppins_400Regular" size="subtitle_two">It's empty up in here!</Text>
          <Spacer size={8} />
          <Text variant="disabledText" font="NotoSans_400Regular">
            Maintain a 21 day streak for a chance to be on our motivation board.
          </Text>
        </View>
        <Spacer size={32} />
        <View style={{ alignItems: 'center' }}>
          <BasicCard style={{ paddingHorizontal: 20, paddingVertical: 24 }}>
            <Text variant="primaryText" font="Poppins_400Regular" size="body_one" key="97566">
              Only Premium users are featured on our motivation board
            </Text>
            <Spacer size={8} />
            <Text variant="primaryText" font="NotoSans_400Regular" size="body_two" key="659">
              Get featured on our motivation board and track your progress within the community
            </Text>
            <Spacer size={32} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require("../../../../assets/Top.png")} style={{ width: '10%', height: undefined, aspectRatio: 1, overflow: 'hidden' }} />
              <Spacer size={16} />
              <Text variant="primaryText" font="NotoSans_400Regular" size="body_two" style={{ flexShrink: 1 }}>
                Get inspired by other user's progress
              </Text>
            </View>
            <Spacer size={16} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require("../../../../assets/badge.png")} style={{ width: '10%', height: undefined, aspectRatio: 1, overflow: 'hidden' }} />
              <Spacer size={16} />
              <Text variant="primaryText" font="NotoSans_400Regular" size="body_two" style={{ flexShrink: 1 }}>
                Set personal best's and track your progress
              </Text>
            </View>
            <Spacer size={16} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require("../../../../assets/mechandise.png")} style={{ width: '10%', height: undefined, aspectRatio: 1, overflow: 'hidden' }} />
              <Spacer size={16} />
              <Text variant="primaryText" font="NotoSans_400Regular" size="body_two" style={{ flexShrink: 1 }}>We occasionally reward top users with myndfulness merch!</Text>
            </View>
          </BasicCard>
          <Spacer size={32} />
        </View>
      </ScrollView>
    }
    <Portal>
      <Modal ref={refRBSheet} size={80}>
        <RewardInfoModal />
      </Modal>
    </Portal>
  </View>
}
