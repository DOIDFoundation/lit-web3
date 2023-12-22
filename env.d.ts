declare type PublicConstructor<T = {}> = new (...args: any[]) => T

//
interface ImportMeta {
  env: Record<string, string>
}
