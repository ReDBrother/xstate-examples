import React, { useEffect, useContext } from "react"
import { useMachine } from "@xstate/react"

import useHover from "../hooks/useHover"
import machine from "../machines/projectListMachine"

const simpleExamples = {
  id: "examples",
  title: "Simple examples",
  description: "Learn some xstate tricks",
  href: "/examples",
}

const flashlights = {
  id: "flashlights",
  title: "flashlights component",
  description: "Learn connection react/xstate",
  href: "/flashlights",
}

const downloadManager = {
  id: "manager",
  title: "download manager component",
  description: "Learn connection redux/xstate",
  href: "/manager",
}

const MachineContext = React.createContext()

const Card = ({
  cardClassName,
  cardRef,
  info: { title, description, href },
}) => {
  return (
    <div className="col">
      <div className={cardClassName} ref={cardRef}>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
        </div>
        <div className="card-footer">
          <a className="btn btn-primary stretched-link" href={href}>
            Show
          </a>
        </div>
      </div>
    </div>
  )
}

const ProjectCard = ({ info }) => {
  const [ref, isHover] = useHover()
  const [current, send] = useContext(MachineContext)

  useEffect(() => {
    send({ type: "HOVER_TOGGLE" })
  }, [isHover, ref.current, send])

  if (isHover && current.matches(`hovered`)) {
    return (
      <Card
        info={info}
        cardRef={ref}
        cardClassName="card border-primary visible h-100"
      />
    )
  } else if (current.matches(`hovered`)) {
    return (
      <Card info={info} cardRef={ref} cardClassName="card invisible h-100" />
    )
  }

  return <Card info={info} cardRef={ref} cardClassName="card visible h-100" />
}

export default () => {
  const service = useMachine(machine, { devTools: true })

  return (
    <MachineContext.Provider value={service}>
      <div className="container">
        <h1 className="text-center">{service[0].value}</h1>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          <ProjectCard info={simpleExamples} />
          <ProjectCard info={flashlights} />
          <ProjectCard info={downloadManager} />
        </div>
      </div>
    </MachineContext.Provider>
  )
}
