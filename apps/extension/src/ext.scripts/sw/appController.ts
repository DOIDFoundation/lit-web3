controller = new MetamaskController({
  infuraProjectId: process.env.INFURA_PROJECT_ID,
  // User confirmation callbacks:
  showUserConfirmation: triggerUi,
  openPopup,
  // initial state
  initState,
  // initial locale code
  initLangCode,
  // platform specific api
  platform,
  notificationManager,
  browser,
  getRequestAccountTabIds: () => {
    return requestAccountTabIds
  },
  getOpenMetamaskTabsIds: () => {
    return openMetamaskTabsIDs
  },
  localStore
})
