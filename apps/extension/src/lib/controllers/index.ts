// TODO: This should be a mixin class instead

// export { createPermissionController } from './permission'
import { setupPreferencesController } from './preferences'
import NetworkController from '~/lib/controllers/network'
import { ControllerMessenger } from '@metamask/base-controller'
import { ApprovalController } from '@metamask/approval-controller'
import { setupOnBoardingController } from './onBoarding'
import { setupAccountTracker } from './accountTracker'
import { setupPermissionController } from './permission'
import setupSubjectMetadataController from './subjectMetadata'

// Init controllers step by step
export default function setupControllers() {
  const { opts, initState } = this
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

  // deps: provider/tokenListController
  this.preferencesController = setupPreferencesController.bind(this)()
  // deps: provider/blockTracker/preferencesController/onboardingController
  this.accountTracker = setupAccountTracker.bind(this)()
  // deps: controllerMessenger
  this.approvalController = new ApprovalController({
    messenger: this.controllerMessenger.getRestricted({ name: 'ApprovalController' }),
    showApprovalRequest: opts.showUserConfirmation
  })
  // deps: keyringController/approvalController/accountTracker
  this.permissionController = setupPermissionController.bind(this)()
  // deps: controllerMessenger/permissionController
  this.subjectMetadataController = setupSubjectMetadataController.bind(this)()
}
