// var socketIO = require('./dependencies/socket.io.js');
// var io = require('./dependencies/sails.io.js')(socketIO);

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


// Vue.js
var Vue = require('vue');
var VueRouter = require('vue-router');

Vue.use(VueRouter);

var router = new VueRouter({
  history: true,
  saveScrollPosition: true
});

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

var App = Vue.extend(require('./app.vue'));
router.start(App, '#app');