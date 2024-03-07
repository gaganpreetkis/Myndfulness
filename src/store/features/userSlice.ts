import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit'
import { AppThunk } from '../index'
import * as Analytics from 'expo-firebase-analytics';

import { viewProfile } from '../../api'

type StateType = {
  id: number
  name: string,
  email: string,
  is_onboard_completed: number,
  habit_medals: number,
  habit_coins: number,
  self_assessment_medals: number,
  self_assessment_coins: number,
  daily_journal_medals: number,
  daily_journal_coins: number,
  total_medals: number,
  total_coins: number,
  loading: boolean
}

let initialState: StateType = {
  id: 0,
  name: '',
  email: '',
  is_onboard_completed: 1,
  habit_medals: 0,
  habit_coins: 0,
  daily_journal_coins: 0,
  daily_journal_medals: 0,
  self_assessment_coins: 0,
  self_assessment_medals: 0,
  total_coins: 0,
  total_medals: 0,
  loading: false
}

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<StateType>) {
      const { daily_journal_coins, daily_journal_medals, email, habit_coins, habit_medals, id, is_onboard_completed, name, self_assessment_coins, self_assessment_medals, total_coins, total_medals } = action.payload
      state.daily_journal_coins = daily_journal_coins
      state.daily_journal_medals = daily_journal_medals
      state.email = email
      state.habit_coins = habit_coins
      state.habit_medals = habit_medals
      state.id = id
      state.is_onboard_completed = is_onboard_completed
      state.name = name
      state.self_assessment_coins = self_assessment_coins
      state.self_assessment_medals = self_assessment_medals
      state.total_coins = total_coins
      state.total_medals = total_medals
      state.loading = false
    },
    setLoading(state) {
      state.loading = true
    }
  }
})

export const { setUser, setLoading } = user.actions

export const syncUser = (routineName = ""): AppThunk => async (
  dispatch,
  getState
) => {
  dispatch(setLoading())
  const response: any = await viewProfile()
  dispatch(setUser(response.data?.user))
  Analytics.logEvent("post_score", { score: response.data?.user?.habit_coins, level: response.data?.user?.habit_medals, character: routineName })
  Analytics.logEvent("level_up", { level: response.data?.user?.habit_medals, character: routineName })
}

export default user.reducer