import React from 'react'
import { View, Image, Platform, ScrollView, Linking, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as InAppPurchases from 'expo-in-app-purchases'

import { Spacer, Text, Button } from '../../components'
import { UserContext, IAPContext } from '../../context'
import { viewProfile, submitReceipt } from '../../api'
import { useApi } from '../../hooks'

const items = Platform.select({
    android: ['mynd_4799_1y'],
    ios: ['mynd_4799_1y'],
})

export const FreeTrialSingle = (props) => {
    const navigateTo = props.navigation.navigate
    const { setUser } = React.useContext(UserContext)
    const viewProfileApi = useApi(viewProfile)
    const receiptApi = useApi(submitReceipt)
    const [loading_1, setLoading_1] = React.useState(false)
    const [item, setItem] = React.useState(null)
    const { IAPState, IAPStates, setIAPState } = React.useContext(IAPContext)

    React.useEffect(() => {
        console.log('IAPState ', IAPState)
        if (IAPState === IAPStates.SUCCESS) {
            changeLoadingState(item, false)
            setItem(null)
            setIAPState(IAPStates.READY)
        }
        if (IAPState === IAPStates.CANCELLED) {
            changeLoadingState(item, false)
            setItem(null)
            setIAPState(IAPStates.READY)
        }
        async function fetchProducts() {
            const products = await InAppPurchases.getProductsAsync(items)
            console.log("Products: ", products.results)
            setIAPState(IAPStates.READY)
        }
        if (IAPState === IAPStates.LOADING) {
            fetchProducts()
        }
    }, [IAPState])

    const purchaseItem = (productId) => {
        // setLoading(true)
        changeLoadingState(productId, true)
        InAppPurchases.purchaseItemAsync(productId)
        setItem(productId)
    }

    const changeLoadingState = (productId, state) => {
        switch (productId) {
            case 'mynd_4799_1y':
                setLoading_1(state)
                return
        }
    }

    const handlePress = async () => {
        const response = await viewProfileApi.request()
        setUser(response.data)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                    source={require('../../../assets/clouds_paywall.png')}
                    style={{ width: '100%', height: undefined, aspectRatio: 1080 / 434 }} />
                <Spacer size={16} />
                <View style={{ paddingHorizontal: 30, flex: 1 }}>
                    <Text
                        variant="primaryText"
                        font="Poppins_400Regular"
                        size="subtitle_one"
                        key="8"
                        style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center', alignContent: 'center', textAlign: 'center' }}
                    >
                        Improve Your{"\n"}Mental Wellness
                    </Text>
                    <Spacer size={24} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={require('../../../assets/square_check.png')}
                            style={{ width: 24, height: 24, aspectRatio: 1, overflow: 'hidden', marginRight: 10 }} />
                        <Text style={{ flex: 1 }} font="Poppins_400Regular" variant="primaryText" size="caption_sub">
                            Track your daily moods
                        </Text>
                    </View>
                    <Spacer size={12} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={require('../../../assets/square_check.png')}
                            style={{ width: 24, height: 24, aspectRatio: 1, overflow: 'hidden', marginRight: 10 }} />
                        <Text style={{ flex: 1 }} font="Poppins_400Regular" variant="primaryText" size="caption_sub">
                            Journal about your thoughts and feelings
                        </Text>
                    </View>
                    <Spacer size={12} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={require('../../../assets/square_check.png')}
                            style={{ width: 24, height: 24, aspectRatio: 1, overflow: 'hidden', marginRight: 10 }} />
                        <Text style={{ flex: 1 }} font="Poppins_400Regular" variant="primaryText" size="caption_sub">
                            Build better self-care habits
                        </Text>
                    </View>
                    <Spacer size={12} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={require('../../../assets/square_check.png')}
                            style={{ width: 24, height: 24, aspectRatio: 1, overflow: 'hidden', marginRight: 10 }} />
                        <Text style={{ flex: 1 }} font="Poppins_400Regular" variant="primaryText" size="caption_sub">
                            Self reflect with daily relfection questions
                        </Text>
                    </View>
                    <Spacer size={12} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={require('../../../assets/square_check.png')}
                            style={{ width: 24, height: 24, aspectRatio: 1, overflow: 'hidden', marginRight: 10 }} />
                        <Text style={{ flex: 1 }} font="Poppins_400Regular" variant="primaryText" size="caption_sub">
                            Stay accountable to your goals
                        </Text>
                    </View>
                    <Spacer size={32} />

                    <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: 260, height: 100, borderRadius: 10, /* backgroundColor: '#f8f8f8', */ borderStyle: 'dashed', borderWidth: 1, borderColor: '#A5A3AB' }}>
                        <Text font="Poppins_400Regular" variant="secondaryText" size="caption_two">
                            Welcome Offer
                        </Text>
                        <Spacer size={4} />
                        <Text font="Poppins_400Regular" variant="subText" size="caption_two">
                            Try 1 week free, then $47.99 USD/year
                        </Text>
                        {/* <Spacer size={12} />
                        <Text font="Poppins_400Regular" variant="disabledText" size="caption_two" style={{ alignContent: 'center', textAlign: 'center' }}>
                            Then $47.99 billed annually after 7 days free trial.{"\n"}Thats just $3.99 a month!
                        </Text> */}
                        <Spacer size={4} />
                        <Text font="Poppins_400Regular" variant="subText" size="caption_two">
                            No commitment. Cancel anytime.
                        </Text>
                    </View>
                    <Spacer size={24} />
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}
                    >
                        {IAPState === IAPStates.LOADING ? <ActivityIndicator size="large" /> :
                            <>
                                <Button
                                    variant="primary"
                                    style={{ width: '90%', paddingVertical: 16 }}
                                    onPress={() => purchaseItem('mynd_4799_1y')}
                                    disabled={item}
                                    loading={loading_1}
                                >
                                    <Text font="NotoSans_400Regular" variant="white" size="subtitle_two">
                                        Continue
                                    </Text>
                                </Button>
                                <Spacer size={12} />
                            </>}
                        <Text
                            onPress={handlePress}
                            font="Poppins_400Regular" variant="disabledText" size="caption_two" /* style={{ color: '#e7e8e9' }} */>
                            No Thanks, continue with free plan
                        </Text>
                        <Spacer size={32} />

                        <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
                            <Text
                                onPress={() => props.navigation.navigate('WebViewer', { title: 'Privacy Policy', url: 'https://www.myndfulness.app/privacy-policy' })}
                                font="NotoSans_400Regular"
                                size="caption_one"
                                variant="primaryText"
                            // style={{ textAlign: 'center', width: '100%' }}
                            >
                                Privacy Policy
                            </Text>
                            <Spacer size={4} />
                            <Text
                                font="NotoSans_400Regular"
                                size="caption_one"
                                variant="secondaryText"
                            >
                                and
                            </Text>
                            <Spacer size={4} />
                            <Text
                                onPress={() => props.navigation.navigate('WebViewer', { title: 'Terms of Service', url: 'https://www.myndfulness.app/terms-of-service' })}
                                font="NotoSans_400Regular"
                                size="caption_one"
                                variant="primaryText"
                            >
                                Terms of use
                            </Text>
                        </View>
                        <Spacer size={12} />
                    </View>
                    <Spacer size={32} />
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}
