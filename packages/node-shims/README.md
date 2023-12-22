# Shim some Node.js API to browser

## Usage

Import directly:

```javascript
import '@doid/node-shims'
```

And declare resolutions in your root package.json.

```json
{
	"resolutions": {
    "assert": "npm:@doid/node-assert",
    "buffer": "npm:@doid/node-buffer",
    "stream": "npm:@doid/node-stream",
    "util": "npm:@doid/node-util"
	}
}
```
