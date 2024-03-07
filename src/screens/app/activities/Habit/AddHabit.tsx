import React, { useRef } from "react";
import { View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { Portal } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";

import { Text, Spacer, TextInput, Button, InputScreen, Modal, PremiumModal } from "../../../../components";
import { createRoutines } from "../../../../api";
import { useApi } from "../../../../hooks";
import { RoutineTypeContext } from "../../../../context";

const validationSchema = () =>
  Yup.object().shape({
    habit: Yup.string().required().min(3).label("Habit Name"),
    habit_description: Yup.string().nullable().label("Description"),
    routine_time: Yup.string().label("Time"),
    routine_type: Yup.string().label("Interval"),
    habit_id: Yup.number().nullable().label("Habit id"),
  });

export const AddHabit = (props) => {
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const { data, loading, error, request } = useApi(createRoutines);
  const { RoutineTypes } = React.useContext(RoutineTypeContext);

  const refRBSheet = useRef();
  const refRBSheetPremium = useRef();
  const [update, setUpdate] = React.useState(0);
  const [success, setSuccess] = React.useState(false);

  const makeInvisible = (fn) => () => fn(false);
  const makeVisible = (fn) => () => fn(true);
  React.useEffect(() => {
    console.log(props.route.params);
    setUpdate(update + 1);
    setSuccess(false);
  }, [props.route.params]);

  const reset = () =>
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "ActivityNavigation" }],
      })
    );

  const handleSubmit = async (values, actions) => {
    actions.setStatus("");
    try {
      let newValues = Object.assign({}, values, {
        routine_time: moment(values["routine_time"]).format("HH:mm:ss"),
      });
      const response = await request(newValues);
      console.log(response.data);
      if (!response.ok) {
        console.log(response.data);
        throw response.data;
      }
      setSuccess(true);
    } catch (e) {
      console.log(e);
      refRBSheetPremium.current.open();
      actions.setStatus("Sorry, please try again.");
    }
  };

  return (
    <InputScreen
      key={update}
      style={{ paddingHorizontal: 24 }}
      containerStyle={{ backgroundColor: "undefined" }}
      parentStyle={{
        flexGrow: 0,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
      }}
      formContainerStyle={{
        width: (95 / 100) * Dimensions.get("screen").width,
        alignItems: "flex-start",
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingHorizontal: 16,
      }}
    >
      {/* <Image source={require("../../../../../assets/cloud_with_stars.png")} style={{ width: undefined, height: "30%", aspectRatio: 2.7 }} /> */}
      <Formik
        initialValues={{
          habit: props.route?.params?.name,
          habit_description: props.route?.params?.description ? props.route?.params?.description : "",
          routine_time: new Date(`1/1/2001 8:00:00`),
          routine_type: "Once a day",
          habit_id: props.route?.params?.id,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, values, setFieldValue, status }) => (
          <>
            {!!status && (
              <View>
                <Text size="caption_two" variant="error" font="Poppins_400Regular">
                  {status}
                </Text>
                <Spacer size={8} />
              </View>
            )}
            <TextInput name="habit" placeholder="Routine Name" />
            <Spacer size={12} />
            <TextInput name="habit_description" placeholder="Routine Note" />
            <Spacer size={24} />
            <View style={{ alignSelf: "flex-start", width: "100%", flex: 1 }}>
              <Text font="Poppins_400Regular" size="caption_one" variant="primaryText">
                Remind me at:
              </Text>
              <Spacer size={8} />
              <TouchableOpacity onPress={makeVisible(setDatePickerVisibility)}>
                <TextInput
                  name="routine_time"
                  pointerEvents="none"
                  value={moment(values["routine_time"]).format("hh:mm A")}
                  editable={false}
                  placeholder="Routine Name"
                />
              </TouchableOpacity>
              <DateTimePickerModal
                date={values["routine_time"]}
                isVisible={isDatePickerVisible}
                mode="time"
                onConfirm={(date) => {
                  setDatePickerVisibility(false);
                  setFieldValue("routine_time", date);
                }}
                onCancel={makeInvisible(setDatePickerVisibility)}
              />
              <Spacer size={12} />
              <TouchableOpacity onPress={() => refRBSheet.current.open()}>
                <TextInput pointerEvents="none" editable={false} name="routine_type" placeholder="Routine Name" />
              </TouchableOpacity>
              <Spacer size={24} />
              {/* <View style={{ flex: 1, justifyContent: 'flex-end' }}> */}
              {!success && (
                <Button variant={"primary"} onPress={handleSubmit} loading={loading}>
                  <Text variant="white" size="body_two">
                    Add to Routine
                  </Text>
                </Button>
              )}
              {success && (
                <Button variant={"primary"} onPress={reset} loading={loading}>
                  <Text variant="white" size="body_two">
                    Show Newly added Routine
                  </Text>
                </Button>
              )}
              {/* </View> */}
              <Spacer size={16} />
              <Portal>
                <Modal ref={refRBSheet}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ justifyContent: "space-between" }}
                  >
                    {RoutineTypes != undefined &&
                      RoutineTypes != null &&
                      RoutineTypes.map((label) => (
                        <Button
                          variant={values["routine_type"] === label ? "activeTab" : "defaultTab"}
                          onPress={() => setFieldValue("routine_type", label)}
                          key={label}
                          style={{ flex: 1, marginVertical: 8 }}
                        >
                          <Text>{label}</Text>
                        </Button>
                      ))}
                  </ScrollView>
                </Modal>
              </Portal>
              <Portal>
                <Modal ref={refRBSheetPremium} size={90} noPadding>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ justifyContent: "space-between" }}
                  >
                    <PremiumModal
                      navigation={props.navigation}
                      onCancel={() => refRBSheetPremium.current.close()}
                      onPurchase={() => refRBSheetPremium.current.close()}
                    />
                  </ScrollView>
                </Modal>
              </Portal>
            </View>
          </>
        )}
      </Formik>
      <Spacer size={16} />
    </InputScreen>
  );
};
