import uts46 from 'tr46'

export const chkName = (name = '') => {
  return uts46.toUnicode(name, { useSTD3ASCIIRules: true })
}

export const chk = async () => {
  const pkg = await import('https://esm.sh/v99/@ensdomains/address-encoder@0.2.20/es2022/address-encoder.js' as any)
  console.log(pkg)
}
