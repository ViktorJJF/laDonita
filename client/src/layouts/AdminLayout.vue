<template>
  <core-toolbar></core-toolbar>
  <div class="container-fluid">
    <core-drawer></core-drawer>
    <!-- <v-fade-transition mode="out-in"> -->
    <success-message />
    <router-view v-if="isDataReady"></router-view>
    <!-- </v-fade-transition> -->
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
      // this.$store.dispatch('showOverlay');
      // await Promise.all([this.$store.dispatch("brandsModule/list")]);
      //   //count orders
      //   await this.$store.dispatch("countOrders");
      //   //count purchases
      //   await this.$store.dispatch("countPurchases");
      this.isDataReady = true;
      // this.$store.dispatch('showOverlay', false);
      //   this.$store.dispatch("showSnackbar", {
      //     text: "Bienvenido",
      //     color: "success",
      //   });
    },
  },
};
</script>

<style></style>
