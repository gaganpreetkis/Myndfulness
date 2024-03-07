import { apiClient } from './client'

const endpoint = '/boot'

export const boot = () => apiClient.get(`${endpoint}`)