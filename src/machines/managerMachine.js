import { Machine } from "xstate"
import { actions } from "../slices/download"

const downloadState = {
  id: "download",
  initial: "available",
  states: {
    available: {
      on: {
        HOLD: {
          target: "disabled",
          cond: ctx => {
            return ctx.download.count === 3
          },
        },
      },
    },
    disabled: {
      on: {
        RELEASE: {
          target: "disabled",
        },
      },
    },
  },
}

export default Machine({
  id: "manager",
  initial: "idle",
  states: {
    idle: {
      on: {
        [actions.startDownload]: "download",
      },
    },
    download: {
      on: {
        [actions.startDownload]: { target: "download", actions: "HOLD" },
        [actions.decrement]: { target: "download", actions: "RELEASE" },
        [actions.handleSuccess]: {
          target: "success",
          cond: ctx => ctx.download.count === 0,
        },
      },
      ...downloadState,
    },
    success: {
      on: {
        [actions.startDownload]: "download",
      },
    },
    failure: {},
  },
})
