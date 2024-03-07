import React from 'react'
import { View, ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Portal } from 'react-native-paper'
import moment from 'moment'

import { Text, Navbar, Button, Spacer, Banner, Modal, PremiumModal, } from '../../../components'
import { getSelfAssessmentQuestions } from '../../../api'
import { useApi } from '../../../hooks'
import { UserContext } from '../../../context'
import { colors } from '../../../config'

export const SelfAssessment = (props) => {
  const selfAssessmentApi = useApi(getSelfAssessmentQuestions)
  const navigateTo = props.navigation.navigate
  const refRBSheetPremium = React.useRef()
  const { user } = React.useContext(UserContext)

  React.useEffect(() => {
    selfAssessmentApi.request()
    console.log(user?.user?.active_plan)
  }, [])

  const continueHandler = async () => {
    if (
      user?.user?.active_plan?.is_self_assessment_limited &&
      user?.user?.active_plan?.self_assessment_limit === 0
    ) {
      refRBSheetPremium.current.open()
      return
    }

    // let present = moment()
    let planExpire = moment(user?.user?.active_plan?.end_date)
    if (planExpire.diff(moment(), "minute") < 0) {
      refRBSheetPremium.current.open()
      return
    }

    navigateTo('SelfAssessmentQuestions', {
      questions: selfAssessmentApi.data.data.pages,
      currentPage: 0,
      response: [],
      totalPage: selfAssessmentApi.data.data.total_page,
    })
  }

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'space-between' }}>
        <Navbar pageTitle="Myndfulness" showLotus />
        <Banner
          onPress={() => props.navigation.navigate('AchievementsNavigation')}
          background={require('../../../../assets/banner_self_assessment.png')}
          coins="100000"
          medals="500"
        />
        <Spacer size={12} />
        <View style={{ paddingHorizontal: 18, flex: 1 }}>
          <Text
            variant="primaryText"
            size="body_one"
            font="Poppins_400Regular"
            style={{ textAlign: 'center' }}
          >
            Date Yourself...
          </Text>
          <Spacer size={8} />
          <Text
            variant="primaryText"
            size="body_one"
            font="NotoSans_400Regular"
            style={{ backgroundColor: '#F5C70B', borderRadius: 5, paddingVertical: 8, textAlign: 'center', color: colors.primaryText, paddingHorizontal: 5, overflow: 'hidden' }}
          >
            {/* Daily self reflections and thoughtful journaling prompts to help you connect with yourself on a deeper level. */}
            Self Reflection is the school for wisdom, kudos to you for seeking making space for it. Understanding how your thoughts, feelings, and actions are connected is key to personal growth. You can continue with more self reflections now or come back later for more!
          </Text>
          <Text
            variant="disabledText"
            size="caption_sub"
            font="NotoSans_400Regular"
            style={{ textAlign: 'center', marginTop: 5 }}
          >
            This is a premium feature that costs less than a cup of coffee per month and is much better for your nerves!
          </Text>
          <Spacer size={16} />

          <Image source={require('../../../../assets/self_reflect_info.png')} style={{ width: '80%', height: undefined, aspectRatio: 2751 / 1540, alignSelf: 'center', marginTop: 20 }} />

          <Spacer size={64} />
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              variant="primary"
              style={{ width: '100%' }}
              onPress={continueHandler}
              loading={selfAssessmentApi.loading}
              disabled={selfAssessmentApi.loading}
            >
              <Text variant="white" size="body_one" font="NotoSans_400Regular">
                Let's Begin
              </Text>
            </Button>
          </View>
          <Spacer size={32} />
        </View>
        <Portal>
          <Modal ref={refRBSheetPremium} size={90} noPadding>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ justifyContent: 'space-between' }}
            >
              <PremiumModal
                navigation={props.navigation}
                onPurchase={() => refRBSheetPremium.current.close()}
                onCancel={() => refRBSheetPremium.current.close()}
              />
            </ScrollView>
          </Modal>
        </Portal>
      </ScrollView>
    </SafeAreaView>
  )
}
