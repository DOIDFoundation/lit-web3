# Shim `'assert'` to browser

- Ensure `process` in globalThis
- Resolve `import 'assert'` or `require('assert')` in browser

## Usage

Import directly:

```javascript
import assert from '@doid/node-assert'
```

Or declare resolutions in your root package.json.

```javascript
{
	"name": "your-app",
	"resolutions": {
		"assert": "npm:@doid/node-assert"
	}
}
```
