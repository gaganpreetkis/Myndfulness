import React from 'react'
import { TextInputProps } from 'react-native'
import { useFormikContext } from 'formik'
import { Text } from '../Text'

export const FromStatus = () => {
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

  return !!status && <Text style={{ paddingBottom: 16 }}>{status}</Text>
}