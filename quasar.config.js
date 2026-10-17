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
      // THAY ĐỔI Ở ĐÂY: Sử dụng custom service worker đã có
      workboxMode: "injectManifest", 
      swFilename: "sw.js",
      manifestFilename: "manifest.json",
      injectPwaMetaTags: true,
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
