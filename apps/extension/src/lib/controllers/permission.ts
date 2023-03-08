import { PermissionController } from '@metamask/permission-controller'
import { ApprovalController, ApprovalRequestNotFoundError } from '@metamask/approval-controller'

export const createPermissionController = function () {
  this.permissionController = new PermissionController({
    messenger: this.controllerMessenger.getRestricted({
      name: 'PermissionController',
      allowedActions: [
        `${this.approvalController.name}:addRequest`,
        `${this.approvalController.name}:hasRequest`,
        `${this.approvalController.name}:acceptRequest`,
        `${this.approvalController.name}:rejectRequest`
      ]
    }),
    state: initState.PermissionController,
    caveatSpecifications: getCaveatSpecifications({ getIdentities }),
    permissionSpecifications: {
      ...getPermissionSpecifications({
        getIdentities,
        getAllAccounts: this.keyringController.getAccounts.bind(this.keyringController),
        captureKeyringTypesWithMissingIdentities: (identities = {}, accounts = []) => {
          const accountsMissingIdentities = accounts.filter((address) => !identities[address])
          const keyringTypesWithMissingIdentities = accountsMissingIdentities.map(
            (address) => this.keyringController.getKeyringForAccount(address)?.type
          )

          const identitiesCount = Object.keys(identities || {}).length

          const accountTrackerCount = Object.keys(this.accountTracker.store.getState().accounts || {}).length

          captureException(
            new Error(
              `Attempt to get permission specifications failed because their were ${accounts.length} accounts, but ${identitiesCount} identities, and the ${keyringTypesWithMissingIdentities} keyrings included accounts with missing identities. Meanwhile, there are ${accountTrackerCount} accounts in the account tracker.`
            )
          )
        }
      }),
      ///: BEGIN:ONLY_INCLUDE_IN(flask)
      ...this.getSnapPermissionSpecifications()
      ///: END:ONLY_INCLUDE_IN
    },
    unrestrictedMethods
  })
}
