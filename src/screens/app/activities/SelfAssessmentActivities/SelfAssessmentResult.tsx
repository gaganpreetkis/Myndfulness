import React from 'react'
import { Dimensions, FlatList, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux'
import LottieView from 'lottie-react-native';

import { Navbar, Text, BasicCard, Spacer, Button } from '../../../../components'
import { syncUser } from '../../../../store/features/userSlice'

export const SelfAssessmentResult = (props) => {
  const params = props.route.params
  const navigateTo = props.navigation.navigate
  const dispatch = useDispatch()
  const [explanation, setExplanation] = React.useState<any>([])

  const [data, setData] = React.useState([{
    text: "Self reflection is a humbling process that helps uncover why you think, say, and do certain things… Kudos to you for getting to know yourself better. Check back tomorrow for more!"
  }]);

  const reset = () => {
    dispatch(syncUser())
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'ActivityNavigation' }
        ],
      })
    );
  }

  /*  React.useEffect(() => {
     console.log(JSON.stringify(params.questions))
     const questions = params.questions.map(q => Object.values(q.question))
     questions.map(qs => {
       console.log(qs)
       qs.map(q => {
         console.log(q)
         if (q.explanation) {
           if (!explanation.length) {
             setExplanation([{ text: q.explanation }])
           } else setExplanation([...explanation, { text: q.explanation }])
         }
       })
     })
     // console.log(explanation)
   }, [params.question]) */

  return (
    <SafeAreaView style={{ backgroundColor: '#8FD3F4', flex: 1 }} >
      <LinearGradient
        colors={['#8FD3F4', '#84FAB0']}
        start={[1, 0]}
        end={[1, 1]}
        locations={[0, 1]}
        style={{ flex: 1 }}
      >
        <Navbar showBack pageTitle="Great job" />
        <LottieView
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute'
          }}
          loop={false}
          autoPlay
          source={require('../../../../../assets/lottie/feedback.json')}
          resizeMode="cover"
        />
        <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `assessment-result-item-${index}`}
          renderItem={({ item }) => <BasicCard style={{ width: (data.length === 1 ? 90 / 100 : 80 / 100) * Dimensions.get('screen').width, height: (40 / 100) * Dimensions.get('screen').height, paddingHorizontal: 24, paddingTop: 24 }}>
            <Text variant="primaryText" font="Poppins_400Regular" size="subtitle_two">{item.text}</Text>
          </BasicCard>}
          // ItemSeparatorComponent={() => <Spacer size={16} />}
          contentContainerStyle={{ flexGrow: 1, paddingTop: 24, paddingHorizontal: 18, alignItems: 'flex-start' }}
        />
        <View style={{ marginHorizontal: 18 }}>
          <Button variant="primary" onPress={reset}>
            <Text font="NotoSans_400Regular" variant="white" size="body_one">
              Back to Home
            </Text>
          </Button>
        </View>
        <Spacer size={24} />
      </LinearGradient>
    </SafeAreaView>
  )
}