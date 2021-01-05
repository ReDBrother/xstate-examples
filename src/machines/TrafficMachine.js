import { Machine } from "xstate"

export default () =>
  Machine({
    id: "traffic",
    initial: "idle",
    states: {
      idle: { entry: () => console.log("idle state establish") },
      loading: {},
      success: {},
      failure: {},
    },
  })
