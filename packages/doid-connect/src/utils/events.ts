export declare namespace EventTypes {
  export type ValidEventTypes = string | symbol | object

  export type EventNames<T extends ValidEventTypes> = T extends string | symbol ? T : keyof T

  export type ArgumentMap<T extends object> = {
    [K in keyof T]: T[K] extends (arg: CustomEvent) => void ? Parameters<T[K]> : T[K] extends any[] ? T[K] : any[]
  }

  export type EventListenerFn<T extends ValidEventTypes, K extends EventNames<T>> = T extends string | symbol
    ? EventListener
    : (...args: ArgumentMap<Exclude<T, string | symbol>>[Extract<K, keyof T>]) => void

  export type EventArgs<T extends ValidEventTypes, K extends EventNames<T>> = T extends string | symbol
    ? void
    : ArgumentMap<Exclude<T, string | symbol>>[Extract<K, keyof T>][0]['detail']
}
