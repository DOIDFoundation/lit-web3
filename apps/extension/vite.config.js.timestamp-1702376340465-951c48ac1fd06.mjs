// vite.config.js
import fs from "node:fs";
import { viteConfig } from "file:///C:/Users/cutsi/Documents/lit/lit-web3/packages/dui/src/shared/vite.config.js";

// manifest.config.ts
import { defineManifest, defineDynamicResource } from "file:///C:/Users/cutsi/Documents/lit/lit-web3/node_modules/.pnpm/@crxjs+vite-plugin@2.0.0-beta.18/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// package.json
var package_default = {
  name: "@lit-web3/extension",
  displayName: "DOID Extension",
  version: "0.7.0",
  description: "DOID Extension",
  private: true,
  type: "module",
  scripts: {
    dev: "cross-env NODE_ENV=development run-p dev:*",
    "dev:inpage": "npm run build:inpage -- --watch --mode development",
    "dev:app": "vite --host --mode development",
    build: "cross-env NODE_ENV=production run-s build:*",
    "build:inpage": "vite build --config vite.config.inpage.ts",
    "build:app": "vite build",
    bundle: "cross-env NODE_ENV=production run-p clear && run-p build && run-p bundle:*",
    "bundle:zip": "rimraf DOID.$npm_package_version.zip && jszip-cli add ./dist/* -o ./DOID.$npm_package_version.zip",
    "bundle:crx": "crx pack ./dist -o ./DOID.$npm_package_version.crx",
    clear: "rimraf ./DOID.$npm_package_version.zip && rimraf ./DOID.$npm_package_version.crx",
    preinstall: "npx only-allow pnpm"
  },
  keywords: [],
  dependencies: {
    "@aptos-labs/wallet-adapter-core": "2.0.1",
    "@erebos/keccak256": "^0.13.1",
    "@erebos/secp256k1": "^0.10.0",
    "@libp2p/crypto": "^1.0.17",
    "@lit-web3/chain": "workspace:latest",
    "@lit-web3/core": "workspace:latest",
    "@lit-web3/doids": "workspace:latest",
    "@lit-web3/dui": "workspace:latest",
    "@lit-web3/ethers": "workspace:latest",
    "@lit-web3/solana-wallet-standard": "workspace:latest",
    "@metamask/eth-keyring-controller": "^12.0.1",
    "@metamask/obs-store": "^8.1.0",
    "@scure/bip39": "^1.2.1",
    "@solana/web3.js": "^1.87.6",
    aptos: "^1.20.0",
    "ed25519-hd-key": "^1.3.0",
    eventemitter3: "^5.0.1",
    "ipfs-core": "^0.18.1",
    lodash: "^4.17.21",
    pify: "^6.1.0",
    tweetnacl: "^1.0.3",
    w3name: "^1.0.8",
    "web3.storage": "^4.5.5",
    "webext-bridge": "^6.0.1"
  },
  devDependencies: {
    "@crxjs/vite-plugin": "2.0.0-beta.18",
    "@ffflorian/jszip-cli": "^3.5.6",
    "@types/chrome": "latest",
    "@types/webextension-polyfill": "^0.10.7",
    "cross-env": "^7.0.3",
    crx: "^5.0.1",
    rimraf: "^5.0.5",
    "unplugin-auto-import": "^0.15.3",
    "webextension-polyfill": "^0.10.0"
  },
  license: "MIT"
};

// manifest.config.ts
var { version } = package_default;
var isDev = process.env.NODE_ENV !== "production";
var [major, minor, patch, label = "0"] = version.replace(/[^\d.-]+/g, "").split(/[.-]/);
var matches = ["file://*/*", "http://*/*", "https://*/*"];
var manifest_config_default = defineManifest({
  manifest_version: 3,
  name: package_default.displayName || package_default.name,
  description: package_default.description,
  version: `${major}.${minor}.${patch}.${label}`,
  version_name: version,
  action: {
    default_popup: "popup.html",
    default_icon: "public/doid.png"
  },
  options_ui: {
    page: "index.html",
    open_in_tab: true
  },
  icons: {
    16: "public/doid.png",
    48: "public/doid.png",
    128: "public/doid.png"
  },
  permissions: [
    "activeTab",
    "favicon",
    "alarms",
    "clipboardWrite",
    "notifications",
    "scripting",
    "storage",
    "unlimitedStorage",
    "webRequest",
    ...isDev ? ["webNavigation"] : []
  ],
  host_permissions: ["*://*/*"],
  background: {
    service_worker: "src/ext.entries/background.ts",
    type: "module"
  },
  content_scripts: [{ js: ["src/ext.entries/contentscript.ts"], matches, run_at: "document_start" }],
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'; frame-ancestors 'none';"
  },
  externally_connectable: {
    matches: ["https://doid.tech/*"],
    ids: ["*"]
  },
  web_accessible_resources: [{ resources: [], matches }, defineDynamicResource({ matches })],
  minimum_chrome_version: "80"
});

// vite.config.js
import { dirname, relative, resolve } from "node:path";
import AutoImport from "file:///C:/Users/cutsi/Documents/lit/lit-web3/node_modules/.pnpm/unplugin-auto-import@0.15.3_rollup@4.8.0/node_modules/unplugin-auto-import/dist/vite.js";
var __vite_injected_original_dirname = "C:\\Users\\cutsi\\Documents\\lit\\lit-web3\\apps\\extension";
var depPath = resolve(__vite_injected_original_dirname, "node_modules/@crxjs/vite-plugin/dist/index.mjs");
var depJsSrc = fs.readFileSync(depPath, "utf8");
var reg = /page\.scripts\.push\(\.\.\.scripts\)/;
if (/reg/.test(depJsSrc)) {
  fs.writeFileSync(depPath, depJsSrc.replace(reg, `page?.scripts.push(...scripts)`));
}
var inpagPath = resolve(__vite_injected_original_dirname, "public/inpage.js");
try {
  const time = /* @__PURE__ */ new Date();
  fs.utimesSync(inpagPath, time, time);
} catch (e) {
  const fd = fs.openSync(inpagPath, "w");
  fs.closeSync(fd);
}
var sharedConfig = async (mode = "") => {
  return {
    plugins: [
      // rewrite assets to use relative path
      {
        name: "assets-rewrite",
        enforce: "post",
        apply: "build",
        transformIndexHtml(html = "", { path = "" }) {
          return html.replace(/"\/assets\//g, `"${relative(dirname(path), "/assets")}/`);
        }
      }
    ],
    optimizeDeps: {
      include: ["webextension-polyfill"]
    },
    viteConfigOptions: {
      pwa: false,
      legacy: false,
      splitChunk: false,
      copies: []
    }
  };
};
var sharedExtConfig = async (mode = "") => {
  const config = await sharedConfig(mode);
  const [isDev2] = [mode === "development"];
  config.plugins.push(
    ...[
      AutoImport({
        imports: [{ "webextension-polyfill": [["*", "browser"]] }],
        dts: resolve(__vite_injected_original_dirname, "src/auto-imports.d.ts")
      })
    ]
  );
  config.build = {
    emptyOutDir: !isDev2
  };
  return config;
};
var vite_config_default = async ({ mode = "" }) => {
  const [port, isDev2] = [4831, mode === "development"];
  const config = await sharedExtConfig(mode);
  const { crx } = await import("file:///C:/Users/cutsi/Documents/lit/lit-web3/node_modules/.pnpm/@crxjs+vite-plugin@2.0.0-beta.18/node_modules/@crxjs/vite-plugin/dist/index.mjs");
  config.plugins.push(...[crx({ manifest: manifest_config_default })]);
  config.server = { port, https: false, hmr: { port } };
  config.build.rollupOptions = {
    input: {
      index: "index.html"
    }
  };
  return viteConfig(config)({ mode });
};
export {
  vite_config_default as default,
  sharedConfig,
  sharedExtConfig
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAibWFuaWZlc3QuY29uZmlnLnRzIiwgInBhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGN1dHNpXFxcXERvY3VtZW50c1xcXFxsaXRcXFxcbGl0LXdlYjNcXFxcYXBwc1xcXFxleHRlbnNpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGN1dHNpXFxcXERvY3VtZW50c1xcXFxsaXRcXFxcbGl0LXdlYjNcXFxcYXBwc1xcXFxleHRlbnNpb25cXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2N1dHNpL0RvY3VtZW50cy9saXQvbGl0LXdlYjMvYXBwcy9leHRlbnNpb24vdml0ZS5jb25maWcuanNcIjsvLyBpbXBvcnQgeyBjcnggfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nXG4vLyBTIEhlcmUgaXMgYSB0ZW1wb3JhcnkgaGFjayBmb3IgQGNyeGpzL3ZpdGUtcGx1Z2luQDIuMC4wLWJldGEuMTNcbmltcG9ydCBmcyBmcm9tICdub2RlOmZzJ1xuY29uc3QgZGVwUGF0aCA9IHJlc29sdmUoX19kaXJuYW1lLCAnbm9kZV9tb2R1bGVzL0Bjcnhqcy92aXRlLXBsdWdpbi9kaXN0L2luZGV4Lm1qcycpXG5jb25zdCBkZXBKc1NyYyA9IGZzLnJlYWRGaWxlU3luYyhkZXBQYXRoLCAndXRmOCcpXG5jb25zdCByZWcgPSAvcGFnZVxcLnNjcmlwdHNcXC5wdXNoXFwoXFwuXFwuXFwuc2NyaXB0c1xcKS9cbmlmICgvcmVnLy50ZXN0KGRlcEpzU3JjKSkge1xuICBmcy53cml0ZUZpbGVTeW5jKGRlcFBhdGgsIGRlcEpzU3JjLnJlcGxhY2UocmVnLCBgcGFnZT8uc2NyaXB0cy5wdXNoKC4uLnNjcmlwdHMpYCkpXG59XG4vLyBFXG4vLyBTIFRvdWNoIGdpdC1pZ25vcmVkIGBwdWJsaWMvaW5wYWdlLmpzYFxuY29uc3QgaW5wYWdQYXRoID0gcmVzb2x2ZShfX2Rpcm5hbWUsICdwdWJsaWMvaW5wYWdlLmpzJylcbnRyeSB7XG4gIGNvbnN0IHRpbWUgPSBuZXcgRGF0ZSgpXG4gIGZzLnV0aW1lc1N5bmMoaW5wYWdQYXRoLCB0aW1lLCB0aW1lKVxufSBjYXRjaCAoZSkge1xuICBjb25zdCBmZCA9IGZzLm9wZW5TeW5jKGlucGFnUGF0aCwgJ3cnKVxuICBmcy5jbG9zZVN5bmMoZmQpXG59XG4vLyBFXG5cbmltcG9ydCB7IHZpdGVDb25maWcgfSBmcm9tICdAbGl0LXdlYjMvZHVpL3NyYy9zaGFyZWQvdml0ZS5jb25maWcuanMnXG5pbXBvcnQgbWFuaWZlc3QgZnJvbSAnLi9tYW5pZmVzdC5jb25maWcnXG5pbXBvcnQgeyBkaXJuYW1lLCByZWxhdGl2ZSwgcmVzb2x2ZSB9IGZyb20gJ25vZGU6cGF0aCdcblxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcblxuZXhwb3J0IGNvbnN0IHNoYXJlZENvbmZpZyA9IGFzeW5jIChtb2RlID0gJycpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICAvLyByZXdyaXRlIGFzc2V0cyB0byB1c2UgcmVsYXRpdmUgcGF0aFxuICAgICAge1xuICAgICAgICBuYW1lOiAnYXNzZXRzLXJld3JpdGUnLFxuICAgICAgICBlbmZvcmNlOiAncG9zdCcsXG4gICAgICAgIGFwcGx5OiAnYnVpbGQnLFxuICAgICAgICB0cmFuc2Zvcm1JbmRleEh0bWwoaHRtbCA9ICcnLCB7IHBhdGggPSAnJyB9KSB7XG4gICAgICAgICAgcmV0dXJuIGh0bWwucmVwbGFjZSgvXCJcXC9hc3NldHNcXC8vZywgYFwiJHtyZWxhdGl2ZShkaXJuYW1lKHBhdGgpLCAnL2Fzc2V0cycpfS9gKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgXSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFsnd2ViZXh0ZW5zaW9uLXBvbHlmaWxsJ11cbiAgICB9LFxuICAgIHZpdGVDb25maWdPcHRpb25zOiB7XG4gICAgICBwd2E6IGZhbHNlLFxuICAgICAgbGVnYWN5OiBmYWxzZSxcbiAgICAgIHNwbGl0Q2h1bms6IGZhbHNlLFxuICAgICAgY29waWVzOiBbXVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgc2hhcmVkRXh0Q29uZmlnID0gYXN5bmMgKG1vZGUgPSAnJykgPT4ge1xuICBjb25zdCBjb25maWcgPSBhd2FpdCBzaGFyZWRDb25maWcobW9kZSlcbiAgY29uc3QgW2lzRGV2XSA9IFttb2RlID09PSAnZGV2ZWxvcG1lbnQnXVxuICBjb25maWcucGx1Z2lucy5wdXNoKFxuICAgIC4uLltcbiAgICAgIEF1dG9JbXBvcnQoe1xuICAgICAgICBpbXBvcnRzOiBbeyAnd2ViZXh0ZW5zaW9uLXBvbHlmaWxsJzogW1snKicsICdicm93c2VyJ11dIH1dLFxuICAgICAgICBkdHM6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2F1dG8taW1wb3J0cy5kLnRzJylcbiAgICAgIH0pXG4gICAgXVxuICApXG4gIGNvbmZpZy5idWlsZCA9IHtcbiAgICBlbXB0eU91dERpcjogIWlzRGV2XG4gIH1cbiAgcmV0dXJuIGNvbmZpZ1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyAoeyBtb2RlID0gJycgfSkgPT4ge1xuICBjb25zdCBbcG9ydCwgaXNEZXZdID0gWzQ4MzEsIG1vZGUgPT09ICdkZXZlbG9wbWVudCddXG4gIGNvbnN0IGNvbmZpZyA9IGF3YWl0IHNoYXJlZEV4dENvbmZpZyhtb2RlKVxuICBjb25zdCB7IGNyeCB9ID0gYXdhaXQgaW1wb3J0KCdAY3J4anMvdml0ZS1wbHVnaW4nKVxuICBjb25maWcucGx1Z2lucy5wdXNoKC4uLltjcngoeyBtYW5pZmVzdCB9KV0pXG4gIGNvbmZpZy5zZXJ2ZXIgPSB7IHBvcnQsIGh0dHBzOiBmYWxzZSwgaG1yOiB7IHBvcnQgfSB9XG4gIGNvbmZpZy5idWlsZC5yb2xsdXBPcHRpb25zID0ge1xuICAgIGlucHV0OiB7XG4gICAgICBpbmRleDogJ2luZGV4Lmh0bWwnXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZpdGVDb25maWcoY29uZmlnKSh7IG1vZGUgfSlcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcY3V0c2lcXFxcRG9jdW1lbnRzXFxcXGxpdFxcXFxsaXQtd2ViM1xcXFxhcHBzXFxcXGV4dGVuc2lvblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcY3V0c2lcXFxcRG9jdW1lbnRzXFxcXGxpdFxcXFxsaXQtd2ViM1xcXFxhcHBzXFxcXGV4dGVuc2lvblxcXFxtYW5pZmVzdC5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2N1dHNpL0RvY3VtZW50cy9saXQvbGl0LXdlYjMvYXBwcy9leHRlbnNpb24vbWFuaWZlc3QuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lTWFuaWZlc3QsIGRlZmluZUR5bmFtaWNSZXNvdXJjZSB9IGZyb20gJ0Bjcnhqcy92aXRlLXBsdWdpbidcbmltcG9ydCBwa2cgZnJvbSAnLi9wYWNrYWdlLmpzb24nXG5cbmNvbnN0IHsgdmVyc2lvbiB9ID0gcGtnXG5jb25zdCBpc0RldiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbidcblxuY29uc3QgW21ham9yLCBtaW5vciwgcGF0Y2gsIGxhYmVsID0gJzAnXSA9IHZlcnNpb24ucmVwbGFjZSgvW15cXGQuLV0rL2csICcnKS5zcGxpdCgvWy4tXS8pXG5cbmV4cG9ydCBjb25zdCBtYXRjaGVzID0gWydmaWxlOi8vKi8qJywgJ2h0dHA6Ly8qLyonLCAnaHR0cHM6Ly8qLyonXVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVNYW5pZmVzdCh7XG4gIG1hbmlmZXN0X3ZlcnNpb246IDMsXG4gIG5hbWU6IHBrZy5kaXNwbGF5TmFtZSB8fCBwa2cubmFtZSxcbiAgZGVzY3JpcHRpb246IHBrZy5kZXNjcmlwdGlvbixcbiAgdmVyc2lvbjogYCR7bWFqb3J9LiR7bWlub3J9LiR7cGF0Y2h9LiR7bGFiZWx9YCxcbiAgdmVyc2lvbl9uYW1lOiB2ZXJzaW9uLFxuICBhY3Rpb246IHtcbiAgICBkZWZhdWx0X3BvcHVwOiAncG9wdXAuaHRtbCcsXG4gICAgZGVmYXVsdF9pY29uOiAncHVibGljL2RvaWQucG5nJ1xuICB9LFxuICBvcHRpb25zX3VpOiB7XG4gICAgcGFnZTogJ2luZGV4Lmh0bWwnLFxuICAgIG9wZW5faW5fdGFiOiB0cnVlXG4gIH0sXG4gIGljb25zOiB7XG4gICAgMTY6ICdwdWJsaWMvZG9pZC5wbmcnLFxuICAgIDQ4OiAncHVibGljL2RvaWQucG5nJyxcbiAgICAxMjg6ICdwdWJsaWMvZG9pZC5wbmcnXG4gIH0sXG4gIHBlcm1pc3Npb25zOiBbXG4gICAgJ2FjdGl2ZVRhYicsXG4gICAgJ2Zhdmljb24nLFxuICAgICdhbGFybXMnLFxuICAgICdjbGlwYm9hcmRXcml0ZScsXG4gICAgJ25vdGlmaWNhdGlvbnMnLFxuICAgICdzY3JpcHRpbmcnLFxuICAgICdzdG9yYWdlJyxcbiAgICAndW5saW1pdGVkU3RvcmFnZScsXG4gICAgJ3dlYlJlcXVlc3QnLFxuICAgIC4uLihpc0RldiA/IFsnd2ViTmF2aWdhdGlvbiddIDogW10pXG4gIF0sXG4gIGhvc3RfcGVybWlzc2lvbnM6IFsnKjovLyovKiddLFxuICBiYWNrZ3JvdW5kOiB7XG4gICAgc2VydmljZV93b3JrZXI6ICdzcmMvZXh0LmVudHJpZXMvYmFja2dyb3VuZC50cycsXG4gICAgdHlwZTogJ21vZHVsZSdcbiAgfSxcbiAgY29udGVudF9zY3JpcHRzOiBbeyBqczogWydzcmMvZXh0LmVudHJpZXMvY29udGVudHNjcmlwdC50cyddLCBtYXRjaGVzLCBydW5fYXQ6ICdkb2N1bWVudF9zdGFydCcgfV0sXG4gIGNvbnRlbnRfc2VjdXJpdHlfcG9saWN5OiB7XG4gICAgZXh0ZW5zaW9uX3BhZ2VzOiBcInNjcmlwdC1zcmMgJ3NlbGYnICd3YXNtLXVuc2FmZS1ldmFsJzsgb2JqZWN0LXNyYyAnc2VsZic7IGZyYW1lLWFuY2VzdG9ycyAnbm9uZSc7XCJcbiAgfSxcbiAgZXh0ZXJuYWxseV9jb25uZWN0YWJsZToge1xuICAgIG1hdGNoZXM6IFsnaHR0cHM6Ly9kb2lkLnRlY2gvKiddLFxuICAgIGlkczogWycqJ11cbiAgfSxcbiAgd2ViX2FjY2Vzc2libGVfcmVzb3VyY2VzOiBbeyByZXNvdXJjZXM6IFtdLCBtYXRjaGVzIH0sIGRlZmluZUR5bmFtaWNSZXNvdXJjZSh7IG1hdGNoZXMgfSldLFxuICBtaW5pbXVtX2Nocm9tZV92ZXJzaW9uOiAnODAnXG59KVxuIiwgIntcbiAgXCJuYW1lXCI6IFwiQGxpdC13ZWIzL2V4dGVuc2lvblwiLFxuICBcImRpc3BsYXlOYW1lXCI6IFwiRE9JRCBFeHRlbnNpb25cIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMC43LjBcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkRPSUQgRXh0ZW5zaW9uXCIsXG4gIFwicHJpdmF0ZVwiOiB0cnVlLFxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImRldlwiOiBcImNyb3NzLWVudiBOT0RFX0VOVj1kZXZlbG9wbWVudCBydW4tcCBkZXY6KlwiLFxuICAgIFwiZGV2OmlucGFnZVwiOiBcIm5wbSBydW4gYnVpbGQ6aW5wYWdlIC0tIC0td2F0Y2ggLS1tb2RlIGRldmVsb3BtZW50XCIsXG4gICAgXCJkZXY6YXBwXCI6IFwidml0ZSAtLWhvc3QgLS1tb2RlIGRldmVsb3BtZW50XCIsXG4gICAgXCJidWlsZFwiOiBcImNyb3NzLWVudiBOT0RFX0VOVj1wcm9kdWN0aW9uIHJ1bi1zIGJ1aWxkOipcIixcbiAgICBcImJ1aWxkOmlucGFnZVwiOiBcInZpdGUgYnVpbGQgLS1jb25maWcgdml0ZS5jb25maWcuaW5wYWdlLnRzXCIsXG4gICAgXCJidWlsZDphcHBcIjogXCJ2aXRlIGJ1aWxkXCIsXG4gICAgXCJidW5kbGVcIjogXCJjcm9zcy1lbnYgTk9ERV9FTlY9cHJvZHVjdGlvbiBydW4tcCBjbGVhciAmJiBydW4tcCBidWlsZCAmJiBydW4tcCBidW5kbGU6KlwiLFxuICAgIFwiYnVuZGxlOnppcFwiOiBcInJpbXJhZiBET0lELiRucG1fcGFja2FnZV92ZXJzaW9uLnppcCAmJiBqc3ppcC1jbGkgYWRkIC4vZGlzdC8qIC1vIC4vRE9JRC4kbnBtX3BhY2thZ2VfdmVyc2lvbi56aXBcIixcbiAgICBcImJ1bmRsZTpjcnhcIjogXCJjcnggcGFjayAuL2Rpc3QgLW8gLi9ET0lELiRucG1fcGFja2FnZV92ZXJzaW9uLmNyeFwiLFxuICAgIFwiY2xlYXJcIjogXCJyaW1yYWYgLi9ET0lELiRucG1fcGFja2FnZV92ZXJzaW9uLnppcCAmJiByaW1yYWYgLi9ET0lELiRucG1fcGFja2FnZV92ZXJzaW9uLmNyeFwiLFxuICAgIFwicHJlaW5zdGFsbFwiOiBcIm5weCBvbmx5LWFsbG93IHBucG1cIlxuICB9LFxuICBcImtleXdvcmRzXCI6IFtdLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAYXB0b3MtbGFicy93YWxsZXQtYWRhcHRlci1jb3JlXCI6IFwiMi4wLjFcIixcbiAgICBcIkBlcmVib3Mva2VjY2FrMjU2XCI6IFwiXjAuMTMuMVwiLFxuICAgIFwiQGVyZWJvcy9zZWNwMjU2azFcIjogXCJeMC4xMC4wXCIsXG4gICAgXCJAbGlicDJwL2NyeXB0b1wiOiBcIl4xLjAuMTdcIixcbiAgICBcIkBsaXQtd2ViMy9jaGFpblwiOiBcIndvcmtzcGFjZTpsYXRlc3RcIixcbiAgICBcIkBsaXQtd2ViMy9jb3JlXCI6IFwid29ya3NwYWNlOmxhdGVzdFwiLFxuICAgIFwiQGxpdC13ZWIzL2RvaWRzXCI6IFwid29ya3NwYWNlOmxhdGVzdFwiLFxuICAgIFwiQGxpdC13ZWIzL2R1aVwiOiBcIndvcmtzcGFjZTpsYXRlc3RcIixcbiAgICBcIkBsaXQtd2ViMy9ldGhlcnNcIjogXCJ3b3Jrc3BhY2U6bGF0ZXN0XCIsXG4gICAgXCJAbGl0LXdlYjMvc29sYW5hLXdhbGxldC1zdGFuZGFyZFwiOiBcIndvcmtzcGFjZTpsYXRlc3RcIixcbiAgICBcIkBtZXRhbWFzay9ldGgta2V5cmluZy1jb250cm9sbGVyXCI6IFwiXjEyLjAuMVwiLFxuICAgIFwiQG1ldGFtYXNrL29icy1zdG9yZVwiOiBcIl44LjEuMFwiLFxuICAgIFwiQHNjdXJlL2JpcDM5XCI6IFwiXjEuMi4xXCIsXG4gICAgXCJAc29sYW5hL3dlYjMuanNcIjogXCJeMS44Ny42XCIsXG4gICAgXCJhcHRvc1wiOiBcIl4xLjIwLjBcIixcbiAgICBcImVkMjU1MTktaGQta2V5XCI6IFwiXjEuMy4wXCIsXG4gICAgXCJldmVudGVtaXR0ZXIzXCI6IFwiXjUuMC4xXCIsXG4gICAgXCJpcGZzLWNvcmVcIjogXCJeMC4xOC4xXCIsXG4gICAgXCJsb2Rhc2hcIjogXCJeNC4xNy4yMVwiLFxuICAgIFwicGlmeVwiOiBcIl42LjEuMFwiLFxuICAgIFwidHdlZXRuYWNsXCI6IFwiXjEuMC4zXCIsXG4gICAgXCJ3M25hbWVcIjogXCJeMS4wLjhcIixcbiAgICBcIndlYjMuc3RvcmFnZVwiOiBcIl40LjUuNVwiLFxuICAgIFwid2ViZXh0LWJyaWRnZVwiOiBcIl42LjAuMVwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBjcnhqcy92aXRlLXBsdWdpblwiOiBcIjIuMC4wLWJldGEuMThcIixcbiAgICBcIkBmZmZsb3JpYW4vanN6aXAtY2xpXCI6IFwiXjMuNS42XCIsXG4gICAgXCJAdHlwZXMvY2hyb21lXCI6IFwibGF0ZXN0XCIsXG4gICAgXCJAdHlwZXMvd2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI6IFwiXjAuMTAuN1wiLFxuICAgIFwiY3Jvc3MtZW52XCI6IFwiXjcuMC4zXCIsXG4gICAgXCJjcnhcIjogXCJeNS4wLjFcIixcbiAgICBcInJpbXJhZlwiOiBcIl41LjAuNVwiLFxuICAgIFwidW5wbHVnaW4tYXV0by1pbXBvcnRcIjogXCJeMC4xNS4zXCIsXG4gICAgXCJ3ZWJleHRlbnNpb24tcG9seWZpbGxcIjogXCJeMC4xMC4wXCJcbiAgfSxcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCJcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFFQSxPQUFPLFFBQVE7QUFtQmYsU0FBUyxrQkFBa0I7OztBQ3JCMlUsU0FBUyxnQkFBZ0IsNkJBQTZCOzs7QUNBNVo7QUFBQSxFQUNFLE1BQVE7QUFBQSxFQUNSLGFBQWU7QUFBQSxFQUNmLFNBQVc7QUFBQSxFQUNYLGFBQWU7QUFBQSxFQUNmLFNBQVc7QUFBQSxFQUNYLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxJQUNULEtBQU87QUFBQSxJQUNQLGNBQWM7QUFBQSxJQUNkLFdBQVc7QUFBQSxJQUNYLE9BQVM7QUFBQSxJQUNULGdCQUFnQjtBQUFBLElBQ2hCLGFBQWE7QUFBQSxJQUNiLFFBQVU7QUFBQSxJQUNWLGNBQWM7QUFBQSxJQUNkLGNBQWM7QUFBQSxJQUNkLE9BQVM7QUFBQSxJQUNULFlBQWM7QUFBQSxFQUNoQjtBQUFBLEVBQ0EsVUFBWSxDQUFDO0FBQUEsRUFDYixjQUFnQjtBQUFBLElBQ2QsbUNBQW1DO0FBQUEsSUFDbkMscUJBQXFCO0FBQUEsSUFDckIscUJBQXFCO0FBQUEsSUFDckIsa0JBQWtCO0FBQUEsSUFDbEIsbUJBQW1CO0FBQUEsSUFDbkIsa0JBQWtCO0FBQUEsSUFDbEIsbUJBQW1CO0FBQUEsSUFDbkIsaUJBQWlCO0FBQUEsSUFDakIsb0JBQW9CO0FBQUEsSUFDcEIsb0NBQW9DO0FBQUEsSUFDcEMsb0NBQW9DO0FBQUEsSUFDcEMsdUJBQXVCO0FBQUEsSUFDdkIsZ0JBQWdCO0FBQUEsSUFDaEIsbUJBQW1CO0FBQUEsSUFDbkIsT0FBUztBQUFBLElBQ1Qs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
