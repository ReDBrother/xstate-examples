import { Machine } from "xstate"
import _ from "lodash"
import { managerActions as actions } from "../slices"

export default Machine({
  id: "manager",
  initial: "idle",
  states: {
    idle: {
      on: {
        [actions.startDownload]: {
          target: "downloading",
        },
      },
    },
    downloading: {
      on: {
        [actions.startDownload]: {
          target: "downloading",
        },
        [actions.handleError]: {
          target: "failure",
        },
        [actions.handleSuccess]: {
          target: "success",
          cond: ctx => ctx.download.count === 1,
        },
      },
    },
    success: {
      on: {
        [actions.startDownload]: {
          target: "downloading",
        },
      },
    },
    failure: {
      on: {
        [actions.clearError]: {
          target: "idle",
        },
      },
    },
  },
})
