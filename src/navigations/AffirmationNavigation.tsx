import React, { useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView } from "react-native";

import { AddAffirmation, ListAffirmation } from "../screens";
import { Navbar, Button, Text } from "../components";
import { affirmationsCategories } from "../api";
import { useApi } from "../hooks";

const Tab = createMaterialTopTabNavigator();

function MyTabBar({ state, descriptors, navigation, position }) {
  return (
    <SafeAreaView style={{ backgroundColor: "#fff" }}>
      <Navbar showBack pageTitle="Affirmations" parentScreen="Affirmation" />
      <View style={{ flexDirection: "row" }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 12, paddingLeft: 24, paddingBottom: 8 }}
          style={{ flexDirection: "row" }}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            return (
              <Button
                variant={isFocused ? "activeTab" : "defaultTab"}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{ marginRight: 8 }}
                key={label}
              >
                <Text font="NotoSans_400Regular">{label}</Text>
              </Button>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export const AffirmationNavigation = ({ route = "Hey" }) => {
  const screens = [{ name: "Well being" }, { name: "Social" }, { name: "Uplift" }];
  const affirmationsApi = useApi(affirmationsCategories);

  const catNames: string[] = [];

  React.useEffect(() => {
    affirmationsApi.request();
    affirmationsApi.resetPagination();
  }, []);

  return (
    <Tab.Navigator initialRouteName="All Affirmations" tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen name="Add Affirmation" key="Add Affirmation" component={AddAffirmation} />
      <Tab.Screen name="All Affirmations" key="All Affirmations" component={ListAffirmation} />
      {affirmationsApi.data.data &&
        affirmationsApi.data?.data.map((screen) => (
          <Tab.Screen name={screen.name} key={screen.name} component={ListAffirmation} initialParams={screen} />
        ))}
    </Tab.Navigator>
  );
};
