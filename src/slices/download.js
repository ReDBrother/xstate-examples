import { createSlice } from "@reduxjs/toolkit"
import _ from "lodash"

const initialState = {
  count: 0,
  progress: {},
  errors: [],
}

const download = createSlice({
  name: "progress",
  initialState,
  reducers: {
    startDownload: (state, { payload }) => {
      const { id, ...data } = payload
      state.count += 1
      state.progress = { ...state.progress, [id]: data }
    },
    updateDownloadProgress: (state, { payload }) => {
      const { id, ...data } = payload
      state.progress = _.update(state.progress, id, oldData => {
        return { ...oldData, ...data, status: "loading" }
      })
    },
    stopDownload: (state, { payload }) => {
      state.progress = _.omit(state.progress, payload.id)
      state.count -= 1
    },
    handleSuccess: (state, { payload }) => {
      state.progress = _.update(state.progress, payload.id, oldData => {
        return { ...oldData, status: "success" }
      })
    },
    decrement: state => {
      state.count -= 1
    },
    handleError: (state, { payload }) => {
      state.progress = _.update(state.progress, payload.id, oldData => {
        return { ...oldData, status: "failed" }
      })
      state.count -= 1
      state.errors = payload
    },
    clearError: state => {
      state.errors = []
    },
  },
})

const { actions, reducer } = download

export { actions }

export default reducer
