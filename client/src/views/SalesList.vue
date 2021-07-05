<template>
  <core-view-slot view-name="Marcas">
    <div class="row gutters">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <simple-table
          :headers="headers"
          :items="items"
          date-to-filter="fechaFin"
          :filterBox="false"
          :filterDate="false"
        >
          <template v-slot:[`item.userId`]=""> kxmn@gmail.com </template>
          <template v-slot:[`item.date`]="{ item }">
            {{ $filters.formatDate(item.date) }}
          </template>
          <template v-slot:[`item.products`]="{ item }">
            <ul>
              <li v-for="saleDetail in item.sales_details" :key="saleDetail.id">
                ✅
                {{
                  saleDetail.product
                    ? saleDetail.product.name
                    : 'Producto eliminado'
                }}
                ({{ saleDetail.qty }} x S/.{{ saleDetail.salePrice }})
              </li>
            </ul>
          </template>
          <template v-slot:[`item.amount`]="{ item }">
            <span class="ganancia">S/.{{ totalRevenue(item.products) }}</span>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <div class="btn-group btn-group-sm">
              <button
                @click="
                  $router.push({ name: 'BrandsAdd', params: { id: item.id } })
                "
                type="button"
                class="btn btn-info"
              >
                <i class="icon-edit1"></i>
              </button>
              <button
                @click="deleteItem(item)"
                type="button"
                class="btn btn-danger"
              >
                <i class="icon-cancel"></i>
              </button>
            </div>
          </template>
          <template v-slot:[`pagination`]>
            <pagination
              v-model="page"
              :records="totalItems"
              :per-page="$store.state.itemsPerPage"
              :options="{
                chunk: $store.state.maxPaginationButtons,
                texts: {
                  count:
                    'Mostrando {from} a {to} de {count} elementos|{count} elementos|Un elemento',
                },
              }"
            />
          </template>
        </simple-table>
      </div>
    </div>
  </core-view-slot>
</template>

<script>
const ENTITY = 'sales';

import CoreViewSlot from '@/components/core/CoreViewSlot.vue';
import SimpleTable from '@/components/template/SimpleTable.vue';

export default {
  components: {
    CoreViewSlot,
    SimpleTable,
  },
  data() {
    return {
      headers: [
        { text: 'Fecha de venta', value: 'date' },
        { text: 'Vendedor', value: 'userId' },
        { text: 'Productos vendidos', value: 'products' },
        { text: 'Beneficio', value: 'amount' },
        { text: 'Acciones', value: 'actions', width: '15%' },
      ],
      fieldsToSearch: ['name'],
      delayTimer: null,
      [ENTITY]: [],
      editedIndex: -1,
      // configuracion de la tabla
      pagination: {},
      dataTableLoading: true,
      page: 1,
      pageCount: 0,
      loadingButton: false,
      search: '',
      dialog: false,
    };
  },
  computed: {
    totalItems() {
      return this.$store.state[ENTITY + 'Module'].total;
    },
    totalPages() {
      return this.$store.state[ENTITY + 'Module'].totalPages;
    },
    items() {
      return this[ENTITY];
    },
    entity() {
      return ENTITY;
    },
  },
  watch: {
    async search() {
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() => {
        this.initialize(this.page);
      }, 600);
    },
    async page() {
      this.initialize(this.page);
    },
  },
  async mounted() {
    this.initialize();
  },
  methods: {
    async initialize(page = 1) {
      // llamada asincrona de items
      await Promise.all([
        this.$store.dispatch(ENTITY + 'Module/list', {
          page,
          search: this.search,
          fieldsToSearch: this.fieldsToSearch,
        }),
      ]);
      // asignar al data del componente
      this[ENTITY] = this.$deepCopy(
        this.$store.state[ENTITY + 'Module'][ENTITY],
      );
    },
    async deleteItem(item) {
      const index = this[ENTITY].indexOf(item);
      let itemId = this[ENTITY][index].id;
      this.$swal
        .fire({
          title: '¿Estás seguro?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, elimínalo!',
          cancelButtonText: 'No, mantenerlo',
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            await this.$store.dispatch(ENTITY + 'Module/delete', itemId);
            this[ENTITY].splice(index, 1);
          }
        });
    },
    totalRevenue(salesDetail) {
      if (salesDetail) {
        return salesDetail
          .reduce((a, b) => a + b.salePrice * b.qty, 0)
          .toFixed(2);
      }
      return 'S/.0';
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
