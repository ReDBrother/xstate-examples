import React from "react"
import { useMachine } from "@xstate/react"

import loadingMachine from "../machines/TrafficMachine"

const TrafficContext = React.createContext()

const Light = () => {
  return (
    <div className="trafficlight">
      <div className="protector"></div>
      <div className="protector"></div>
      <div className="protector"></div>
      <div className="red"></div>
      <div className="yellow"></div>
      <div className="green"></div>
    </div>
  )
}

export default () => {
  const service = useMachine(loadingMachine, { devTools: true })
  const contextValue = { ...service }

  return (
    <TrafficContext.Provider value={contextValue}>
      <Light />
    </TrafficContext.Provider>
  )
}
