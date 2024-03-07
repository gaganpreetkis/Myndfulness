import React from 'react'
import { Keyboard, View } from 'react-native'
import moment from 'moment'
import { useFormikContext } from 'formik'

import { Text } from '../Text'
import { Spacer } from '../Spacer'
import { TextInput } from './TextInput'
import { FormCheckBoxInput } from './FormCheckBoxInput'
import { FormRadioInput } from './FormRadioInput'
import { FormSlider } from './FormSlider'

export const FromInputFactory = ({ form, showSubText = true }) => {
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

  const getFormBlock = (formSection) => {
    switch (formSection.type) {
      case 'Text Input Answer':
        return (
          <View key={formSection.id} style={{ width: '100%' }}>
            <Text
              font="NotoSans_400Regular"
              variant="primaryText"
              size="body_one"
            >
              {formSection.question}
            </Text>
            <Spacer size={8} />
            <TextInput name={formSection.id} />
            <Spacer size={16} />
          </View>
        )
      case 'Single Answer Choice':
        return (
          <View key={formSection.id} style={{ width: '100%' }}>
            <Text
              font="Poppins_400Regular"
              variant="primaryText"
              size="subtitle_two"
            >
              {formSection.question}
            </Text>
            {/*  {showSubText && (
              <View>
                <Spacer size={4} />
                <Text
                  variant="disabledText"
                  font="NotoSans_400Regular"
                  size="caption_one"
                >
                  Note: Your answers doesn't limit your Myndfulness experience.
                </Text>
              </View>
            )} */}
            {/* <View> */}
            <Spacer size={8} />
            {formSection.options.map((option) => (
              <View style={{ marginVertical: 7 }} key={option.option_id}>
                <FormRadioInput
                  id={option.option_id}
                  nextQuestionId={option.next_question_id}
                  name={formSection.id}
                >
                  {option.option?.text}
                </FormRadioInput>
              </View>
            ))}
            {/* </View> */}
          </View>
        )
      case 'Multiple Answer Choice':
        return (
          <View key={formSection.id} style={{ width: '100%' }}>
            <Text
              font="Poppins_400Regular"
              variant="primaryText"
              size="subtitle_two"
            >
              {formSection.question}
            </Text>
            <Spacer size={8} />
            {showSubText && (
              <Text
                variant="disabledText"
                font="NotoSans_400Regular"
                size="caption_one"
              >
                Note: You can select more than one.
              </Text>
            )}
            {/* <View> */}
            <Spacer size={24} />
            <View>
              {formSection.options.map((option) => (
                <View style={{ paddingVertical: 2 }} key={option.option_id}>
                  <FormCheckBoxInput
                    nextQuestionId={option.next_question_id}
                    id={option.option_id}
                    name={formSection.id}
                  >
                    {option.option?.text}
                  </FormCheckBoxInput>
                </View>
              ))}
            </View>
            <Spacer size={16} />
          </View>
        )
      case 'Text Answer':
        return (
          <View key={formSection.id} style={{ width: '100%' }}>
            {(values[formSection.id]?.text == '' ||
              values[formSection.id]?.text == undefined) && (
                <Text
                  font="NotoSans_400Regular"
                  variant="primaryText"
                  size="subtitle_two"
                >
                  {formSection.question}
                </Text>
              )}
            <Spacer size={12} />
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text
                variant="disabledText"
                font="NotoSans_400Regular"
                size="caption_one"
              >
                Today is {moment().format('MMMM Do YYYY')}
              </Text>
              <Text
                variant="disabledText"
                font="NotoSans_400Regular"
                size="caption_one"
              >
                {values[formSection.id]
                  ? values[formSection.id]?.text.replace(/ /g, '').length
                  : 0}{' '}
                characters
              </Text>
            </View>
            <TextInput
              removePaddingMargin={true}
              border={false}
              name={formSection.id}
              multiline
              autoFocus
              scrollEnabled={true}
              placeholder="This is your daily journal, you can write your thoughts here & it is totally private. You’ll earn a coin when you write your thoughts in more than 300 characters."
              textAlignVertical="top"
              numberOfLines={8}
              enablesReturnKeyAutomatically={true}
              returnKeyType='done'
              style={{ maxHeight: 300 }}
              onSubmitEditing={() => { Keyboard.dismiss() }}
            />
            <Spacer size={16} />
          </View>
        )
      case 'Rating Answer':
        return (
          <View
            key={formSection.id}
            style={{ width: '100%', alignItems: 'center' }}
          >
            <Text
              font="NotoSans_400Regular"
              variant="primaryText"
              size="subtitle_two"
            >
              {formSection.question}
            </Text>
            <Spacer size={8} />
            <FormSlider name={formSection.id} />
            <Spacer size={16} />
          </View>
        )
    }
  }

  return form.map(getFormBlock)
}
