import React, { useEffect } from 'react'
import { View, Image } from 'react-native';
import { useFormikContext } from 'formik'
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

import { Button } from '../Button'
import { Text } from '../Text'
import { Spacer } from '../Spacer'

import { colors } from '../../config'



export const FormSlider = ({ name }) => {
  const {
    setFieldTouched,
    setFieldValue,
    errors,
    touched,
    values,
    status,
    setValues,
    handleReset,
    handleSubmit,
  } = useFormikContext<any>()

  const valueToText = [
    {
      image: require('../../../assets/sad.png'),
      name: 'Very Bad'
    },
    {
      image: require('../../../assets/bad.png'),
      name: 'Bad'
    },
    {
      image: require('../../../assets/okay.png'),
      name: 'Okay'
    },
    {
      image: require('../../../assets/good.png'),
      name: 'Good'
    },
    {
      image: require('../../../assets/great.png'),
      name: 'Great'
    },
    {
      image: require('../../../assets/excellent.png'),
      name: 'Excellent'
    }
  ]

  React.useEffect(() => {
    setFieldValue(name, { optionId: null, text: "Very Bad" })
  }, []);

  const handleChange = (text) => {
    setFieldValue(name, { optionId: null, text: valueToText[text].name })
  }


  return <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
    <Slider
      style={{ width: '100%', height: 50, padding: 10, margin: 0 }}
      minimumValue={0}
      maximumValue={valueToText.length - 1}
      step={1}
      thumbTintColor={colors.primary}
      minimumTrackTintColor={colors.primary}
      maximumTrackTintColor="#95BAFF"
      onValueChange={handleChange}
    />
    <Spacer size={16} />
    <Image source={valueToText.find(x => x.name === values[name]?.text)?.image} style={{ width: '20%', height: undefined, aspectRatio: 1 }} />
    <Spacer size={16} />
    <Text variant="primaryText" size="subtitle_one" font="NotoSans_400Regular">
      {valueToText.find(x => x.name === values[name]?.text)?.name}
    </Text>
  </View>

}