# Shim `'stream'` to browser

- Ensure `process`, `global` in globalThis
- Resolve `import 'stream'` or `require('stream')` in browser

## Usage

Import directly:

```javascript
import { Stream } from '@doid/node-stream'
```

Declare resolutions in your root package.json.

```json
{
	"resolutions": {
		"stream": "npm:@doid/node-stream"
	}
}
```
