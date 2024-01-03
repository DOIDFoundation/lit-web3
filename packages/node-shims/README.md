# Shim some Node.js API to browser

## Usage

Import directly:

```javascript
import '@lit-web3/node-shims'
```

And declare resolutions in your root package.json.

```json
{
	"resolutions": {
		"assert": "npm:@lit-web3/node-assert",
		"buffer": "npm:@lit-web3/node-buffer",
		"stream": "npm:@lit-web3/node-stream",
		"util": "npm:@lit-web3/node-util"
	}
}
```
