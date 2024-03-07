import React from 'react'
import {
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  FlatList,
  RefreshControl,
} from 'react-native'
import ViewShot, { captureRef } from 'react-native-view-shot'
import * as Sharing from 'expo-sharing'
import { Portal } from 'react-native-paper'

import {
  Text,
  Navbar,
  Button,
  Spacer,
  Banner,
  Modal,
  OneAchievement,
  RewardInfoModal,
} from '../../../components'
import { allAchievements } from '../../../api'
import { useApi } from '../../../hooks'
import { colors } from '../../../config'

export const AchievementList = (props) => {
  const achievementApi = useApi(allAchievements)
  const [list, setList] = React.useState([])
  const [share, setShare] = React.useState(false)
  // const { onScreenShot } = React.useContext(ScreenShotContext)
  const viewRef = React.createRef()
  const refRBSheet = React.useRef()

  React.useEffect(() => {
    fetchOrganizeData()
  }, [])

  const fetchOrganizeData = async () => {
    const response = await achievementApi.request()
    let mapData = {}
    // console.log(response.data)
    if (!response.ok) return
    if (response.data.data != undefined) {
      response.data.data.map((item) => {
        if (mapData[item.rewardable_id]) {
          mapData[item.rewardable_id].total_reward += 1
        } else mapData[item.rewardable_id] = item
      })
      setList(Object.values(mapData))
    }
    // console.log(response.data.data)
  }

  const captureAndShareScreenshot = async () => {
    setShare(true)
    try {
      viewRef.current.capture().then((uri) => {
        console.log('do something with ', uri)
        // setFile(uri)
        return Sharing.shareAsync('file://' + uri)
      }).then(() => setShare(false))
    } catch (e) {
      console.error('Oops, snapshot failed', e)
    }
  }

  return (
    <ViewShot options={{ format: 'jpg', quality: 0.8 }} ref={viewRef}>
      <FlatList
        ListHeaderComponent={
          <Banner
            onPress={() => refRBSheet.current.open()}
            help
            background={require('../../../../assets/banner_achievements.png')}
            coins="100000"
            medals="500"
          />
        }
        ListHeaderComponentStyle={{ paddingBottom: 16 }}
        refreshControl={
          <RefreshControl
            progressViewOffset={50}
            enabled
            refreshing={achievementApi.loading}
            onRefresh={achievementApi.request}
          />
        }
        data={list}
        renderItem={({ item }) => <OneAchievement {...item} />}
        keyExtractor={(item, index) => `achievement-item-${index}`}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ padding: 8 }} />}
        ListFooterComponent={
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Button
              onPress={captureAndShareScreenshot}
              style={{ marginTop: 16, display: share ? 'none' : 'flex' }}
            >
              <Text variant="white">Share</Text>
            </Button>
            <Spacer size={32} />
            {/* <Image source={require('../../../../assets/lotus.png')}
              style={{ width: '60%', height: undefined, aspectRatio: 848 / 620 }} />
            <Spacer size={16} />
            <Text variant="primaryText" font="Poppins_400Regular" size="subtitle_two">Myndfulness</Text>
            <Spacer size={8} />
            <Text font="Poppins_400Regular" size="caption_one">
              Build Habits | Growth | Self Reflection
            </Text>
            <Spacer size={32} /> */}
          </View>
        }
        style={{ width: '100%' }}
      />
      <Portal>
        <Modal ref={refRBSheet} size={80}>
          <RewardInfoModal />
        </Modal>
      </Portal>
    </ViewShot>
  )
}
