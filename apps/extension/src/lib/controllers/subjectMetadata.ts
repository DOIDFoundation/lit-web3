// deps: controllerMessenger/permissionController
import { SubjectMetadataController } from '@metamask/subject-metadata-controller'

// Init methods step by step
export default function setupSubjectMetadataController() {
  const { initState } = this
  return new SubjectMetadataController({
    messenger: this.controllerMessenger.getRestricted({
      name: 'SubjectMetadataController',
      allowedActions: [`${this.permissionController.name}:hasPermissions`]
    }),
    state: initState.SubjectMetadataController,
    subjectCacheLimit: 100
  })
}
