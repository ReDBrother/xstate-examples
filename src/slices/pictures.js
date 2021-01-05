import { createSlice } from "@reduxjs/toolkit"
import { actions as downloadActions } from "./download"

const initialState = {
  list: [],
}

const pictures = createSlice({
  name: "pictures",
  initialState,
  reducers: {
    resetPictures: state => {
      state.list = []
    },
  },
  extraReducers: {
    [downloadActions.handleSuccess]: (state, { payload }) => {
      state.list = [...state.list, payload]
    },
  },
})

const { actions, reducer } = pictures

export { actions }

export default reducer
