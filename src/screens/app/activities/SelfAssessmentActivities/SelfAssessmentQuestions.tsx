import React from 'react'
import { View, ScrollView } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { StackActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text, FromInputFactory, Spacer, Button, InputScreen, Navbar, Banner } from '../../../../components'
import { FormHelper } from '../../../../helpers'
import { useApi } from '../../../../hooks'
import { submitSelfAssessmentResponse } from '../../../../api'
import { colors } from '../../../../config'

export const SelfAssessmentQuestions = (props) => {
  const params = props.route.params
  const navigateTo = props.navigation.navigate
  const [questions, setQuestions] = React.useState<any>([])
  const [questionResponse, setQuestionResponse] = React.useState({})
  const [initFormData, setInitFormData] = React.useState({})
  const submitApi = useApi(submitSelfAssessmentResponse)
  // const [linkedQuestionId, setLinkedQuestionId] = React.useState<any>(null)

  React.useEffect(() => {
    let questionGroup = params.questions[params.currentPage]
    let firstQuestion = questionGroup.question[questionGroup.first_question_id]
    setQuestions([...questions, firstQuestion])
    setQuestionResponse({ ...questionResponse, [firstQuestion.id]: firstQuestion })
  }, [])

  React.useEffect(() => {
    if (questions.length) {
      setInitFormData(FormHelper.makeResponseObject(questions))
    }
  }, [questions])

  const _insertAtIndex = (arr, index, newItem) => [
    ...arr.slice(0, index),
    newItem,
    ...arr.slice(index)
  ];

  const makeQuestionBody = (question, id) => ({
    page: null,
    first_question_id: id,
    question: {
      [id]: question
    }
  })

  const extractLinkedQuestionFromGroup = (id) => {
    let questionGroup = params.questions[params.currentPage]
    return questionGroup.question[id]
  }

  const isValidateForm = (values, formikHelpers) => {
    let questionIds = Object.keys(values)
    let valid = true

    if (questionIds.length != questions.length) {
      console.log("questionIds: ", values)
      formikHelpers.setStatus('One or more questions are not answered.')
      formikHelpers.setSubmitting(false)
      return
    }
    console.log("Values: ", values)
    Object.values(values).map((ans) => {
      if (ans == null || ans == undefined) {
        formikHelpers.setStatus('One or more questions are not answered.')
        formikHelpers.setSubmitting(false)
        valid = false
      }
      if (ans && ans.hasOwnProperty('text') && ans['text'] === '' && ans['text'] === null) {
        formikHelpers.setStatus('One or more questions are not answered.')
        formikHelpers.setSubmitting(false)
        valid = false
      }
      if (Array.isArray(ans) && ans.length < 0) {
        formikHelpers.setStatus('One or more questions are not answered.')
        formikHelpers.setSubmitting(false)
        valid = false
      }
    })

    return valid
  }

  const _handleSubmit = (values, formikHelpers) => {
    let questionIds = Object.keys(values)
    let totalPage = params.totalPage
    let linkedQuestionId = null
    let transformedValues = {}
    formikHelpers.setStatus("")
    if (!isValidateForm(values, formikHelpers)) return
    console.log("valid form")
    Object.values(values).map(ans => {
      if (ans && typeof ans === 'object' && ans.hasOwnProperty('next_question_id') && ans['next_question_id']) {
        linkedQuestionId = ans['next_question_id']
      }
    })
    Object.keys(values).map(key => {
      let { next_question_id, ...rest } = values[key]
      transformedValues[key] = rest
    })
    let response = questionIds.map(id => {
      return ({ question_id: id, answers: transformedValues[id], type: questionResponse[id].type, question: questionResponse[id].question })
    })
    if (linkedQuestionId) totalPage += 1
    if (params.currentPage == totalPage - 1) {
      _submitResponse([...params.response, ...response], formikHelpers)
      return
    }
    formikHelpers.setStatus("")
    formikHelpers.setSubmitting(true)
    // console.log("Response: ", response, values)
    if (linkedQuestionId) {
      // console.log("Linked Question ", linkedQuestionId)
      let newQuestion = makeQuestionBody(extractLinkedQuestionFromGroup(linkedQuestionId), linkedQuestionId)
      let withLinkedQuestion = _insertAtIndex(params.questions, params.currentPage + 1, newQuestion)
      props.navigation.dispatch(StackActions.push('SelfAssessmentQuestions', { questions: withLinkedQuestion, currentPage: params.currentPage + 1, response: [...params.response, ...response], totalPage }));

    } else props.navigation.dispatch(StackActions.push('SelfAssessmentQuestions', { questions: params.questions, currentPage: params.currentPage + 1, response: [...params.response, ...response], totalPage: params.totalPage }));
  }

  const _submitResponse = async (data, formikHelpers) => {
    const response = await submitApi.request(data)
    // console.log("Result ", response.data)
    if (!response.ok) {
      formikHelpers.setStatus(response.data?.message ? response.data.message : "We encountered an error!")
      formikHelpers.setSubmitting(false)
      return
    }
    navigateTo("SelfAssessmentResult", { questions: params.questions })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Navbar showBack pageTitle="Self Reflect" />
      <InputScreen noSafeArea={true}>
        <Spacer size={16} />
        <View style={{ paddingHorizontal: 28, flex: 1, width: '100%' }}>
          <Formik
            initialValues={initFormData}
            onSubmit={_handleSubmit}
          // validationSchema={() => myValidationSchema}
          >
            {
              ({ handleSubmit, status }) => <>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  {params.questions.map((_, index) => <View style={{ width: '2%', marginLeft: 8, padding: 5, borderRadius: 20, backgroundColor: index == params.currentPage ? colors.primary : '#D3E2FD' }} />)}
                </View>
                <Spacer size={16} />
                {status != '' && status != undefined && <View style={{ width: '100%', paddingBottom: 8 }}>
                  <Text
                    size="caption_one"
                    variant="error"
                    font="Poppins_400Regular"
                  >{status}</Text>
                </View>}
                <Spacer size={48} />
                <FromInputFactory form={questions} showSubText={false} />
                <Spacer size={24} />
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                  <Button variant="primary" onPress={handleSubmit} style={{ width: '100%', flexDirection: 'row' }} loading={submitApi.loading}>
                    <Text variant="white" size="body_one" font="NotoSans_400Regular">Next</Text>
                    <Spacer size={8} />
                    <Ionicons name="ios-arrow-forward-sharp" size={20} color="#fff" />
                  </Button>
                </View>
              </>
            }
          </Formik>
          <Spacer size={24} />
        </View>
        {/* </View> */}
      </InputScreen>
    </SafeAreaView>
  )
}