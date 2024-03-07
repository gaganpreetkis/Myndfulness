import React, { useRef, useState } from "react";
import { Platform, ScrollView, View, Image, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text, Navbar, Button, Spacer, Banner } from "../../../components";
import { getJournalQuestions, getJournalSubmissions, subscribeToNotification } from "../../../api";
import { useApi } from "../../../hooks";
import * as Notifications from "expo-notifications";
import { Calendar, LocaleConfig } from "react-native-calendars";
import moment from "moment";
import { UserContext } from "../../../context";
import { DateData } from "react-native-calendars/src/types";
import { storeToken } from "../../../utility";

export const Journal = (props) => {
  const journalQuestionsApi = useApi(getJournalQuestions);
  const journalSubmissionsApi = useApi(getJournalSubmissions);
  const navigateTo = props.navigation.navigate;
  const [permission, setPermission] = useState<any>("");
  const notificationApi = useApi(subscribeToNotification);
  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));
  const { user } = React.useContext(UserContext);
  const [mark, setMark] = useState({});
  const [item, setItem] = useState({});

  var currentMonth: DateData;
  // Create ref for calendar
  const calendarRef = useRef();
  const [dayColor, SetDayColor] = useState({
    "Very Bad": "#FF595E",
    Bad: "#74B8FF",
    Okay: "#FFEA2B",
    Good: "#FFAE45",
    Great: "#FB8FFD",
    Excellent: "#9CD441",
  });

  LocaleConfig.locales["en"] = {
    monthNames: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul.", "Aug", "Sep", "Oct", "Nov", "Dec"],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["S", "M", "T", "W", "T", "F", "S"],
    today: "Today",
  };
  LocaleConfig.defaultLocale = "en";

  React.useEffect(() => {
    journalQuestionsApi.request();
    async function getJournalSubmissions() {
      const response = await journalSubmissionsApi.request();
      console.log(JSON.stringify(response.data));
      setupCalendarDates(response.data);
    }
    getJournalSubmissions();

    async function checkNotificationPermission() {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      console.log("existingStatus notification: ", existingStatus);
      if (existingStatus != "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        setPermission(status);
        console.log("Requesting: ", status);
      }
      let token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "26251baa-5c7f-43cf-ad0e-4c5a4bb03e9f",
          experienceId: "@balwindersingh_kis/Myndfulness",
        })
      ).data;
      const response = await notificationApi.request({ expo_token: token });
      console.log(response.data, token);
    }

    checkNotificationPermission();
  }, []);

  React.useEffect(() => {
    setupCalendarDates(journalSubmissionsApi.data);
  }, [journalSubmissionsApi.data]);

  React.useEffect(() => {
    console.log("journalQuestionsApi ", journalQuestionsApi.data);
  }, [journalQuestionsApi.data]);

  const setupCalendarDates = (response) => {
    // const response = journalSubmissionsApi.data
    // console.log(JSON.stringify(response.data[0].json_response))
    // console.log("setupCalendarDates", JSON.stringify(response))
    if (response != undefined && response.data != undefined) {
      for (let i = 0; i < response.data.length; i++) {
        // console.log(mark[moment(response.data[i].response_date).format('YYYY-MM-DD') + ''], "Exists")
        const jsonResponse = response.data[i].json_response;
        if (
          response.data[i].response_date != undefined &&
          !mark[moment(response.data[i].response_date).format("YYYY-MM-DD")]
        ) {
          for (let j = 0; j < jsonResponse.length; j++) {
            let obj = jsonResponse[j];
            if (obj["type"] && obj["type"] == "Rating Answer") {
              // console.log("Rating answer " + obj.answers.text)
              mark[moment(response.data[i].response_date).format("YYYY-MM-DD") + ""] = {
                selected: true,
                selectedColor: dayColor[obj.answers.text] + "",
              };
              item[moment(response.data[i].response_date).format("YYYY-MM-DD") + ""] = response.data[i];
              // console.log(moment(response.data[i].response_date).format('YYYY-MM-DD') + ' ---- ', dayColor[obj.answers.text])
            }
          }
        }
      }
    }
  };

  const continueHandler = async () => {
    console.log("continueHandler", journalQuestionsApi.data);
    if (journalQuestionsApi.data.total_page != 0) {
      navigateTo("JournalQuestions", {
        questions: journalQuestionsApi.data.data.pages,
        currentPage: 0,
        response: [],
        totalPage: journalQuestionsApi.data.data.total_page,
      });
    }
    // navigateTo('SelfAssessmentResult')
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }} edges={["right", "left", "top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: "space-between" }}
        refreshControl={
          <RefreshControl
            progressViewOffset={50}
            enabled
            refreshing={journalSubmissionsApi.loading}
            onRefresh={journalSubmissionsApi.resetPagination}
          />
        }
      >
        <Navbar pageTitle="Myndfulness" showLotus />
        <Banner
          onPress={() => props.navigation.navigate("AchievementsNavigation")}
          background={require("../../../../assets/banner_journal.png")}
          coins="100000"
          medals="500"
        />
        <View style={{ backgroundColor: "#eee", flex: 1, padding: 10 }}>
          <Text variant="primaryText" size="subtitle_two" font="Poppins_400Regular" style={{ alignSelf: "center" }}>
            Your Daily Mood Journal
          </Text>
        </View>
        <Spacer size={8} />
        <View style={{ paddingHorizontal: 18, flex: 1 }}>
          <Calendar
            ref={(ref) => calendarRef}
            // Initially visible month. Default = now
            current={currentDate}
            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            // minDate={currentDate}
            // Handler which gets executed on day press. Default = undefined
            onDayPress={(day) => {
              console.log("selected day", day);
              if (item[`${day.dateString}`] != undefined) {
                console.log(`date ${item[`${day.dateString}`]}`, JSON.stringify(item[`${day.dateString}`]));
                props.navigation.navigate("YourJournalEntryDetail", item[`${day.dateString}`]);
              }
            }}
            // Handler which gets executed on day long press. Default = undefined
            onDayLongPress={(day) => {
              console.log("selected day", day);
            }}
            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
            monthFormat={"MMMM yyyy"}
            // Handler which gets executed when visible month changes in calendar. Default = undefined
            onMonthChange={(month) => {
              console.log("month changed", month);
              currentMonth = month;
            }}
            // Hide month navigation arrows. Default = false
            hideArrows={false}
            // Do not show days of other months in month page. Default = false
            hideExtraDays={true}
            // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
            // day from another month that is visible in calendar page. Default = false
            disableMonthChange={true}
            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
            firstDay={1}
            // Hide day names. Default = false
            hideDayNames={false}
            // Disable left arrow. Default = false
            disableArrowLeft={false}
            // Disable right arrow. Default = false
            disableArrowRight={false}
            // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
            disableAllTouchEventsForDisabledDays={true}
            // Enable the option to swipe between months. Default = false
            enableSwipeMonths={true}
            markedDates={mark}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "black",
              textSectionTitleDisabledColor: "#d9e1e8",
              selectedDayBackgroundColor: "#00adf5",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#00adf5",
              dayTextColor: "black",
              textDisabledColor: "#d9e1e8",
              dotColor: "#00adf5",
              selectedDotColor: "#ffffff",
              arrowColor: "black",
              disabledArrowColor: "#d9e1e8",
              monthTextColor: "black",
              indicatorColor: "blue",
              textDayFontFamily: "NotoSans_400Regular" ? "NotoSans_400Regular" : "",
              textMonthFontFamily: "NotoSans_400Regular" ? "NotoSans_400Regular" : "",
              textDayHeaderFontFamily: "NotoSans_400Regular" ? "NotoSans_400Regular" : "",
              textDayFontWeight: "300",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "300",
              textDayFontSize: 16,
              textDayStyle: { marginBottom: Platform.OS == "ios" ? 2 : 2, marginTop: 4 },
              textMonthFontSize: 18,
              textDayHeaderFontSize: 16,
            }}
          />
          <Spacer size={24} />
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", marginHorizontal: 20 }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ backgroundColor: dayColor["Excellent"], height: 16, width: 16 }} />
              <Spacer size={4} />
              <Text variant="disabledText" size="overline" font="NotoSans_400Regular">
                feeling excellent
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ backgroundColor: dayColor["Great"], height: 16, width: 16 }} />
              <Spacer size={4} />
              <Text variant="disabledText" size="overline" font="NotoSans_400Regular">
                feeling great
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ backgroundColor: dayColor["Good"], height: 16, width: 16 }} />
              <Spacer size={4} />
              <Text variant="disabledText" size="overline" font="NotoSans_400Regular">
                feeling good
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginVertical: 15,
              justifyContent: "space-evenly",
              alignItems: "center",
              marginHorizontal: 20,
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ backgroundColor: dayColor["Okay"], height: 16, width: 16 }} />
              <Spacer size={4} />
              <Text variant="disabledText" size="overline" font="NotoSans_400Regular">
                feeling okay
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ backgroundColor: dayColor["Bad"], height: 16, width: 16 }} />
              <Spacer size={4} />
              <Text variant="disabledText" size="overline" font="NotoSans_400Regular">
                feeling bad
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ backgroundColor: dayColor["Very Bad"], height: 16, width: 16 }} />
              <Spacer size={4} />
              <Text variant="disabledText" size="overline" font="NotoSans_400Regular">
                feeling very bad
              </Text>
            </View>
          </View>
          <Spacer size={16} />
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="primary"
              style={{ width: "100%" }}
              onPress={continueHandler}
              loading={journalQuestionsApi.loading}
              disabled={journalQuestionsApi.loading}
            >
              <Text variant="white" size="body_one" font="NotoSans_400Regular">
                Start Today's Journal
              </Text>
            </Button>
          </View>
          <Spacer size={32} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
