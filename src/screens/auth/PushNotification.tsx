import React from "react";
import { View } from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import { Spacer, Text, Button } from "../../components";
import { subscribeToNotification } from "../../api";
import { useApi } from "../../hooks";
import { UserContext } from "../../context";
import { updateProfile, viewProfile } from "../../api";

export const PushNotification = (props) => {
  const navigateTo = props.navigation.navigate;
  const [permission, setPermission] = React.useState<any>("");
  const [token, setToken] = React.useState<any>();
  const notificationApi = useApi(subscribeToNotification);
  const [loading, setLoading] = React.useState(false);

  const { setUser } = React.useContext(UserContext);
  const viewProfileApi = useApi(viewProfile);

  React.useEffect(() => {
    Notifications.getPermissionsAsync().then(({ status: existingStatus }) => {
      setPermission(existingStatus);
      console.log("Init: ", existingStatus);
    });
  }, []);

  const requestPermission = async () => {
    setLoading(true);
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus != "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      setPermission(status);
      console.log("Requesting: ", status);
    }
    if (finalStatus !== "granted") {
      handlePress();
      return;
    }
    let token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "26251baa-5c7f-43cf-ad0e-4c5a4bb03e9f",
        experienceId: "@balwindersingh_kis/Myndfulness",
      })
    ).data;
    const response = await notificationApi.request({ expo_token: token });
    console.log(response.data, token);
    performAndroidOperation();
    handlePress();
  };

  const handlePress = async () => {
    const response = await viewProfileApi.request();
    // await setUser(response.data)
    navigateTo("FreeTrialSingle");
  };

  const performAndroidOperation = () => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        sound: "default",
        enableVibrate: true,
      });
    }
  };

  return (
    <SafeAreaView style={{ paddingHorizontal: 24, flex: 1, backgroundColor: "#fff" }}>
      <Spacer size={24} />
      <FontAwesome5 name="bell" size={54} color="#FFBC39" />
      <Spacer size={16} />
      <Text font="Poppins_400Regular" variant="primaryText" size="subtitle_one">
        Keep Yourself on track with small reminders
      </Text>
      <Spacer size={8} />
      <Text font="NotoSans_400Regular" variant="secondaryText" size="body_one">
        Life gets busy.{"\n"}
        We can help you stay accountable :)
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "flex-start",
        }}
      >
        <Button
          variant="primary"
          style={{ width: "100%", flexDirection: "row" }}
          onPress={requestPermission}
          loading={viewProfileApi.loading}
        >
          <Text variant="white" size="body_two" font="NotoSans_400Regular">
            Enable Push Notification
          </Text>
        </Button>
        <Spacer size={8} />
        <Button variant="secondary" style={{ width: "100%" }} onPress={() => navigateTo("FreeTrialSingle")}>
          <Text font="NotoSans_400Regular" variant="disabledText" size="body_one">
            No thanks
          </Text>
        </Button>
      </View>
      <Spacer size={24} />
    </SafeAreaView>
  );
};
