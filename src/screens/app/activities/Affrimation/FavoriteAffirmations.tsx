import React from "react";
import { FlatList, View, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { useApi } from "../../../../hooks";
import { fetchFavoriteAffirmations, markUnFavoriteAffirmation } from "../../../../api/";
import { BasicCard, Navbar, OneAffirmation, SafeAreaView, Spacer, Text } from "../../../../components";
import { colors } from "../../../../config";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { UserContext } from "../../../../context";

export const FavoriteAffirmations = (props) => {
  const params = props.route.params;
  const navigateTo = props.navigation.navigate;
  const { user } = React.useContext(UserContext);
  const markUnFavoriteApi = useApi(markUnFavoriteAffirmation);
  const fetchFavoritesApi = useApi(fetchFavoriteAffirmations);
  const [favaffirmationData, setFavAffirmationData] = React.useState([]);

  React.useEffect(() => {
    let data = new FormData();
    data.append("user_id", user?.user?.id);
    fetchFavoritesApi.request(data);
  }, []);

  React.useEffect(() => {
    // console.log("fetchFavoritesApi.data", fetchFavoritesApi.data);
    setFavAffirmationData(fetchFavoritesApi.data.data);
  }, [fetchFavoritesApi.data]);

  const markUnFavorite = async (item) => {
    let data = new FormData();
    data.append("affirmation_id", item.id);

    console.log("markUnFavoriteApi.request ", data);
    var response = await markUnFavoriteApi.request(data);

    console.log(response.data);
    if (response.ok) {
      let data = JSON.parse(JSON.stringify(favaffirmationData));
      let arr = data.filter((it) => it.id != item.id);
      setFavAffirmationData(arr);
    }
  };

  const openDetailPage = (item) => {
    props.navigation.navigate("Affirmation", { screen: "Affirmation", item: item });
  };

  return (
    <SafeAreaView>
      <Navbar showBack pageTitle="Favorite Affirmations" />
      <View style={styles.container}>
        <FlatList
          data={favaffirmationData}
          keyExtractor={(item, index) => `Favorite-affirmation-${index}`}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                openDetailPage(item);
              }}
              style={{ flex: 1 }}
              key={`Favorite-affirmation-${index}`}
            >
              <Spacer size={16} />
              <BasicCard>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <Text variant="black" font="NotoSans_400Regular" style={{ flex: 1 }}>
                    {item.text}
                  </Text>

                  <Spacer size={12} />

                  {markUnFavoriteApi.loading ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        markUnFavorite(item);
                      }}
                    >
                      <Feather name="trash-2" size={20} color={colors.subText} />
                    </TouchableOpacity>
                  )}
                  <Spacer size={8} />
                </View>
              </BasicCard>
            </TouchableOpacity>
          )}
          style={{ /* height: 110, */ width: "100%", marginTop: 14, flex: 1 }}
        />
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
});
