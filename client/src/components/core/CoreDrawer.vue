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
          <router-link class="nav-link" :to="{ name: 'Home' }">
            <i class="icon-devices_other nav-icon"></i>
            Inicio
          </router-link>
        </li>
        <li class="nav-item" v-for="item in items" :key="item.to">
          <router-link class="nav-link" :to="{ name: item.to }">
            <i :class="item.icon"></i>
            {{ item.text }}
          </router-link>
        </li>
        <li
          class="nav-item dropdown"
          v-for="(multiple, idx) in multiples"
          :key="idx"
        >
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="doctoRs"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i class="icon-users nav-icon"></i>
            {{ multiple.text }}
          </a>
          <ul class="dropdown-menu" aria-labelledby="doctoRs">
            <li v-for="(subItem, idy) in multiple.subItems" :key="idy">
              <router-link
                :to="{ name: subItem.to }"
                class="dropdown-item"
                href="hospital-doctors-list.html"
                >{{ subItem.text }}</router-link
              >
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
  <!-- Navigation end -->
</template>

<script>
export default {
  data() {
    return {
      items: [],
      multiples: [
        {
          icon: 'icon-users nav-icon',
          text: 'Productos',
          to: 'Products',
          subItems: [
            {
              icon: 'icon-users nav-icon',
              text: 'Listado de Productos',
              to: 'ProductsList',
            },
            {
              icon: 'icon-users nav-icon',
              text: 'Nuevo Producto',
              to: 'ProductsCreate',
            },
          ],
        },
        {
          icon: 'icon-users nav-icon',
          text: 'Marcas',
          to: 'Brands',
          subItems: [
            {
              icon: 'icon-users nav-icon',
              text: 'Listado de Marcas',
              to: 'BrandsList',
            },
            {
              icon: 'icon-users nav-icon',
              text: 'Nueva marca',
              to: 'BrandsCreate',
            },
          ],
        },
        {
          icon: 'icon-users nav-icon',
          text: 'Insumos',
          to: 'Suppliers',
          subItems: [
            {
              icon: 'icon-users nav-icon',
              text: 'Listado de Insumos',
              to: 'SuppliersList',
            },
            {
              icon: 'icon-users nav-icon',
              text: 'Nuevo insumo',
              to: 'SuppliersCreate',
            },
          ],
        },
        {
          icon: 'icon-users nav-icon',
          text: 'Proveedores',
          to: 'Providers',
          subItems: [
            {
              icon: 'icon-users nav-icon',
              text: 'Listado de Proveedores',
              to: 'ProvidersList',
            },
            {
              icon: 'icon-users nav-icon',
              text: 'Nuevo proveedor',
              to: 'ProvidersCreate',
            },
          ],
        },

        {
          icon: 'icon-users nav-icon',
          text: 'Ventas',
          to: 'SalesList',
          subItems: [
            {
              icon: 'icon-users nav-icon',
              text: 'Nueva venta',
              to: 'SalesAdd',
            },
            {
              icon: 'icon-users nav-icon',
              text: 'Historial de ventas',
              to: 'SalesList',
            },
          ],
        },
        {
          icon: 'icon-users nav-icon',
          text: 'Compras',
          to: 'Brands',
          subItems: [
            {
              icon: 'icon-users nav-icon',
              text: 'Nueva compra',
              to: 'BrandsCreate',
            },
            {
              icon: 'icon-users nav-icon',
              text: 'Historial de Compras',
              to: 'BrandsList',
            },
          ],
        },
        {
          icon: 'icon-users nav-icon',
          text: 'Reportes',
          to: 'Brands',
          subItems: [
            {
              icon: 'icon-users nav-icon',
              text: 'Nueva compra',
              to: 'BrandsCreate',
            },
            {
              icon: 'icon-users nav-icon',
              text: 'Historial de Compras',
              to: 'BrandsList',
            },
          ],
        },
      ],
      expansionItems: [],
      superAdminItems: {
        icon: 'mdi-format-list-bulleted',
        text: 'SUPERADMIN',
        active: false,
        items: [],
      },
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
