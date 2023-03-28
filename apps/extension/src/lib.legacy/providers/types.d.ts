declare interface SentWarningsState {
  // methods
  enable: boolean
  experimentalMethods: boolean
  send: boolean
  // events
  events: {
    close: boolean
    data: boolean
    networkChanged: boolean
    notification: boolean
  }
}

declare interface SentWarningsState {
  // methods
  enable: boolean
  experimentalMethods: boolean
  send: boolean
  // events
  events: {
    close: boolean
    data: boolean
    networkChanged: boolean
    notification: boolean
  }
}
declare type WarningEventName = keyof SentWarningsState['events']
