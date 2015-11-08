<template>
  <div class="main main--dashboard">
    <div class="dashboard">
      <ul class="dashboard__list" id="dashboardList" v-bind:style="{ width: winWidth * dataLength + 'px' }">
        <component-entry
          v-for="item in data"
          :item="item"
          :item-count="itemCount"
          :win-width="winWidth"
          :win-height="winHeight"
          :header-height="headerHeight"
          :like="like"
          :unlike="unlike"
          :reblog="reblog">
        </component-entry>
      </ul>
    </div>

    <div class="controller">
      <div v-on:click="goPrev" class="controller__prev">
        <span>Prev</span>
      </div>
      <div v-on:click="[like(itemCount), reblog(itemCount)]" class="controller__likeReblog">
        <span>Like & Reblog</span>
      </div>
      <div v-on:click="goNext" class="controller__next">
        <span>Next</span>
      </div>
    </div>
  </div>
</template>

<script>
  var socketIO = require('../dependencies/socket.io.js');
  var io = require('../dependencies/sails.io.js')(socketIO);
  require('jquery');
  var velocity = require('velocity');

  module.exports = {
    data: function(){
      return {
        data: [],
        dataLength: 0,
        itemCount: 0,
        winWidth: $(window).width(),
        winHeight: $(window).height(),
        headerHeight: $('#header').height(),
        marginLeft: 0
      }
    },

    ready: function(){
      var self = this;

      console.log('dashboard表示');

      // socket.io接続時の処理
      io.socket.on('connect', this.loadDb);

      // socket.io切断時の処理
      io.socket.on('disconnect', io.socket.disconnect);

      $(window).on('load resize', function(){
        self.$set('winWidth', $(window).width());
        self.$set('winHeight', $(window).height());
      });
    },

    methods: {
      // ダッシュボード取得リクエストを送る
      loadDb: function(){
        var self = this;

        console.log('サーバにリクエスト送信');
        io.socket.get('/dashboard/get', function serverRespondedWith (body, jwr){
          console.log('ダッシュボード取得完了');

          self.$set('data', body);
          self.$set('dataLength', self.$get('data').length); //取得した配列のlengthをdataLengthに入れる
          console.log(self.$get('data'));
          console.log('dataLength: ', self.$get('dataLength'));
        });
      },

      // 前のitemに移動
      goPrev: function(){
        console.log('前のitemに移動');
        // ここにjQueryとか使って遷移の処理

        // itemCountを1つ減らす
        var count = this.$get('itemCount') -1;

        if(count < 0){
          return console.log('itemCountが0以下なので何もしないよ');
        }

        this.$set('itemCount', count);
        console.log('itemCount: ', this.$get('itemCount'));

        // 前のアイテムにスライド
        this.sldePrev();
      },

      // 次のitemに移動
      goNext: function(){
        console.log('次のitemに移動');
        // ここにjQueryとか使って遷移の処理

        // itemCountを1つ増やす
        var count = this.$get('itemCount') +1;

        // 最後の方まで来たらダッシュボードを更新
        if(count > this.$get('dataLength')*0.7){
          this.loadDb();
        }

        this.$set('itemCount', count);
        console.log('itemCount: ', this.$get('itemCount'));

        // 次のアイテムにスライド
        this.sldeNext();
      },

      // Like
      like: function(n){
        var self = this;

        var sendData = {
          id: this.$get('data')[n].id,
          reblogKey: this.$get('data')[n].reblog_key,
          liked: this.$get('data')[n].liked
        }

        // Like済みだったらスキップ
        if(sendData.liked){
          return console.log('Like済みなのでスキップ');
        }

        io.socket.post('/dashboard/like', sendData, function(data, jwres){
          console.log(data);
          self.$get('data')[n].liked = true;
        })
      },

      // Unlike
      unlike: function(n){
        var self = this;

        var sendData = {
          id: this.$get('data')[n].id,
          reblogKey: this.$get('data')[n].reblog_key,
          liked: this.$get('data')[n].liked
        }

        // unike済みだったらスキップ
        if(!sendData.liked){
          return console.log('Unlike済みなのでスキップ');
        }

        io.socket.post('/dashboard/unlike', sendData, function(data, jwres){
          console.log(data);
          self.$get('data')[n].liked = false;
        })
      },

      // Reblog
      reblog: function(n){
        var self = this;

        var sendData = {
          id: this.$get('data')[n].id,
          reblogKey: this.$get('data')[n].reblog_key
        }

        io.socket.post('/dashboard/reblog', sendData, function(data, jwres){
          console.log(data);
        })
      },

      sldePrev: function(){
        var self = this;

        $('#dashboardList').velocity({
          marginLeft: this.$get('marginLeft') + this.$get('winWidth')
        },{
          duration: 400,
          easing: 'easeOutQuart',
          complete: function(){
            self.$set('marginLeft', self.$get('marginLeft') + self.$get('winWidth'));
          }
        });
        console.log('slide prev');
      },

      sldeNext: function(){
        var self = this;

        $('#dashboardList').velocity({
          marginLeft: this.$get('marginLeft') - this.$get('winWidth')
        },{
          duration: 400,
          easing: 'easeOutQuart',
          complete: function(){
            self.$set('marginLeft', self.$get('marginLeft') - self.$get('winWidth'));
          }
        });
        console.log('slide next');
      }
    }
  };
</script>