import React from 'react'
import { View, StyleSheet, Dimensions, StyleProp, ViewStyle } from 'react-native'
import { colors } from '../config'

type BasicCardProps = {
  style?: StyleProp<ViewStyle>,
  children?: React.ReactNode,
}

export const BasicCard = (props: BasicCardProps) => {
  return <View style={[styles.container, props.style]}>
    {props.children}
  </View>
}

const styles = StyleSheet.create({
  container: {
    width: (95 / 100) * Dimensions.get('screen').width,
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 2,
  }
})