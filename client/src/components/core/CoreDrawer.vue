<template>
  <!-- Navigation start -->
  <nav class="navbar navbar-expand-lg custom-navbar">
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#royalHospitalsNavbar"
      aria-controls="royalHospitalsNavbar"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon">
        <i></i>
        <i></i>
        <i></i>
      </span>
    </button>
    <div class="collapse navbar-collapse" id="royalHospitalsNavbar">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'SeguimientoEgresados' }">
            <i class="icon-users nav-icon"></i>
            Lista de egresados
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
  <!-- Navigation end -->
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
</style>
