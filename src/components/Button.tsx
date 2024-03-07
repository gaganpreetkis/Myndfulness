import React from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { cond, test, T, always, mergeAll, equals } from 'ramda'

import { Spacer } from './Spacer'

import { colors } from '../config'

interface ButtonProps extends TouchableOpacityProps {
  variant?:
  'text'
  | 'primary'
  | 'secondary'
  | 'activeTab'
  | 'defaultTab'
  | 'basic'
  | 'selected'
  | 'unselected'
  | 'basicSelected'
  children: React.ReactNode
  loading?: boolean
}

export const Button = ({
  children,
  variant = 'primary',
  loading,
  style,
  ...props
}: ButtonProps) => {
  const variantStyle = cond([
    [test(/^primary$/), always(styles.primary)],
    [test(/^secondary$/), always(styles.secondary)],
    [test(/^activeTab$/), always(styles.activeTab)],
    [test(/^defaultTab$/), always(styles.defaultTab)],
    [test(/^basic$/), always(styles.basic)],
    [test(/^basicSelected$/), always(styles.basicSelected)],
    [test(/^unselected$/), always(styles.unselected)],
    [test(/^selected$/), always(styles.selected)],
    [T, always(styles.primary)],
  ])(variant)

  return loading ? (
    <View style={[styles.container, variantStyle, style]}>
      <ActivityIndicator color={colors.secondary} />
    </View>
  ) : (
    <TouchableOpacity
      style={[styles.container, variantStyle, style]}
      {...props}
    >
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 40
  },
  basic: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 40,
    shadowColor: '#000',
    backgroundColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 2,
  },
  basicSelected: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 40,
    shadowColor: '#000',
    backgroundColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 2,
  },
  unselected: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: 20
  },
  secondary: {
    backgroundColor: colors.secondary
  },
  activeTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#BDDBFF"
  },
  selected: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: '#E8F0FF'
  },
  defaultTab: {
    borderWidth: 2,
    borderColor: '#EFF5FF',
    paddingHorizontal: 14,
    paddingVertical: 9,
  }
})
