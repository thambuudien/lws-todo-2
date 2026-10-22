/* eslint-env node */

const { configure } = require("quasar/wrappers");

// Tải các biến môi trường từ file .env
require("dotenv").config();

module.exports = configure(function (/* ctx */) {
  return {
    eslint: {
      warnings: true,
      errors: true,
    },

    boot: ["apollo", "firebase"],

    css: ["app.scss"],

    extras: ["roboto-font", "material-icons"],

    build: {
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16",
      },
      vueRouterMode: "hash",
      // Cung cấp các biến môi trường cho client-side code
      env: {
        GRAPHQL_URI: process.env.GRAPHQL_URI,
        LWS_SECRET_TOKEN: process.env.LWS_SECRET_TOKEN,
        LWS_HOTHAM_SECRET_TOKEN: process.env.LWS_HOTHAM_SECRET_TOKEN,
      },
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
      pwa: false,
      prodPort: 3000,
      middlewares: ["render"],
    },

    pwa: {
      workboxMode: "generateSW",
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
