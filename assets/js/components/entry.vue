<template>
  <li class="dashboard__listItem" v-bind:style="{ width: winWidth + 'px', height: winHeight + 'px' }">
    <div class="entry">
      <div class="entry__content entry__content--photo" v-if="isTypePhoto()">
        <div class="entry__image">
          <img v-for="photo in item.photos" v-bind:src="photo.original_size.url" alt="">
        </div>
      </div>

      <div class="entry__content entry__content--quote" v-if="isTypeQuote()">
        <div class="entry__text">
          <div class="entry__body">{{{item.text}}}</div>
          <div class="entry__source">{{{item.source}}}</div>
        </div>
      </div>

      <div class="entry__content entry__content--text" v-if="isTypeText()">
        <div class="entry__text">
          <h1 class="entry__title">{{item.title}}</h1>
          <div class="entry__body">{{{item.body}}}</div>
          <div class="entry__source">{{{item.source}}}</div>
        </div>
      </div>

      <div class="entry__content entry__content--other" v-if="isTypeOther()">
        <div class="entry__text">
          <div class="entry__body entry__body--incompatible">
            対応していない投稿タイプです({{item.type}})
          </div>
        </div>
      </div>

      <!-- info -->
      <div class="entry__info">
        <a class="entry__infoFrom" v-bind:href="fromUrl" target="_blank">{{item.reblogged_from_name}}</a>

        <a class="entry__infoNotes" v-bind:href="item.reblogged_from_url" target="_blank">
          <span class="entry__infoNotesCount">{{item.note_count}} Notes</span>
          <span class="entry__infoNotesIcon">Url</span>
        </a>
      </div>
      <!-- caption -->
      <div class="entry__caption" v-if="item.caption">
        <div class="entry__body entry__body--caption">{{{item.caption}}}</div>
      </div>
      <!-- button -->
      <div class="entry__button">
        <div class="entry__buttonItem entry__buttonItem--reblog" v-on:click="reblog(itemCount)">
          <span>Reblog</span>
        </div>
        <div class="entry__buttonItem entry__buttonItem--like" v-if="!item.liked" v-on:click="like(itemCount)">
          <span>Like</span>
        </div>
        <div class="entry__buttonItem entry__buttonItem--unlike" v-else v-on:click="unlike(itemCount)">
          <span>Unike</span>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
  module.exports = {
    props: ['item', 'itemCount', 'winWidth', 'winHeight', 'like', 'unlike', 'reblog'],

    computed: {
      fromUrl: function(){
        return 'http://' + this.item.reblogged_from_name + '.tumblr.com';
      }
    },

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