<template>
  <!-- Loading starts -->
  <div id="loading-wrapper" v-show="overlay">
    <div class="spinner-wrapper">
      <div class="spinner">
        <div class="inner"></div>
      </div>
      <div class="spinner">
        <div class="inner"></div>
      </div>
      <div class="spinner">
        <div class="inner"></div>
      </div>
      <div class="spinner">
        <div class="inner"></div>
      </div>
      <div class="spinner">
        <div class="inner"></div>
      </div>
      <div class="spinner">
        <div class="inner"></div>
      </div>
    </div>
  </div>
  <!-- Loading ends -->
</template>

<script>
export default {
  computed: {
    overlay() {
      return this.$store.state.loadingModule.loading;
    },
    overlayText() {
      return this.$store.state.overlay.text;
    },
  },
};
</script>

<style lang="scss" scoped></style>
