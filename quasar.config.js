/* eslint-env node */

const { configure } = require("quasar/wrappers");
require("dotenv").config();

module.exports = configure(function (/* ctx */) {
  return {
    eslint: {
      warnings: true,
      errors: true,
    },

    boot: ["apollo"],

    css: ["app.scss"],

    extras: ["roboto-font", "material-icons"],

    build: {
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16",
      },
      vueRouterMode: "history",
      env: require("dotenv").config().parsed,
    },

    devServer: {
      server: {},
      hmr: {
        clientPort: 443,
      },
    },

    framework: {
      config: {},
      lang: "vi",
      plugins: ["Notify", "Dialog"],
    },

    animations: [],

    ssr: {
      pwa: false, // <-- Giữ nguyên vì bạn không build SSR+PWA
      prodPort: 3000,
      middlewares: ["render"],
    },

    pwa: {
      workboxMode: "generateSW", // Chuyển từ 'injectManifest' nếu không dùng custom service worker
      injectPwaMetaTags: true,
      swFilename: "sw.js",
      manifestFilename: "manifest.json",
      useCredentialsForManifestTag: false,
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true,
    },

    electron: {
      inspectPort: 5858,
      bundler: "packager",
      packager: {},
      builder: {
        appId: "app-vite",
      },
    },

    bex: {
      contentScripts: ["my-content-script"],
    },
  };
});
