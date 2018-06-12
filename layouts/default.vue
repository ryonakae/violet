<template>
  <div>
    <header-component/>
    <nuxt/>
  </div>
</template>

<script>
import HeaderComponent from '~/components/Header.vue'

export default {
  components: {
    HeaderComponent
  }
}
</script>
