import React from "react";
import { FlatList, ImageBackground, StyleSheet, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { fetchThemes, selectTheme } from "../../../../api";
import { Button, Navbar, SafeAreaView, Spacer, Text } from "../../../../components";
import { IMAGE_PATH } from "../../../../config/endpoint";
import { UserContext } from "../../../../context";
import { useApi } from "../../../../hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { colors } from "../../../../config";

export const AffirmationThemes = (props) => {
  const [data, setData] = React.useState([]);

  const fetchThemeseApi = useApi(fetchThemes);
  const saveThemeApi = useApi(selectTheme);
  const { user } = React.useContext(UserContext);
  const [selectedTheme, setSelectedTheme] = React.useState({});

  React.useEffect(() => {
    let formData = new FormData();
    formData.append("user_id", user?.user?.id);
    // formData.append("user_id", "13009");

    console.log("fetchThemeseApi.request", formData);
    fetchThemeseApi.request(formData);

    async function getThemeFromStorage() {
      try {
        const SELECTED_THEME = await AsyncStorage.getItem("SELECTED_THEME");
        console.log("SELECTED_THEME", SELECTED_THEME);
        if (SELECTED_THEME != undefined && SELECTED_THEME != null && SELECTED_THEME != "") {
          setSelectedTheme(SELECTED_THEME);
        }
      } catch (err) {}
    }
    getThemeFromStorage();
  }, []);

  React.useEffect(() => {
    console.log("fetchThemeseApi.data", JSON.stringify(fetchThemeseApi.data));
    if (fetchThemeseApi.data) {
      let arr = fetchThemeseApi.data.data;
      let selected_theme = fetchThemeseApi.data.selected_theme;

      if (arr != undefined && selected_theme != undefined && selected_theme.length > 0) {
        arr.forEach((it) => {
          it.selected = it.id == selected_theme[0].selected_theme;
        });
        setData(arr);
      } else {
        if (arr != null) {
          arr.forEach((it) => {
            it.selected = false;
          });
          setData(arr);
        }
      }
    }
  }, [fetchThemeseApi.data]);

  React.useEffect(() => {
    if (saveThemeApi.data) {
      console.log("saveThemeApi.data", JSON.stringify(saveThemeApi.data));
    }
  }, [saveThemeApi.data]);

  const saveThemeMethod = async () => {
    let list = data.filter((it) => it.selected == true);
    if (list.length > 0) {
      let item = list[0];

      let formData = new FormData();
      formData.append("theme_id", item.id);
      formData.append("user_id", user?.user?.id);

      const viewResponse = await saveThemeApi.request(formData);
      if (viewResponse.ok) {
        Toast.show({
          type: "info",
          text1: viewResponse.data?.message,
          visibilityTime: 2000,
        });
        // viewResponse.data?.message
      }

      AsyncStorage.setItem("SELECTED_THEME", JSON.stringify(list[0]));
    }
  };

  return (
    <SafeAreaView>
      <Navbar showBack pageTitle="Themes" />
      <View style={styles.container}>
        <FlatList
          data={data}
          numColumns={4}
          keyExtractor={(item, index) => `theme-${index}`}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                let arr = JSON.parse(JSON.stringify(data));
                arr.forEach((it) => (it.selected = false));
                arr[index].selected = true;
                setData(arr);
              }}
              key={index}
              style={[styles.cell, { borderColor: item.selected ? "#ff0000" : "#eee" }]}
            >
              <ImageBackground
                source={{
                  uri: item.image ? `${IMAGE_PATH}${item.image}` : "",
                }}
                resizeMode="cover"
                style={{ flex: 1, width: null, height: null, justifyContent: "center", alignItems: "center" }}
              >
                <Text
                  style={{
                    fontSize: item.font_size ? parseInt(item.font_size) : 16,
                    color: item.font_color ? item.font_color : "#000000",
                    fontFamily: item.fonts ? item.fonts : "Poppins_400Regular",
                  }}
                >
                  Myndfulness
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 15, width: 15 }} />}
          style={{ paddingStart: 15, width: "100%", flex: 1 }}
        />

        <View style={{ width: "100%", height: 40 }} />
        {saveThemeApi.loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <View style={{ flexDirection: "row" }}>
            <Button variant="primary" onPress={saveThemeMethod} style={{ height: 60 }}>
              <Text variant="white" font="NotoSans_400Regular">
                DONE
              </Text>
            </Button>
            <Spacer size={16} />
            <Button variant="basicSelected" onPress={saveThemeMethod} style={{ height: 60 }}>
              <Text variant="disabledText" font="NotoSans_400Regular">
                SET AS DEFAULT
              </Text>
            </Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  cell: {
    backgroundColor: "#eee",
    height: 120,
    flex: 1,
    marginRight: 15,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
