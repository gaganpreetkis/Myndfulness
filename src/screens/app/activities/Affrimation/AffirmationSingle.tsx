import React, { useRef } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useApi } from "../../../../hooks";
import { allAffirmations, markFavoriteAffirmation, markUnFavoriteAffirmation } from "../../../../api";
import { Text } from "../../../../components/Text";
import { Spacer, PremiumModal, Modal, Navbar, SafeAreaView } from "../../../../components";
import { FAB, DefaultTheme } from "react-native-paper";
import Share from "react-native-share";
import ViewShot from "react-native-view-shot";
import { BottomSheet } from "react-native-btr";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../../../config";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { Portal } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken } from "../../../../utility";
import { UserContext } from "../../../../context";
import * as SMS from "expo-sms";
import { RefreshControl } from "react-native";
import { IMAGE_PATH } from "../../../../config/endpoint";

export const AffirmationSingle = (props) => {
  const params: any = props.route.params;
  const affirmationApi = useApi(allAffirmations, true);
  const markFavoriteApi = useApi(markFavoriteAffirmation);
  const markUnFavoriteApi = useApi(markUnFavoriteAffirmation);

  const [visibleIndex, setVisibleIndex] = React.useState(0);
  const [visibleItem, setVisibleItem] = React.useState({});
  const [shareOptionsVisible, setShareOptionVisible] = React.useState(false);
  const [isMarkedFavorite, setMarkedFavorite] = React.useState(false);
  const [affirmationData, setAffirmationData] = React.useState([]);
  const isFocused = useIsFocused();
  const [flatlistHeight, setFlatslistHeight] = React.useState(
    Dimensions.get("screen").height - (22 / 100) * Dimensions.get("screen").height
  );
  const [selectedTheme, setSelectedTheme] = React.useState({
    id: 3,
    name: "Theme1",
    image: "habbits/93OsFcfZOHbITnTDrU95WzQtxp0TmCg4h67GP7qv.jpg",
    font_size: "24",
    font_color: "#a0aa18",
    font_style: "Helvetica",
  });

  const screenShowViewRef = useRef();
  const refRBSheetPremium = React.useRef();
  const { user } = React.useContext(UserContext);

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: "#3498db",
      accent: "#75E264",
    },
  };

  React.useEffect(() => {
    console.log("affirmationApi.data ", JSON.stringify(affirmationApi.data));
    setAffirmationData(affirmationApi.data);
  }, [affirmationApi.data]);

  React.useEffect(() => {
    console.log("markFavoriteApi.data ", JSON.stringify(markFavoriteApi.data));
  }, [markFavoriteApi.data]);

  React.useEffect(() => {
    // let data = new FormData();
    // data.append("user_id", user?.user?.id);
    // console.log(params, JSON.stringify(props));
    if (params != undefined && params.item != undefined) {
      setAffirmationData([params.item]);
    } else {
      affirmationApi.resetPagination();
    }

    async function getThemeFromStorage() {
      try {
        const SELECTED_THEME = await AsyncStorage.getItem("SELECTED_THEME");
        console.log("SELECTED_THEME", SELECTED_THEME);
        if (SELECTED_THEME != undefined && SELECTED_THEME != null && SELECTED_THEME != "") {
          setSelectedTheme(JSON.parse(SELECTED_THEME));
        }
      } catch (err) {}
    }
    getThemeFromStorage();
  }, [isFocused]);

  const alertToken = async () => {
    alert(await getToken());
  };

  const moreButton = () => {
    props.navigation.navigate("ManageAffirmation");
  };

  const themes = () => {
    props.navigation.navigate("AffirmationThemes");
  };

  const markFavorite = async () => {
    if (isMarkedFavorite) {
      markUnFavorite();
      return;
    }
    let data = new FormData();
    // data.append("affirmation_id", visibleItem.id);
    data.append("affirmation_id", visibleItem.id);
    // data.append("user_id", "13009");

    console.log("markFavoriteApi.request ", data);
    var response = await markFavoriteApi.request(data);
    console.log(response.data);
    if (response.ok) {
      let data = JSON.parse(JSON.stringify(affirmationData));

      data[visibleIndex].is_fav = 1;
      setAffirmationData(data);
      setMarkedFavorite(data[visibleIndex].is_fav == 1);
    }
  };

  const markUnFavorite = async () => {
    let data = new FormData();
    data.append("affirmation_id", visibleItem.id);
    // data.append("user_id", "13009");

    console.log("markUnFavoriteApi.request ", data);
    var response = await markUnFavoriteApi.request(data);

    console.log(response.data);
    if (response.ok) {
      let data = JSON.parse(JSON.stringify(affirmationData));
      data[visibleIndex].is_fav = 0;
      setAffirmationData(data);
      setMarkedFavorite(data[visibleIndex].is_fav == 1);
    }
  };

  const getShareAppPackageId = (shareVia) => {
    if (shareVia == Share.Social.INSTAGRAM || shareVia == Share.Social.INSTAGRAM_STORIES)
      return "com.instagram.android";
    if (shareVia == Share.Social.FACEBOOK || shareVia == Share.Social.FACEBOOK_STORIES) return "com.facebook.katana";
  };

  const shareNow = async (shareVia) => {
    // console.log("visibleItem " + JSON.stringify(visibleItem), visibleIndex);
    toggle();
    screenShowViewRef.current.capture().then((uri) => {
      // console.log("do something with ", uri);
      let base64url = "data:image/png;base64," + uri;
      let encodetitle = "https://myndfulness.app/&quote=" + encodeURIComponent(visibleItem.text);
      if (shareVia == Share.Social.INSTAGRAM) {
        Share.shareSingle({
          social: Share.Social.INSTAGRAM,
          url: base64url,
          type: "image/*",
        });
        return;
      } else if (shareVia == Share.Social.WHATSAPP) {
        setTimeout(() => {
          Share.shareSingle({
            title: visibleItem.text,
            message: `${visibleItem.text} Myndfulness`,
            url: "",
            social: Share.Social.WHATSAPP,
            // whatsAppNumber: "9199999999", // country code + phone number
            filename: "Myndfulness", // only for base64 file in Android
          });
        }, 500);
        return;
      }

      const shareImage = async (imageuri) => {
        try {
          // console.log("base64url ", base64url);
          let fileurl = `file://${imageuri}`;

          let encodetitle = "https://myndfulness.app/&quote=" + encodeURIComponent(visibleItem.text);

          let customOptions = {
            // method: Share.InstagramStories.SHARE_BACKGROUND_AND_STICKER_IMAGE,
            title: visibleItem.text,
            message: `${visibleItem.text} Myndfulness.app`,
            subject: "Myndfulness Affirmation",
            email: "",
            // url: uri,
            // url: "instagram://camera",
            url: shareVia == Share.Social.EMAIL ? "" : shareVia == Share.Social.WHATSAPP ? base64url : encodetitle,
            social: shareVia,
            backgroundBottomColor: "#ffffff",
            backgroundTopColor: "#6C7FE7",
            appId: "228924529594590",
            quote: visibleItem.text,
            contentDescription: "Facebook sharing is easy!",
            type: "url",
            // type: "image/*",
            // method: Share.InstagramStories.SHARE_BACKGROUND_IMAGE,
            // BackgroundImage:
            //   "https://uploads-ssl.webflow.com/6158087d93bb55ca8a9e4414/615b089e330f0c55756ca6d1_logo.png",
            // stickerImage: "https://uploads-ssl.webflow.com/6158087d93bb55ca8a9e4414/615b089e330f0c55756ca6d1_logo.png",
            stickerImage: base64url,
            // forceDialog: true,
            ...Platform.select({
              // Necessary due to bug in
              // node_modules/react-native-share/android/src/main/java/cl/json/social/SingleShareIntent.java
              android: {
                forceDialog: true,
              },
            }),
            // whatsAppNumber: "9199999999",
            // filename: file.pdf,
          };

          var shareNowLocal = true;
          if (Platform.OS == "android") {
            const packageName = getShareAppPackageId(shareVia);
            const { isInstalled } = await Share.isPackageInstalled(packageName);

            shareNowLocal = isInstalled;
            console.log("shareNowLocal", shareNowLocal);
          }

          try {
            if (shareNowLocal) {
              const shareResponse = await Share.shareSingle(customOptions);
              console.log("shareResponse", shareResponse);
            } else {
              alert("App not installed");
            }
          } catch (err) {
            console.log("error sharing", JSON.stringify(err));
          }
        } catch (err) {
          console.log("error", JSON.stringify(err));
        }
      };

      setTimeout(() => {
        shareImage(uri);
      }, 500);
    });
  };

  const showShareOption = () => {
    toggle();
  };

  // The name of the function must be onViewableItemsChanged.
  const onViewableItemsChanged = ({ viewableItems }) => {
    // console.log("onViewableItemsChanged", JSON.stringify(viewableItems));
    let lastVisibleObj = viewableItems.slice(-1);
    setVisibleIndex(lastVisibleObj[0].index);
    setVisibleItem(lastVisibleObj[0].item);

    let lastItem = lastVisibleObj[0].item;
    if (lastItem) {
      setMarkedFavorite(lastItem.is_fav == 1);
    }
  };
  const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged }]);

  function toggle() {
    setShareOptionVisible((shareOptionsVisible) => !shareOptionsVisible);
  }

  const hideWatermark = () => {
    toggle();
    setTimeout(() => {
      refRBSheetPremium.current.open();
    }, 500);
  };

  const saveImage = () => {
    toggle();
    screenShowViewRef.current.capture().then((uri) => {
      let base64url = "data:image/png;base64," + uri;
      CameraRoll.save(base64url, { type: "photo" });
      Toast.show({
        type: "info",
        text1: "Saved to Camera Roll",
        visibilityTime: 2000,
      });
    });
  };

  const copyToClipboard = () => {
    toggle();
    try {
      Clipboard.setString(visibleItem.text);
      Toast.show({
        type: "info",
        text1: "Copied to Clipboard",
        visibilityTime: 2000,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const shareMessage = async () => {
    toggle();
    try {
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        setTimeout(() => {
          SMS.sendSMSAsync("", visibleItem.text)
            .then((result) => {
              console.log(result);
            })
            .catch((error) => {
              console.log("error", error);
            });
        }, 500);
      } else {
        alert("There's no Message available on this device");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView>
      <Navbar showLotus />
      <View style={styles.container}>
        <ViewShot ref={screenShowViewRef} options={{ result: "base64" }} style={{ flex: 1 }}>
          <FlatList
            onLayout={({ nativeEvent }) => {
              const { x, y, width, height } = nativeEvent.layout;
              setFlatslistHeight(height);
            }}
            refreshControl={
              <RefreshControl
                progressViewOffset={50}
                enabled
                refreshing={affirmationApi.loading}
                onRefresh={affirmationApi.resetPagination}
              />
            }
            pagingEnabled
            data={affirmationData}
            style={{ width: "100%", height: "100%" }}
            keyExtractor={(item, index) => `affirmation-${index}`}
            showsVerticalScrollIndicator={false}
            // ItemSeparatorComponent={() => <View style={{ padding: 8 }} />}
            contentContainerStyle={{
              flexGrow: 1,
              // justifyContent: "center",
            }}
            viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
            renderItem={({ item, index }) => (
              <ImageBackground
                source={{ uri: `${IMAGE_PATH}${selectedTheme.image}` }}
                resizeMode="cover"
                style={[styles.backgroundimage, { height: flatlistHeight }]}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      marginHorizontal: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      color: selectedTheme.font_color,
                      fontSize: selectedTheme.font_size ? parseInt(selectedTheme.font_size) : 16,
                    }}
                    size="subtitle_one"
                    variant="primaryText"
                    font="NotoSans_400Regular"
                  >
                    {item.text}
                  </Text>
                  <Text font="NotoSans_400Regular" style={{ color: colors.disabled, marginTop: 10 }}>
                    myndfulness.app
                  </Text>
                </View>
              </ImageBackground>
            )}
          />
        </ViewShot>
        <View style={[styles.buttonContainer]}>
          <TouchableOpacity style={styles.roundButton} onPress={moreButton}>
            <Image
              source={require("../../../../../assets/icon_more.png")}
              style={{ width: "50%", height: "50%", resizeMode: "contain" }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton} onPress={themes}>
            <Image
              source={require("../../../../../assets/icon_themes.png")}
              style={{ width: "50%", height: "50%", resizeMode: "contain" }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roundButton, { backgroundColor: isMarkedFavorite ? "#6C7FE7" : "#9B9B9B" }]}
            onPress={markFavorite}
          >
            {markFavoriteApi.loading || markUnFavoriteApi.loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Image
                source={require("../../../../../assets/icon_heart.png")}
                style={{ width: "50%", height: "50%", resizeMode: "contain" }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton} onPress={showShareOption}>
            <Image
              source={require("../../../../../assets/icon_share.png")}
              style={{ width: "50%", height: "50%", resizeMode: "contain" }}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <FAB
            style={styles.fab}
            icon="plus"
            onPress={() => props.navigation.navigate("AffirmationNavigation")}
            theme={theme}
          />
        </View>
        <BottomSheet visible={shareOptionsVisible} onBackButtonPress={toggle} onBackdropPress={toggle}>
          <View style={{ padding: 16, backgroundColor: "#fff" }}>
            <TouchableOpacity onPress={toggle}>
              <AntDesign name="close" size={24} color="black" style={{ alignSelf: "flex-end" }} />
            </TouchableOpacity>
            <Spacer size={24} />
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity style={styles.shareIconContainer} onPress={() => shareNow(Share.Social.WHATSAPP)}>
                <Image
                  source={require("../../../../../assets/icon_whatsapp.jpg")}
                  style={{ width: 40, height: 40, aspectRatio: 1 }}
                />
                <Text size="caption_two" variant="subText" font="NotoSans_400Regular" style={{ textAlign: "center" }}>
                  WhatsApp
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareIconContainer} onPress={() => shareNow(Share.Social.EMAIL)}>
                <Image
                  source={require("../../../../../assets/icon_mail.jpg")}
                  style={{ width: 40, height: 40, aspectRatio: 1 }}
                />
                <Text size="caption_two" variant="subText" font="NotoSans_400Regular" style={{ textAlign: "center" }}>
                  Email
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareIconContainer} onPress={shareMessage}>
                <Image
                  source={require("../../../../../assets/icon_messages.jpg")}
                  style={{ width: 40, height: 40, aspectRatio: 1 }}
                />
                <Text size="caption_two" variant="subText" font="NotoSans_400Regular" style={{ textAlign: "center" }}>
                  Message
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shareIconContainer}
                onPress={() => shareNow(Share.Social.INSTAGRAM_STORIES)}
              >
                <Image
                  source={require("../../../../../assets/icon_instagram_story.jpg")}
                  style={{ width: 40, height: 40, aspectRatio: 1 }}
                />
                <Text size="caption_two" variant="subText" font="NotoSans_400Regular" style={{ textAlign: "center" }}>
                  Instagram Stories
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareIconContainer} onPress={() => shareNow(Share.Social.INSTAGRAM)}>
                <Image
                  source={require("../../../../../assets/icon_instagram.jpg")}
                  style={{ width: 40, height: 40, aspectRatio: 1 }}
                />
                <Text size="caption_two" variant="subText" font="NotoSans_400Regular" style={{ textAlign: "center" }}>
                  Instagram
                </Text>
              </TouchableOpacity>
            </View>
            <Spacer size={24} />
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.shareIconContainer}
                onPress={() => shareNow(Share.Social.FACEBOOK_STORIES)}
              >
                <Image
                  source={require("../../../../../assets/icon_facebook_story.jpg")}
                  style={{ width: 40, height: 40, aspectRatio: 1 }}
                />
                <Text size="caption_two" variant="subText" font="NotoSans_400Regular" style={{ textAlign: "center" }}>
                  Facebook Stories
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareIconContainer} onPress={() => shareNow(Share.Social.FACEBOOK)}>
                <Image
                  source={require("../../../../../assets/icon_facebook.jpg")}
                  style={{ width: 40, height: 40, aspectRatio: 1 }}
                />
                <Text size="caption_two" variant="subText" font="NotoSans_400Regular" style={{ textAlign: "center" }}>
                  Facebook
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareIconContainer} onPress={() => hideWatermark()}>
                <Image
                  source={require("../../../../../assets/icon_remove_watermark.png")}
                  style={{ width: 40, height: 40, aspectRatio: 1 }}
                />
                <Text size="caption_two" variant="subText" font="NotoSans_400Regular" style={{ textAlign: "center" }}>
                  Hide Watermark
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareIconContainer} onPress={() => saveImage()}>
                <Image
                  source={require("../../../../../assets/icon_save.jpg")}
                  style={{ width: 40, height: 40, aspectRatio: 1 }}
                />
                <Text size="caption_two" variant="subText" font="NotoSans_400Regular" style={{ textAlign: "center" }}>
                  Save Image
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareIconContainer} onPress={() => copyToClipboard()}>
                <Image
                  source={require("../../../../../assets/icon_copy.jpg")}
                  style={{ width: 40, height: 40, aspectRatio: 1 }}
                />
                <Text size="caption_two" variant="subText" font="NotoSans_400Regular" style={{ textAlign: "center" }}>
                  Copy
                </Text>
              </TouchableOpacity>
            </View>
            <Spacer size={24} />
          </View>
        </BottomSheet>
      </View>
      <Portal>
        <Modal ref={refRBSheetPremium} size={90} noPadding>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: "space-between" }}>
            <PremiumModal
              navigation={props.navigation}
              onCancel={() => refRBSheetPremium.current.close()}
              onPurchase={() => refRBSheetPremium.current.close()}
            />
          </ScrollView>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    position: "absolute",
    margin: 16,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  roundButton: {
    width: 40,
    height: 40,
    backgroundColor: "#9B9B9B",
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundimage: {
    width: "100%",
    justifyContent: "center",
    height: Dimensions.get("screen").height - (22 / 100) * Dimensions.get("screen").height,
  },
  shareIconContainer: {
    flex: 1,
    alignItems: "center",
  },
});
