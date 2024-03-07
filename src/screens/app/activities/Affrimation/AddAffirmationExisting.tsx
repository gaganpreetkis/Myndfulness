import React, { useState } from "react";
import { View, TouchableOpacity, Image, Dimensions, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";

import { Text, Spacer, InputScreen, SafeAreaView, Navbar, Button } from "../../../../components";
import { createAffirmation, updateAffirmation } from "../../../../api";
import { useApi } from "../../../../hooks";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { ApiResponse } from "apisauce";
import { colors } from "../../../../config";

const validationSchema = () =>
  Yup.object().shape({
    starts_at: Yup.string().label("Time"),
  });

export const AddAffirmationExisting = (props) => {
  const params = props.route.params;
  const navigateTo = props.navigation.navigate;

  const createAffirmationApi = useApi(createAffirmation);
  const updateAffirmationApi = useApi(updateAffirmation);

  const makeVisible = (fn) => () => fn(true);
  const makeInvisible = (fn) => () => fn(false);
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

  const [item, setItem] = useState();
  const [isUpdating, setIsUpdating] = useState(false);
  const [reminderTime, setReminderTime] = useState("9:00:00");
  const [isGeneralReminder, setIsGeneralReminder] = useState(false);

  const [update, setUpdate] = React.useState(0);
  const [success, setSuccess] = React.useState(false);

  const [sun, setSun] = useState(false);
  const [mon, setMon] = useState(false);
  const [tue, setTue] = useState(false);
  const [wed, setWed] = useState(false);
  const [thu, setThu] = useState(false);
  const [fri, setFri] = useState(false);
  const [sat, setSat] = useState(false);

  React.useEffect(() => {
    console.log(params);
    if (params.item) {
      setItem(params.item);
    }
    if (params.isUpdate) {
      setIsUpdating(params.isUpdate);
      if (params.item.reminder_time) {
        setReminderTime(params.item.reminder_time);
      }
      if (params.item.repeats) {
        let arr = params.item.repeats.split(",");
        arr.forEach((day) => {
          if (day == "0") setSun(true);
          else if (day == "1") setMon(true);
          else if (day == "2") setTue(true);
          else if (day == "3") setWed(true);
          else if (day == "4") setThu(true);
          else if (day == "5") setFri(true);
          else if (day == "6") setSat(true);
        });
      }
    }
    if (params.isGeneralReminder) {
      setIsGeneralReminder(params.isGeneralReminder);
    }
    setUpdate(update + 1);
    setSuccess(false);
  }, [props.route.params]);

  const reset = () => props.navigation.navigate("AffirmationSingleNavigation");

  const getDaysForApi = () => {
    let arr = new Array();
    if (sun) {
      arr.push(0);
    }
    if (mon) {
      arr.push(1);
    }
    if (tue) {
      arr.push(2);
    }
    if (wed) {
      arr.push(3);
    }
    if (thu) {
      arr.push(4);
    }
    if (fri) {
      arr.push(5);
    }
    if (sat) {
      arr.push(6);
    }
    return arr;
  };

  const handleSubmit = async (values, actions) => {
    console.log("inside handleSubmit");
    actions.setStatus("");

    if (isGeneralReminder) {
      CommonActions.goBack();
      return;
    }

    try {
      let obj = new FormData();
      obj.append("cat_id", item.cat_id);
      obj.append("affirmation_text", item.text);
      obj.append("starts_at", moment(values["starts_at"]).format("HH:mm:ss"));
      getDaysForApi().length > 0 ? obj.append("repeats", getDaysForApi().join(",")) : null;
      if (isUpdating) {
        obj.append("aff_id", item.id);
      }

      console.log("obj api", obj);

      var response: ApiResponse<any, any>;
      if (isUpdating) response = await updateAffirmationApi.request(obj);
      else response = await createAffirmationApi.request(obj);

      console.log(response.data);
      if (!response.ok) {
        console.log(response.data);
        throw response.data;
      }
      setSuccess(true);
    } catch (e) {
      console.log(e);
      actions.setStatus("Sorry, please try again.");
    }
  };

  return (
    <SafeAreaView>
      <Navbar
        showBack
        pageTitle={isUpdating ? "Update Affirmation" : isGeneralReminder ? "Edit Reminder" : "Add Affirmation"}
      />
      <InputScreen
        key={update}
        style={{ paddingHorizontal: 24 }}
        containerStyle={{ backgroundColor: "undefined" }}
        parentStyle={{
          flexGrow: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
        formContainerStyle={{
          width: (95 / 100) * Dimensions.get("screen").width,
          alignItems: "flex-start",
          backgroundColor: "#fff",
          borderRadius: 20,
          paddingHorizontal: 16,
        }}
        noSafeArea={false}
      >
        <Formik
          initialValues={{
            starts_at: new Date(`1/1/2001 ` + reminderTime),
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
              {item != undefined && item.text ? (
                <View style={{ flex: 1 }}>
                  <View style={styles.textCardContainer}>
                    <FontAwesome name="quote-left" size={24} color="white" />
                    <Text variant="white" font="Poppins_400Regular" size="subtitle_two" style={{ textAlign: "center" }}>
                      {item.text}
                    </Text>
                  </View>

                  <Spacer size={16} />
                </View>
              ) : null}
              <Text
                style={[{ textAlign: "center", alignSelf: "center", lineHeight: 26 }]}
                variant={isGeneralReminder ? "black" : "subText"}
                size={isGeneralReminder ? "body_one" : "caption_one"}
                font={"NotoSans_400Regular"}
              >
                {isGeneralReminder
                  ? "Choose how you want your affirmation reminders to start, repeat and sound."
                  : "SET REMINDER"}
              </Text>
              {isUpdating ? (
                <Text
                  variant="subText"
                  font="Poppins_400Regular"
                  size="body_two"
                  style={{ textAlign: "center", alignSelf: "center" }}
                >
                  optional
                </Text>
              ) : null}
              <Spacer size={16} />
              {line()}
              <Spacer size={32} />
              <View style={styles.viewStyle}>
                <Text style={styles.textStyle1}>Starts at</Text>
                <TouchableOpacity
                  style={{ width: "50%", height: "50%", alignSelf: "flex-end" }}
                  onPress={makeVisible(setDatePickerVisibility)}
                >
                  <Image
                    source={require("../../../../../assets/icon_subtract.png")}
                    style={{
                      resizeMode: "contain",
                      alignSelf: "flex-end",
                      marginEnd: 180,
                      marginTop: -25,
                      width: 35,
                      height: 35,
                      aspectRatio: 1,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 100,
                    height: 40,
                    backgroundColor: "#9B9B9B50",
                    opacity: 0.5,
                    marginTop: -55,
                    alignSelf: "flex-end",
                    marginEnd: 70,
                    borderRadius: 8,
                  }}
                  onPress={makeVisible(setDatePickerVisibility)}
                >
                  <DateTimePickerModal
                    date={values["starts_at"]}
                    isVisible={isDatePickerVisible}
                    mode="time"
                    onConfirm={(date) => {
                      setDatePickerVisibility(false);
                      setFieldValue("starts_at", date);
                    }}
                    onCancel={makeInvisible(setDatePickerVisibility)}
                  />
                  <Text style={{ alignSelf: "center", padding: 8, color: "#000000" }}>
                    {moment(values["starts_at"]).format("hh:mm A")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ width: "50%", height: "50%", alignSelf: "flex-end" }}
                  onPress={makeVisible(setDatePickerVisibility)}
                >
                  <Image
                    source={require("../../../../../assets/icon_add.png")}
                    style={{
                      resizeMode: "contain",
                      alignSelf: "flex-end",
                      marginEnd: 25,
                      marginTop: -35,
                      width: 35,
                      height: 35,
                      aspectRatio: 1,
                    }}
                  />
                </TouchableOpacity>
              </View>
              {line()}
              <Spacer size={16} />
              <View style={{ flex: 1 }}>
                <Text style={styles.textStyle1}>Repeats</Text>
                <Spacer size={32} />

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={sun ? styles.roundButtonActive : styles.roundButton}
                    onPress={() => {
                      let day = sun;
                      setSun(!day);
                    }}
                  >
                    <Text
                      size="v_small"
                      font="Poppins_400Regular"
                      style={[sun ? styles.weekActive : styles.weekInactive]}
                    >
                      SUN
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={mon ? styles.roundButtonActive : styles.roundButton}
                    onPress={() => {
                      let day = mon;
                      setMon(!day);
                    }}
                  >
                    <Text
                      size="v_small"
                      font="Poppins_400Regular"
                      style={[mon ? styles.weekActive : styles.weekInactive]}
                    >
                      MON
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={tue ? styles.roundButtonActive : styles.roundButton}
                    onPress={() => {
                      let day = tue;
                      setTue(!day);
                    }}
                  >
                    <Text
                      size="v_small"
                      font="Poppins_400Regular"
                      style={[tue ? styles.weekActive : styles.weekInactive]}
                    >
                      TUE
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={wed ? styles.roundButtonActive : styles.roundButton}
                    onPress={() => {
                      let day = wed;
                      setWed(!day);
                    }}
                  >
                    <Text
                      size="v_small"
                      font="Poppins_400Regular"
                      style={[wed ? styles.weekActive : styles.weekInactive]}
                    >
                      WED
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={thu ? styles.roundButtonActive : styles.roundButton}
                    onPress={() => {
                      let day = thu;
                      setThu(!day);
                    }}
                  >
                    <Text
                      size="v_small"
                      font="Poppins_400Regular"
                      style={[thu ? styles.weekActive : styles.weekInactive]}
                    >
                      THU
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={fri ? styles.roundButtonActive : styles.roundButton}
                    onPress={() => {
                      let day = fri;
                      setFri(!day);
                    }}
                  >
                    <Text
                      size="v_small"
                      font="Poppins_400Regular"
                      style={[fri ? styles.weekActive : styles.weekInactive]}
                    >
                      FRI
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={sat ? styles.roundButtonActive : styles.roundButton}
                    onPress={() => {
                      let day = sat;
                      setSat(!day);
                    }}
                  >
                    <Text
                      size="v_small"
                      font="Poppins_400Regular"
                      style={[sat ? styles.weekActive : styles.weekInactive]}
                    >
                      SAT
                    </Text>
                  </TouchableOpacity>

                  <View style={{ flex: 1, height: 50 }} />
                </View>
              </View>
              <Spacer size={32} />
              {line()}
              <Spacer size={16} />
              <Text style={styles.textStyle1}>Sound</Text>
              <View style={{ alignSelf: "flex-end" }}>
                <TouchableOpacity>
                  <Text style={{ color: "#000000", opacity: 0.5, marginTop: -22 }}>{"Positive  >"}</Text>
                </TouchableOpacity>
              </View>
              <Spacer size={32} />

              {!success && (
                <Button
                  variant={"primary"}
                  onPress={handleSubmit}
                  loading={createAffirmationApi.loading}
                  style={{ flex: 1, alignSelf: "center" }}
                >
                  <Text variant="white" size="body_two">
                    DONE
                  </Text>
                </Button>
              )}
              {success && (
                <Button
                  variant={"primary"}
                  onPress={reset}
                  loading={createAffirmationApi.loading}
                  style={{ flex: 1, alignSelf: "center" }}
                >
                  <Text variant="white" size="body_two">
                    View Affirmations
                  </Text>
                </Button>
              )}
            </>
          )}
        </Formik>
      </InputScreen>
    </SafeAreaView>
  );
};
const line = () => {
  return (
    <View
      style={{
        width: "100%",
        height: 0.5,
        backgroundColor: "#00000050",
        opacity: 0.5,
      }}
    />
  );
};
const styles = StyleSheet.create({
  buttonStyle: {
    width: 80,
    height: 40,
    backgroundColor: "#9B9B9B",
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    color: "#FFFFFF",
    textAlign: "center",
    padding: 8,
    overflow: "hidden",
  },
  textStyle: {
    color: colors.subText,
    alignSelf: "center",
  },
  textStyle1: {
    color: "#000000",
  },
  subtractButton: {
    // alignSelf: "center",
  },
  viewStyle: {
    width: "100%",
    height: 50,
  },
  buttonContainer: {
    flexDirection: "row",
    position: "absolute",
    margin: 20,
    paddingTop: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: -0,
    backgroundColor: "#FFFFFF",
  },
  roundButton: {
    width: 40,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#616161",
    borderWidth: 1,
    textAlign: "center",
    alignContent: "center",
  },
  roundButtonActive: {
    width: 40,
    height: 40,
    backgroundColor: "#616161",
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#616161",
    borderWidth: 1,
  },
  weekActive: {
    color: "#ffffff",
    textAlign: "center",
  },
  weekInactive: {
    color: "#616161",
    textAlign: "center",
  },
  textCardContainer: {
    width: (85 / 100) * Dimensions.get("screen").width,
    backgroundColor: "#6D6D6D",
    padding: 40,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
