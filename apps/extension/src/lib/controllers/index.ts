// TODO: This should be a mixin class instead

import { setupPreferencesController } from './preferences'
import NetworkController from '~/lib/controllers/network'
import { ControllerMessenger } from '@metamask/base-controller'
import { setupApprovalController } from './approval'
import { setupOnBoardingController } from './onBoarding'
import { setupAccountTracker } from './accountTracker'
import { setupPermissionController } from './permission'
import { setupSubjectMetadataController } from './subjectMetadata'
import { setupAppStateController } from './appState'
import { notificationManager } from '~/ext.scripts/sw/notificationManager'

// Init controllers step by step
export default function setupControllers() {
  // no deps
  this.controllerMessenger = new ControllerMessenger()
  // no deps
  this.onboardingController = setupOnBoardingController.bind(this)()
  // no deps
  this.networkController = new NetworkController()
  this.networkController.initializeProvider()
  // deps: networkController
  this.provider = this.networkController.getProviderAndBlockTracker().provider
  // deps: networkController
  this.blockTracker = this.networkController.getProviderAndBlockTracker().blockTracker
  this.networkController.lookupNetwork()
  // no deps
  this.tokenListController = {}

  // deps: provider/openPopup/networkController/tokenListController
  this.preferencesController = setupPreferencesController.bind(this)()
  // setLocked/isUnlocked/preferencesController/showUserConfirmation
  this.appStateController = setupAppStateController.bind(this)()
  // deps: provider/blockTracker/preferencesController/onboardingController
  this.accountTracker = setupAccountTracker.bind(this)()
  // deps: controllerMessenger
  this.approvalController = setupApprovalController.bind(this)()
  // deps: keyringController/approvalController/accountTracker
  this.permissionController = setupPermissionController.bind(this)()
  // deps: controllerMessenger/permissionController
  this.subjectMetadataController = setupSubjectMetadataController.bind(this)()
  // deps: keyringController
  this.notificationManager = notificationManager
}
