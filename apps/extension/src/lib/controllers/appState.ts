import EventEmitter from 'events'
import { ObservableStore } from '@metamask/obs-store'
import { AUTO_LOCK_TIMEOUT_ALARM } from '~/constants/alarms'
import { ENVIRONMENT_TYPE_BACKGROUND, POLLING_TOKEN_ENVIRONMENT_TYPES } from '~/constants/app'

export const CONTROLLER_EVENTS = {
  // Fired after state changes that impact the extension badge (unapproved msg count)
  // The process of updating the badge happens in app/scripts/background.js.
  UPDATE_BADGE: 'updateBadge',
  // TODO: Add this and similar enums to the `controllers` repo and export them
  APPROVAL_STATE_CHANGE: 'ApprovalController:stateChange'
}

export default class AppStateController extends EventEmitter {
  onInactiveTimeout: any
  store: any
  timer: any
  isUnlocked: any
  waitingForUnlock: any
  _showUnlockRequest: any
  constructor(opts: Record<string, any> = {}) {
    const {
      addUnlockListener,
      isUnlocked,
      initState,
      onInactiveTimeout,
      showUnlockRequest,
      preferencesStore,
      qrHardwareStore
    } = opts
    super()

    this.onInactiveTimeout = onInactiveTimeout || (() => undefined)
    this.store = new ObservableStore({
      timeoutMinutes: 0,
      connectedStatusPopoverHasBeenShown: true,
      defaultHomeActiveTabName: null,
      browserEnvironment: {},
      popupGasPollTokens: [],
      notificationGasPollTokens: [],
      fullScreenGasPollTokens: [],
      recoveryPhraseReminderHasBeenShown: false,
      recoveryPhraseReminderLastShown: new Date().getTime(),
      outdatedBrowserWarningLastShown: new Date().getTime(),
      nftsDetectionNoticeDismissed: false,
      showTestnetMessageInDropdown: true,
      showBetaHeader: true,
      trezorModel: null,
      currentPopupId: undefined,
      ...initState,
      qrHardware: {},
      nftsDropdownState: {},
      usedNetworks: {
        '0x1': true,
        '0x5': true,
        '0x539': true
      }
    })
    this.timer = null

    this.isUnlocked = isUnlocked
    this.waitingForUnlock = []
    addUnlockListener(this.handleUnlock.bind(this))

    this._showUnlockRequest = showUnlockRequest

    preferencesStore.subscribe(({ preferences }) => {
      const currentState = this.store.getState()
      if (currentState.timeoutMinutes !== preferences.autoLockTimeLimit) {
        this._setInactiveTimeout(preferences.autoLockTimeLimit)
      }
    })

    // qrHardwareStore.subscribe((state) => {
    //   this.store.updateState({ qrHardware: state })
    // })

    const { preferences } = preferencesStore.getState()
    this._setInactiveTimeout(preferences.autoLockTimeLimit)
  }

  /**
   * Get a Promise that resolves when the extension is unlocked.
   * This Promise will never reject.
   *
   * @param {boolean} shouldShowUnlockRequest - Whether the extension notification
   * popup should be opened.
   * @returns {Promise<void>} A promise that resolves when the extension is
   * unlocked, or immediately if the extension is already unlocked.
   */
  getUnlockPromise(shouldShowUnlockRequest) {
    return new Promise((resolve) => {
      if (this.isUnlocked()) {
        resolve(true)
      } else {
        this.waitForUnlock(resolve, shouldShowUnlockRequest)
      }
    })
  }

  /**
   * Adds a Promise's resolve function to the waitingForUnlock queue.
   * Also opens the extension popup if specified.
   *
   * @param {Promise.resolve} resolve - A Promise's resolve function that will
   * be called when the extension is unlocked.
   * @param {boolean} shouldShowUnlockRequest - Whether the extension notification
   * popup should be opened.
   */
  waitForUnlock(resolve: Function, shouldShowUnlockRequest: boolean) {
    this.waitingForUnlock.push({ resolve })
    this.emit(CONTROLLER_EVENTS.UPDATE_BADGE)
    if (shouldShowUnlockRequest) {
      this._showUnlockRequest()
    }
  }

  /**
   * Drains the waitingForUnlock queue, resolving all the related Promises.
   */
  handleUnlock() {
    if (this.waitingForUnlock.length > 0) {
      while (this.waitingForUnlock.length > 0) {
        this.waitingForUnlock.shift().resolve(true)
      }
      this.emit(CONTROLLER_EVENTS.UPDATE_BADGE)
    }
  }

  /**
   * Sets the default home tab
   *
   * @param {string} [defaultHomeActiveTabName] - the tab name
   */
  setDefaultHomeActiveTabName(defaultHomeActiveTabName: string) {
    this.store.updateState({
      defaultHomeActiveTabName
    })
  }

  /**
   * Record that the user has seen the connected status info popover
   */
  setConnectedStatusPopoverHasBeenShown() {
    this.store.updateState({
      connectedStatusPopoverHasBeenShown: true
    })
  }

  /**
   * Record that the user has been shown the recovery phrase reminder.
   */
  setRecoveryPhraseReminderHasBeenShown() {
    this.store.updateState({
      recoveryPhraseReminderHasBeenShown: true
    })
  }

  /**
   * Record the timestamp of the last time the user has seen the recovery phrase reminder
   *
   * @param {number} lastShown - timestamp when user was last shown the reminder.
   */
  setRecoveryPhraseReminderLastShown(lastShown: number) {
    this.store.updateState({
      recoveryPhraseReminderLastShown: lastShown
    })
  }

  /**
   * Record the timestamp of the last time the user has seen the outdated browser warning
   *
   * @param {number} lastShown - Timestamp (in milliseconds) of when the user was last shown the warning.
   */
  setOutdatedBrowserWarningLastShown(lastShown: number) {
    this.store.updateState({
      outdatedBrowserWarningLastShown: lastShown
    })
  }

  /**
   * Sets the last active time to the current time.
   */
  setLastActiveTime() {
    this._resetTimer()
  }

  /**
   * Sets the inactive timeout for the app
   *
   * @private
   * @param {number} timeoutMinutes - The inactive timeout in minutes.
   */
  _setInactiveTimeout(timeoutMinutes: number) {
    this.store.updateState({
      timeoutMinutes
    })

    this._resetTimer()
  }

  /**
   * Resets the internal inactive timer
   *
   * If the {@code timeoutMinutes} state is falsy (i.e., zero) then a new
   * timer will not be created.
   *
   * @private
   */
  /* eslint-disable no-undef */
  _resetTimer() {
    const { timeoutMinutes } = this.store.getState()

    if (this.timer) {
      clearTimeout(this.timer)
    } else {
      chrome.alarms.clear(AUTO_LOCK_TIMEOUT_ALARM)
    }

    if (!timeoutMinutes) {
      return
    }

    chrome.alarms.create(AUTO_LOCK_TIMEOUT_ALARM, {
      delayInMinutes: timeoutMinutes,
      periodInMinutes: timeoutMinutes
    })
    chrome.alarms.onAlarm.addListener((alarmInfo) => {
      if (alarmInfo.name === AUTO_LOCK_TIMEOUT_ALARM) {
        this.onInactiveTimeout()
        chrome.alarms.clear(AUTO_LOCK_TIMEOUT_ALARM)
      }
    })
  }

  /**
   * Sets the current browser and OS environment
   *
   * @param os
   * @param browser
   */
  setBrowserEnvironment(os: string, browser: string) {
    this.store.updateState({ browserEnvironment: { os, browser } })
  }

  /**
   * Adds a pollingToken for a given environmentType
   *
   * @param pollingToken
   * @param pollingTokenType
   */
  addPollingToken(pollingToken: unknown, pollingTokenType: string) {
    if (pollingTokenType !== POLLING_TOKEN_ENVIRONMENT_TYPES[ENVIRONMENT_TYPE_BACKGROUND]) {
      const prevState = this.store.getState()[pollingTokenType]
      this.store.updateState({
        [pollingTokenType]: [...prevState, pollingToken]
      })
    }
  }

  /**
   * removes a pollingToken for a given environmentType
   *
   * @param pollingToken
   * @param pollingTokenType
   */
  removePollingToken(pollingToken: unknown, pollingTokenType: string) {
    if (pollingTokenType !== POLLING_TOKEN_ENVIRONMENT_TYPES[ENVIRONMENT_TYPE_BACKGROUND]) {
      const prevState = this.store.getState()[pollingTokenType]
      this.store.updateState({
        [pollingTokenType]: prevState.filter((token: unknown) => token !== pollingToken)
      })
    }
  }

  /**
   * clears all pollingTokens
   */
  clearPollingTokens() {
    this.store.updateState({
      popupGasPollTokens: [],
      notificationGasPollTokens: [],
      fullScreenGasPollTokens: []
    })
    // this.handleUnlock()
  }

  /**
   * Sets whether the testnet dismissal link should be shown in the network dropdown
   *
   * @param showTestnetMessageInDropdown
   */
  setShowTestnetMessageInDropdown(showTestnetMessageInDropdown) {
    this.store.updateState({ showTestnetMessageInDropdown })
  }

  /**
   * Sets whether the beta notification heading on the home page
   *
   * @param showBetaHeader
   */
  setShowBetaHeader(showBetaHeader) {
    this.store.updateState({ showBetaHeader })
  }

  /**
   * Sets a property indicating the model of the user's Trezor hardware wallet
   *
   * @param trezorModel - The Trezor model.
   */
  setTrezorModel(trezorModel) {
    this.store.updateState({ trezorModel })
  }

  /**
   * A setter for the `nftsDropdownState` property
   *
   * @param nftsDropdownState
   */
  updateNftDropDownState(nftsDropdownState) {
    this.store.updateState({
      nftsDropdownState
    })
  }

  /**
   * Updates the array of the first time used networks
   *
   * @param chainId
   * @returns {void}
   */
  setFirstTimeUsedNetwork(chainId) {
    const currentState = this.store.getState()
    const { usedNetworks } = currentState
    usedNetworks[chainId] = true

    this.store.updateState({ usedNetworks })
  }

  /**
   * A setter for the currentPopupId which indicates the id of popup window that's currently active
   *
   * @param currentPopupId
   */
  setCurrentPopupId(currentPopupId) {
    this.store.updateState({
      currentPopupId
    })
  }

  /**
   * A getter to retrieve currentPopupId saved in the appState
   */
  getCurrentPopupId() {
    return this.store.getState().currentPopupId
  }
}

export const setupAppStateController = function () {
  const { initState, opts } = this
  return new AppStateController({
    addUnlockListener: this.on.bind(this, 'unlock'),
    isUnlocked: this.isUnlocked.bind(this),
    initState: initState.AppStateController,
    onInactiveTimeout: () => this.setLocked(),
    showUnlockRequest: opts.showUserConfirmation,
    preferencesStore: this.preferencesController.store
    // qrHardwareStore: this.qrHardwareKeyring.getMemStore()
  })
}
