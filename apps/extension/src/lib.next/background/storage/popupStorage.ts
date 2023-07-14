// import { State, property, storage } from '@lit-app/state'

type OpenTabsIDs = {
  [key: number]: boolean
}
type PopupId = number | undefined

// class PopupStorage extends State {
//   @property({ value: Number }) currentPopupId!: PopupId
//   @property({ value: Boolean }) isOpen!: boolean
//   @property({ value: Object }) openTabsIDs!: OpenTabsIDs
//   @property({ value: Number }) _popupId!: PopupId
//   @property({ value: Boolean }) _popupAutomaticallyClosed!: boolean | undefined
// }

export const popupStorage = {
  previousTabId: 0,
  currentPopupId: undefined as PopupId,
  isOpen: false,
  uiIsTriggering: false,
  openTabsIDs: {} as OpenTabsIDs,
  _popupId: undefined as PopupId,
  _popupAutomaticallyClosed: undefined
}
