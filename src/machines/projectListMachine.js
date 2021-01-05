import { Machine } from "xstate"

export default Machine({
  id: "list",
  initial: "idle",
  states: {
    idle: {
      on: {
        HOVER_TOGGLE: { target: "hovered" },
      },
    },
    hovered: {
      on: {
        SELECT: "selected",
        HOVER_TOGGLE: "idle",
      },
    },
    selected: {
      on: {
        BACK: "idle",
      },
    },
  },
})
