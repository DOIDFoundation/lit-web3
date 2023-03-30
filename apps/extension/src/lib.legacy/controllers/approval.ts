import { ApprovalController, ApprovalRequestNotFoundError } from '@metamask/approval-controller'

export const setupApprovalController = function () {
  return new ApprovalController({
    messenger: this.controllerMessenger.getRestricted({
      name: 'ApprovalController'
    }),
    showApprovalRequest: this.opts.showUserConfirmation
  })
}
