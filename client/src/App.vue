<template>
  <router-view />
  <loading-screen />
</template>

<script>
import LoadingScreen from '@/components/common/loadingScreen.vue';

export default {
  components: {
    LoadingScreen,
  },
  created() {
    if (this.$store.getters['authModule/isTokenSet']) {
      this.$store.dispatch('authModule/autoLogin');
    }
  },
};
</script>

<style lang="scss">
</style>
