declare type SnapSender = {
  snapId: string
}
declare interface Sender extends chrome.runtime.MessageSender, SnapSender {}
