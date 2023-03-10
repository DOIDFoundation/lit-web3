import { ApprovalController, ApprovalRequestNotFoundError } from '@metamask/approval-controller'

export default function setupApproval() {
  this.approvalController = new ApprovalController({
    messenger: this.controllerMessenger.getRestricted({
      name: 'ApprovalController'
    }),
    showApprovalRequest: opts.showUserConfirmation
  })
}
