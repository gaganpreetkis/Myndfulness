import * as React from 'react';
import { View } from 'react-native';
import { useFormikContext } from 'formik'
import { MaterialIcons } from '@expo/vector-icons';

import { Button } from '../Button'
import { Text } from '../Text'
import { Spacer } from '../Spacer'

import { colors } from '../../config'

export const FormRadioInput = ({ name, children, id, nextQuestionId = null }) => {
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

  const handleChange = () => {
    if (values[name]?.text === children) setFieldValue(name, null)
    else setFieldValue(name, { optionId: id, text: children, next_question_id: nextQuestionId })
  }

  return values[name]?.text === children
    ? (<Button variant="selected" onPress={handleChange} style={{ justifyContent: "flex-start", flexDirection: "row" }}>
      <MaterialIcons name="radio-button-on" size={24} color={colors.primary} />
      <Spacer size={8} />
      <Text variant="primaryText" size="body_two" font="NotoSans_400Regular">
        {children}
      </Text>
    </Button>)
    : (<Button variant="unselected" onPress={handleChange} style={{ justifyContent: "flex-start", flexDirection: "row" }}>
      <MaterialIcons name="radio-button-off" size={24} color={colors.primary} />
      <Spacer size={8} />
      <Text variant="primaryText" size="body_two" font="NotoSans_400Regular">
        {children}
      </Text>
    </Button>)
};