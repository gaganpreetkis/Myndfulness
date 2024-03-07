import React from 'react'
import { Dimensions, ActivityIndicator } from 'react-native'
import { Navbar, SafeAreaView } from '../components'
import { WebView } from 'react-native-webview'

export const WebViewer = (props) => {
  const params = props.route.params
  const [loading, setLoading] = React.useState(true)

  const runFirst = `
      document.getElementsByClassName("navbarcontainer")[0].style.display="none";
      true; // note: this is required, or you'll sometimes get silent failures
    `;
  return <SafeAreaView style={{ flex: 1 }}>
    <Navbar pageTitle={params?.title} showBack hideBell />
    <WebView injectedJavaScript={runFirst} onMessage={(event) => { }} onLoad={() => setLoading(false)} source={{ uri: params?.url }} />
    {loading && <ActivityIndicator style={{ position: "absolute", top: Dimensions.get("screen").height / 2, left: Dimensions.get("screen").width / 2 }} />}
  </SafeAreaView>

}