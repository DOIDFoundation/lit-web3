// vite.config.ts
import { viteConfig } from "file:///Users/zzz/fed/lit-web3/packages/dui/src/shared/vite.config.cjs";

// manifest.config.ts
import { defineManifest, defineDynamicResource } from "file:///Users/zzz/fed/lit-web3/node_modules/.pnpm/@crxjs+vite-plugin@2.0.0-beta.13/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// package.json
var package_default = {
  name: "@lit-web3/extension",
  displayName: "DOID Extension",
  version: "0.0.1",
  description: "DOID Extension",
  private: true,
  type: "module",
  scripts: {
    dev: "cross-env NODE_ENV=development run-p dev:*",
    "dev:inpage": "npm run build:inpage -- --mode development",
    "dev:app": "vite --host --mode development",
    build: "cross-env NODE_ENV=production run-s build:*",
    "build:inpage": "vite build --config vite.config.inpage.ts",
    "build:app": "vite build",
    preinstall: "npx only-allow pnpm"
  },
  keywords: [],
  dependencies: {
    "@lit-web3/core": "workspace:latest",
    "@lit-web3/dui": "workspace:latest",
    "@lit-web3/ethers": "workspace:latest",
    "@metamask/browser-passworder": "^4.0.2",
    "@metamask/eth-keyring-controller": "^10.0.0",
    "@metamask/permission-controller": "^1.0.0",
    "ipfs-http-client": "^60.0.0",
    "@metamask/post-message-stream": "^6.1.0",
    "@metamask/providers": "^10.2.1",
    "json-rpc-engine": "^6.1.0",
    "process-nextick-args": "^2.0.1",
    "webextension-polyfill": "^0.10.0",
    "ethereum-cryptography": "^1.2.0",
    "ethereumjs-util": "^7.1.5",
    "ipfs-http-client": "^60.0.0"
  },
  devDependencies: {
    "@types/fs-extra": "^9.0.13",
    "@crxjs/vite-plugin": "2.0.0-beta.13",
    "@types/webextension-polyfill": "^0.10.0",
    "@rollup/plugin-node-resolve": "^15.0.1",
    "@types/chrome": "latest",
    chokidar: "^3.5.3",
    "cross-env": "^7.0.3",
    crx: "^5.0.1",
    kolorist: "^1.6.0",
    "unplugin-auto-import": "^0.15.0",
    "vite-plugin-ngmi-polyfill": "^0.0.2",
    "web-ext": "^7.3.1",
    "webext-bridge": "^5.0.5"
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
  permissions: [
    "activeTab",
    "alarms",
    "clipboardWrite",
    "notifications",
    "scripting",
    "storage",
    "unlimitedStorage",
    "webRequest",
    ...isDev ? ["webNavigation"] : []
  ],
  host_permissions: [...matches, "http://localhost:4813/"],
  background: {
    service_worker: "src/ext.scripts/app-init.ts",
    type: "module"
  },
  content_scripts: [{ js: ["src/ext.scripts/contentscript.ts"], matches, run_at: "document_start" }],
  // web_accessible_resources: [{ resources: ['public/inpage.js'], matches }, defineDynamicResource({ matches })],
  web_accessible_resources: [defineDynamicResource({ matches })]
});

// vite.config.ts
import { dirname, relative, resolve } from "path";
import fs from "fs";
var __vite_injected_original_dirname = "/Users/zzz/fed/lit-web3/apps/extension";
var depPath = resolve(__vite_injected_original_dirname, "node_modules/@crxjs/vite-plugin/dist/index.mjs");
var depJsSrc = fs.readFileSync(depPath, "utf8");
var reg = /page\.scripts\.push\(\.\.\.scripts\)/;
if (/reg/.test(depJsSrc)) {
  fs.writeFileSync(depPath, depJsSrc.replace(reg, `page?.scripts.push(...scripts)`));
}
var sharedConfig = async (mode = "") => {
  const [port, isDev2] = [4831, mode === "development"];
  return {
    server: { port, https: false, hmr: { port } },
    build: {
      minify: "terser",
      emptyOutDir: !isDev2,
      sourcemap: isDev2 ? "inline" : false,
      terserOptions: {
        mangle: !isDev2
      },
      // so annoying, here will break in build stage
      rollupOptions: {
        input: {
          background: "index.html",
          popup: "popup.html"
        }
      }
    },
    plugins: [
      // rewrite assets to use relative path
      {
        name: "assets-rewrite",
        enforce: "post",
        apply: "build",
        transformIndexHtml(html, { path = "" }) {
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
      copies: []
    }
  };
};
var vite_config_default = async ({ mode = "" }) => {
  const config = await sharedConfig(mode);
  const { crx } = await import("file:///Users/zzz/fed/lit-web3/node_modules/.pnpm/@crxjs+vite-plugin@2.0.0-beta.13/node_modules/@crxjs/vite-plugin/dist/index.mjs");
  config.plugins.push(...[crx({ manifest: manifest_config_default })]);
  return viteConfig(config)({ mode });
};
export {
  vite_config_default as default,
  sharedConfig
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibWFuaWZlc3QuY29uZmlnLnRzIiwgInBhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy96enovZmVkL2xpdC13ZWIzL2FwcHMvZXh0ZW5zaW9uXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvenp6L2ZlZC9saXQtd2ViMy9hcHBzL2V4dGVuc2lvbi92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvenp6L2ZlZC9saXQtd2ViMy9hcHBzL2V4dGVuc2lvbi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IHZpdGVDb25maWcgfSBmcm9tICdAbGl0LXdlYjMvZHVpL3NyYy9zaGFyZWQvdml0ZS5jb25maWcuY2pzJ1xuaW1wb3J0IG1hbmlmZXN0IGZyb20gJy4vbWFuaWZlc3QuY29uZmlnJ1xuaW1wb3J0IHsgZGlybmFtZSwgcmVsYXRpdmUsIHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuLy8gaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcblxuLy8gUyBIZXJlIGlzIGEgdGVtcG9yYXJ5IGhhY2sgZm9yIEBjcnhqcy92aXRlLXBsdWdpbkAyLjAuMC1iZXRhLjEzXG4vLyBpbXBvcnQgeyBjcnggfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5jb25zdCBkZXBQYXRoID0gcmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvQGNyeGpzL3ZpdGUtcGx1Z2luL2Rpc3QvaW5kZXgubWpzJylcbmNvbnN0IGRlcEpzU3JjID0gZnMucmVhZEZpbGVTeW5jKGRlcFBhdGgsICd1dGY4JylcbmNvbnN0IHJlZyA9IC9wYWdlXFwuc2NyaXB0c1xcLnB1c2hcXChcXC5cXC5cXC5zY3JpcHRzXFwpL1xuaWYgKC9yZWcvLnRlc3QoZGVwSnNTcmMpKSB7XG4gIGZzLndyaXRlRmlsZVN5bmMoZGVwUGF0aCwgZGVwSnNTcmMucmVwbGFjZShyZWcsIGBwYWdlPy5zY3JpcHRzLnB1c2goLi4uc2NyaXB0cylgKSlcbn1cbi8vIEVcblxuZXhwb3J0IGNvbnN0IHNoYXJlZENvbmZpZyA9IGFzeW5jIChtb2RlID0gJycpID0+IHtcbiAgY29uc3QgW3BvcnQsIGlzRGV2XSA9IFs0ODMxLCBtb2RlID09PSAnZGV2ZWxvcG1lbnQnXVxuICByZXR1cm4ge1xuICAgIHNlcnZlcjogeyBwb3J0LCBodHRwczogZmFsc2UsIGhtcjogeyBwb3J0IH0gfSxcbiAgICBidWlsZDoge1xuICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAgIGVtcHR5T3V0RGlyOiAhaXNEZXYsXG4gICAgICBzb3VyY2VtYXA6IGlzRGV2ID8gJ2lubGluZScgOiBmYWxzZSxcbiAgICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgICAgbWFuZ2xlOiAhaXNEZXZcbiAgICAgIH0sXG4gICAgICAvLyBzbyBhbm5veWluZywgaGVyZSB3aWxsIGJyZWFrIGluIGJ1aWxkIHN0YWdlXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIGlucHV0OiB7XG4gICAgICAgICAgYmFja2dyb3VuZDogJ2luZGV4Lmh0bWwnLFxuICAgICAgICAgIHBvcHVwOiAncG9wdXAuaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgLy8gcmV3cml0ZSBhc3NldHMgdG8gdXNlIHJlbGF0aXZlIHBhdGhcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2Fzc2V0cy1yZXdyaXRlJyxcbiAgICAgICAgZW5mb3JjZTogJ3Bvc3QnLFxuICAgICAgICBhcHBseTogJ2J1aWxkJyxcbiAgICAgICAgdHJhbnNmb3JtSW5kZXhIdG1sKGh0bWw6IHN0cmluZywgeyBwYXRoID0gJycgfSkge1xuICAgICAgICAgIHJldHVybiBodG1sLnJlcGxhY2UoL1wiXFwvYXNzZXRzXFwvL2csIGBcIiR7cmVsYXRpdmUoZGlybmFtZShwYXRoKSwgJy9hc3NldHMnKX0vYClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBpbmNsdWRlOiBbJ3dlYmV4dGVuc2lvbi1wb2x5ZmlsbCddXG4gICAgfSxcbiAgICB2aXRlQ29uZmlnT3B0aW9uczoge1xuICAgICAgcHdhOiBmYWxzZSxcbiAgICAgIGxlZ2FjeTogZmFsc2UsXG4gICAgICBjb3BpZXM6IFtdXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jICh7IG1vZGUgPSAnJyB9KSA9PiB7XG4gIGNvbnN0IGNvbmZpZyA9IGF3YWl0IHNoYXJlZENvbmZpZyhtb2RlKVxuICBjb25zdCB7IGNyeCB9ID0gYXdhaXQgaW1wb3J0KCdAY3J4anMvdml0ZS1wbHVnaW4nKVxuICBjb25maWcucGx1Z2lucy5wdXNoKC4uLihbY3J4KHsgbWFuaWZlc3QgfSldIGFzIGFueVtdKSlcbiAgcmV0dXJuIHZpdGVDb25maWcoY29uZmlnKSh7IG1vZGUgfSlcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3p6ei9mZWQvbGl0LXdlYjMvYXBwcy9leHRlbnNpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy96enovZmVkL2xpdC13ZWIzL2FwcHMvZXh0ZW5zaW9uL21hbmlmZXN0LmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvenp6L2ZlZC9saXQtd2ViMy9hcHBzL2V4dGVuc2lvbi9tYW5pZmVzdC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVNYW5pZmVzdCwgZGVmaW5lRHluYW1pY1Jlc291cmNlIH0gZnJvbSAnQGNyeGpzL3ZpdGUtcGx1Z2luJ1xuaW1wb3J0IHBrZyBmcm9tICcuL3BhY2thZ2UuanNvbidcblxuY29uc3QgeyB2ZXJzaW9uIH0gPSBwa2dcbmNvbnN0IGlzRGV2ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJ1xuXG5jb25zdCBbbWFqb3IsIG1pbm9yLCBwYXRjaCwgbGFiZWwgPSAnMCddID0gdmVyc2lvbi5yZXBsYWNlKC9bXlxcZC4tXSsvZywgJycpLnNwbGl0KC9bLi1dLylcblxuZXhwb3J0IGNvbnN0IG1hdGNoZXMgPSBbJ2ZpbGU6Ly8qLyonLCAnaHR0cDovLyovKicsICdodHRwczovLyovKiddXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZU1hbmlmZXN0KHtcbiAgbWFuaWZlc3RfdmVyc2lvbjogMyxcbiAgbmFtZTogcGtnLmRpc3BsYXlOYW1lIHx8IHBrZy5uYW1lLFxuICBkZXNjcmlwdGlvbjogcGtnLmRlc2NyaXB0aW9uLFxuICB2ZXJzaW9uOiBgJHttYWpvcn0uJHttaW5vcn0uJHtwYXRjaH0uJHtsYWJlbH1gLFxuICB2ZXJzaW9uX25hbWU6IHZlcnNpb24sXG4gIGFjdGlvbjoge1xuICAgIGRlZmF1bHRfcG9wdXA6ICdwb3B1cC5odG1sJyxcbiAgICBkZWZhdWx0X2ljb246ICdwdWJsaWMvZG9pZC5wbmcnXG4gIH0sXG4gIHBlcm1pc3Npb25zOiBbXG4gICAgJ2FjdGl2ZVRhYicsXG4gICAgJ2FsYXJtcycsXG4gICAgJ2NsaXBib2FyZFdyaXRlJyxcbiAgICAnbm90aWZpY2F0aW9ucycsXG4gICAgJ3NjcmlwdGluZycsXG4gICAgJ3N0b3JhZ2UnLFxuICAgICd1bmxpbWl0ZWRTdG9yYWdlJyxcbiAgICAnd2ViUmVxdWVzdCcsXG4gICAgLi4uKGlzRGV2ID8gWyd3ZWJOYXZpZ2F0aW9uJ10gOiBbXSlcbiAgXSxcbiAgaG9zdF9wZXJtaXNzaW9uczogWy4uLm1hdGNoZXMsICdodHRwOi8vbG9jYWxob3N0OjQ4MTMvJ10sXG4gIGJhY2tncm91bmQ6IHtcbiAgICBzZXJ2aWNlX3dvcmtlcjogJ3NyYy9leHQuc2NyaXB0cy9hcHAtaW5pdC50cycsXG4gICAgdHlwZTogJ21vZHVsZSdcbiAgfSxcbiAgY29udGVudF9zY3JpcHRzOiBbeyBqczogWydzcmMvZXh0LnNjcmlwdHMvY29udGVudHNjcmlwdC50cyddLCBtYXRjaGVzLCBydW5fYXQ6ICdkb2N1bWVudF9zdGFydCcgfV0sXG4gIC8vIHdlYl9hY2Nlc3NpYmxlX3Jlc291cmNlczogW3sgcmVzb3VyY2VzOiBbJ3B1YmxpYy9pbnBhZ2UuanMnXSwgbWF0Y2hlcyB9LCBkZWZpbmVEeW5hbWljUmVzb3VyY2UoeyBtYXRjaGVzIH0pXSxcbiAgd2ViX2FjY2Vzc2libGVfcmVzb3VyY2VzOiBbZGVmaW5lRHluYW1pY1Jlc291cmNlKHsgbWF0Y2hlcyB9KV1cbn0pXG4iLCAie1xuICBcIm5hbWVcIjogXCJAbGl0LXdlYjMvZXh0ZW5zaW9uXCIsXG4gIFwiZGlzcGxheU5hbWVcIjogXCJET0lEIEV4dGVuc2lvblwiLFxuICBcInZlcnNpb25cIjogXCIwLjAuMVwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiRE9JRCBFeHRlbnNpb25cIixcbiAgXCJwcml2YXRlXCI6IHRydWUsXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiZGV2XCI6IFwiY3Jvc3MtZW52IE5PREVfRU5WPWRldmVsb3BtZW50IHJ1bi1wIGRldjoqXCIsXG4gICAgXCJkZXY6aW5wYWdlXCI6IFwibnBtIHJ1biBidWlsZDppbnBhZ2UgLS0gLS1tb2RlIGRldmVsb3BtZW50XCIsXG4gICAgXCJkZXY6YXBwXCI6IFwidml0ZSAtLWhvc3QgLS1tb2RlIGRldmVsb3BtZW50XCIsXG4gICAgXCJidWlsZFwiOiBcImNyb3NzLWVudiBOT0RFX0VOVj1wcm9kdWN0aW9uIHJ1bi1zIGJ1aWxkOipcIixcbiAgICBcImJ1aWxkOmlucGFnZVwiOiBcInZpdGUgYnVpbGQgLS1jb25maWcgdml0ZS5jb25maWcuaW5wYWdlLnRzXCIsXG4gICAgXCJidWlsZDphcHBcIjogXCJ2aXRlIGJ1aWxkXCIsXG4gICAgXCJwcmVpbnN0YWxsXCI6IFwibnB4IG9ubHktYWxsb3cgcG5wbVwiXG4gIH0sXG4gIFwia2V5d29yZHNcIjogW10sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBsaXQtd2ViMy9jb3JlXCI6IFwid29ya3NwYWNlOmxhdGVzdFwiLFxuICAgIFwiQGxpdC13ZWIzL2R1aVwiOiBcIndvcmtzcGFjZTpsYXRlc3RcIixcbiAgICBcIkBsaXQtd2ViMy9ldGhlcnNcIjogXCJ3b3Jrc3BhY2U6bGF0ZXN0XCIsXG4gICAgXCJAbWV0YW1hc2svYnJvd3Nlci1wYXNzd29yZGVyXCI6IFwiXjQuMC4yXCIsXG4gICAgXCJAbWV0YW1hc2svZXRoLWtleXJpbmctY29udHJvbGxlclwiOiBcIl4xMC4wLjBcIixcbiAgICBcIkBtZXRhbWFzay9wZXJtaXNzaW9uLWNvbnRyb2xsZXJcIjogXCJeMS4wLjBcIixcbiAgICBcImlwZnMtaHR0cC1jbGllbnRcIjogXCJeNjAuMC4wXCIsXG4gICAgXCJAbWV0YW1hc2svcG9zdC1tZXNzYWdlLXN0cmVhbVwiOiBcIl42LjEuMFwiLFxuICAgIFwiQG1ldGFtYXNrL3Byb3ZpZGVyc1wiOiBcIl4xMC4yLjFcIixcbiAgICBcImpzb24tcnBjLWVuZ2luZVwiOiBcIl42LjEuMFwiLFxuICAgIFwicHJvY2Vzcy1uZXh0aWNrLWFyZ3NcIjogXCJeMi4wLjFcIixcbiAgICBcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiOiBcIl4wLjEwLjBcIixcbiAgICBcImV0aGVyZXVtLWNyeXB0b2dyYXBoeVwiOiBcIl4xLjIuMFwiLFxuICAgIFwiZXRoZXJldW1qcy11dGlsXCI6IFwiXjcuMS41XCIsXG4gICAgXCJpcGZzLWh0dHAtY2xpZW50XCI6IFwiXjYwLjAuMFwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkB0eXBlcy9mcy1leHRyYVwiOiBcIl45LjAuMTNcIixcbiAgICBcIkBjcnhqcy92aXRlLXBsdWdpblwiOiBcIjIuMC4wLWJldGEuMTNcIixcbiAgICBcIkB0eXBlcy93ZWJleHRlbnNpb24tcG9seWZpbGxcIjogXCJeMC4xMC4wXCIsXG4gICAgXCJAcm9sbHVwL3BsdWdpbi1ub2RlLXJlc29sdmVcIjogXCJeMTUuMC4xXCIsXG4gICAgXCJAdHlwZXMvY2hyb21lXCI6IFwibGF0ZXN0XCIsXG4gICAgXCJjaG9raWRhclwiOiBcIl4zLjUuM1wiLFxuICAgIFwiY3Jvc3MtZW52XCI6IFwiXjcuMC4zXCIsXG4gICAgXCJjcnhcIjogXCJeNS4wLjFcIixcbiAgICBcImtvbG9yaXN0XCI6IFwiXjEuNi4wXCIsXG4gICAgXCJ1bnBsdWdpbi1hdXRvLWltcG9ydFwiOiBcIl4wLjE1LjBcIixcbiAgICBcInZpdGUtcGx1Z2luLW5nbWktcG9seWZpbGxcIjogXCJeMC4wLjJcIixcbiAgICBcIndlYi1leHRcIjogXCJeNy4zLjFcIixcbiAgICBcIndlYmV4dC1icmlkZ2VcIjogXCJeNS4wLjVcIlxuICB9LFxuICBcImxpY2Vuc2VcIjogXCJNSVRcIlxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvUyxTQUFTLGtCQUFrQjs7O0FDQW5CLFNBQVMsZ0JBQWdCLDZCQUE2Qjs7O0FDQWxXO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixhQUFlO0FBQUEsRUFDZixTQUFXO0FBQUEsRUFDWCxhQUFlO0FBQUEsRUFDZixTQUFXO0FBQUEsRUFDWCxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsSUFDVCxLQUFPO0FBQUEsSUFDUCxjQUFjO0FBQUEsSUFDZCxXQUFXO0FBQUEsSUFDWCxPQUFTO0FBQUEsSUFDVCxnQkFBZ0I7QUFBQSxJQUNoQixhQUFhO0FBQUEsSUFDYixZQUFjO0FBQUEsRUFDaEI7QUFBQSxFQUNBLFVBQVksQ0FBQztBQUFBLEVBQ2IsY0FBZ0I7QUFBQSxJQUNkLGtCQUFrQjtBQUFBLElBQ2xCLGlCQUFpQjtBQUFBLElBQ2pCLG9CQUFv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
