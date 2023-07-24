import browser from 'webextension-polyfill'

export const connectRemote = async (remotePort: browser.Runtime.Port) => {
  const senderUrl = remotePort.sender?.url ? new URL(remotePort.sender.url) : null
  let isInternalProcess = [`chrome`, 'edge']
    .map((r) => `${r}-extension://${browser.runtime.id}`)
    .includes(senderUrl?.host ?? '')
  if (isInternalProcess) {
    console.log({ isInternalProcess })
  }
}
