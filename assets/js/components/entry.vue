<template>
  <li class="dashboard__listItem" v-bind:style="{ width: winWidth + 'px', height: winHeight - headerHeight + 'px' }">
    <div class="entry entry--photo" v-if="isTypePhoto()">
      <div class="entry__image">
        <img v-if="item.photos[0].original_size.url" v-bind:src="item.photos[0].original_size.url" alt="">
      </div>
      <div class="entry__info">
        <small>id: {{item.id}} / {{item.note_count}} Notes / Liked: {{item.liked}}</small>
      </div>
      <div class="entry__caption" v-if="item.caption">{{{item.caption}}}</div>
    </div>

    <div class="entry entry--quote" v-if="isTypeQuote()">
      <div class="entry__text">
        {{{item.text}}}
        <div class="entry__textSource">{{{item.source}}}</div>
      </div>
      <div class="entry__info">
        <small>id: {{item.id}} / {{item.note_count}} Notes / Liked: {{item.liked}}</small>
      </div>
      <div class="entry__caption" v-if="item.caption">{{{item.caption}}}</div>
    </div>
  </li>
</template>

<script>
  module.exports = {
    props: ['item', 'winWidth', 'winHeight', 'headerHeight'],

    methods: {
      isTypePhoto: function(){
        if(this.item.type === 'photo') return true;
        else return false;
      },

      isTypeQuote: function(){
        if(this.item.type === 'quote') return true;
        else return false;
      },
    }
  };
</script>