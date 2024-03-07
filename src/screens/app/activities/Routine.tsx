import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Image,
  ScrollView,
  Platform,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  Linking,
} from "react-native";
// import { SafeAreaView } from 'react-native-safe-area-context'
import { FAB, DefaultTheme } from "react-native-paper";
import { Portal } from "react-native-paper";
import * as Notifications from "expo-notifications";

import {
  Text,
  OneRoutine,
  Navbar,
  Spacer,
  Banner,
  PremiumModal,
  Modal as CustomModal,
  SafeAreaView,
  Button,
} from "../../../components";
import { allRoutines, changeStatus, subscribeToNotification } from "../../../api";
import { useApi } from "../../../hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken } from "../../../utility";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3498db",
    accent: "#75E264",
  },
};

export const Routine = (props) => {
  const routineApi = useApi(allRoutines, true);
  const statusApi = useApi(changeStatus);
  const refRBSheetPremium = React.useRef();
  const [showIntroPopup, setShowIntroPopup] = React.useState(false);
  const [showRatingPopup, setShowRatingPopup] = React.useState(false);
  const [introImage, setIntroImage] = React.useState(require("../../../../assets/intro_1.png"));
  const [introImageNumber, setIntroImageNumber] = React.useState(1);
  const [permission, setPermission] = React.useState<any>("");
  const notificationApi = useApi(subscribeToNotification);

  React.useEffect(() => {
    routineApi.request();
    /* async function printToken() {
      console.log("printToken", await getToken())
    }
    printToken() */
    async function checkToShowIntroPopup() {
      try {
        const SHOW_INTRO = await AsyncStorage.getItem("SHOW_INTRO");
        console.log("SHOW_INTRO", SHOW_INTRO);
        if (SHOW_INTRO != undefined || SHOW_INTRO == "false") {
        } else {
          AsyncStorage.setItem("SHOW_INTRO", "true");
          setShowIntroPopup(true);
        }
      } catch (err) {}
    }
    checkToShowIntroPopup();
    async function checkToShowRatingPopup() {
      try {
        const SHOW_RATING = await AsyncStorage.getItem("SHOW_RATING");
        console.log("SHOW_RATING ", SHOW_RATING + "  " + typeof SHOW_RATING);
        if (
          (SHOW_RATING != undefined || SHOW_RATING == null) &&
          SHOW_RATING != "1" &&
          SHOW_RATING != "2" &&
          SHOW_RATING != "3"
        ) {
          AsyncStorage.setItem("SHOW_RATING", "1");
        } else if (SHOW_RATING != undefined && SHOW_RATING == "1") {
          AsyncStorage.setItem("SHOW_RATING", "2");
        } else if (SHOW_RATING != undefined && SHOW_RATING == "2") {
          AsyncStorage.setItem("SHOW_RATING", "3");
          setShowRatingPopup(true);
        } else {
        }
      } catch (err) {}
    }

    checkToShowRatingPopup();

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

      let devicetoken = await Notifications.getDevicePushTokenAsync();
      console.log("Device token " + devicetoken, token);
    }

    checkNotificationPermission();
  }, []);

  const showModal = ({ ok }) => {
    if (!ok) refRBSheetPremium.current.open();
  };

  const reset = () => {
    routineApi.resetPagination();
  };

  const changeIntroImage = () => {
    let imageNumber = introImageNumber + 1;
    switch (imageNumber) {
      case 1:
        setIntroImage(require("./../../../../assets/intro_1.png"));
        break;
      case 2:
        setIntroImage(require("../../../../assets/intro_2.png"));
        break;
      case 3:
        setIntroImage(require("../../../../assets/intro_3.png"));
        break;
      case 4:
        setIntroImage(require("../../../../assets/intro_4.png"));
        break;
      case 5:
        setIntroImage(require("../../../../assets/intro_5.png"));
        break;
      case 6:
        setIntroImage(require("../../../../assets/intro_5.png"));
        setShowIntroPopup(false);
        break;
    }
    setIntroImageNumber(imageNumber);
  };

  const navigateToRating = () => {
    const url =
      Platform.OS === "android"
        ? "https://play.google.com/store/apps/details?id=app.myndfulness"
        : "https://apps.apple.com/us/app/myndfulness/id1579481834";
    Linking.openURL(url);
  };

  return (
    <SafeAreaView>
      <Navbar showLotus />
      <FlatList
        ListHeaderComponent={
          <Banner
            onPress={() => props.navigation.navigate("AchievementsNavigation")}
            background={require("../../../../assets/banner.png")}
            coins="100000"
            medals="500"
          />
        }
        ListHeaderComponentStyle={{ marginBottom: 16 }}
        refreshControl={
          <RefreshControl
            progressViewOffset={50}
            enabled
            refreshing={routineApi.loading}
            onRefresh={routineApi.resetPagination}
          />
        }
        onEndReachedThreshold={0.01}
        onEndReached={() => routineApi.request()}
        data={routineApi.data}
        renderItem={({ item }) => (
          <OneRoutine
            {...item}
            onStatusChange={() => statusApi.request(item.id).then(showModal)}
            onPress={() => {
              console.log(item);
              props.navigation.navigate("EditRoutine", item);
            }}
          />
        )}
        keyExtractor={(item, index) => `routine-item-${index}`}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 0,
          paddingVertical: 16,
          paddingBottom: 80,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ padding: 8 }} />}
        style={{ width: "100%" }}
      />
      <FAB style={styles.fab} icon="plus" onPress={() => props.navigation.navigate("HabitNavigation")} theme={theme} />
      <Portal>
        <CustomModal ref={refRBSheetPremium} size={90} noPadding onClose={reset}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: "space-between" }}>
            <PremiumModal
              navigation={props.navigation}
              onCancel={() => refRBSheetPremium.current.close()}
              onPurchase={() => refRBSheetPremium.current.close()}
            />
          </ScrollView>
        </CustomModal>
      </Portal>
      {showIntroPopup ? (
        <Portal>
          <View style={{ backgroundColor: "#6b6b6b", flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={showIntroPopup}
              onRequestClose={() => {
                setShowIntroPopup(false);
              }}
            >
              <TouchableWithoutFeedback style={{ backgroundColor: "#6b6b6b" }} onPress={() => changeIntroImage()}>
                <Image source={introImage} style={{ width: "100%", height: "100%", resizeMode: "contain" }} />
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        </Portal>
      ) : null}
      {showRatingPopup ? (
        <Portal>
          <View
            style={{
              backgroundColor: "#6b6b6b",
              opacity: 0.7,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Modal
              animationType="fade"
              transparent={true}
              visible={showRatingPopup}
              onRequestClose={() => {
                setShowRatingPopup(false);
              }}
            >
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <View
                  style={{
                    backgroundColor: "white",
                    width: "90%",
                    height: 500,
                    margin: "auto",
                    alignSelf: "center",
                    padding: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 2,
                  }}
                >
                  <Spacer size={16} />
                  <Image
                    source={require("../../../../assets/arc_text.png")}
                    style={{ width: "100%", height: undefined, aspectRatio: 534 / 308, alignSelf: "center" }}
                  />
                  <Spacer size={24} />
                  <Text
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      color: "#4D3877",
                    }}
                    font="Poppins_400Regular"
                    variant="primaryText"
                    size="body_two"
                  >
                    If you enjoy using Myndfulness, would you mind rating us on the App Store?
                  </Text>
                  <Spacer size={12} />
                  <Image
                    source={require("../../../../assets/star.png")}
                    style={{ width: "60%", height: undefined, aspectRatio: 273 / 49, alignSelf: "center" }}
                  />
                  <Spacer size={24} />
                  <Button
                    style={{
                      width: 170,
                      flexDirection: "row",
                      borderRadius: 10,
                      backgroundColor: "#5d76fa",
                      paddingVertical: 14,
                    }}
                    onPress={navigateToRating}
                  >
                    <Text variant="white" size="body_one" font="NotoSans_400Regular" style={{ color: "#e6d2c3" }}>
                      Rate us
                    </Text>
                  </Button>
                  <Spacer size={16} />
                  <Text
                    onPress={() => setShowRatingPopup(false)}
                    font="Poppins_400Regular"
                    variant="disabledText"
                    size="body_one"
                  >
                    No, thanks!
                  </Text>
                  <Spacer size={12} />
                </View>
              </View>
            </Modal>
          </View>
        </Portal>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    // backgroundColor: '#FFD000'
  },
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
