export * from '@lit-web3/base/tailwind-element'

import { TailwindElement } from '@lit-web3/base/tailwind-element'
import ThemeLight from './theme-light.css?inline'

export const ThemeElement = (styles: unknown | unknown[]) =>
  TailwindElement([ThemeLight, ...(Array.isArray(styles) ? styles : [styles])])
