if (!('global' in globalThis)) Object.defineProperty(globalThis, 'global', { value: globalThis })
if (!('window' in globalThis)) Object.defineProperty(globalThis, 'window', { value: globalThis })
