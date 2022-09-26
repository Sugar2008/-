import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 引入ElementUI
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

// 引入httpApis
import httpApis from "./http/index";
Vue.prototype.$http = httpApis;

// 设置JSCDE安全密钥
window._AMapSecurityConfig = {
  securityJsCode: "51931793ddf06cd6115f799aa7ed9c2f",
};

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
