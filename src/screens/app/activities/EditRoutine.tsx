import React, { useRef } from 'react'
import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import moment from 'moment'
import { Portal, Switch } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CommonActions } from '@react-navigation/native'

import {
  Text,
  Spacer,
  TextInput,
  Button,
  InputScreen,
  Modal,
  Navbar,
  PremiumModal,
} from '../../../components'
import { changeStatus, updateRoutine, deleteRoutine } from '../../../api'
import { useApi } from '../../../hooks'
import { RoutineTypeContext } from '../../../context'

const validationSchema = () =>
  Yup.object().shape({
    routine_time: Yup.string().label('Time'),
    routine_type: Yup.string().label('Interval'),
  })

export const EditRoutine = (props) => {
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false)
  const statusApi = useApi(changeStatus)
  const deleteApi = useApi(deleteRoutine)
  const updateRoutineApi = useApi(updateRoutine)
  const [success, setSuccess] = React.useState(false)
  const { RoutineTypes } = React.useContext(RoutineTypeContext)
  const refRBSheetPremium = React.useRef()

  React.useEffect(()=> {
    console.log("routine types ", RoutineTypes);
  },[RoutineTypes]);

  const reset = () =>
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'ActivityNavigation' }],
      })
    )

  const refRBSheet = useRef()

  const makeInvisible = (fn) => () => fn(false)
  const makeVisible = (fn) => () => fn(true)

  const _handleSubmit = async (values, actions) => {
    actions.setStatus('')
    try {
      let newValues = Object.assign({}, values, {
        routine_time: moment(values['routine_time']).format('HH:mm:ss'),
        habit: props.route?.params?.habit,
        habit_description: props.route?.params?.habit_description,
      })
      const response = await updateRoutineApi.request(
        props.route?.params?.id,
        newValues
      )
      console.log(response, response.data)
      if (!response.ok) {
        throw response.data
      }
      reset()
      setSuccess(true)
    } catch (e) {
      console.log(e)
      actions.setStatus('Sorry, please try again.')
    }
  }

  const handleDelete = async () => {
    const response = await deleteApi.request(props.route?.params?.id)
    console.log(response.data)
    reset()
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Navbar showBack pageTitle="Edit Routine" parentScreen="Routine" />
      {/* <Image source={require("../../../../assets/cloud_with_stars.png")} style={{ width: Dimensions.get("screen").width, height: undefined, aspectRatio: 2.7 }} /> */}
      <Spacer size={8} />
      <View style={{ paddingHorizontal: 24, flex: 1 }}>
        <Text
          size="subtitle_two"
          font="Poppins_400Regular"
          variant="primaryText"
        >
          {props.route?.params?.habit}
        </Text>
        <Text
          size="body_one"
          font="NotoSans_400Regular"
          variant="secondaryText"
        >
          {props.route?.params?.habit_description}
        </Text>
        <Spacer size={16} />
        <Formik
          initialValues={{
            routine_time: new Date(
              `1/1/2001 ${props.route?.params?.routine_time}`
            ),
            routine_type: props.route?.params?.routine_type,
          }}
          onSubmit={_handleSubmit}
          validationSchema={validationSchema}
        >
          {({ handleSubmit, values, setFieldValue }) => (
            <>
              <View style={{ padding: 0.2, backgroundColor: '#D4D4D4' }} />
              <Spacer size={8} />
              <View style={{ alignSelf: 'flex-start', width: '100%' }}>
                <Text
                  font="Poppins_400Regular"
                  size="caption_one"
                  variant="primaryText"
                >
                  Remind me at:
                </Text>
                <Spacer size={8} />
                <TouchableOpacity
                  onPress={makeVisible(setDatePickerVisibility)}
                >
                  <TextInput
                    pointerEvents="none"
                    editable={false}
                    name="routine_time"
                    value={moment(values['routine_time']).format('hh:mm A')}
                    placeholder="Routine Name"
                  />
                </TouchableOpacity>
                <DateTimePickerModal
                  date={values['routine_time']}
                  isVisible={isDatePickerVisible}
                  mode="time"
                  onConfirm={(date) => {
                    setDatePickerVisibility(false)
                    setFieldValue('routine_time', date)
                  }}
                  onCancel={makeInvisible(setDatePickerVisibility)}
                />
                <Spacer size={16} />
                <TouchableOpacity onPress={() => refRBSheet.current.open()}>
                  <TextInput
                    pointerEvents="none"
                    editable={false}
                    name="routine_type"
                    placeholder="Routine Name"
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                {!success && (
                  <Button
                    variant={'primary'}
                    onPress={handleSubmit}
                    loading={updateRoutineApi.loading}
                  >
                    <Text variant="white" size="body_two">
                      Save Changes
                    </Text>
                  </Button>
                )}
                {success && (
                  <Button variant={'primary'} onPress={reset}>
                    <Text variant="white" size="body_two">
                      View Changes
                    </Text>
                  </Button>
                )}
                <Button
                  variant={'secondary'}
                  onPress={handleDelete}
                  loading={updateRoutineApi.loading}
                >
                  <Text variant="disabledText" size="body_two">
                    Delete Routine
                  </Text>
                </Button>
              </View>
              <Spacer size={16} />
              <Portal>
                <Modal ref={refRBSheet}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ justifyContent: 'space-between' }}
                  >
                    {RoutineTypes != undefined && RoutineTypes != null && Array.isArray(RoutineTypes) && RoutineTypes.map((label) => (
                      <Button
                        variant={
                          values['routine_type'] === label
                            ? 'activeTab'
                            : 'defaultTab'
                        }
                        onPress={() => setFieldValue('routine_type', label)}
                        key={label}
                        style={{ flex: 1, marginVertical: 8 }}
                      >
                        <Text>{label}</Text>
                      </Button>
                    ))}
                  </ScrollView>
                </Modal>
              </Portal>
            </>
          )}
        </Formik>
      </View>
      <Portal>
        <Modal ref={refRBSheetPremium} size={90} noPadding>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ justifyContent: 'space-between' }}
          >
            <PremiumModal
              navigation={props.navigation}
              onCancel={() => refRBSheetPremium.current.close()}
              onPurchase={() => refRBSheetPremium.current.close()}
            />
          </ScrollView>
        </Modal>
      </Portal>
    </SafeAreaView>
  )
}
