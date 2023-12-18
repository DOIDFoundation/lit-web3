export declare namespace EventTypes {
  export type VoidEvent = (evt: Event) => void
  export type DetailedEvent<T> = (evt: CustomEvent<T>) => void

  export type ValidTypes = string | symbol | object

  export type EventNames<T extends ValidTypes> = T extends string | symbol ? T : keyof T

  export type ArgumentMap<T extends object> = {
    [K in keyof T]: T[K] extends (evt: any) => void ? Parameters<T[K]>[0] : Event
  }

  export type EventType<T extends ValidTypes, K extends EventNames<T>> = ArgumentMap<
    Exclude<T, string | symbol>
  >[Extract<K, keyof T>]

  export type EventListenerFn<T extends ValidTypes, K extends EventNames<T>> = T extends string | symbol
    ? EventListener
    : (evt: EventType<T, K>) => void

  export type EventDetailType<T extends ValidTypes, K extends EventNames<T>> = T extends string | symbol
    ? void
    : EventType<T, K> extends CustomEvent
    ? EventType<T, K>['detail']
    : void
}
