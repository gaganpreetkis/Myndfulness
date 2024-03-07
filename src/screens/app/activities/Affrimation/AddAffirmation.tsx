import React, { useState } from "react";
import { View, TouchableOpacity, Image, Dimensions, StyleSheet, FlatList } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { Portal } from "react-native-paper";

import { Text, Spacer, TextInput, Button, InputScreen, Modal } from "../../../../components";
import { affirmationsCategories, createRoutines, createAffirmation } from "../../../../api";
import { useApi } from "../../../../hooks";
import { RoutineTypeContext } from "../../../../context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { colors } from "../../../../config";

const validationSchema = () =>
  Yup.object().shape({
    starts_at: Yup.string().label("Time"),
  });

export const AddAffirmation = (props) => {
  const { data, loading, error, request } = useApi(createRoutines);
  const createAffirmationApi = useApi(createAffirmation);
  const { RoutineTypes } = React.useContext(RoutineTypeContext);
  const makeVisible = (fn) => () => fn(true);
  const makeInvisible = (fn) => () => fn(false);
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const refRBSheet = React.useRef();
  const affirmationsCategoriesApi = useApi(affirmationsCategories);

  const [update, setUpdate] = React.useState(0);
  const [success, setSuccess] = React.useState(false);
  const [selectedCategoryId, setselectedCategoryId] = React.useState("");
  const [reminderTime, setReminderTime] = useState("9:00:00");

  const [sun, setSun] = useState(false);
  const [mon, setMon] = useState(false);
  const [tue, setTue] = useState(false);
  const [wed, setWed] = useState(false);
  const [thu, setThu] = useState(false);
  const [fri, setFri] = useState(false);
  const [sat, setSat] = useState(false);

  React.useEffect(() => {
    // console.log(props.route.params);
    setUpdate(update + 1);
    setSuccess(false);
    affirmationsCategoriesApi.request();
  }, [props.route.params]);

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

  const reset = () => props.navigation.navigate("ManageAffirmation");

  const handleSubmit = async (values, actions) => {
    console.log("inside handleSubmit", values);
    actions.setStatus("");

    try {
      let obj = new FormData();
      obj.append("cat_id", selectedCategoryId);
      obj.append("affirmation_text", values["undefined"].text);
      obj.append("starts_at", moment(values["starts_at"]).format("HH:mm:ss"));
      getDaysForApi().length > 0 ? obj.append("repeats", getDaysForApi().join(",")) : null;

      console.log("obj api", obj);

      var response = await createAffirmationApi.request(obj);

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
            <Text style={{ color: "#000000", marginTop: -20, opacity: 0.5, alignSelf: "center" }}>WRITE YOUR OWN</Text>
            <Spacer size={16} />
            <TouchableOpacity onPress={() => refRBSheet.current.open()}>
              <Text
                style={{
                  height: 48,
                  borderRadius: 10,
                  borderColor: colors.tertiaryText,
                  borderWidth: 1,
                  width: (86 / 100) * Dimensions.get("screen").width,
                  color: values["category"] ? colors.black : colors.tertiaryText,
                  padding: 12,
                }}
              >
                {values["category"] ? values["category"] : "Category (optional)"}
              </Text>
            </TouchableOpacity>
            <Spacer size={24} />
            <TextInput
              name=""
              placeholder="Enter your affirmation here..."
              borderRadius={10}
              style={{ height: 60 }}
              multiline={true}
            />
            <Spacer size={48} />
            <Text style={styles.textStyle}>SET REMINDER</Text>
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
                    width: 40,
                    height: 40,
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
            <Spacer size={36} />
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
              <TouchableOpacity onPress={handleSubmit} style={{ alignSelf: "center" }}>
                <Text style={styles.buttonStyle}>DONE</Text>
              </TouchableOpacity>
            )}
            {success && (
              <TouchableOpacity onPress={reset} style={{ alignSelf: "center" }}>
                <Text style={[styles.buttonStyle, { width: 250 }]}>View Affirmations</Text>
              </TouchableOpacity>
            )}
            <Portal>
              <Modal ref={refRBSheet} size={90}>
                <FlatList
                  data={affirmationsCategoriesApi.data.data}
                  showsVerticalScrollIndicator={false}
                  // data={timezones}
                  renderItem={({ item }) => (
                    <Button
                      variant={values["category"] === item.name ? "activeTab" : "defaultTab"}
                      onPress={() => {
                        setFieldValue("category", item.name);
                        setselectedCategoryId(item.id);
                        refRBSheet.current.close();
                      }}
                      key={`${item.name}-category`}
                      style={{ flex: 1, marginVertical: 8 }}
                    >
                      <Text variant="primaryText" size="body_one" font="Poppins_400Regular">{`${item.name}`}</Text>
                    </Button>
                  )}
                />
              </Modal>
            </Portal>
          </>
        )}
      </Formik>
    </InputScreen>
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
    color: "#000000",
    opacity: 0.5,
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
    // backgroundColor: "#000000",
  },
  buttonContainer: {
    flexDirection: "row",
    position: "absolute",
    margin: 20,
    // bottom: -20,
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
});
