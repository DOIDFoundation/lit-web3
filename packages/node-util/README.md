# Shim `'util'` to browser

- Ensure `process` in globalThis
- Resolve `import 'util'` or `require('util')` in browser

## Usage

Import directly:

```javascript
import util from '@doid/node-util'
```

Or declare resolutions in your root package.json.

```javascript
{
	"name": "your-app",
	"resolutions": {
		"util": "npm:@doid/node-util"
	}
}
```
