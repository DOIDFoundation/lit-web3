import { State, Unsubscribe } from '@lit-web3/base/state'

export * from '@lit-web3/base/state'

/** require {@link state} to be a State with property {@link key} */
function requireStateProperty(state: any, key: string) {
  if (!(state instanceof State)) {
    throw new TypeError(
      `Require ${state instanceof Object ? state.constructor.name : typeof state} to be a State object`
    )
  }
  if (!state.propertyMap.has(key)) {
    console.debug(state.constructor.name, 'has known properties', { propertyMap: state.propertyMap })
    throw new ReferenceError(`${key} is not a property of ${state.constructor.name}`)
  }
}

/**
 * reflect `dest[destKey] = source[key]` when `source[key]` changes
 * @param source who's property to reflect
 * @param key of {@link source} to reflect
 * @param dest who's property to reflect to
 * @param destKey of {@link dest} to reflect to, default to {@link key}
 * @returns a unsubscribe function
 */
export function reflectProperty(source: State, key: string, dest: object, destKey: string = key) {
  requireStateProperty(source, key)
  return source.subscribe((_, value) => ((dest as {} as { [destKey: string]: any })[destKey] = value), key)
}

/**
 * reflect `dest[destKey] = source[key]?[subKey]` when `source[key]` or `source[key][subKey]` changes, set to `undefined` if `source[key]` is undefined
 * @param source who's property to reflect
 * @param key of {@link source} to reflect to
 * @param subKey of `source[key]` to reflect to
 * @param dest who's property to reflect to
 * @param destKey of {@link dest} to reflect to, default to {@link subKey}
 * @returns a unsubscribe function
 */
export function reflectSubProperty(
  source: State,
  key: string,
  subKey: string,
  dest: object,
  destKey: string = subKey
): Unsubscribe {
  requireStateProperty(source, key)
  let unsubscribes: { source?: Unsubscribe; child?: Unsubscribe } = {}
  let subProperty = source.stateValue[key]
  if (subProperty instanceof State) unsubscribes.child = reflectProperty(subProperty, subKey, dest, destKey)
  unsubscribes.source = source.subscribe((_, value) => {
    unsubscribes.child && unsubscribes.child()
    unsubscribes.child = undefined
    const dstObject = dest as {} as { [destKey: string]: any }
    if (value) {
      try {
        dstObject[destKey] = (value as {} as { [subKey: string]: any })[subKey]
        unsubscribes.child = reflectProperty(value, subKey, dest, destKey)
        return
      } catch (e) {
        console.warn(e)
      }
    }
    dstObject[destKey] = undefined
  }, key)

  return () => {
    unsubscribes.source && unsubscribes.source()
    unsubscribes.child && unsubscribes.child()
  }
}
