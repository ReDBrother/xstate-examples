import React from "react"
import _ from "lodash"
import { Provider, useDispatch, useSelector } from "react-redux"
import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { XstateRedux } from "xstate-redux"

import { managerReducers } from "../slices"
import { managerActions as actions } from "../slices"
import managerMachine from "../machines/managerMachine"
import { downloadImage } from "../utils"

const reduxManagerMachine = new XstateRedux(managerMachine)
const rootReducer = combineReducers({
  xstate: reduxManagerMachine.createReducer(),
  ...managerReducers,
})

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(reduxManagerMachine.createMiddleware()),
})

const Container = ({ children }) => (
  <div className="container">
    <div className="row">{children}</div>
  </div>
)

const PictureList = () => {
  const pictures = useSelector(state => state.pictures)

  const list = pictures.list.map(info => {
    const src = `data:image/jpeg;base64,${info.data}`

    return (
      <div className="col-md-7">
          <img className="img-fluid rounded mb-3 mb-md-0" alt="puppy" src={src} />
      </div>
    )
  })

  return <div className="row">{list}</div>
}

const Progress = ({ behavior, loadedPercentage, id }) => {
  if (behavior === "chuncked") {
    const style = {
      width: `${loadedPercentage}%`,
    }

    return (
      <div key={id} className="progress m-1">
        <div
        className="progress-bar progress-bar-striped bg-primary"
        style={style}
        role="progressbar"
        aria-label="progressbar"
        aria-valuenow={loadedPercentage}
        aria-valuemin="0"
        aria-valuemax="100"
        ></div>
      </div>
    )
  }

  return (
    <div key={id} className="progress m-1">
      <div
      className="w-100 progress-bar progress-bar-striped bg-warning"
      role="progressbar"
      aria-label="progressbar"
      aria-valuenow="100"
      aria-valuemin="0"
      aria-valuemax="100"
      ></div>
    </div>
  )
}

const ControlPanel = ({ id, status, children }) => {
  const dispatch = useDispatch()

  const stopDownload = () => {
    dispatch(actions.stopDownload({ id }))
  }

  return (
    <div className="coll">
      <button className="btn btn-primary mx-1" onClick={stopDownload}>
        Stop
      </button>
      <div className="btn btn-secondary mx-1">{status}</div>
      {children}
    </div>
  )
}

const ProgressList = () => {
  const progress = useSelector(state => state.download.progress)

  const list = Object.keys(progress).map(id => {
    const props = { id, ...progress[id] }

    return (
      <ControlPanel id={id} status={progress[id].status}>
        <Progress {...props} />
      </ControlPanel>
    )
  })

  return list
}

const DownloadPanel = () => {
  const dispatch = useDispatch()
  const current = useSelector(state => state.xstate) // download.disabled
  const stateTitle = `state: ${current}`
  const { count } = useSelector(state => state.download)

  const startDownload = event => {
    dispatch(
      downloadImage({
        id: count,
        behavior: "default",
        status: "loading",
      })
    )
  }

  const startChunckedDownload = event => {
    dispatch(
      downloadImage({
        id: count,
        behavior: "chuncked",
        loadedPercentage: 0,
        status: "loading",
      })
    )
  }

  console.log(current)
  const disabledButton = _.isEqual(current, { download: "disabled" })

  return (
    <>
      <div className="col-md-7">
        <ProgressList />
      </div>
      <div className="col-md-5">
        <h1>{stateTitle}</h1>
        <h3>Download Manager</h3>
        <p>Click start button, to downloads images</p>
        <button
          className="btn btn-primary mx-1"
          onClick={startDownload}
          disabled={disabledButton}
        >
          Start
        </button>
        <button
          className="btn btn-primary mx-1"
          onClick={startChunckedDownload}
          disabled={disabledButton}
        >
          Start with progress
        </button>
      </div>
    </>
  )
}

export default () => {
  return (
    <Provider store={store}>
      <Container>
        <DownloadPanel />
        <PictureList />
      </Container>
    </Provider>
  )
}
