export const getSymbol = async (chain?: ChainNetwork) => {
  if (!chain) return ''
  let { symbol, title, testnet } = chain

  if (testnet) return title.toUpperCase().substring(0, 1)

  const { default: svg } = await import(`./assets/symbol/${symbol}.svg`)
  return svg
}
