import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit'
import { AppThunk } from '../index'

import { allTasks } from '../../api'

type StateType = {
  total: number
}

let initialState: StateType = {
  total: 0
}

const task = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTotal(state, action: PayloadAction<StateType>) {
      state.total = action.payload.total
    }
  }
})

export const { setTotal } = task.actions

export const fetchTotal = (): AppThunk => async (
  dispatch,
  getState
) => {
  const response: any = await allTasks(1)
  dispatch(setTotal(response.data))
}

export default task.reducer