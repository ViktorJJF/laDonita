<template>
  <core-toolbar></core-toolbar>
  <div class="container-fluid">
    <core-drawer></core-drawer>
    <success-message />
    <router-view v-slot="{ Component }">
      <!-- <transition name="fade"> -->
      <component v-if="isDataReady" :is="Component" />
      <!-- </transition> -->
    </router-view>
    <core-footer></core-footer>
  </div>
</template>

<script>
import SuccessMessage from '@/components/common/successMessage.vue';
import CoreToolbar from '@/components/core/CoreToolbar.vue';
import CoreDrawer from '@/components/core/CoreDrawer.vue';
import CoreFooter from '@/components/core/CoreFooter.vue';

export default {
  components: {
    SuccessMessage,
    CoreToolbar,
    CoreDrawer,
    CoreFooter,
  },
  props: {
    source: String,
  },
  data: () => ({
    isDataReady: false,
  }),
  computed: {
    // overlay() {
    //   return this.$store.state.overlay.active;
    // },
    // overlayText() {
    //   return this.$store.state.overlay.text;
    // },
  },
  mounted() {
    this.initialData();
  },
  methods: {
    async initialData() {
      await Promise.all([
        this.$store.dispatch('productsModule/list', {
          limit: 9999999,
          order: 1,
          sort: 'name',
        }),
        this.$store.dispatch('brandsModule/list'),
        this.$store.dispatch('providersModule/list'),
      ]);
      this.isDataReady = true;
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
