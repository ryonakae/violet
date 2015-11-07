(function(){


var Vue = require('vue');
var VueRouter = require('vue-router');
Vue.use(VueRouter);

// デバッグモードを有効
// Vue.config.debug = true;

// グローバルで使うcomponentの登録
Vue.component('component-header', require('./components/header.vue'));
Vue.component('component-entry', require('./components/entry.vue'));

// routerの作成
var router = new VueRouter({
  history: true,
  saveScrollPosition: true
});

// routerのマッピングを定義
router.map({
  '/': {
    component: require('./pages/home.vue')
  },
  '/dashboard': {
    component: require('./pages/dashboard.vue')
  },
  '/about': {
    component: require('./pages/about.vue')
  }
});

// route トランジション終了後
router.afterEach(function (transition) {
  console.log('Successfully navigated to: ' + transition.to.path)
})

// routerが使用可能なアプリケーションを開始
var App = Vue.extend(require('./app.vue'));
router.start(App, '#app');


})();