# Shim `'util'` to browser

- Ensure `process` in globalThis
- Resolve `import 'util'` or `require('util')` in browser

## Usage

Import directly:

```javascript
import util from '@lit-web3/node-util'
```

Or declare resolutions in your root package.json.

```javascript
{
	"name": "your-app",
	"resolutions": {
		"util": "npm:@lit-web3/node-util"
	}
}
```
