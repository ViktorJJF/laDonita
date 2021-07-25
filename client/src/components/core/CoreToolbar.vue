<template>
  <header class="header">
    <div class="container-fluid">
      <!-- Row start -->
      <div class="row gutters">
        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4">
          <a href="index-2.html" class="logo"
            >La Doñita <span>campestre</span></a
          >
        </div>
        <div class="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-8">
          <!-- Header actions start -->
          <ul class="header-actions">
            <li class="dropdown">
              <a
                href="#"
                id="userSettings"
                class="user-settings"
                data-toggle="dropdown"
                aria-haspopup="true"
              >
                <span class="user-name">{{
                  $store.getters['authModule/user']
                }}</span>
                <img
                  class="avatar"
                  :src="$store.getters.getBusinessImage"
                  alt="La Donita"
                />
              </a>
              <div
                class="dropdown-menu dropdown-menu-right"
                aria-labelledby="userSettings"
              >
                <div class="header-profile-actions">
                  <div class="header-user-profile">
                    <div class="header-user">
                      <img
                        :src="$store.getters.getBusinessImage"
                        alt="La Donita"
                      />
                    </div>
                    <h5>{{ $store.getters['authModule/user'] }}</h5>
                    <p>Admin</p>
                  </div>
                  <router-link :to="{ name: 'Profile' }">
                    <i class="icon-devices_other nav-icon"></i>
                    <i class="icon-user1"></i>Mi perfi
                  </router-link>

                  <a @click="logout"
                    ><i class="icon-log-out1"></i>Cerrar sesión</a
                  >
                </div>
              </div>
            </li>
          </ul>
          <!-- Header actions end -->
        </div>
      </div>
      <!-- Row end -->
    </div>
  </header>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store
        .dispatch('authModule/logout')
        .then(() => {})
        .catch((err) => {
          console.log('algo salio mal en logout:', err);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
