export const NETWORK_EVENTS = {
    // Fired after the actively selected network is changed
    NETWORK_DID_CHANGE: 'networkDidChange',
    // Fired when the actively selected network *will* change
    NETWORK_WILL_CHANGE: 'networkWillChange',
    // Fired when Infura returns an error indicating no support
    INFURA_IS_BLOCKED: 'infuraIsBlocked',
    // Fired when not using an Infura network or when Infura returns no error, indicating support
    INFURA_IS_UNBLOCKED: 'infuraIsUnblocked',
  };