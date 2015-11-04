var socketIO = require('./dependencies/socket.io.js');
var io = require('./dependencies/sails.io.js')(socketIO);

// require('jquery');
// require('velocity');

// $('#button').on('click', function(){
//   io.socket.get('/dashboard/get', function serverRespondedWith (body, jwr){
//     console.log(body);
//   });

//   $(this).velocity({
//     opacity: 0
//   },{
//     duration: 500
//   });
// });

// var data = JSON.parse(document.getElementById('initial-data').getAttribute('data-json'));
// console.log('data:authenticated ', data[0]);


// Vue.js
var Vue = require('vue');
var VueRouter = require('vue-router');
Vue.use(VueRouter);

// グローバルで使うcomponentの登録
Vue.component('component-header', require('./components/header.vue'));

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

// routerが使用可能なアプリケーションを開始
var App = Vue.extend(require('./app.vue'));
router.start(App, '#app');