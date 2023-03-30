import { getPermittedDOIDName } from './getPermittedDOIDName'

export default function setupDOIDMethods() {
  this.getPermittedDOIDName = getPermittedDOIDName.bind(this)
}
