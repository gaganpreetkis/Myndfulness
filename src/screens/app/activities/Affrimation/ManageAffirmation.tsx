import React, { useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { myAffirmations, deleteAffirmation, fetchFavoriteAffirmations } from "../../../../api/";
import { BasicCard, Navbar, SafeAreaView, Spacer, Text } from "../../../../components";
import { UserContext } from "../../../../context";
import { useApi } from "../../../../hooks";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { colors } from "../../../../config";
import { Switch } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";

export const ManageAffirmation = (props) => {
  const params = props.route.params;
  const navigateTo = props.navigation.navigate;
  const myAffirmationsApi = useApi(myAffirmations);
  const deleteAffirmationApi = useApi(deleteAffirmation);
  const fetchFavoritesApi = useApi(fetchFavoriteAffirmations);
  const isFocused = useIsFocused();

  const { user } = React.useContext(UserContext);
  const [generalAffirmationSwitch, setGeneralAffirmationSwitch] = useState(false);
  const [dailyReminderSwitch, setDailyReminderSwitch] = useState(false);

  React.useEffect(() => {
    let data = new FormData();
    data.append("user_id", user?.user?.id);
    // data.append("user_id", "13009");

    console.log("data", data);
    myAffirmationsApi.request(data);
    fetchFavoritesApi.request(data);
  }, [isFocused]);

  React.useEffect(() => {
    console.log(JSON.stringify(myAffirmationsApi.data), myAffirmationsApi.error);
  }, [myAffirmationsApi.data, myAffirmationsApi.error]);

  React.useEffect(() => {
    console.log("fetchFavoritesApi" + JSON.stringify(fetchFavoritesApi.data), fetchFavoritesApi.error);
  }, [fetchFavoritesApi.data, fetchFavoritesApi.error]);

  React.useEffect(() => {
    console.log(JSON.stringify(deleteAffirmationApi.data), deleteAffirmationApi.error);
    if (deleteAffirmationApi.data != undefined && deleteAffirmationApi.data.status == "ok") {
      let data = new FormData();
      data.append("user_id", user?.user?.id);

      myAffirmationsApi.request(data);
    }
  }, [deleteAffirmationApi.data, deleteAffirmationApi.error]);

  const editAffirmation = (item) => {
    navigateTo("AddAffirmationExisting", {
      item: item,
      isUpdate: true,
    });
  };

  const deleteAffirmationFunction = async (item) => {
    let obj = new FormData();
    obj.append("aff_id", item.id);
    console.log("deleteAffirmation", obj);

    deleteAffirmationApi.request(obj);
  };

  const onToggleSwitchGeneral = () => {
    setGeneralAffirmationSwitch(!generalAffirmationSwitch);
  };

  const onToggleSwitchDailyReminder = () => {
    setDailyReminderSwitch(!dailyReminderSwitch);
  };

  return (
    <SafeAreaView>
      <Navbar showBack pageTitle="Manage Affirmations" />
      <View style={styles.container}>
        <BasicCard style={{ flex: 1, maxHeight: 150 }}>
          <View style={{ flexDirection: "row" }}>
            <Text variant="black" font="NotoSans_400Regular">
              Favorites
            </Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => navigateTo("FavoriteAffirmations")}>
              <Text variant="subText" font="NotoSans_400Regular">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {fetchFavoritesApi.data == null ||
          fetchFavoritesApi.data.data == null ||
          fetchFavoritesApi.data.data.length == 0 ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text
                style={{
                  textAlign: "center",
                  textAlignVertical: "center",
                }}
                size="caption_sub"
                font="Poppins_400Regular"
                variant="primaryText"
              >
                No Records
              </Text>
            </View>
          ) : (
            <FlatList
              data={fetchFavoritesApi.data.data}
              // horizontal
              // ItemSeparatorComponent={() => <View style={{ height: 15, width: 15 }} />}
              keyExtractor={(item, index) => `favorite-${index}`}
              renderItem={({ item, index }) => (
                <View
                  key={`favorite-${index}`}
                  style={{
                    padding: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={{ flex: 1 }} size="caption_sub" font="Poppins_400Regular" variant="primaryText">
                    {item.text}
                  </Text>
                </View>
              )}
              style={{ /* height: 110, */ width: "100%", marginTop: 14, flex: 1 }}
            />
          )}
        </BasicCard>

        <Spacer size={24} />

        <BasicCard>
          <Text variant="black" font="NotoSans_400Regular">
            Reminder
          </Text>

          <Spacer size={16} />

          <View style={{ flexDirection: "row" }}>
            <Text variant="black" font="NotoSans_400Regular">
              General Affirmations
            </Text>

            <View style={{ flex: 1 }} />

            <TouchableOpacity
              onPress={() => {
                navigateTo("AddAffirmationExisting", {
                  isGeneralReminder: true,
                });
              }}
            >
              <MaterialIcons name="edit" size={18} color={colors.subText} />
            </TouchableOpacity>
            <Spacer size={4} />
            <Text variant="black" font="NotoSans_400Regular" size="caption_one">
              9:00 AM
            </Text>
          </View>
          <Spacer size={4} />
          <View style={{ flexDirection: "row" }}>
            <Text size="caption_one" variant="black" font="NotoSans_400Regular">
              1X
            </Text>
            <Spacer size={8} />
            <Text size="caption_one" variant="subText" font="NotoSans_400Regular">
              Every day: Mon, Wed
            </Text>

            <View style={{ flex: 1 }} />

            <Switch value={generalAffirmationSwitch} onValueChange={onToggleSwitchGeneral} color="#8285EF" />
          </View>

          <Spacer size={24} />

          <View style={{ flexDirection: "row" }}>
            <Text variant="black" font="NotoSans_400Regular">
              Daily Writing Reminder
            </Text>

            <View style={{ flex: 1 }} />

            <MaterialIcons name="edit" size={18} color={colors.subText} />
            <Spacer size={4} />
            <Text variant="black" font="NotoSans_400Regular" size="caption_one">
              9:00 AM
            </Text>
          </View>
          <Spacer size={4} />
          <View style={{ flexDirection: "row" }}>
            <Text size="caption_one" variant="black" font="NotoSans_400Regular">
              1X
            </Text>
            <Spacer size={8} />
            <Text size="caption_one" variant="subText" font="NotoSans_400Regular">
              Every day
            </Text>
            <View style={{ flex: 1 }} />
            <Switch value={dailyReminderSwitch} onValueChange={onToggleSwitchDailyReminder} color="#8285EF" />
          </View>
          <Spacer size={12} />
        </BasicCard>

        <Spacer size={24} />

        <View style={styles.cardContainer}>
          <Text variant="black" font="NotoSans_400Regular">
            My Affirmations
          </Text>

          <Spacer size={16} />

          {myAffirmationsApi.data == null ||
          myAffirmationsApi.data.data == null ||
          myAffirmationsApi.data.data.length == 0 ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text
                style={{
                  textAlign: "center",
                  textAlignVertical: "center",
                }}
                size="caption_sub"
                font="Poppins_400Regular"
                variant="primaryText"
              >
                No Records
              </Text>
            </View>
          ) : (
            <FlatList
              data={myAffirmationsApi.data.data}
              keyExtractor={(item, index) => `my-affirmation-${index}`}
              renderItem={({ item, index }) => (
                <View style={{ flex: 1 }} key={`my-affirmation-${index}`}>
                  <Spacer size={16} />

                  <View style={{ flexDirection: "row" }}>
                    <Text variant="black" font="NotoSans_400Regular" style={{ flex: 1 }}>
                      {item.text}
                    </Text>

                    <Spacer size={12} />

                    {deleteAffirmationApi.loading ? (
                      <ActivityIndicator color={colors.primary} />
                    ) : (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity onPress={() => editAffirmation(item)}>
                          <MaterialIcons name="edit" size={18} color={colors.subText} />
                        </TouchableOpacity>
                        <Spacer size={4} />
                        <TouchableOpacity onPress={() => deleteAffirmationFunction(item)}>
                          <Feather name="trash-2" size={18} color={colors.subText} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 15, width: 15 }} />}
              style={{ width: "100%", flex: 1 }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    alignItems: "center",
    padding: 14,
  },
  cardContainer: {
    width: (95 / 100) * Dimensions.get("screen").width,
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 2,
    flex: 1,
  },
});
