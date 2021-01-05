import download, { actions as downloadActions } from "./download"
import pictures, { actions as picturesActions } from "./pictures"

export const managerActions = {
  ...downloadActions,
  ...picturesActions,
}

export const managerReducers = {
  download,
  pictures,
}
