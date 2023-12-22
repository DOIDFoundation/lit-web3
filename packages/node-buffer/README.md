# Shim `'buffer'` to browser

- Ensure `process` in globalThis
- Resolve `globalThis.Buffer` or `import 'buffer'` or `require('buffer')` in browser

## Usage

Import directly:

```javascript
import { Buffer } from '@doid/node-buffer'
```

Or declare resolutions in your root package.json.

```javascript
{
	"name": "your-app",
	"resolutions": {
		"buffer": "npm:@doid/node-buffer"
	}
}
```
