import { defineConfig } from 'tsup'
import fg from 'fast-glob'

console.warn(`
=================================
=================================
=================================
Possibly there is a bug of tsup's mutil-entries,
If you got a error like: "error occured in dts build",
Please remove "exports" in package.json temporarily.
=================================
=================================
=================================
`)
const entry = fg.sync('src/**/*.(ts|js)', { absolute: false })

export default defineConfig({
  entry,
  splitting: false,
  clean: true,
  format: 'esm',
  outDir: 'dist',
  dts: true,
  bundle: false,
  publicDir: true
})
