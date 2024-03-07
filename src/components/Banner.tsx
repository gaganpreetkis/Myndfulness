import React from 'react'
import { View, ImageBackground, Image, Dimensions, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux'
import LottieView from 'lottie-react-native';

import { RootState } from '../store/rootReducer'

import { Spacer } from './Spacer'
import { Text } from './Text'
import { colors } from '../config';

type BannerProps = {
  background: any,
  coins: any,
  medals: any,
  onPress: any,
  help?: any
}

export const Banner = (props: BannerProps) => {
  const userState = useSelector((state: RootState) => state.user)
  const lottieRef = React.useRef()
  const [prevState, setPrevState] = React.useState(userState.loading)

  React.useEffect(() => {
    if (prevState == true && userState.loading == false) lottieRef.current.play()
    setPrevState(userState.loading)
  }, [userState.loading])

  return <ImageBackground source={props.background} style={{ width: Dimensions.get("screen").width, height: undefined, aspectRatio: 1500 / 480 }}>
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <LottieView
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute'
        }}
        loop={false}
        ref={lottieRef}
        source={require('../../assets/lottie/feedback.json')}
        resizeMode="cover"
      />
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 30, flexDirection: 'row', alignItems: 'center' }}>
        <Image source={require('../../assets/coin.png')} style={{ width: '10%', height: undefined, aspectRatio: 1 }} />
        <Spacer size={4} />
        <View>
          <Text variant="disabledText" size="caption_two" font="NotoSans_400Regular">COINS</Text>
          {userState.loading && <ActivityIndicator color={colors.primary} />}
          {!userState.loading && <Text variant="black" size="body_two" font="NotoSans_400Regular">{`${userState.total_coins}`}</Text>}
        </View>
        <Spacer size={12} />
        <Image source={require('../../assets/badge.png')} style={{ width: '10%', height: undefined, aspectRatio: 1 }} />
        <Spacer size={4} />
        <View>
          <Text variant="disabledText" size="caption_two" font="NotoSans_400Regular">MEDALS</Text>
          {userState.loading && <ActivityIndicator color={colors.primary} />}
          {!userState.loading && <Text variant="black" size="body_two" font="NotoSans_400Regular">{`${userState.total_medals}`}</Text>}
        </View>
        <Spacer size={12} />
        <TouchableWithoutFeedback onPress={props.onPress} >
          {props.help ? <Image source={require('../../assets/help.png')} style={{ width: '11%', height: undefined, aspectRatio: 1 }} /> : <Image source={require('../../assets/forward.png')} style={{ width: '10%', height: undefined, aspectRatio: 1 }} />}
        </TouchableWithoutFeedback>
      </View>
    </View>
  </ImageBackground>
}