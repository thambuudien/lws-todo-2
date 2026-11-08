window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

export default ({ app }) => {
  // You can make gtag available globally in your Vue components
  app.config.globalProperties.$gtag = gtag;
};
