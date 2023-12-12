// vite.config.js
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
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
    "build:inpage": "vite build --config vite.config.inpage.js",
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
    "@crxjs/vite-plugin": "2.0.0-beta.21",
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
import AutoImport from "file:///C:/Users/cutsi/Documents/lit/lit-web3/node_modules/.pnpm/unplugin-auto-import@0.15.3_rollup@4.8.0/node_modules/unplugin-auto-import/dist/vite.js";
var __vite_injected_original_import_meta_url = "file:///C:/Users/cutsi/Documents/lit/lit-web3/apps/extension/vite.config.js";
var cwd = process.cwd();
var __dirname = dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var { env } = process;
var [pathRoot, pathSrc] = [env.INIT_CWD, resolve(cwd, "./src")];
var depPath = resolve(__dirname, "node_modules/@crxjs/vite-plugin/dist/index.mjs");
var depJsSrc = fs.readFileSync(depPath, "utf8");
var reg = /page\.scripts\.push\(\.\.\.scripts\)/;
if (/reg/.test(depJsSrc)) {
  fs.writeFileSync(depPath, depJsSrc.replace(reg, `page?.scripts.push(...scripts)`));
}
var inpagPath = resolve(__dirname, "public/inpage.js");
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
        dts: resolve(pathSrc, "auto-imports.d.ts")
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAibWFuaWZlc3QuY29uZmlnLnRzIiwgInBhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGN1dHNpXFxcXERvY3VtZW50c1xcXFxsaXRcXFxcbGl0LXdlYjNcXFxcYXBwc1xcXFxleHRlbnNpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGN1dHNpXFxcXERvY3VtZW50c1xcXFxsaXRcXFxcbGl0LXdlYjNcXFxcYXBwc1xcXFxleHRlbnNpb25cXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2N1dHNpL0RvY3VtZW50cy9saXQvbGl0LXdlYjMvYXBwcy9leHRlbnNpb24vdml0ZS5jb25maWcuanNcIjsvLyBpbXBvcnQgeyBjcnggfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nXG5pbXBvcnQgeyByZXNvbHZlLCBkaXJuYW1lLCByZWxhdGl2ZSB9IGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCdcbi8vIEVudlxuY29uc3QgY3dkID0gcHJvY2Vzcy5jd2QoKVxuY29uc3QgX19kaXJuYW1lID0gZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpXG5jb25zdCB7IGVudiB9ID0gcHJvY2Vzc1xuY29uc3QgW3BhdGhSb290LCBwYXRoU3JjXSA9IFtlbnYuSU5JVF9DV0QsIHJlc29sdmUoY3dkLCAnLi9zcmMnKV1cbi8vIFMgSGVyZSBpcyBhIHRlbXBvcmFyeSBoYWNrIGZvciBAY3J4anMvdml0ZS1wbHVnaW5AMi4wLjAtYmV0YS4xM1xuaW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnXG5jb25zdCBkZXBQYXRoID0gcmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvQGNyeGpzL3ZpdGUtcGx1Z2luL2Rpc3QvaW5kZXgubWpzJylcbmNvbnN0IGRlcEpzU3JjID0gZnMucmVhZEZpbGVTeW5jKGRlcFBhdGgsICd1dGY4JylcbmNvbnN0IHJlZyA9IC9wYWdlXFwuc2NyaXB0c1xcLnB1c2hcXChcXC5cXC5cXC5zY3JpcHRzXFwpL1xuaWYgKC9yZWcvLnRlc3QoZGVwSnNTcmMpKSB7XG4gIGZzLndyaXRlRmlsZVN5bmMoZGVwUGF0aCwgZGVwSnNTcmMucmVwbGFjZShyZWcsIGBwYWdlPy5zY3JpcHRzLnB1c2goLi4uc2NyaXB0cylgKSlcbn1cbi8vIEVcbi8vIFMgVG91Y2ggZ2l0LWlnbm9yZWQgYHB1YmxpYy9pbnBhZ2UuanNgXG5jb25zdCBpbnBhZ1BhdGggPSByZXNvbHZlKF9fZGlybmFtZSwgJ3B1YmxpYy9pbnBhZ2UuanMnKVxudHJ5IHtcbiAgY29uc3QgdGltZSA9IG5ldyBEYXRlKClcbiAgZnMudXRpbWVzU3luYyhpbnBhZ1BhdGgsIHRpbWUsIHRpbWUpXG59IGNhdGNoIChlKSB7XG4gIGNvbnN0IGZkID0gZnMub3BlblN5bmMoaW5wYWdQYXRoLCAndycpXG4gIGZzLmNsb3NlU3luYyhmZClcbn1cbi8vIEVcblxuaW1wb3J0IHsgdml0ZUNvbmZpZyB9IGZyb20gJ0BsaXQtd2ViMy9kdWkvc3JjL3NoYXJlZC92aXRlLmNvbmZpZy5qcydcbmltcG9ydCBtYW5pZmVzdCBmcm9tICcuL21hbmlmZXN0LmNvbmZpZydcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXG5cbmV4cG9ydCBjb25zdCBzaGFyZWRDb25maWcgPSBhc3luYyAobW9kZSA9ICcnKSA9PiB7XG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgLy8gcmV3cml0ZSBhc3NldHMgdG8gdXNlIHJlbGF0aXZlIHBhdGhcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2Fzc2V0cy1yZXdyaXRlJyxcbiAgICAgICAgZW5mb3JjZTogJ3Bvc3QnLFxuICAgICAgICBhcHBseTogJ2J1aWxkJyxcbiAgICAgICAgdHJhbnNmb3JtSW5kZXhIdG1sKGh0bWwgPSAnJywgeyBwYXRoID0gJycgfSkge1xuICAgICAgICAgIHJldHVybiBodG1sLnJlcGxhY2UoL1wiXFwvYXNzZXRzXFwvL2csIGBcIiR7cmVsYXRpdmUoZGlybmFtZShwYXRoKSwgJy9hc3NldHMnKX0vYClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBpbmNsdWRlOiBbJ3dlYmV4dGVuc2lvbi1wb2x5ZmlsbCddXG4gICAgfSxcbiAgICB2aXRlQ29uZmlnT3B0aW9uczoge1xuICAgICAgcHdhOiBmYWxzZSxcbiAgICAgIGxlZ2FjeTogZmFsc2UsXG4gICAgICBzcGxpdENodW5rOiBmYWxzZSxcbiAgICAgIGNvcGllczogW11cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHNoYXJlZEV4dENvbmZpZyA9IGFzeW5jIChtb2RlID0gJycpID0+IHtcbiAgY29uc3QgY29uZmlnID0gYXdhaXQgc2hhcmVkQ29uZmlnKG1vZGUpXG4gIGNvbnN0IFtpc0Rldl0gPSBbbW9kZSA9PT0gJ2RldmVsb3BtZW50J11cbiAgY29uZmlnLnBsdWdpbnMucHVzaChcbiAgICAuLi5bXG4gICAgICBBdXRvSW1wb3J0KHtcbiAgICAgICAgaW1wb3J0czogW3sgJ3dlYmV4dGVuc2lvbi1wb2x5ZmlsbCc6IFtbJyonLCAnYnJvd3NlciddXSB9XSxcbiAgICAgICAgZHRzOiByZXNvbHZlKHBhdGhTcmMsICdhdXRvLWltcG9ydHMuZC50cycpXG4gICAgICB9KVxuICAgIF1cbiAgKVxuICBjb25maWcuYnVpbGQgPSB7XG4gICAgZW1wdHlPdXREaXI6ICFpc0RldlxuICB9XG4gIHJldHVybiBjb25maWdcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgKHsgbW9kZSA9ICcnIH0pID0+IHtcbiAgY29uc3QgW3BvcnQsIGlzRGV2XSA9IFs0ODMxLCBtb2RlID09PSAnZGV2ZWxvcG1lbnQnXVxuICBjb25zdCBjb25maWcgPSBhd2FpdCBzaGFyZWRFeHRDb25maWcobW9kZSlcbiAgY29uc3QgeyBjcnggfSA9IGF3YWl0IGltcG9ydCgnQGNyeGpzL3ZpdGUtcGx1Z2luJylcbiAgY29uZmlnLnBsdWdpbnMucHVzaCguLi5bY3J4KHsgbWFuaWZlc3QgfSldKVxuICBjb25maWcuc2VydmVyID0geyBwb3J0LCBodHRwczogZmFsc2UsIGhtcjogeyBwb3J0IH0gfVxuICBjb25maWcuYnVpbGQucm9sbHVwT3B0aW9ucyA9IHtcbiAgICBpbnB1dDoge1xuICAgICAgaW5kZXg6ICdpbmRleC5odG1sJ1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2aXRlQ29uZmlnKGNvbmZpZykoeyBtb2RlIH0pXG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGN1dHNpXFxcXERvY3VtZW50c1xcXFxsaXRcXFxcbGl0LXdlYjNcXFxcYXBwc1xcXFxleHRlbnNpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGN1dHNpXFxcXERvY3VtZW50c1xcXFxsaXRcXFxcbGl0LXdlYjNcXFxcYXBwc1xcXFxleHRlbnNpb25cXFxcbWFuaWZlc3QuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9jdXRzaS9Eb2N1bWVudHMvbGl0L2xpdC13ZWIzL2FwcHMvZXh0ZW5zaW9uL21hbmlmZXN0LmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZU1hbmlmZXN0LCBkZWZpbmVEeW5hbWljUmVzb3VyY2UgfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nXG5pbXBvcnQgcGtnIGZyb20gJy4vcGFja2FnZS5qc29uJ1xuXG5jb25zdCB7IHZlcnNpb24gfSA9IHBrZ1xuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nXG5cbmNvbnN0IFttYWpvciwgbWlub3IsIHBhdGNoLCBsYWJlbCA9ICcwJ10gPSB2ZXJzaW9uLnJlcGxhY2UoL1teXFxkLi1dKy9nLCAnJykuc3BsaXQoL1suLV0vKVxuXG5leHBvcnQgY29uc3QgbWF0Y2hlcyA9IFsnZmlsZTovLyovKicsICdodHRwOi8vKi8qJywgJ2h0dHBzOi8vKi8qJ11cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lTWFuaWZlc3Qoe1xuICBtYW5pZmVzdF92ZXJzaW9uOiAzLFxuICBuYW1lOiBwa2cuZGlzcGxheU5hbWUgfHwgcGtnLm5hbWUsXG4gIGRlc2NyaXB0aW9uOiBwa2cuZGVzY3JpcHRpb24sXG4gIHZlcnNpb246IGAke21ham9yfS4ke21pbm9yfS4ke3BhdGNofS4ke2xhYmVsfWAsXG4gIHZlcnNpb25fbmFtZTogdmVyc2lvbixcbiAgYWN0aW9uOiB7XG4gICAgZGVmYXVsdF9wb3B1cDogJ3BvcHVwLmh0bWwnLFxuICAgIGRlZmF1bHRfaWNvbjogJ3B1YmxpYy9kb2lkLnBuZydcbiAgfSxcbiAgb3B0aW9uc191aToge1xuICAgIHBhZ2U6ICdpbmRleC5odG1sJyxcbiAgICBvcGVuX2luX3RhYjogdHJ1ZVxuICB9LFxuICBpY29uczoge1xuICAgIDE2OiAncHVibGljL2RvaWQucG5nJyxcbiAgICA0ODogJ3B1YmxpYy9kb2lkLnBuZycsXG4gICAgMTI4OiAncHVibGljL2RvaWQucG5nJ1xuICB9LFxuICBwZXJtaXNzaW9uczogW1xuICAgICdhY3RpdmVUYWInLFxuICAgICdmYXZpY29uJyxcbiAgICAnYWxhcm1zJyxcbiAgICAnY2xpcGJvYXJkV3JpdGUnLFxuICAgICdub3RpZmljYXRpb25zJyxcbiAgICAnc2NyaXB0aW5nJyxcbiAgICAnc3RvcmFnZScsXG4gICAgJ3VubGltaXRlZFN0b3JhZ2UnLFxuICAgICd3ZWJSZXF1ZXN0JyxcbiAgICAuLi4oaXNEZXYgPyBbJ3dlYk5hdmlnYXRpb24nXSA6IFtdKVxuICBdLFxuICBob3N0X3Blcm1pc3Npb25zOiBbJyo6Ly8qLyonXSxcbiAgYmFja2dyb3VuZDoge1xuICAgIHNlcnZpY2Vfd29ya2VyOiAnc3JjL2V4dC5lbnRyaWVzL2JhY2tncm91bmQudHMnLFxuICAgIHR5cGU6ICdtb2R1bGUnXG4gIH0sXG4gIGNvbnRlbnRfc2NyaXB0czogW3sganM6IFsnc3JjL2V4dC5lbnRyaWVzL2NvbnRlbnRzY3JpcHQudHMnXSwgbWF0Y2hlcywgcnVuX2F0OiAnZG9jdW1lbnRfc3RhcnQnIH1dLFxuICBjb250ZW50X3NlY3VyaXR5X3BvbGljeToge1xuICAgIGV4dGVuc2lvbl9wYWdlczogXCJzY3JpcHQtc3JjICdzZWxmJyAnd2FzbS11bnNhZmUtZXZhbCc7IG9iamVjdC1zcmMgJ3NlbGYnOyBmcmFtZS1hbmNlc3RvcnMgJ25vbmUnO1wiXG4gIH0sXG4gIGV4dGVybmFsbHlfY29ubmVjdGFibGU6IHtcbiAgICBtYXRjaGVzOiBbJ2h0dHBzOi8vZG9pZC50ZWNoLyonXSxcbiAgICBpZHM6IFsnKiddXG4gIH0sXG4gIHdlYl9hY2Nlc3NpYmxlX3Jlc291cmNlczogW3sgcmVzb3VyY2VzOiBbXSwgbWF0Y2hlcyB9LCBkZWZpbmVEeW5hbWljUmVzb3VyY2UoeyBtYXRjaGVzIH0pXSxcbiAgbWluaW11bV9jaHJvbWVfdmVyc2lvbjogJzgwJ1xufSlcbiIsICJ7XG4gIFwibmFtZVwiOiBcIkBsaXQtd2ViMy9leHRlbnNpb25cIixcbiAgXCJkaXNwbGF5TmFtZVwiOiBcIkRPSUQgRXh0ZW5zaW9uXCIsXG4gIFwidmVyc2lvblwiOiBcIjAuNy4wXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJET0lEIEV4dGVuc2lvblwiLFxuICBcInByaXZhdGVcIjogdHJ1ZSxcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJkZXZcIjogXCJjcm9zcy1lbnYgTk9ERV9FTlY9ZGV2ZWxvcG1lbnQgcnVuLXAgZGV2OipcIixcbiAgICBcImRldjppbnBhZ2VcIjogXCJucG0gcnVuIGJ1aWxkOmlucGFnZSAtLSAtLXdhdGNoIC0tbW9kZSBkZXZlbG9wbWVudFwiLFxuICAgIFwiZGV2OmFwcFwiOiBcInZpdGUgLS1ob3N0IC0tbW9kZSBkZXZlbG9wbWVudFwiLFxuICAgIFwiYnVpbGRcIjogXCJjcm9zcy1lbnYgTk9ERV9FTlY9cHJvZHVjdGlvbiBydW4tcyBidWlsZDoqXCIsXG4gICAgXCJidWlsZDppbnBhZ2VcIjogXCJ2aXRlIGJ1aWxkIC0tY29uZmlnIHZpdGUuY29uZmlnLmlucGFnZS5qc1wiLFxuICAgIFwiYnVpbGQ6YXBwXCI6IFwidml0ZSBidWlsZFwiLFxuICAgIFwiYnVuZGxlXCI6IFwiY3Jvc3MtZW52IE5PREVfRU5WPXByb2R1Y3Rpb24gcnVuLXAgY2xlYXIgJiYgcnVuLXAgYnVpbGQgJiYgcnVuLXAgYnVuZGxlOipcIixcbiAgICBcImJ1bmRsZTp6aXBcIjogXCJyaW1yYWYgRE9JRC4kbnBtX3BhY2thZ2VfdmVyc2lvbi56aXAgJiYganN6aXAtY2xpIGFkZCAuL2Rpc3QvKiAtbyAuL0RPSUQuJG5wbV9wYWNrYWdlX3ZlcnNpb24uemlwXCIsXG4gICAgXCJidW5kbGU6Y3J4XCI6IFwiY3J4IHBhY2sgLi9kaXN0IC1vIC4vRE9JRC4kbnBtX3BhY2thZ2VfdmVyc2lvbi5jcnhcIixcbiAgICBcImNsZWFyXCI6IFwicmltcmFmIC4vRE9JRC4kbnBtX3BhY2thZ2VfdmVyc2lvbi56aXAgJiYgcmltcmFmIC4vRE9JRC4kbnBtX3BhY2thZ2VfdmVyc2lvbi5jcnhcIixcbiAgICBcInByZWluc3RhbGxcIjogXCJucHggb25seS1hbGxvdyBwbnBtXCJcbiAgfSxcbiAgXCJrZXl3b3Jkc1wiOiBbXSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGFwdG9zLWxhYnMvd2FsbGV0LWFkYXB0ZXItY29yZVwiOiBcIjIuMC4xXCIsXG4gICAgXCJAZXJlYm9zL2tlY2NhazI1NlwiOiBcIl4wLjEzLjFcIixcbiAgICBcIkBlcmVib3Mvc2VjcDI1NmsxXCI6IFwiXjAuMTAuMFwiLFxuICAgIFwiQGxpYnAycC9jcnlwdG9cIjogXCJeMS4wLjE3XCIsXG4gICAgXCJAbGl0LXdlYjMvY2hhaW5cIjogXCJ3b3Jrc3BhY2U6bGF0ZXN0XCIsXG4gICAgXCJAbGl0LXdlYjMvY29yZVwiOiBcIndvcmtzcGFjZTpsYXRlc3RcIixcbiAgICBcIkBsaXQtd2ViMy9kb2lkc1wiOiBcIndvcmtzcGFjZTpsYXRlc3RcIixcbiAgICBcIkBsaXQtd2ViMy9kdWlcIjogXCJ3b3Jrc3BhY2U6bGF0ZXN0XCIsXG4gICAgXCJAbGl0LXdlYjMvZXRoZXJzXCI6IFwid29ya3NwYWNlOmxhdGVzdFwiLFxuICAgIFwiQGxpdC13ZWIzL3NvbGFuYS13YWxsZXQtc3RhbmRhcmRcIjogXCJ3b3Jrc3BhY2U6bGF0ZXN0XCIsXG4gICAgXCJAbWV0YW1hc2svZXRoLWtleXJpbmctY29udHJvbGxlclwiOiBcIl4xMi4wLjFcIixcbiAgICBcIkBtZXRhbWFzay9vYnMtc3RvcmVcIjogXCJeOC4xLjBcIixcbiAgICBcIkBzY3VyZS9iaXAzOVwiOiBcIl4xLjIuMVwiLFxuICAgIFwiQHNvbGFuYS93ZWIzLmpzXCI6IFwiXjEuODcuNlwiLFxuICAgIFwiYXB0b3NcIjogXCJeMS4yMC4wXCIsXG4gICAgXCJlZDI1NTE5LWhkLWtleVwiOiBcIl4xLjMuMFwiLFxuICAgIFwiZXZlbnRlbWl0dGVyM1wiOiBcIl41LjAuMVwiLFxuICAgIFwiaXBmcy1jb3JlXCI6IFwiXjAuMTguMVwiLFxuICAgIFwibG9kYXNoXCI6IFwiXjQuMTcuMjFcIixcbiAgICBcInBpZnlcIjogXCJeNi4xLjBcIixcbiAgICBcInR3ZWV0bmFjbFwiOiBcIl4xLjAuM1wiLFxuICAgIFwidzNuYW1lXCI6IFwiXjEuMC44XCIsXG4gICAgXCJ3ZWIzLnN0b3JhZ2VcIjogXCJeNC41LjVcIixcbiAgICBcIndlYmV4dC1icmlkZ2VcIjogXCJeNi4wLjFcIlxuICB9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAY3J4anMvdml0ZS1wbHVnaW5cIjogXCIyLjAuMC1iZXRhLjIxXCIsXG4gICAgXCJAZmZmbG9yaWFuL2pzemlwLWNsaVwiOiBcIl4zLjUuNlwiLFxuICAgIFwiQHR5cGVzL2Nocm9tZVwiOiBcImxhdGVzdFwiLFxuICAgIFwiQHR5cGVzL3dlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiOiBcIl4wLjEwLjdcIixcbiAgICBcImNyb3NzLWVudlwiOiBcIl43LjAuM1wiLFxuICAgIFwiY3J4XCI6IFwiXjUuMC4xXCIsXG4gICAgXCJyaW1yYWZcIjogXCJeNS4wLjVcIixcbiAgICBcInVucGx1Z2luLWF1dG8taW1wb3J0XCI6IFwiXjAuMTUuM1wiLFxuICAgIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI6IFwiXjAuMTAuMFwiXG4gIH0sXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiXG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxTQUFTLFNBQVMsZ0JBQWdCO0FBQzNDLFNBQVMscUJBQXFCO0FBTzlCLE9BQU8sUUFBUTtBQW1CZixTQUFTLGtCQUFrQjs7O0FDNUIyVSxTQUFTLGdCQUFnQiw2QkFBNkI7OztBQ0E1WjtBQUFBLEVBQ0UsTUFBUTtBQUFBLEVBQ1IsYUFBZTtBQUFBLEVBQ2YsU0FBVztBQUFBLEVBQ1gsYUFBZTtBQUFBLEVBQ2YsU0FBVztBQUFBLEVBQ1gsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLElBQ1QsS0FBTztBQUFBLElBQ1AsY0FBYztBQUFBLElBQ2QsV0FBVztBQUFBLElBQ1gsT0FBUztBQUFBLElBQ1QsZ0JBQWdCO0FBQUEsSUFDaEIsYUFBYTtBQUFBLElBQ2IsUUFBVTtBQUFBLElBQ1YsY0FBYztBQUFBLElBQ2QsY0FBYztBQUFBLElBQ2QsT0FBUztBQUFBLElBQ1QsWUFBYztBQUFBLEVBQ2hCO0FBQUEsRUFDQSxVQUFZLENBQUM7QUFBQSxFQUNiLGNBQWdCO0FBQUEsSUFDZCxt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
