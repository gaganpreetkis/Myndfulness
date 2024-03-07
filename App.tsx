import "react-native-gesture-handler";
import { Provider as ReduxProvider, useDispatch, useSelector } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-native-paper";
import { useFonts } from "expo-font";
import * as GoogleSignIn from "expo-google-sign-in";
import { getToken } from "./src/utility";
import * as Notifications from "expo-notifications";
import * as Analytics from "expo-firebase-analytics";
import { Platform, View, Image, Dimensions, AppState } from "react-native";
import * as InAppPurchases from "expo-in-app-purchases";

import { rootNavigationRef, AppNavigation, AuthNavigation, OnboardingNavigation } from "./src/navigations";
import { useLaunches, useApi } from "./src/hooks";
import { OnboardingContext, UserContext, RoutineTypeContext, IAPContext } from "./src/context";
import { viewProfile, boot, subscribeToNotification, allTasks, submitReceipt } from "./src/api";
import store from "./src/store";
import { setUser } from "./src/store/features/userSlice";
import { fetchTotal } from "./src/store/features/taskSlice";
import { RootState } from "./src/store/rootReducer";
import { Spacer, Text } from "./src/components";
import { IAPStates } from "./src/config";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Analytics.setDebugModeEnabled(true)

const AppNavWrapper = (props) => {
  const dispatch = useDispatch();
  const taskState = useSelector((state: RootState) => state.task);
  const { user, refreshUser } = React.useContext(UserContext);
  const notificationApi = useApi(subscribeToNotification);
  const notificationListener = React.useRef();

  const pushNotification = async () => {
    try {
      let token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "26251baa-5c7f-43cf-ad0e-4c5a4bb03e9f",
          experienceId: "@balwindersingh_kis/Myndfulness",
        })
      ).data;
      if (token) {
        const response = await notificationApi.request({ expo_token: token });
        console.log(response.data, token);
        performAndroidOperation();
      }
    } catch (e) {
      // console.error(e)
    }
  };

  React.useEffect(() => {
    // dispatch(setUser(user?.user))
    if (user != undefined && user != null && user?.user) {
      dispatch(setUser(user?.user));
      dispatch(fetchTotal());
      if (user != undefined && user.user != undefined) {
        console.log(user.user, "user.user");
        if (user.user.id != undefined) {
          Analytics.setUserId(user?.user?.id + "");
        }
        Analytics.setUserProperties(user?.user);
      }
      pushNotification();
    }
  }, [user]);

  React.useEffect(() => {
    console.log("taskState.total", taskState.total);
    Notifications.setBadgeCountAsync(taskState.total);
  }, [taskState.total]);

  React.useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
      const response: any = await allTasks(1);
      Notifications.setBadgeCountAsync(response.data.total);
      console.log("Notification Event");
      dispatch(fetchTotal());
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  React.useEffect(() => {
    notificationListener.current = Notifications.addNotificationResponseReceivedListener(async (notification) => {
      const response: any = await allTasks(1);
      Notifications.setBadgeCountAsync(response.data.total);
      // dispatch(fetchTotal())
      if (notification.notification.request.content.subtitle?.toLowerCase().includes("did you")) {
        rootNavigationRef.current?.navigate("ActivityNavigation", { screen: "DailyReview" });
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

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

  const appState = React.useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = React.useState(appState.current);

  React.useEffect(() => {
    AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        console.log("appState changed");
        dispatch(fetchTotal());
        // refreshUser()
      }
      appState.current = nextAppState;
      // setAppStateVisible(appState.current);
    });
  }, []);

  // useInterval(async () => {
  //   console.log("use interval")
  //   dispatch(fetchTotal())
  // }, 5000)

  return <AppNavigation {...props} />;
};

export default function App() {
  const [user, setUser] = React.useState<any>(null);
  const { getLaunches, setLaunches } = useLaunches();
  const [onBoarding, setOnBoarding] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [complete, setComplete] = React.useState(false);
  const [showAnimation, setShowAnimation] = React.useState(false);
  const [routineTypes, setRoutineTypes] = React.useState({});
  const [loaded] = useFonts({
    "San Francisco": require("./assets/fonts/san_francisco.ttf"),
  });
  const routeNameRef = React.useRef();
  const [IAPState, setIAPState] = React.useState(IAPStates.LOADING);

  const profileApi = useApi(viewProfile);
  const receiptApi = useApi(submitReceipt);
  const bootApi = useApi(boot);
  const items = Platform.select({
    ios: ["mynd_1999_1m", "mynd_4999_3m", "mynd_7999_1y", "mynd_4799_1y"],
    android: ["mynd_1999_1m", "mynd_4999_3m", "mynd_7999_1y", "mynd_4799_1y"],
  });

  /* React.useEffect(() => {
    console.log("receiptApi.data ", receiptApi.data);
  }, [receiptApi.data]); */

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  function chunkString(text, len) {
    var chunks = [];
    var chunkSize = len;
    var str = text;

    while (str) {
      if (str.length < chunkSize) {
        chunks.push(str);
        break;
      } else {
        chunks.push(str.substr(0, chunkSize));
        str = str.substr(chunkSize);
      }
    }
    console.log(chunks);
  }

  const startUp = async () => {
    // alert(process.env.NODE_ENV)
    console.log("startUp ", process.env.NODE_ENV);
    if (Platform.OS === "android")
      await GoogleSignIn.initAsync({
        webClientId: "441874631846-om5idge4hnekm6s5dma8tnnhf757bvte.apps.googleusercontent.com",
      });
    const history = await InAppPurchases.connectAsync();
    console.log("history ", history);
    setIAPState(IAPStates.LOADING);
    const products = await InAppPurchases.getProductsAsync(items);
    console.log("Products: ", products.results);
    InAppPurchases.setPurchaseListener(async ({ responseCode, results, errorCode }) => {
      // Purchase was successful
      try {
        console.log("Response:", "inside setPurchaseListener");
        if (responseCode === InAppPurchases.IAPResponseCode.OK && results?.length > 0) {
          console.log("Response:", results);
          const purchaseTime = results?.map((it) => it.purchaseTime);
          console.log("purchaseTime ", purchaseTime);
          results.forEach(async (purchase) => {
            if (!purchase.acknowledged) {
              // console.log('Purchase: purchaseTime', purchase.purchaseTime)
              // chunkString(purchase.transactionReceipt, 1000)
              // console.log(result)
              // console.log('Purchase: end')
              // console.log('Purchase: ', purchase.transactionReceipt.length);
              // console.log('Purchase: ', purchase.transactionReceipt)
              setIAPState(IAPStates.SUCCESS);
              console.log(`Successfully purchased ${purchase.productId}`);
              if (Platform.OS == "ios") {
                let receiptResponse = await receiptApi.request({
                  receipt_data: purchase.transactionReceipt,
                });
                console.log("receipt api", receiptResponse);
              } else {
                let receiptResponse = await receiptApi.request({
                  receipt_data: purchase,
                  purchaseToken: purchase.purchaseToken,
                  packageName: purchase.packageName,
                  productId: purchase.productId,
                });
                console.log("receipt api", receiptResponse);
              }
              InAppPurchases.finishTransactionAsync(purchase, false);
              await refreshUser();
            } else {
              alert("Purchase already acknowledged");
            }
          });
        } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
          console.log("User canceled the transaction");
          setIAPState(IAPStates.CANCELLED);
        } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
          console.log("User does not have permissions to buy but requested parental approval (iOS only)");
          setIAPState(IAPStates.CANCELLED);
        } else {
          console.warn(`Something went wrong with the purchase. Received errorCode ${errorCode}`);
          setIAPState(IAPStates.CANCELLED);
          alert("Something went wrong with the purchase.");
        }
      } catch (e) {
        console.log("Error purchse ", JSON.stringify(e));
        console.warn(`Something went wrong with the purchase. Received errorCode ${e}`);
        setIAPState(IAPStates.CANCELLED);
      }
    });
    setIAPState(IAPStates.READY);
    console.log("preventAutoHideAsync called");
    SplashScreen.preventAutoHideAsync();
    let launches = await getLaunches();
    if (!launches) setOnBoarding(true);
    await setLaunches(launches + 1);
    console.log("setLaunches called");
    const token = await getToken();
    const bootResponse = await bootApi.request();
    // console.log("boot api ", bootResponse)
    if (bootResponse.ok) {
      setRoutineTypes(bootResponse.data.routine_types);
    }
    if (token != undefined && token != null && token != "") {
      console.log("user ", user);
      const profile = await profileApi.request();
      setUser(profile.data);
    }
    finishUp();
  };

  const refreshUser = async () => {
    const profile = await profileApi.request();
    console.log("refreshUser", profile.data);
    // console.log('finishUp refreshUser --- ' + profile.status + " --- " + profile.originalError, " //// " + profile.problem)
    if (profile.status === 200) {
      setUser(profile.data);
    } else {
      setUser(undefined);
    }
  };

  const finishUp = async () => {
    console.log("finishUp setComplete");
    setReady(true);
    await SplashScreen.hideAsync();
    console.log("Finished");
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
      console.log("finishUp setComplete");
      setComplete(true);
    }, 2000);
  };
  const onLayoutRootView = React.useCallback(async () => {
    if (ready) {
      finishUp();
    } else {
      // SplashScreen.show();
      startUp();
    }
  }, [ready]);

  if (!ready) return <View style={{ flex: 1 }} onLayout={onLayoutRootView}></View>;
  // <AppLoading startAsync={startUp} onFinish={finishUp} onError={(err) => console.log(err)} />;

  if (ready && showAnimation) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        {/* <LottieView
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
          }}
          loop={false}
          onAnimationFinish={() => {
            setShowAnimation(false)
            setComplete(true)
          }}
          autoPlay
          source={require('./assets/lottie/logo.json')}
        /> */}
        <Image
          source={require("./assets/logo.gif")}
          style={{
            width: Dimensions.get("screen").width,
            height: undefined,
            aspectRatio: 1,
          }}
        />
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          <Text font="Poppins_400Regular" size="caption_one">
            Build Habits | Growth | Self Reflection
          </Text>
          <Spacer size={64} />
        </View>
      </View>
    );
  }

  if (onBoarding)
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <OnboardingContext.Provider value={{ onBoarding, setOnBoarding }}>
            <NavigationContainer ref={rootNavigationRef}>
              <OnboardingNavigation />
            </NavigationContainer>
          </OnboardingContext.Provider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );

  return !complete ? null : (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <SafeAreaProvider>
          {/* <ViewShot  options={{ format: 'jpg', quality: 0.8 }} ref={viewRef}> */}
          <RoutineTypeContext.Provider value={{ RoutineTypes: routineTypes }}>
            <UserContext.Provider value={{ user, setUser, refreshUser }}>
              <IAPContext.Provider value={{ IAPState, setIAPState, IAPStates }}>
                <Provider>
                  <NavigationContainer
                    ref={rootNavigationRef}
                    onReady={() => (routeNameRef.current = rootNavigationRef.current?.getCurrentRoute()?.name)}
                    onStateChange={async () => {
                      const previousRouteName = routeNameRef.current;
                      const currentRouteName = rootNavigationRef.current?.getCurrentRoute()?.name;

                      if (previousRouteName !== currentRouteName) {
                        // The line below uses the expo-firebase-analytics tracker
                        // https://docs.expo.io/versions/latest/sdk/firebase-analytics/
                        // Change this line to use another Mobile analytics SDK
                        // await Analytics.setCurrentScreen(currentRouteName);
                        await Analytics.logEvent("screen_view", { screen_name: currentRouteName });
                      }
                      // Save the current route name for later comparison
                      routeNameRef.current = currentRouteName;
                    }}
                  >
                    {user != undefined && user != null ? <AppNavWrapper /> : <AuthNavigation />}
                  </NavigationContainer>
                </Provider>
              </IAPContext.Provider>
            </UserContext.Provider>
          </RoutineTypeContext.Provider>
          {/* </ViewShot> */}
          <Toast />
        </SafeAreaProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}
