import { getKeyring } from '~/lib.next/keyring'

export const names2DOIDs = async (names: string[]): Promise<KeyringDOID[]> => {
  const { DOIDs, isUnlocked } = await getKeyring()
  if (!isUnlocked) return []
  return names.map((r) => DOIDs[r])
}

export const names2Addresses = async (names: string[], chain = 'eth') => {
  const DOIDs = await names2DOIDs(names)
  return DOIDs.map((DOID: KeyringDOID) => DOID.address).slice(0, 1)
}
