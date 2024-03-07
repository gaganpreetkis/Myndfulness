import * as React from 'react';
import { View } from 'react-native';
import { useFormikContext } from 'formik'
import { MaterialIcons } from '@expo/vector-icons';

import { Button } from '../Button'
import { Text } from '../Text'
import { Spacer } from '../Spacer'

import { colors } from '../../config'

export const FormCheckBoxInput = ({ name, children, id, nextQuestionId = null }) => {
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
    if (Array.isArray(values[name]) && values[name].filter(val => val?.text == children).length) {
      setFieldValue(name, values[name].filter(x => x?.text != children))
    } else {
      if (!values[name]) {
        setFieldValue(name, [{ optionId: id, text: children, next_question_id: nextQuestionId }])
      } else setFieldValue(name, [...values[name], { optionId: id, text: children, next_question_id: nextQuestionId }])
    }
  }

  React.useEffect(() => {
    if (values[name] && values[name].length === 0) {
      setFieldValue(name, null)
    }
  }, [values[name]])

  return Array.isArray(values[name]) && values[name].filter(val => val?.text === children).length
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