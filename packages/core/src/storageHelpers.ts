export async function getStorageItem(key: string) {
  try {
    const serializedData = localStorage.getItem(key)
    if (serializedData === null) return
    return JSON.parse(serializedData)
  } catch (err) {
    return
  }
}

export async function setStorageItem(key: string, value: unknown) {
  try {
    const serializedData = JSON.stringify(value)
    localStorage.setItem(key, serializedData)
  } catch (err) {
    console.warn(err)
  }
}
