/* eslint-env node */

const { configure } = require("quasar/wrappers");

require("dotenv").config();

module.exports = configure(function (/* ctx */) {
  return {
    // Tối ưu SEO: Thêm thông tin sản phẩm và mô tả
    productName: "ANLO - Sổ nhắc tái tục bảo hiểm",
    productDescription: "ANLO là ứng dụng web PWA giúp các nhân viên tư vấn và tổ chức dịch vụ thu quản lý, nhắc tái tục, gia hạn thẻ BHYT và BHXH tự nguyện một cách hiệu quả.",

    eslint: {
      warnings: true,
      errors: true,
    },

    boot: ["apollo", "gtm", "redirect"], // <-- ĐÃ THÊM REDIRECT BOOT FILE

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
      // Thêm các thẻ meta SEO vào đây
      htmlOptions: {
        meta: {
          keywords: {
            name: 'keywords',
            content: 'sổ thu bảo hiểm, nhắc tái tục, BHYT, BHXH, an sinh xã hội, anlo, long web studio, nhân viên tư vấn, gia hạn bảo hiểm'
          },
          author: {
            name: 'author',
            content: 'Long Web Studio'
          }
        }
      }
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
      plugins: ["Notify", "Dialog", "LocalStorage"], // <-- ĐÃ THÊM LOCALSTORAGE PLUGIN
    },

    animations: [],

    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: ["render"],
    },

    pwa: {
      workboxMode: "injectManifest",
      swFilename: "sw.js",
      // Cập nhật thông tin trong PWA manifest
      manifest: {
        name: "ANLO - Sổ nhắc tái tục bảo hiểm",
        short_name: "ANLO",
        description: "Ứng dụng quản lý và nhắc tái tục BHYT, BHXH của Long Web Studio",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#1976D2",
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
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
