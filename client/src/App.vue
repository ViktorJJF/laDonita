<template>
  <div id="app">
    <router-view />

    <error-message />
    <loading-screen />
  </div>
</template>

<script>
import ErrorMessage from '@/components/common/errorMessage.vue';
import LoadingScreen from '@/components/common/loadingScreen.vue';

export default {
  components: {
    ErrorMessage,
    LoadingScreen,
  },
};
</script>

<style lang="scss">
</style>
