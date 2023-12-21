let promise: any
export const doidValidator = async () => {
  if (promise) return promise
  return (promise = new Promise(async (resolve) => {
    resolve(await import('@doid/name-validator'))
  }))
}

export default async (name = '') => {
  return (await doidValidator()).toUnicode(name)
}
