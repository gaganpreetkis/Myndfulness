import { create } from 'apisauce'

import { getToken, removeToken, storeToken } from '../utility'
import { API } from '../config'

export const apiClient = create({
  baseURL: API,
})

export const registerClient = create({
  baseURL: API,
})

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await getToken()
  if (!authToken) {
    console.log('Token Not found', authToken)
    return
  }
  request.headers['Authorization'] = `Bearer ${authToken}`
})
