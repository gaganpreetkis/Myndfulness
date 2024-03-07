import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator, BottomTabBar } from "@react-navigation/bottom-tabs";
import { Platform, Image, Keyboard, Dimensions } from "react-native";
import { useRoute } from "@react-navigation/native";

import {
  WebViewer,
  YourJournalEntryDetail,
  JournalCompleted,
  JournalQuestions,
  SelfAssessmentQuestions,
  SelfAssessmentResult,
  DailyReview,
  Journal,
  EditRoutine,
  Profile,
  Review,
  Reward,
  Routine,
  SelfAssessment,
  EditProfile,
  ReachUs,
  YourJournalEntries,
  YourSubscription,
  FreeTrialSingle,
  AffirmationSingle,
  AffirmationThemes,
  ManageAffirmation,
  AddAffirmationExisting,
  FavoriteAffirmations,
} from "../screens";
import { colors } from "../config";

import { HabitNavigation } from "./HabitNavigation";
import { AchievementsNavigation } from "./AchievementNavigation";
import { AffirmationNavigation } from "./AffirmationNavigation";
// import { MotivationNavigation } from './MotivationNavigation'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CustomBottomTabBar = (props) => {
  const [visible, setVisible] = useState(true);
  const route = useRoute();

  useEffect(() => {
    let keyboardEventListeners;
    if (Platform.OS === "android") {
      keyboardEventListeners = [
        Keyboard.addListener("keyboardDidShow", () => setVisible(false)),
        Keyboard.addListener("keyboardDidHide", () => setVisible(true)),
      ];
    }
    return () => {
      if (Platform.OS === "android") {
        keyboardEventListeners && keyboardEventListeners.forEach((eventListener) => eventListener.remove());
      }
    };
  }, []);

  const render = () => {
    if (Platform.OS === "ios") {
      return <BottomTabBar {...props} />;
    }
    if (!visible) return null;
    return <BottomTabBar {...props} />;
  };

  return render();
};

const ActivityNavigation = ({ route = "JournalNavigation" }) => (
  <Tab.Navigator
    initialRouteName={route}
    tabBarOptions={{
      activeBackgroundColor: colors.secondary,
      activeTintColor: colors.primaryText,
      inactiveTintColor: colors.tertiaryText,
      allowFontScaling: true,
      tabStyle: {
        marginHorizontal: 8,
        paddingVertical: 4,
        height: (7 / 100) * Dimensions.get("screen").height,
      },
      labelStyle: {
        fontSize: 10,
        textTransform: "uppercase",
      },
      style: {
        height: (10 / 100) * Dimensions.get("screen").height,
        paddingTop: 8,
        paddingHorizontal: 10,
        paddingBottom: Platform.OS === "android" ? 16 : 24,
      },
    }}
    tabBar={(props) => <CustomBottomTabBar {...props} />}
  >
    <Tab.Screen
      name="JournalNavigation"
      component={JournalNavigation}
      options={{
        title: "Journal",
        tabBarIcon: ({ color, size, focused }) => (
          <Image
            source={require("../../assets/journal.png")}
            style={{ width: "30%", height: undefined, aspectRatio: 1, opacity: focused ? 1 : 0.4 }}
          />
        ),
      }}
    />
    <Tab.Screen
      name="RoutineHabitNavigation"
      component={RoutineHabitNavigation}
      options={{
        title: "Routine",
        tabBarIcon: ({ color, size, focused }) => (
          <Image
            source={require("../../assets/routine.png")}
            style={{ width: "30%", height: undefined, aspectRatio: 1, opacity: focused ? 1 : 0.4 }}
          />
        ),
      }}
    />
    <Tab.Screen
      name="SelfAssessmentNavigation"
      component={SelfAssessmentNavigation}
      options={{
        title: "Self Reflect",
        tabBarIcon: ({ color, size, focused }) => (
          <Image
            source={require("../../assets/assessment.png")}
            style={{ width: "30%", height: undefined, aspectRatio: 1, opacity: focused ? 1 : 0.4 }}
          />
        ),
      }}
    />
    <Tab.Screen
      name="AffirmationSingleNavigation"
      component={AffirmationSingleNavigation}
      options={{
        title: "Affirmations",
        tabBarIcon: ({ color, size, focused }) => (
          <Image
            source={require("../../assets/affirmations.png")}
            style={{ width: "15%", height: undefined, aspectRatio: 1, opacity: focused ? 1 : 0.4 }}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

export const AppNavigation = ({ route = "ActivityNavigation" }) => (
  <Stack.Navigator initialRouteName={route} screenOptions={{ headerShown: false }} headerMode="float">
    <Stack.Screen name="ActivityNavigation" component={ActivityNavigation} />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="Review" component={Review} />
    <Stack.Screen name="Reward" component={Reward} />
    <Stack.Screen name="DailyReview" component={DailyReview} />
    <Stack.Screen name="EditProfile" component={EditProfile} />
    <Stack.Screen name="YourJournalEntries" component={YourJournalEntries} />
    <Stack.Screen name="ReachUs" component={ReachUs} />
    <Stack.Screen name="WebViewer" component={WebViewer} />
    <Stack.Screen name="YourSubscription" component={YourSubscription} />
    <Stack.Screen name="AchievementsNavigation" component={AchievementsNavigation} />
    <Stack.Screen name="YourJournalEntryDetail" component={YourJournalEntryDetail} />
    <Stack.Screen name="JournalCompleted" component={JournalCompleted} />
    <Stack.Screen name="JournalQuestions" component={JournalQuestions} />
    <Stack.Screen name="EditRoutine" component={EditRoutine} />
    <Stack.Screen name="HabitNavigation" component={HabitNavigation} />
    <Stack.Screen name="AffirmationNavigation" component={AffirmationNavigation} />
    <Stack.Screen name="AffirmationThemes" component={AffirmationThemes} />
    <Stack.Screen name="ManageAffirmation" component={ManageAffirmation} />
    <Stack.Screen name="AddAffirmationExisting" component={AddAffirmationExisting} />
    <Stack.Screen name="FavoriteAffirmations" component={FavoriteAffirmations} />

    {/* <Stack.Screen name="FreeTrialSingle" component={FreeTrialSingle} /> */}
  </Stack.Navigator>
);

export const RoutineHabitNavigation = ({ route = "Routine" }) => (
  <Stack.Navigator initialRouteName={route} screenOptions={{ headerShown: false }} headerMode="float">
    <Stack.Screen name="Routine" component={Routine} />
  </Stack.Navigator>
);

export const AffirmationSingleNavigation = ({ route = "Affirmation" }) => (
  <Stack.Navigator initialRouteName={route} screenOptions={{ headerShown: false }} headerMode="float">
    <Stack.Screen name="Affirmation" component={AffirmationSingle} />
  </Stack.Navigator>
);

export const SelfAssessmentNavigation = ({ route = "Self Reflect" }) => (
  <Stack.Navigator initialRouteName={route} screenOptions={{ headerShown: false }} headerMode="float">
    <Stack.Screen name="Self Reflect" component={SelfAssessment} />
    <Stack.Screen name="SelfAssessmentQuestions" component={SelfAssessmentQuestions} />
    <Stack.Screen name="SelfAssessmentResult" component={SelfAssessmentResult} />
  </Stack.Navigator>
);

export const JournalNavigation = ({ route = "Journal" }) => (
  <Stack.Navigator initialRouteName={route} screenOptions={{ headerShown: false }} headerMode="float">
    <Stack.Screen name="Journal" component={Journal} />
  </Stack.Navigator>
);
