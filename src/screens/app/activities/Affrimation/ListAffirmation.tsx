import React from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { OneAffirmation } from "../../../../components";
import { allAffirmations, affirmationByCategory } from "../../../../api";
import { useApi } from "../../../../hooks";

export const ListAffirmation = (props) => {
  const params = props.route.params;
  const navigateTo = props.navigation.navigate;
  const { data, error, loading, request } = useApi(allAffirmations);
  const affirmationByCategoryApi = useApi(affirmationByCategory);

  React.useEffect(() => {
    /* console.log("params ", props.route.params); */
    if (props.route.params?.id) {
      affirmationByCategoryApi.request(props.route.params.id);
    } else request();
  }, [props.route.params]);

  /*  React.useEffect(() => {
    console.log("data ", JSON.stringify(data));
  }, [data]); */

  /* React.useEffect(() => {
    console.log("affirmationByCategoryApi.data ", JSON.stringify(affirmationByCategoryApi.data));
  }, [affirmationByCategoryApi.data]); */

  return (
    <FlatList
      refreshControl={<RefreshControl progressViewOffset={50} enabled refreshing={loading} onRefresh={request} />}
      data={props.route.params?.id ? affirmationByCategoryApi.data?.data : data?.data}
      renderItem={({ item }) => (
        <OneAffirmation
          {...item}
          onPress={() => props.navigation.navigate("AddAffirmationExisting", { item: item })}
          hidePlusButton={false}
        />
      )}
      keyExtractor={(item, index) => `habit-item-${index}`}
      contentContainerStyle={{ flexGrow: 1, paddingVertical: 16, alignItems: "center" }}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ padding: 8 }} />}
      style={{ width: "100%" }}
    />
  );
};
