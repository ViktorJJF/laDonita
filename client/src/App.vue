<template>
  <div id="app">
    <router-view />
    <loading-screen />
  </div>
</template>

<script>
import LoadingScreen from '@/components/common/loadingScreen.vue';

export default {
  components: {
    LoadingScreen,
  },
};
</script>

<style lang="scss">
</style>
