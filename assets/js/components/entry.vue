<template>
  <li class="dashboard__listItem" v-bind:style="{ width: winWidth + 'px', height: winHeight - headerHeight + 'px' }">
    <div class="entry">
      <div class="entry__content entry__content--photo" v-if="isTypePhoto()">
        <div class="entry__image">
          <img v-for="photo in item.photos" v-bind:src="photo.original_size.url" alt="">
        </div>
      </div>

      <div class="entry__content entry__content--quote" v-if="isTypeQuote()">
        <div class="entry__text">
          {{{item.text}}}
          <div class="entry__textSource">{{{item.source}}}</div>
        </div>
      </div>

      <div class="entry__content entry__content--text" v-if="isTypeText()">
        <div class="entry__text">
          <h2 class="entry__textTitle">{{item.title}}</h2>
          {{{item.body}}}
          <div class="entry__textSource">{{{item.source}}}</div>
        </div>
      </div>

      <div class="entry__content entry__content--other" v-if="isTypeOther()">
        <div class="entry__text">
          {{item.type}}<br>
          対応していない投稿タイプです
        </div>
      </div>

      <!-- info -->
      <div class="entry__info">
        <small>id: {{item.id}} / {{item.note_count}} Notes / Liked: {{item.liked}}</small>
      </div>
      <!-- caption -->
      <div class="entry__caption" v-if="item.caption">{{{item.caption}}}</div>
      <!-- button -->
      <div class="entry__button">
        <div class="entry__buttonItem entry__buttonItem--like" v-if="!item.liked" v-on:click="like(itemCount)">Like</div>
        <div class="entry__buttonItem entry__buttonItem--unlike" v-else v-on:click="unlike(itemCount)">Unike</div>
        <div class="entry__buttonItem entry__buttonItem--reblog" v-on:click="reblog(itemCount)">Reblog</div>
      </div>
    </div>
  </li>
</template>

<script>
  module.exports = {
    props: ['item', 'itemCount', 'winWidth', 'winHeight', 'headerHeight', 'like', 'unlike', 'reblog'],

    methods: {
      isTypePhoto: function(){
        if(this.item.type === 'photo') return true;
        else return false;
      },

      isTypeQuote: function(){
        if(this.item.type === 'quote') return true;
        else return false;
      },

      isTypeText: function(){
        if(this.item.type === 'text') return true;
        else return false;
      },

      isTypeOther: function(){
        var type = this.item.type;
        if(type !== 'photo' && type !== 'quote' && type !== 'text') return true;
        else return false;
      }
    }
  };
</script>