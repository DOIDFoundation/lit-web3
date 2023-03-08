import localforage from 'localforage'

export async function getStorageItem(key: string) {
  try {
    const serializedData: any = await localforage.getItem(key)
    if (serializedData === null) {
      return
    }
    return JSON.parse(serializedData)
  } catch (err) {
    return
  }
}

export async function setStorageItem(key: string, value: unknown) {
  try {
    const serializedData = JSON.stringify(value)
    await localforage.setItem(key, serializedData)
  } catch (err) {
    console.warn(err)
  }
}
