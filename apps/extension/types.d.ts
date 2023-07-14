/// <reference types="@types/webextension-polyfill" />
/// <reference types="@types/chrome" />
// Alias of Browser
declare namespace browser {
  const activityLog: ActivityLog.Static
  const alarms: Alarms.Static
  const bookmarks: Bookmarks.Static
  const action: Action.Static
  const browserAction: BrowserAction.Static
  const browserSettings: BrowserSettings.Static
  const browsingData: BrowsingData.Static
  const captivePortal: CaptivePortal.Static
  const clipboard: Clipboard.Static
  const commands: Commands.Static
  const contentScripts: ContentScripts.Static
  const contextualIdentities: ContextualIdentities.Static
  const cookies: Cookies.Static
  const declarativeNetRequest: DeclarativeNetRequest.Static
  const devtools: Devtools.Static
  const dns: Dns.Static
  const downloads: Downloads.Static
  const events: Events.Static
  const experiments: Experiments.Static
  const extension: Extension.Static
  const extensionTypes: ExtensionTypes.Static
  const find: Find.Static
  const geckoProfiler: GeckoProfiler.Static
  const history: History.Static
  const i18n: I18n.Static
  const identity: Identity.Static
  const idle: Idle.Static
  const management: Management.Static
  const manifest: Manifest.Static
  const contextMenus: ContextMenus.Static
  const menus: Menus.Static
  const networkStatus: NetworkStatus.Static
  const normandyAddonStudy: NormandyAddonStudy.Static
  const notifications: Notifications.Static
  const omnibox: Omnibox.Static
  const pageAction: PageAction.Static
  const permissions: Permissions.Static
  const pkcs11: Pkcs11.Static
  const privacy: Privacy.Static
  const proxy: Proxy.Static
  const runtime: Runtime.Static
  const scripting: Scripting.Static
  const search: Search.Static
  const sessions: Sessions.Static
  const sidebarAction: SidebarAction.Static
  const storage: Storage.Static
  const tabs: Tabs.Static
  const theme: Theme.Static
  const topSites: TopSites.Static
  const types: Types.Static
  const urlbar: Urlbar.Static
  const userScripts: UserScripts.Static
  const webNavigation: WebNavigation.Static
  const webRequest: WebRequest.Static
  const windows: Windows.Static
}

declare interface Window {
  skipWaiting: any
  DOID: DOID
}

declare module globalThis {
  var isFirstTimeProfileLoaded: boolean
}
declare module '@metamask/eth-keyring-controller'

declare type ChainNet = {
  name: string
  title: string
  icon?: string
  coin?: string
  color?: string
}
