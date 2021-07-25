<template>
  <div class="authentication full-height">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // imageBg: "/images/loginbg.jpg",
    };
  },
};
</script>

<style lang="scss" scoped>
.full-height {
  height: 100vh;
}
</style>
