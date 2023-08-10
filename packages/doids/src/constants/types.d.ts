// Networks
declare type DOIDChainId = string
declare interface DOIDNetwork {
  name: string
  title: string
  provider: string
  providerWs: string
  scan: string
  icon: string
}
declare type DOIDNetworks = Record<DOIDChainId, DOIDNetwork>
