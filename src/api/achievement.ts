import { apiClient } from './client'

const endpoint = '/achievement'

export const allAchievements = () => apiClient.get(`${endpoint}`)