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
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'NotesList' }">
            <i class="icon-devices_other nav-icon"></i>
            Notas
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
          @click="$router.push({ name: multiple.to })"
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
              <a
                @click.stop="$router.push({ name: subItem.to })"
                class="dropdown-item"
                >{{ subItem.text }}</a
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
          to: 'ProductsList',
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
          to: 'BrandsList',
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
          to: 'SuppliersList',
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
          to: 'ProvidersList',
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
              to: 'PurchasesAdd',
            },
            {
              icon: 'icon-users nav-icon',
              text: 'Historial de Compras',
              to: 'PurchasesList',
            },
          ],
        },
        {
          icon: 'icon-users nav-icon',
          text: 'Reportes',
          to: 'ReportSales',
          subItems: [
            {
              icon: 'icon-users nav-icon',
              text: 'Reporte de ventas',
              to: 'ReportSales',
            },
            {
              icon: 'icon-users nav-icon',
              text: 'Reporte de compras',
              to: 'ReportPurchases',
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
