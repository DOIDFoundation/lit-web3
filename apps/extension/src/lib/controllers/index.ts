export { createPermissionController } from './permission'

export default function setupControllers() {
  this.approvalController = new ApprovalController({
    messenger: this.controllerMessenger.getRestricted({
      name: 'ApprovalController'
    }),
    showApprovalRequest: opts.showUserConfirmation
  })
}
