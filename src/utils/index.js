import { managerActions as actions } from "../slices"
import axios from "axios"

export const downloadImage = info => dispatch => {
  dispatch(actions.startDownload(info))
  const targetId = Math.floor(Math.random() * Math.floor(10))

  const promise = axios
    .get(`/photos/${targetId}.jpeg`, {
      responseType: "arraybuffer",
    })
    .then(response => Buffer.from(response.data, "binary").toString("base64"))

  const sendAnswer = delay => {
    promise.then(data => {
      setTimeout(() => {
        dispatch(actions.decrement())
        dispatch(actions.handleSuccess({ id: info.id, data }))
      }, delay)
    })
  }

  if (info.behavior === "chuncked") {
    const parts = Math.floor(Math.random() * Math.floor(10))
    let progress = 0

    const interval = setInterval(() => {
      progress += parts

      if (progress > 100) {
        sendAnswer(0)
        clearInterval(interval)
      } else {
        dispatch(
          actions.updateDownloadProgress({
            id: info.id,
            loadedPercentage: progress,
          })
        )
      }
    }, 1000)

    return
  }

  sendAnswer(5000)
}
